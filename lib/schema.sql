-- ==========================================
-- SALONZA ERP - SUPABASE POSTGRESQL SCHEMA
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SYSTEM ROLES
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Insert standard system roles
INSERT INTO roles (name) VALUES 
('super_admin'), 
('salon_owner'), 
('salon_manager'), 
('receptionist'), 
('stylist'), 
('accountant'), 
('supplier'), 
('customer')
ON CONFLICT (name) DO NOTHING;

-- 2. SALONS (TENANTS)
CREATE TABLE IF NOT EXISTS salons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    owner_id UUID,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email TEXT,
    slug VARCHAR(50) UNIQUE NOT NULL,
    about TEXT DEFAULT 'We provide premium salon services.',
    years_experience INTEGER DEFAULT 1,
    clients_count INTEGER DEFAULT 0,
    staff_count INTEGER DEFAULT 1,
    rating NUMERIC(3, 2) DEFAULT 4.50,
    opening_hours JSONB, -- Mapped from ISalon openingHours
    socials JSONB, -- instagram, facebook, twitter
    main_image TEXT,
    gallery TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for subdomain slug lookups
CREATE INDEX IF NOT EXISTS idx_salons_slug ON salons(slug);

-- 3. USERS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    salon_id UUID REFERENCES salons(id) ON DELETE SET NULL,
    
    -- Supplier Verification Fields
    verification_status VARCHAR(20) DEFAULT 'unapplied', -- unapplied, pending, verified, rejected
    business_name VARCHAR(100),
    gst_number VARCHAR(20),
    business_address TEXT,
    business_logo TEXT,
    business_description TEXT,
    
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP WITH TIME ZONE,
    login_attempts INTEGER DEFAULT 0,
    lock_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BRANCHES
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SERVICES
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    price NUMERIC(10, 2) NOT NULL,
    description TEXT DEFAULT '',
    category VARCHAR(50) DEFAULT 'General',
    image TEXT DEFAULT '',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    total_duration INTEGER,
    total_price NUMERIC(10, 2),
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_walk_in BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'upcoming', -- upcoming, in-progress, completed, cancelled
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid
    paid_amount NUMERIC(10, 2) DEFAULT 0.00,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES for Bookings
CREATE INDEX IF NOT EXISTS idx_bookings_salon_date ON bookings(salon_id, date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(salon_id, status);

-- JOIN TABLE: BOOKING SERVICES
CREATE TABLE IF NOT EXISTS booking_services (
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (booking_id, service_id)
);

-- 7. STAFF
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Nullable if staff doesn't log in
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    skills TEXT[],
    profile_image TEXT,
    is_active BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'available', -- available, busy, break, offline
    daily_limit INTEGER,
    avg_time INTEGER,
    completed_today INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. QUEUE ITEMS
CREATE TABLE IF NOT EXISTS queue_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    is_walk_in BOOLEAN DEFAULT false,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    position INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'waiting', -- waiting, serving
    estimated_minutes INTEGER,
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- JOIN TABLE: QUEUE SERVICES
CREATE TABLE IF NOT EXISTS queue_services (
    queue_item_id UUID REFERENCES queue_items(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (queue_item_id, service_id)
);

-- 9. SALES (Point of Sale receipts)
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    discount_type VARCHAR(20) DEFAULT 'none', -- fixed, percentage, none
    discount_value NUMERIC(10, 2) DEFAULT 0.00,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    final_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(20) DEFAULT 'cash', -- cash, online, split
    payment_split_cash NUMERIC(10, 2) DEFAULT 0.00,
    payment_split_online NUMERIC(10, 2) DEFAULT 0.00,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sales_salon_date ON sales(salon_id, date);

-- JOIN TABLE: SALE SERVICES
CREATE TABLE IF NOT EXISTS sale_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL, -- Snapshotted service name
    price NUMERIC(10, 2) NOT NULL -- Snapshotted price at time of purchase
);

-- 10. CUSTOMERS (Mongoose Client.ts)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    gender VARCHAR(20), -- male, female, other, prefer_not_to_say
    birthday DATE,
    loyalty_points INTEGER DEFAULT 0,
    total_visits INTEGER DEFAULT 0,
    total_spent NUMERIC(10, 2) DEFAULT 0.00,
    last_visit TIMESTAMP WITH TIME ZONE,
    rating INTEGER DEFAULT 0,
    notes TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_salon_phone UNIQUE (salon_id, phone)
);

-- 11. FEEDBACKS
CREATE TABLE IF NOT EXISTS feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    sale_id UUID REFERENCES sales(id) ON DELETE SET NULL,
    customer_name VARCHAR(100),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    source VARCHAR(20) DEFAULT 'pos', -- pos, link, qr
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. MEMBERSHIPS
CREATE TABLE IF NOT EXISTS memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    validity INTEGER NOT NULL, -- in days
    discount NUMERIC(5, 2) NOT NULL, -- percentage
    benefits TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. OFFERS
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(100) NOT NULL,
    subtitle VARCHAR(100),
    description TEXT,
    original_price NUMERIC(10, 2),
    discounted_price NUMERIC(10, 2),
    percentage NUMERIC(5, 2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. INVENTORY ITEMS (Mongoose Product.ts)
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    sku VARCHAR(50),
    category VARCHAR(50) DEFAULT 'General',
    price NUMERIC(10, 2) NOT NULL, -- Selling price
    cost_price NUMERIC(10, 2), -- Purchase cost
    stock_count INTEGER DEFAULT 0,
    min_stock_alert INTEGER DEFAULT 5,
    unit VARCHAR(20) DEFAULT 'pcs', -- pcs, ml, grams
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. INVENTORY TRANSACTIONS
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- purchase, consumption, adjustment, sale
    quantity INTEGER NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. B2B MARKETPLACE PRODUCTS
CREATE TABLE IF NOT EXISTS marketplace_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL, -- Retail price
    business_price NUMERIC(10, 2), -- Discounted price for salons
    category VARCHAR(50) NOT NULL,
    brand VARCHAR(50),
    image TEXT,
    stock INTEGER DEFAULT 0,
    min_order_quantity INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 17. SUPPLIER ORDERS
CREATE TABLE IF NOT EXISTS supplier_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    salon_owner_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    supplier_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid
    shipping_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SUPPLIER ORDER ITEMS (LINE ITEMS)
CREATE TABLE IF NOT EXISTS supplier_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES supplier_orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES marketplace_products(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL
);

-- 18. SUPPLIER SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS supplier_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    plan VARCHAR(20) DEFAULT 'free', -- free, silver, gold
    status VARCHAR(20) DEFAULT 'active', -- active, expired, cancelled
    max_products INTEGER DEFAULT 5,
    commission_rate NUMERIC(5, 2) DEFAULT 10.00,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 19. SALON SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    plan VARCHAR(50) NOT NULL,
    razorpay_subscription_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- 20. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    review TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 21. CAMPAIGNS
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) DEFAULT 'sms', -- sms, email, whatsapp
    audience VARCHAR(20) DEFAULT 'all', -- all, loyal, inactive
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'draft', -- draft, sent, scheduled
    sent_count INTEGER DEFAULT 0,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 22. SESSIONS
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    token TEXT NOT NULL,
    user_agent VARCHAR(255) DEFAULT 'Unknown Device',
    ip VARCHAR(50) DEFAULT 'Unknown IP',
    last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- INDEX for session expiry
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- 23. BLACKLISTED TOKENS
CREATE TABLE IF NOT EXISTS blacklisted_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_blacklisted_tokens_expires_at ON blacklisted_tokens(expires_at);

-- ========================================================
-- NEW ERP-CAPABILITIES (NOT IN WORKSPACE BUT REQ FOR SAAS)
-- ========================================================

-- 24. ATTENDANCE
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    hours_worked NUMERIC(5, 2),
    CONSTRAINT unique_staff_date UNIQUE (staff_id, date)
);

-- 25. PAYROLL
CREATE TABLE IF NOT EXISTS payroll (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE NOT NULL,
    salary NUMERIC(10, 2) NOT NULL,
    commission NUMERIC(10, 2) DEFAULT 0.00,
    bonus NUMERIC(10, 2) DEFAULT 0.00,
    deduction NUMERIC(10, 2) DEFAULT 0.00,
    net_pay NUMERIC(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 26. EXPENSES
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL, -- rent, electricity, salary, supplies, marketing, miscellaneous
    amount NUMERIC(10, 2) NOT NULL,
    notes TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 27. NOTIFICATIONS (IN-APP)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    read_status BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ========================================================

-- Enable RLS on all main business tables
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- EXAMPLE POLICIES (Assuming client accesses through verified custom claims mapped to app metadata)

-- 1. Owner policy: Has access to all records matching their salon_id.
DROP POLICY IF EXISTS owner_all_access ON bookings;
CREATE POLICY owner_all_access ON bookings 
    FOR ALL 
    USING (salon_id = (SELECT salon_id FROM users WHERE id = auth.uid()));

-- 2. Staff/Stylist policy: Stylist can view their assigned staff bookings or queue items.
DROP POLICY IF EXISTS stylist_view_bookings ON bookings;
CREATE POLICY stylist_view_bookings ON bookings 
    FOR SELECT 
    USING (
        salon_id = (SELECT salon_id FROM users WHERE id = auth.uid())
        AND 
        id IN (
            SELECT booking_id FROM queue_items 
            WHERE staff_id = (SELECT id FROM staff WHERE user_id = auth.uid())
        )
    );

-- 3. Receptionist/Manager policy: Manage bookings
DROP POLICY IF EXISTS receptionist_manage_bookings ON bookings;
CREATE POLICY receptionist_manage_bookings ON bookings
    FOR ALL
    USING (
        salon_id = (SELECT salon_id FROM users WHERE id = auth.uid())
        AND 
        (SELECT name FROM roles WHERE id = (SELECT role_id FROM users WHERE id = auth.uid())) IN ('salon_owner', 'salon_manager', 'receptionist')
    );

-- 4. Accountant policy: Access payroll and expenses
DROP POLICY IF EXISTS accountant_finance ON payroll;
CREATE POLICY accountant_finance ON payroll
    FOR ALL
    USING (
        (SELECT name FROM roles WHERE id = (SELECT role_id FROM users WHERE id = auth.uid())) IN ('salon_owner', 'accountant')
    );
