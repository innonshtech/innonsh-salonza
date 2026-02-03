// "use client";

// import { useEffect, useState } from "react";
// import {
//   Users,
//   Plus,
//   Check,
//   Clock,
//   User,
//   ChevronRight,
//   AlertCircle,
//   Trash2,
//   GripVertical,
//   CheckCircle2,
//   Timer,
//   Calendar,
//   Phone,
//   Armchair,
//   Sofa,
//   X,
//   Scissors,
//   Sparkles,
//   CreditCard,
//   Banknote,
//   Percent,
//   Receipt
// } from "lucide-react";
// import {
//   DndContext,
//   closestCenter,
//   rectIntersection,
//   closestCorners,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragOverlay,
//   defaultDropAnimationSideEffects,
//   TouchSensor,
//   MouseSensor,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
//   useSortable,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { useDroppable } from '@dnd-kit/core';

// interface Service {
//   _id: string;
//   name: string;
//   duration: number;
//   price: number;
// }

// interface QueueItem {
//   _id: string;
//   position: number;
//   customerName: string;
//   serviceId: string;
//   serviceIds: string[];
//   status: "waiting" | "serving";
//   staffId?: string;
//   createdAt: string;
// }

// function QueueCard({ item, getServiceName, getEstimatedWait, onRemove, onServe, isServing, isDragging, dragOverlay, attributes, listeners }: any) {
//   return (
//     <div
//       className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${dragOverlay
//         ? 'cursor-grabbing shadow-2xl scale-105 border-purple-600 bg-white ring-4 ring-purple-200' :
//         isDragging
//           ? 'opacity-20 cursor-grabbing bg-slate-50 border-slate-200' :
//           'cursor-grab bg-white border-slate-200 hover:border-purple-400 hover:shadow-md active:cursor-grabbing'
//         } ${isServing && !dragOverlay && !isDragging ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-sm' : ''}`}
//       {...attributes}
//       {...listeners}
//     >
//       {/* Drag Handle */}
//       <div className="flex-shrink-0 touch-none">
//         <GripVertical className={`w-5 h-5 ${isServing ? 'text-green-400' : 'text-slate-300'}`} />
//       </div>

//       {/* Avatar */}
//       <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isServing
//         ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md'
//         : 'bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-md'
//         }`}>
//         <span className="font-black text-lg">{item.customerName.charAt(0).toUpperCase()}</span>
//       </div>

//       {/* Content */}
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2 mb-1">
//           {!isServing && (
//             <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 text-[10px] font-black text-purple-600 bg-purple-100 rounded-lg">
//               #{item.position}
//             </span>
//           )}
//           <h3 className="font-bold text-slate-900 truncate text-base leading-tight">{item.customerName}</h3>
//         </div>

//         {/* Services */}
//         <div className="flex flex-wrap gap-1.5 mt-1.5">
//           {(item.serviceIds || [item.serviceId]).map((sid: string, idx: number) => (
//             <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-[11px] text-purple-700 font-bold rounded-lg border border-purple-200">
//               <Scissors className="w-3 h-3" />
//               {getServiceName(sid)}
//             </span>
//           ))}
//         </div>

//         {/* Mobile Wait Time */}
//         {!isServing && (
//           <div className="mt-2 sm:hidden">
//             <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 rounded-lg border border-purple-200">
//               <Timer className="w-3.5 h-3.5 text-purple-600" />
//               <span className="text-[11px] font-bold text-purple-700">
//                 {getEstimatedWait(item.position)}
//               </span>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Actions */}
//       <div className="flex items-center gap-2 flex-shrink-0" onPointerDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
//         {/* Desktop Wait Time */}
//         {!isServing && (
//           <div className="text-right hidden sm:flex flex-col mr-1 min-w-[70px]">
//             <div className="text-sm font-black text-slate-900 leading-tight">
//               {getEstimatedWait(item.position)}
//             </div>
//             <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">
//               Est. Wait
//             </div>
//           </div>
//         )}

//         {/* Serve Button */}
//         {!isServing && (
//           <button
//             onClick={(e) => { e.stopPropagation(); onServe(item._id); }}
//             className="p-2.5 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl hover:from-purple-600 hover:to-purple-800 transition-all shadow-md hover:shadow-lg active:scale-95"
//             title="Start Serving"
//           >
//             <ChevronRight className="w-4 h-4" />
//           </button>
//         )}

//         {/* Complete/Remove Button */}
//         <button
//           onClick={(e) => { e.stopPropagation(); onRemove(item._id, item.customerName, isServing); }}
//           className={`p-2.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 ${isServing
//             ? 'bg-gradient-to-br from-green-500 to-emerald-700 text-white hover:from-green-600 hover:to-emerald-800'
//             : 'bg-slate-100 text-slate-500 hover:bg-red-500 hover:text-white'
//             }`}
//           title={isServing ? "Complete" : "Remove"}
//         >
//           {isServing ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
//         </button>
//       </div>
//     </div>
//   );
// }

// function SortableItem(props: any) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({
//     id: props.item._id,
//     data: {
//       type: 'item',
//       container: props.isServing ? 'serving' : 'waiting'
//     }
//   });

//   const style = {
//     transform: CSS.Translate.toString(transform),
//     transition,
//   };

//   return (
//     <div ref={setNodeRef} style={style}>
//       <QueueCard
//         {...props}
//         isDragging={isDragging}
//         attributes={attributes}
//         listeners={listeners}
//       />
//     </div>
//   );
// }

// function DropZone({ id, label, icon: Icon, children, colorClass, count }: any) {
//   const { setNodeRef, isOver } = useDroppable({
//     id,
//     data: {
//       type: 'container',
//       container: id
//     }
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       className={`bg-gradient-to-br from-white to-slate-50/30 rounded-2xl border-2 p-6 transition-all min-h-[450px] flex flex-col ${isOver
//         ? 'border-purple-500 border-dashed scale-[1.01] bg-purple-50/30 shadow-xl ring-4 ring-purple-200'
//         : 'border-slate-200 shadow-md hover:shadow-lg'
//         }`}
//     >
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className={`w-12 h-12 ${colorClass || 'bg-gradient-to-br from-purple-100 to-purple-200'} rounded-xl flex items-center justify-center shadow-sm`}>
//             <Icon className="w-6 h-6 text-purple-700" />
//           </div>
//           <div>
//             <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{label}</h2>
//             <p className="text-[11px] text-slate-500 font-bold tracking-wide mt-0.5">{count} {count === 1 ? 'Customer' : 'Customers'}</p>
//           </div>
//         </div>
//       </div>
//       <div className="flex-1 space-y-3">
//         {children}
//       </div>
//     </div>
//   );
// }

// function DoneDropZone() {
//   const { setNodeRef, isOver } = useDroppable({
//     id: 'done',
//     data: {
//       type: 'container',
//       container: 'done'
//     }
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       className={`p-8 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all touch-none ${isOver
//         ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-500 scale-[1.02] shadow-2xl ring-4 ring-green-300'
//         : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300 hover:border-slate-400'
//         }`}
//     >
//       <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-lg ${isOver ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-white border-2 border-slate-200'
//         }`}>
//         <CheckCircle2 className={`w-8 h-8 ${isOver ? 'text-white animate-bounce' : 'text-slate-400'}`} />
//       </div>
//       <h3 className={`text-xl font-black ${isOver ? 'text-green-700' : 'text-slate-600'}`}>
//         {isOver ? 'Release to Complete!' : 'Drag Here to Finish'}
//       </h3>
//       <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-2">Complete Service</p>
//     </div>
//   );
// }

// function StaffSeat({ staff, servingItems, getServiceName, onRemove, onServe, startServe, allServices, onUpdateServices }: any) {
//   const staffServing = servingItems.filter((i: any) => i.staffId === staff._id);
//   const isOccupied = staffServing.length > 0;
//   const customer = staffServing[0];
//   const [showAddService, setShowAddService] = useState(false);

//   const { setNodeRef, isOver } = useDroppable({
//     id: `serving-${staff._id}`,
//     data: {
//       type: 'container',
//       container: `serving-${staff._id}`
//     }
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       className={`relative group transition-all duration-300 ${isOver ? 'scale-105' : ''}`}
//     >
//       <div className={`
//         flex flex-col items-center p-4 rounded-2xl border-2 transition-all
//         ${isOver
//           ? 'border-purple-500 bg-purple-50 shadow-lg ring-4 ring-purple-200'
//           : isOccupied
//             ? 'border-green-300 bg-white shadow-md'
//             : 'border-slate-200 bg-slate-50/50 hover:border-purple-300 hover:bg-white hover:shadow-md'
//         }
//         w-full min-w-[150px]
//       `}>
//         {/* Seat Icon & Staff Name */}
//         <div className="flex flex-col items-center gap-2 mb-3 w-full">
//           <div className={`
//             w-14 h-14 rounded-xl flex items-center justify-center transition-all
//             ${isOccupied
//               ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md'
//               : 'bg-white border-2 border-slate-200 text-slate-400 group-hover:text-purple-500 group-hover:border-purple-300 shadow-sm'
//             }
//           `}>
//             {isOccupied ? <User className="w-7 h-7" /> : <Armchair className="w-7 h-7" />}
//           </div>
//           <div className="text-center w-full">
//             <span className="text-xs font-black text-slate-900 uppercase tracking-wide block truncate px-2">
//               {staff.name}
//             </span>
//             <span className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 block ${isOccupied ? 'text-green-600' : 'text-slate-400'}`}>
//               {isOccupied ? 'Occupied' : 'Available'}
//             </span>
//           </div>
//         </div>

//         {/* Status/Customer Info */}
//         <div className="w-full">
//           {isOccupied ? (
//             <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200 animate-in fade-in slide-in-from-bottom-1">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center flex-shrink-0">
//                   <span className="font-black text-sm">{customer.customerName.charAt(0).toUpperCase()}</span>
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="text-xs font-black text-green-900 truncate">
//                     {customer.customerName}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-wrap gap-1.5 mb-3">
//                 {(customer.serviceIds || [customer.serviceId]).map((sid: string, idx: number) => (
//                   <div key={idx} className="flex items-center gap-1 text-[9px] bg-white text-green-700 font-black px-2 py-1 rounded-lg border border-green-200 uppercase tracking-tight">
//                     <Scissors className="w-2.5 h-2.5" />
//                     {getServiceName(sid)}
//                   </div>
//                 ))}
//               </div>

//               {showAddService ? (
//                 <div className="space-y-2 mt-3 pt-3 border-t border-green-200">
//                   <select
//                     className="w-full text-[10px] font-bold p-2 border-2 border-green-200 rounded-lg bg-white outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
//                     onChange={(e) => {
//                       if (e.target.value) {
//                         onUpdateServices(customer._id, [...(customer.serviceIds || [customer.serviceId]), e.target.value]);
//                         setShowAddService(false);
//                       }
//                     }}
//                   >
//                     <option value="">Select Service to Add</option>
//                     {allServices.map((s: any) => (
//                       <option key={s._id} value={s._id}>{s.name} - ₹{s.price}</option>
//                     ))}
//                   </select>
//                   <button
//                     onClick={() => setShowAddService(false)}
//                     className="w-full text-[9px] font-black text-slate-500 hover:text-slate-700 py-1"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-green-200">
//                   <button
//                     onClick={() => setShowAddService(true)}
//                     className="w-full py-2 bg-white text-green-700 rounded-lg text-[10px] font-black hover:bg-green-100 transition-all border border-green-200 flex items-center justify-center gap-1"
//                   >
//                     <Plus className="w-3 h-3" />
//                     ADD SERVICE
//                   </button>
//                   <button
//                     onClick={(e) => { e.stopPropagation(); onRemove(customer._id, customer.customerName, true); }}
//                     className="w-full py-2 bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-lg text-[10px] font-black hover:from-green-700 hover:to-emerald-800 transition-all active:scale-95 shadow-md flex items-center justify-center gap-1"
//                   >
//                     <Check className="w-3 h-3" />
//                     COMPLETE
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="py-4 text-center">
//               <span className={`text-[11px] font-black tracking-widest ${isOver ? 'text-purple-600' : 'text-slate-400'}`}>
//                 {isOver ? 'DROP HERE' : 'READY'}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function PaymentModal({ isOpen, onClose, customer, services, onComplete }: any) {
//   if (!isOpen || !customer) return null;

//   const [discountType, setDiscountType] = useState('none');
//   const [discountValue, setDiscountValue] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState('cash');
//   const [cashAmount, setCashAmount] = useState(0);
//   const [onlineAmount, setOnlineAmount] = useState(0);

//   const subtotal = (customer.serviceIds || [customer.serviceId]).reduce((sum: number, sid: string) => {
//     const s = services.find((srv: any) => srv._id === sid);
//     return sum + (s?.price || 0);
//   }, 0);

//   let discountAmount = 0;
//   if (discountType === 'fixed') discountAmount = Number(discountValue);
//   if (discountType === 'percentage') discountAmount = (subtotal * Number(discountValue)) / 100;

//   const total = Math.max(0, subtotal - discountAmount);

//   useEffect(() => {
//     if (paymentMethod === 'cash') {
//       setCashAmount(total);
//       setOnlineAmount(0);
//     } else if (paymentMethod === 'online') {
//       setCashAmount(0);
//       setOnlineAmount(total);
//     } else if (paymentMethod === 'split') {
//       // Initialize as 50-50, but allow user to edit
//       if (cashAmount + onlineAmount !== total) {
//         setCashAmount(Math.floor(total / 2));
//         setOnlineAmount(total - Math.floor(total / 2));
//       }
//     }
//   }, [total, paymentMethod]);

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//       <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
//         <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
//           <div className="flex items-center justify-between mb-2">
//             <h3 className="text-xl font-black">Finalize Payment</h3>
//             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//           <p className="text-slate-400 text-sm font-medium">Customer: <span className="text-white font-bold">{customer.customerName}</span></p>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Bill Summary */}
//           <div className="space-y-2">
//             <div className="flex justify-between text-sm font-bold text-slate-500 uppercase tracking-widest">
//               <span>Subtotal</span>
//               <span>₹{subtotal}</span>
//             </div>

//             {/* Discount Options */}
//             <div className="space-y-3 pt-2">
//               <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">Discount</label>
//               <div className="grid grid-cols-3 gap-2">
//                 {['none', 'fixed', 'percentage'].map((type) => (
//                   <button
//                     key={type}
//                     onClick={() => setDiscountType(type)}
//                     className={`py-2 px-1 rounded-xl border-2 text-[10px] font-black uppercase transition-all ${discountType === type
//                       ? 'border-purple-500 bg-purple-50 text-purple-700'
//                       : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
//                       }`}
//                   >
//                     {type === 'none' ? 'No Disc' : type === 'fixed' ? 'Fixed ₹' : 'Percent %'}
//                   </button>
//                 ))}
//               </div>

//               {discountType !== 'none' && (
//                 <div className="flex items-center gap-2 animate-in slide-in-from-top-2">
//                   <div className="relative flex-1">
//                     {discountType === 'percentage' ? <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /> : <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</div>}
//                     <input
//                       type="number"
//                       value={discountValue || ''}
//                       onChange={(e) => setDiscountValue(Number(e.target.value))}
//                       placeholder={discountType === 'percentage' ? "0" : "0.00"}
//                       className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-bold text-sm"
//                     />
//                   </div>
//                   <div className="text-right min-w-[80px]">
//                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Amount</div>
//                     <div className="text-sm font-black text-red-500">-₹{discountAmount.toFixed(0)}</div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-slate-100">
//               <span className="text-base font-black text-slate-900">Total Payable</span>
//               <span className="text-2xl font-black text-green-600">₹{total.toFixed(0)}</span>
//             </div>
//           </div>

//           {/* Payment Method */}
//           <div className="space-y-3">
//             <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">Select Payment Method</label>
//             <div className="grid grid-cols-3 gap-3">
//               {[
//                 { id: 'cash', label: 'Cash', icon: Banknote, color: 'emerald' },
//                 { id: 'online', label: 'Online', icon: CreditCard, color: 'blue' },
//                 { id: 'split', label: 'Split', icon: Receipt, color: 'amber' }
//               ].map((m) => (
//                 <button
//                   key={m.id}
//                   onClick={() => setPaymentMethod(m.id)}
//                   className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${paymentMethod === m.id
//                     ? `border-${m.color}-500 bg-${m.color}-50 text-${m.color}-700 shadow-md`
//                     : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
//                     }`}
//                 >
//                   <m.icon className="w-5 h-5" />
//                   <span className="text-[10px] font-black uppercase">{m.label}</span>
//                 </button>
//               ))}
//             </div>

//             {paymentMethod === 'split' && (
//               <div className="grid grid-cols-2 gap-4 pt-2 animate-in slide-in-from-top-2">
//                 <div className="space-y-1">
//                   <label className="text-[9px] font-black text-emerald-600 uppercase ml-1">Cash Part</label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
//                     <input
//                       type="number"
//                       value={cashAmount || ''}
//                       onChange={(e) => {
//                         const val = Number(e.target.value);
//                         setCashAmount(val);
//                         setOnlineAmount(total - val);
//                       }}
//                       className="w-full pl-7 pr-3 py-2 bg-slate-50 border-2 border-emerald-100 rounded-xl focus:border-emerald-500 outline-none font-bold text-xs"
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-[9px] font-black text-blue-600 uppercase ml-1">Online Part</label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
//                     <input
//                       type="number"
//                       value={onlineAmount || ''}
//                       onChange={(e) => {
//                         const val = Number(e.target.value);
//                         setOnlineAmount(val);
//                         setCashAmount(total - val);
//                       }}
//                       className="w-full pl-7 pr-3 py-2 bg-slate-50 border-2 border-blue-100 rounded-xl focus:border-blue-500 outline-none font-bold text-xs"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3 pt-2">
//             <button
//               onClick={onClose}
//               className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95 text-sm"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => onComplete({
//                 paymentMethod,
//                 paymentSplit: { cash: cashAmount, online: onlineAmount },
//                 discount: { type: discountType, value: discountValue, amount: discountAmount }
//               })}
//               className="flex-2 flex-[2] py-3.5 bg-gradient-to-br from-green-500 to-emerald-600 text-white font-black rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all active:scale-95 shadow-lg shadow-green-200 text-sm flex items-center justify-center gap-2"
//             >
//               <Check className="w-4 h-4" />
//               COMPLETE ORDER
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function QueueManagement() {
//   const [salon, setSalon] = useState<any>(null);
//   const [queue, setQueue] = useState<QueueItem[]>([]);
//   const [services, setServices] = useState<Service[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [activeId, setActiveId] = useState<string | null>(null);

//   const [customerName, setCustomerName] = useState("");
//   const [customerPhone, setCustomerPhone] = useState("");
//   const [selectedServices, setSelectedServices] = useState<string[]>([]);
//   const [staff, setStaff] = useState<any[]>([]);

//   // Payment Modal State
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [completingItem, setCompletingItem] = useState<QueueItem | null>(null);

//   const sensors = useSensors(
//     useSensor(MouseSensor, {
//       activationConstraint: {
//         distance: 8,
//       },
//     }),
//     useSensor(TouchSensor, {
//       activationConstraint: {
//         delay: 200,
//         tolerance: 8,
//       },
//     }),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   useEffect(() => {
//     const saved = localStorage.getItem("salon");
//     if (saved) {
//       const s = JSON.parse(saved);
//       setSalon(s);
//       loadQueue(s._id);
//       loadServices(s._id);
//       loadStaff(s._id);
//     }
//   }, []);

//   async function loadQueue(id: string) {
//     try {
//       const res = await fetch(`/api/queue/list?id=${id}`);
//       const data = await res.json();
//       setQueue(data.queue || []);
//     } catch (error) {
//       console.error("Error loading queue:", error);
//     }
//   }

//   async function loadServices(id: string) {
//     try {
//       const res = await fetch(`/api/salon/services/list?id=${id}`);
//       const data = await res.json();
//       setServices(data.services || []);
//     } catch (error) {
//       console.error("Error loading services:", error);
//     }
//   }

//   async function loadStaff(id: string) {
//     try {
//       const res = await fetch(`/api/staff/list?salonId=${id}`);
//       const data = await res.json();
//       setStaff(data.staff || []);
//     } catch (error) {
//       console.error("Error loading staff:", error);
//     }
//   }

//   async function addToQueue(e: React.FormEvent) {
//     e.preventDefault();
//     if (!customerName || selectedServices.length === 0) return;

//     setLoading(true);
//     try {
//       await fetch(`/api/queue/add`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           salonId: salon._id,
//           customerName,
//           customerPhone,
//           serviceIds: selectedServices
//         }),
//       });

//       await loadQueue(salon._id);
//       setCustomerName("");
//       setCustomerPhone("");
//       setSelectedServices([]);
//     } catch (error) {
//       console.error("Error adding to queue:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleUpdateServices(id: string, newServiceIds: string[]) {
//     try {
//       const res = await fetch('/api/queue/update', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ id, serviceIds: newServiceIds })
//       });
//       const data = await res.json();
//       if (data.success) {
//         setQueue(prev => prev.map(item => item._id === id ? { ...item, serviceIds: newServiceIds } : item));
//       }
//     } catch (err) {
//       console.error("Update services fail:", err);
//     }
//   }

//   async function startServe(id: string, staffId?: string) {
//     setQueue(prev => prev.map(i =>
//       i._id === id ? { ...i, status: "serving" as const, position: 0, staffId } : i
//     ));

//     try {
//       await fetch(`/api/queue/serve`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id, staffId }),
//       });
//       loadQueue(salon._id);
//     } catch (error) {
//       console.error("Error starting service:", error);
//       loadQueue(salon._id);
//     }
//   }

//   async function unserve(id: string) {
//     setQueue(prev => prev.map(i =>
//       i._id === id ? { ...i, status: "waiting" as const, position: 999 } : i
//     ));

//     try {
//       await fetch(`/api/queue/unserve`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });
//       loadQueue(salon._id);
//     } catch (error) {
//       console.error("Error unserving:", error);
//       loadQueue(salon._id);
//     }
//   }

//   async function handleRemove(id: string, customerName: string, isServing: boolean, skipConfirm = false, paymentData: any = null) {
//     if (isServing && !paymentData) {
//       // Find the item to get service details
//       const item = queue.find(i => i._id === id);
//       if (item) {
//         setCompletingItem(item);
//         setShowPaymentModal(true);
//         return;
//       }
//     }

//     const action = isServing ? "complete" : "remove";
//     if (!skipConfirm && !confirm(`Mark ${customerName} as ${action}d?`)) return;

//     try {
//       await fetch(`/api/queue/remove`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id,
//           ...paymentData
//         }),
//       });
//       setShowPaymentModal(false);
//       setCompletingItem(null);
//       loadQueue(salon._id);
//     } catch (error) {
//       console.error("Error removing:", error);
//     }
//   }

//   function handleDragStart(event: any) {
//     setActiveId(event.active.id);
//   }

//   async function handleDragEnd(event: any) {
//     const { active, over } = event;
//     setActiveId(null);
//     if (!over) return;

//     const activeItem = queue.find(i => i._id === active.id);
//     if (!activeItem) return;

//     const overData = over.data.current;
//     let targetContainer = null;

//     if (overData?.type === 'container') {
//       targetContainer = overData.container;
//     } else if (overData?.type === 'item') {
//       targetContainer = overData.container;
//     } else {
//       if (over.id === 'serving' || over.id === 'waiting' || over.id === 'done') {
//         targetContainer = over.id;
//       }
//     }

//     if (!targetContainer) return;

//     const currentStatus = activeItem.status;

//     if (currentStatus === "waiting" && targetContainer.startsWith("serving-")) {
//       const staffId = targetContainer.replace("serving-", "");
//       await startServe(activeItem._id, staffId);
//     } else if (currentStatus === "waiting" && targetContainer === "serving") {
//       await startServe(activeItem._id);
//     } else if (currentStatus === "serving" && targetContainer === "waiting") {
//       await unserve(activeItem._id);
//     } else if (targetContainer === "done") {
//       if (activeItem.status === "serving") {
//         setCompletingItem(activeItem);
//         setShowPaymentModal(true);
//       } else {
//         await handleRemove(activeItem._id, activeItem.customerName, false, true);
//       }
//     } else if (targetContainer.startsWith("serving-") && currentStatus === "serving" && activeItem.staffId !== targetContainer.replace("serving-", "")) {
//       const staffId = targetContainer.replace("serving-", "");
//       await startServe(activeItem._id, staffId);
//     } else if (currentStatus === "waiting" && targetContainer === "waiting" && active.id !== over.id) {
//       const waitingItems = queue.filter(i => i.status === "waiting");
//       const servingItems = queue.filter(i => i.status === "serving");
//       const oldIndex = waitingItems.findIndex(i => i._id === active.id);
//       const newIndex = waitingItems.findIndex(i => i._id === over.id);

//       if (newIndex !== -1 && oldIndex !== -1) {
//         const newOrder = arrayMove(waitingItems, oldIndex, newIndex);
//         setQueue([...servingItems, ...newOrder.map((item, idx) => ({ ...item, position: idx + 1 }))]);

//         try {
//           await fetch('/api/queue/reorder', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               items: newOrder.map((item, idx) => ({ id: item._id, position: idx + 1 }))
//             })
//           });
//         } catch (err) {
//           console.error("Reorder fail:", err);
//           loadQueue(salon._id);
//         }
//       }
//     }
//   }

//   function getServiceName(serviceId: string) {
//     const service = services.find(s => s._id === serviceId);
//     return service?.name || "Unknown";
//   }

//   function getEstimatedWait(position: number) {
//     if (position === 1) return "Next Up";
//     const avgTime = 30;
//     const waitTime = (position - 1) * avgTime;
//     if (waitTime < 60) return `~${waitTime} min`;
//     const hours = Math.floor(waitTime / 60);
//     const mins = waitTime % 60;
//     return mins > 0 ? `~${hours}h ${mins}m` : `~${hours}h`;
//   }

//   const toggleService = (serviceId: string) => {
//     setSelectedServices(prev =>
//       prev.includes(serviceId)
//         ? prev.filter(id => id !== serviceId)
//         : [...prev, serviceId]
//     );
//   };

//   if (!salon) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
//           <p className="mt-4 text-slate-600 font-medium">Loading Queue...</p>
//         </div>
//       </div>
//     );
//   }

//   const servingItems = queue.filter(i => i.status === "serving");
//   const waitingItems = queue.filter(i => i.status === "waiting");
//   const activeItem = activeId ? (queue.find(i => i._id === activeId) || null) : null;

//   return (
//     <div className="space-y-6 pb-20 px-4 sm:px-0">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Queue Management</h1>
//           <p className="mt-1 text-sm text-slate-600 font-medium">Drag cards to manage your service queue</p>
//         </div>

//         {/* Stats */}
//         <div className="flex gap-3">
//           <div className="bg-gradient-to-br from-purple-500 to-purple-700 px-6 py-3 rounded-xl text-center min-w-[100px] shadow-lg">
//             <div className="text-2xl font-black text-white">{waitingItems.length}</div>
//             <div className="text-[10px] uppercase font-black text-purple-100 tracking-widest">Waiting</div>
//           </div>
//           <div className="bg-gradient-to-br from-green-500 to-emerald-700 px-6 py-3 rounded-xl text-center min-w-[100px] shadow-lg">
//             <div className="text-2xl font-black text-white">{servingItems.length}</div>
//             <div className="text-[10px] uppercase font-black text-green-100 tracking-widest">Serving</div>
//           </div>
//         </div>
//       </div>

//       {/* Add to Queue Form */}
//       <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-slate-200 p-6 shadow-lg">
//         <div className="flex items-center gap-3 mb-5">
//           <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-md">
//             <Plus className="w-5 h-5 text-white" />
//           </div>
//           <div>
//             <h3 className="text-lg font-black text-slate-900">Add New Customer</h3>
//             <p className="text-[11px] text-slate-500 font-medium">Enter customer details and select services</p>
//           </div>
//         </div>

//         <form onSubmit={addToQueue} className="space-y-4">
//           {/* Customer Name Input */}
//           <div className="relative group">
//             <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">
//               Customer Name
//             </label>
//             <div className="relative">
//               <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-600 transition-colors pointer-events-none" />
//               <input
//                 type="text"
//                 placeholder="Enter customer name"
//                 value={customerName}
//                 onChange={(e) => setCustomerName(e.target.value)}
//                 required
//                 className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all font-medium text-sm"
//               />
//             </div>
//           </div>

//           {/* Customer Phone Input */}
//           <div className="relative group">
//             <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">
//               Phone Number
//             </label>
//             <div className="relative">
//               <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-600 transition-colors pointer-events-none" />
//               <input
//                 type="tel"
//                 placeholder="Enter 10-digit number"
//                 value={customerPhone}
//                 onChange={(e) => setCustomerPhone(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all font-medium text-sm"
//               />
//             </div>
//           </div>

//           {/* Services Selection */}
//           <div>
//             <label className="block text-xs font-black text-slate-700 mb-3 uppercase tracking-wide">
//               Select Services
//             </label>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
//               {services.map((service) => {
//                 const isSelected = selectedServices.includes(service._id);
//                 return (
//                   <button
//                     key={service._id}
//                     type="button"
//                     onClick={() => toggleService(service._id)}
//                     className={`
//                       relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
//                       ${isSelected
//                         ? 'border-purple-500 bg-purple-50 shadow-md'
//                         : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-sm'
//                       }
//                     `}
//                   >
//                     <div className={`
//                       w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all
//                       ${isSelected
//                         ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white'
//                         : 'bg-slate-100 text-slate-400'
//                       }
//                     `}>
//                       <Scissors className="w-5 h-5" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="font-bold text-slate-900 text-sm truncate">{service.name}</div>
//                       <div className="text-xs text-slate-500 font-medium">₹{service.price} • {service.duration} min</div>
//                     </div>
//                     {isSelected && (
//                       <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
//                         <Check className="w-3 h-3 text-white" />
//                       </div>
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//             {selectedServices.length > 0 && (
//               <div className="mt-3 flex items-center gap-2 flex-wrap">
//                 <span className="text-xs font-bold text-slate-600">Selected:</span>
//                 {selectedServices.map(sid => (
//                   <span key={sid} className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">
//                     {getServiceName(sid)}
//                     <button
//                       type="button"
//                       onClick={() => toggleService(sid)}
//                       className="hover:bg-purple-200 rounded-full p-0.5"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading || !customerName || selectedServices.length === 0}
//             className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-br from-slate-900 to-slate-800 text-white font-black rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg text-sm flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                 Adding...
//               </>
//             ) : (
//               <>
//                 <Plus className="w-4 h-4" />
//                 Add to Queue
//               </>
//             )}
//           </button>
//         </form>
//       </div>

//       {/* Drag & Drop Area */}
//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCorners}
//         onDragStart={handleDragStart}
//         onDragEnd={handleDragEnd}
//       >
//         <div className="max-w-7xl mx-auto space-y-6">
//           {/* Done Drop Zone */}
//           <DoneDropZone />

//           {/* Queue Columns */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Staff Seats */}
//             <div className="space-y-4">
//               <div className="flex items-center justify-between px-2">
//                 <div className="flex items-center gap-2">
//                   <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-md">
//                     <Armchair className="w-5 h-5 text-white" />
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-black text-slate-900">Staff Seats</h2>
//                     <p className="text-[11px] text-slate-500 font-medium">{staff.length} available seats</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-1.5">
//                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Live</span>
//                 </div>
//               </div>

//               {/* Grid of Seats */}
//               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
//                 {staff.map((s) => (
//                   <StaffSeat
//                     key={s._id}
//                     staff={s}
//                     servingItems={servingItems}
//                     getServiceName={getServiceName}
//                     onRemove={handleRemove}
//                     onServe={startServe}
//                     startServe={startServe}
//                     allServices={services}
//                     onUpdateServices={handleUpdateServices}
//                   />
//                 ))}
//               </div>

//               {/* Unassigned Serving */}
//               {servingItems.some(i => !i.staffId) && (
//                 <div className="mt-6 bg-white rounded-2xl border-2 border-amber-200 p-4 shadow-sm">
//                   <div className="flex items-center gap-2 mb-3">
//                     <AlertCircle className="w-5 h-5 text-amber-600" />
//                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Unassigned</h3>
//                   </div>
//                   <div className="space-y-2">
//                     {servingItems.filter(i => !i.staffId).map((item) => (
//                       <SortableItem
//                         key={item._id}
//                         item={item}
//                         isServing={true}
//                         getServiceName={getServiceName}
//                         getEstimatedWait={getEstimatedWait}
//                         onRemove={handleRemove}
//                         onServe={startServe}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Waiting List */}
//             <DropZone
//               id="waiting"
//               label="Waiting List"
//               icon={Users}
//               colorClass="bg-gradient-to-br from-purple-100 to-purple-200"
//               count={waitingItems.length}
//             >
//               <SortableContext items={waitingItems.map(i => i._id)} strategy={verticalListSortingStrategy}>
//                 {waitingItems.length === 0 ? (
//                   <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-purple-200 rounded-2xl py-20 bg-purple-50/30">
//                     <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-3 shadow-sm">
//                       <Users className="w-8 h-8 text-purple-400" />
//                     </div>
//                     <p className="text-purple-600 text-sm font-bold">Queue is Empty</p>
//                     <p className="text-purple-400 text-xs font-medium mt-1">Add customers to get started</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     {waitingItems.map((item) => (
//                       <SortableItem
//                         key={item._id}
//                         item={item}
//                         isServing={false}
//                         getServiceName={getServiceName}
//                         getEstimatedWait={getEstimatedWait}
//                         onRemove={handleRemove}
//                         onServe={startServe}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </SortableContext>
//             </DropZone>
//           </div>
//         </div>

//         {/* Drag Overlay */}
//         <DragOverlay
//           adjustScale={true}
//           dropAnimation={{
//             sideEffects: defaultDropAnimationSideEffects({
//               styles: { active: { opacity: '0.3' } }
//             }),
//           }}
//         >
//           {activeItem ? (
//             <QueueCard
//               item={activeItem}
//               isServing={activeItem.status === 'serving'}
//               getServiceName={getServiceName}
//               getEstimatedWait={getEstimatedWait}
//               onRemove={() => { }}
//               onServe={() => { }}
//               dragOverlay
//             />
//           ) : null}
//         </DragOverlay>
//       </DndContext>

//       <PaymentModal
//         isOpen={showPaymentModal}
//         onClose={() => { setShowPaymentModal(false); setCompletingItem(null); }}
//         customer={completingItem}
//         services={services}
//         onComplete={(paymentData: any) => {
//           if (completingItem) {
//             handleRemove(completingItem._id, completingItem.customerName, true, true, paymentData);
//           }
//         }}
//       />
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useRef } from "react";
import {
  Users,
  Plus,
  Check,
  Clock,
  User,
  ChevronRight,
  AlertCircle,
  Trash2,
  GripVertical,
  CheckCircle2,
  Timer,
  Calendar,
  Phone,
  Armchair,
  Scissors,
  X,
  Sparkles,
  CreditCard,
  Banknote,
  Percent,
  Receipt,
  IndianRupee,
  RotateCcw,
  Loader2
} from "lucide-react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  TouchSensor,
  MouseSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';

interface Service {
  _id: string;
  name: string;
  duration: number;
  price: number;
}

interface QueueItem {
  _id: string;
  position: number;
  customerName: string;
  serviceId: string;
  serviceIds: string[];
  status: "waiting" | "serving";
  staffId?: string;
  createdAt: string;
}

function QueueCard({ item, getServiceName, getEstimatedWait, onRemove, onServe, isServing, isDragging, dragOverlay, attributes, listeners }: any) {
  return (
    <div
      className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all ${dragOverlay
        ? 'cursor-grabbing shadow-xl scale-105 border-purple-500 bg-white ring-2 ring-purple-200' :
        isDragging
          ? 'opacity-30 cursor-grabbing bg-slate-50 border-slate-200' :
          'cursor-grab bg-white border-slate-200 hover:border-purple-300 hover:shadow-md active:cursor-grabbing'
        } ${isServing && !dragOverlay && !isDragging ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300 shadow-sm' : ''}`}
      {...attributes}
      {...listeners}
    >
      {/* Drag Handle */}
      <div className="flex-shrink-0 touch-none">
        <GripVertical className={`w-4 h-4 ${isServing ? 'text-emerald-400' : 'text-slate-300'}`} />
      </div>

      {/* Avatar */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isServing
        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
        : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
        }`}>
        <span className="font-bold text-sm">{item.customerName.charAt(0).toUpperCase()}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {!isServing && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-bold text-purple-700 bg-purple-100 rounded-md">
              #{item.position}
            </span>
          )}
          <h3 className="font-semibold text-slate-900 truncate text-sm">{item.customerName}</h3>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-1 mt-1">
          {(item.serviceIds || [item.serviceId]).map((sid: string, idx: number) => (
            <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-[10px] text-purple-700 font-medium rounded-md border border-purple-100">
              <Scissors className="w-2.5 h-2.5" />
              {getServiceName(sid)}
            </span>
          ))}
        </div>

        {/* Mobile Wait Time */}
        {!isServing && (
          <div className="mt-1 sm:hidden">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 rounded-md border border-purple-100">
              <Timer className="w-3 h-3 text-purple-600" />
              <span className="text-[10px] font-medium text-purple-700">
                {getEstimatedWait(item.position)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0" onPointerDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
        {/* Desktop Wait Time */}
        {!isServing && (
          <div className="text-right hidden sm:flex flex-col mr-2 min-w-[60px]">
            <div className="text-xs font-bold text-slate-900">
              {getEstimatedWait(item.position)}
            </div>
            <div className="text-[8px] text-slate-500 uppercase font-medium tracking-wide">
              Est. Wait
            </div>
          </div>
        )}

        {/* Serve Button */}
        {!isServing && (
          <button
            onClick={(e) => { e.stopPropagation(); onServe(item._id); }}
            className="p-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-sm hover:shadow"
            title="Start Serving"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Complete/Remove Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(item._id, item.customerName, isServing); }}
          className={`p-2 rounded-lg transition-all shadow-sm hover:shadow ${isServing
            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700'
            : 'bg-slate-100 text-slate-500 hover:bg-red-500 hover:text-white'
            }`}
          title={isServing ? "Complete" : "Remove"}
        >
          {isServing ? <Check className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

function SortableItem(props: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.item._id,
    data: {
      type: 'item',
      container: props.isServing ? 'serving' : 'waiting'
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <QueueCard
        {...props}
        isDragging={isDragging}
        attributes={attributes}
        listeners={listeners}
      />
    </div>
  );
}

function DropZone({ id, label, icon: Icon, children, colorClass, count }: any) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'container',
      container: id
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-xl border p-5 transition-all min-h-[400px] flex flex-col ${isOver
        ? 'border-purple-500 border-dashed scale-[1.005] bg-purple-50 shadow-lg'
        : 'border-slate-200 shadow-sm'
        }`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${colorClass || 'bg-purple-100'} rounded-lg flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{label}</h2>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">{count} {count === 1 ? 'Customer' : 'Customers'}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {children}
      </div>
    </div>
  );
}

function DoneDropZone() {
  const { setNodeRef, isOver } = useDroppable({
    id: 'done',
    data: {
      type: 'container',
      container: 'done'
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all touch-none ${isOver
        ? 'bg-emerald-50 border-emerald-500 shadow-lg'
        : 'bg-slate-50 border-slate-300 hover:border-slate-400'
        }`}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${isOver ? 'bg-gradient-to-r from-emerald-500 to-green-600' : 'bg-white border border-slate-200'
        }`}>
        <CheckCircle2 className={`w-6 h-6 ${isOver ? 'text-white' : 'text-slate-400'}`} />
      </div>
      <h3 className={`font-semibold ${isOver ? 'text-emerald-700' : 'text-slate-600'}`}>
        {isOver ? 'Release to Complete!' : 'Drag Here to Finish'}
      </h3>
      <p className="text-[9px] text-slate-500 uppercase font-medium mt-1">Complete Service</p>
    </div>
  );
}

function StaffSeat({ staff, servingItems, getServiceName, onRemove, onServe, startServe, allServices, onUpdateServices }: any) {
  const staffServing = servingItems.filter((i: any) => i.staffId === staff._id);
  const isOccupied = staffServing.length > 0;
  const customer = staffServing[0];
  const [showAddService, setShowAddService] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: `serving-${staff._id}`,
    data: {
      type: 'container',
      container: `serving-${staff._id}`
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative group transition-all duration-200 ${isOver ? 'scale-[1.02]' : ''}`}
    >
      <div className={`
        flex flex-col items-center p-3 rounded-xl border transition-all
        ${isOver
          ? 'border-purple-500 bg-purple-50 shadow-md'
          : isOccupied
            ? 'border-emerald-300 bg-white shadow-sm'
            : 'border-slate-200 bg-slate-50 hover:border-purple-300 hover:bg-white'
        }
        w-full min-w-[140px]
      `}>
        {/* Seat Icon & Staff Name */}
        <div className="flex flex-col items-center gap-2 mb-2 w-full">
          <div className={`
            w-12 h-12 rounded-lg flex items-center justify-center transition-all
            ${isOccupied
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
              : 'bg-white border border-slate-200 text-slate-400 group-hover:text-purple-500 group-hover:border-purple-300'
            }
          `}>
            {isOccupied ? <User className="w-6 h-6" /> : <Armchair className="w-6 h-6" />}
          </div>
          <div className="text-center w-full">
            <span className="text-xs font-semibold text-slate-900 block truncate px-1">
              {staff.name}
            </span>
            <span className={`text-[8px] font-medium uppercase mt-0.5 block ${isOccupied ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isOccupied ? 'Occupied' : 'Available'}
            </span>
          </div>
        </div>

        {/* Status/Customer Info */}
        <div className="w-full">
          {isOccupied ? (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-2 border border-emerald-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-md bg-gradient-to-r from-emerald-500 to-green-600 text-white flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-xs">{customer.customerName.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-emerald-900 truncate">
                    {customer.customerName}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                {(customer.serviceIds || [customer.serviceId]).map((sid: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-0.5 text-[8px] bg-white text-emerald-700 font-medium px-1.5 py-0.5 rounded border border-emerald-200">
                    <Scissors className="w-2 h-2" />
                    {getServiceName(sid)}
                  </div>
                ))}
              </div>

              {showAddService ? (
                <div className="space-y-1 mt-2 pt-2 border-t border-emerald-200">
                  <select
                    className="w-full text-[9px] font-medium p-1.5 border border-emerald-200 rounded bg-white outline-none focus:border-emerald-400"
                    onChange={(e) => {
                      if (e.target.value) {
                        onUpdateServices(customer._id, [...(customer.serviceIds || [customer.serviceId]), e.target.value]);
                        setShowAddService(false);
                      }
                    }}
                  >
                    <option value="">Select Service to Add</option>
                    {allServices.map((s: any) => (
                      <option key={s._id} value={s._id}>{s.name} - ₹{s.price}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowAddService(false)}
                    className="w-full text-[8px] font-medium text-slate-500 hover:text-slate-700 py-0.5"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-emerald-200">
                  <button
                    onClick={() => setShowAddService(true)}
                    className="w-full py-1.5 bg-white text-emerald-700 rounded text-[9px] font-medium hover:bg-emerald-100 transition-all border border-emerald-200 flex items-center justify-center gap-0.5"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    ADD SERVICE
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemove(customer._id, customer.customerName, true); }}
                    className="w-full py-1.5 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded text-[9px] font-medium hover:from-emerald-700 hover:to-green-800 transition-all shadow-sm flex items-center justify-center gap-0.5"
                  >
                    <Check className="w-2.5 h-2.5" />
                    COMPLETE
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-3 text-center">
              <span className={`text-[10px] font-medium ${isOver ? 'text-purple-600' : 'text-slate-400'}`}>
                {isOver ? 'DROP HERE' : 'READY'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ isOpen, onClose, customer, services, onComplete }: any) {
  if (!isOpen || !customer) return null;

  const [discountType, setDiscountType] = useState('none');
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashAmount, setCashAmount] = useState(0);
  const [onlineAmount, setOnlineAmount] = useState(0);

  const subtotal = (customer.serviceIds || [customer.serviceId]).reduce((sum: number, sid: string) => {
    const s = services.find((srv: any) => srv._id === sid);
    return sum + (s?.price || 0);
  }, 0);

  let discountAmount = 0;
  if (discountType === 'fixed') discountAmount = Number(discountValue);
  if (discountType === 'percentage') discountAmount = (subtotal * Number(discountValue)) / 100;

  const total = Math.max(0, subtotal - discountAmount);

  useEffect(() => {
    if (paymentMethod === 'cash') {
      setCashAmount(total);
      setOnlineAmount(0);
    } else if (paymentMethod === 'online') {
      setCashAmount(0);
      setOnlineAmount(total);
    } else if (paymentMethod === 'split') {
      if (cashAmount + onlineAmount !== total) {
        setCashAmount(Math.floor(total / 2));
        setOnlineAmount(total - Math.floor(total / 2));
      }
    }
  }, [total, paymentMethod]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold">Finalize Payment</h3>
            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-400 text-xs">Customer: <span className="text-white font-medium">{customer.customerName}</span></p>
        </div>

        <div className="p-5 space-y-5">
          {/* Bill Summary */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-500 uppercase">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            {/* Discount Options */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-medium text-slate-700">Discount</label>
              <div className="grid grid-cols-3 gap-1">
                {['none', 'fixed', 'percentage'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setDiscountType(type)}
                    className={`py-1.5 px-1 rounded-lg border text-[9px] font-medium uppercase transition-all ${discountType === type
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                      }`}
                  >
                    {type === 'none' ? 'No Disc' : type === 'fixed' ? 'Fixed ₹' : 'Percent %'}
                  </button>
                ))}
              </div>

              {discountType !== 'none' && (
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    {discountType === 'percentage' ? <Percent className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" /> : <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">₹</div>}
                    <input
                      type="number"
                      value={discountValue || ''}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      placeholder={discountType === 'percentage' ? "0" : "0.00"}
                      className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:ring-1 focus:ring-purple-500 outline-none font-medium text-sm"
                    />
                  </div>
                  <div className="text-right min-w-[70px]">
                    <div className="text-[9px] font-medium text-slate-400">Amount</div>
                    <div className="text-sm font-medium text-red-500">-₹{discountAmount.toFixed(0)}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-100">
              <span className="font-semibold text-slate-900">Total Payable</span>
              <span className="text-xl font-semibold text-emerald-600">₹{total.toFixed(0)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">Select Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cash', label: 'Cash', icon: Banknote, color: 'emerald' },
                { id: 'online', label: 'Online', icon: CreditCard, color: 'blue' },
                { id: 'split', label: 'Split', icon: Receipt, color: 'amber' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${paymentMethod === m.id
                    ? `border-${m.color}-500 bg-${m.color}-50 text-${m.color}-700`
                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                    }`}
                >
                  <m.icon className="w-4 h-4" />
                  <span className="text-[9px] font-medium uppercase">{m.label}</span>
                </button>
              ))}
            </div>

            {paymentMethod === 'split' && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-0.5">
                  <label className="text-[8px] font-medium text-emerald-600 ml-0.5">Cash Part</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">₹</span>
                    <input
                      type="number"
                      value={cashAmount || ''}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCashAmount(val);
                        setOnlineAmount(total - val);
                      }}
                      className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-emerald-100 rounded-lg focus:border-emerald-500 outline-none font-medium text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <label className="text-[8px] font-medium text-blue-600 ml-0.5">Online Part</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">₹</span>
                    <input
                      type="number"
                      value={onlineAmount || ''}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setOnlineAmount(val);
                        setCashAmount(total - val);
                      }}
                      className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-blue-100 rounded-lg focus:border-blue-500 outline-none font-medium text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 transition-all text-xs"
            >
              Cancel
            </button>
            <button
              onClick={() => onComplete({
                paymentMethod,
                paymentSplit: { cash: cashAmount, online: onlineAmount },
                discount: { type: discountType, value: discountValue, amount: discountAmount }
              })}
              className="flex-2 flex-[2] py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-sm text-xs flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              COMPLETE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QueueManagement() {
  const [salon, setSalon] = useState<any>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [staff, setStaff] = useState<any[]>([]);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [completingItem, setCompletingItem] = useState<QueueItem | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const saved = localStorage.getItem("salon");
    if (saved) {
      const s = JSON.parse(saved);
      setSalon(s);
      loadQueue(s._id);
      loadServices(s._id);
      loadStaff(s._id);
    }
  }, []);

  async function loadQueue(id: string) {
    try {
      const res = await fetch(`/api/queue/list?id=${id}`);
      const data = await res.json();
      setQueue(data.queue || []);
    } catch (error) {
      console.error("Error loading queue:", error);
    }
  }

  async function loadServices(id: string) {
    try {
      const res = await fetch(`/api/salon/services/list?id=${id}`);
      const data = await res.json();
      setServices(data.services || []);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  }

  async function loadStaff(id: string) {
    try {
      const res = await fetch(`/api/staff/list?salonId=${id}`);
      const data = await res.json();
      setStaff(data.staff || []);
    } catch (error) {
      console.error("Error loading staff:", error);
    }
  }

  async function addToQueue(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName || selectedServices.length === 0) return;

    setLoading(true);
    try {
      await fetch(`/api/queue/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          salonId: salon._id,
          customerName,
          customerPhone,
          serviceIds: selectedServices
        }),
      });

      await loadQueue(salon._id);
      setCustomerName("");
      setCustomerPhone("");
      setSelectedServices([]);
    } catch (error) {
      console.error("Error adding to queue:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateServices(id: string, newServiceIds: string[]) {
    try {
      const res = await fetch('/api/queue/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, serviceIds: newServiceIds })
      });
      const data = await res.json();
      if (data.success) {
        setQueue(prev => prev.map(item => item._id === id ? { ...item, serviceIds: newServiceIds } : item));
      }
    } catch (err) {
      console.error("Update services fail:", err);
    }
  }

  async function startServe(id: string, staffId?: string) {
    setQueue(prev => prev.map(i =>
      i._id === id ? { ...i, status: "serving" as const, position: 0, staffId } : i
    ));

    try {
      await fetch(`/api/queue/serve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, staffId }),
      });
      loadQueue(salon._id);
    } catch (error) {
      console.error("Error starting service:", error);
      loadQueue(salon._id);
    }
  }

  async function unserve(id: string) {
    setQueue(prev => prev.map(i =>
      i._id === id ? { ...i, status: "waiting" as const, position: 999 } : i
    ));

    try {
      await fetch(`/api/queue/unserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      loadQueue(salon._id);
    } catch (error) {
      console.error("Error unserving:", error);
      loadQueue(salon._id);
    }
  }

  async function handleRemove(id: string, customerName: string, isServing: boolean, skipConfirm = false, paymentData: any = null) {
    if (isServing && !paymentData) {
      const item = queue.find(i => i._id === id);
      if (item) {
        setCompletingItem(item);
        setShowPaymentModal(true);
        return;
      }
    }

    const action = isServing ? "complete" : "remove";
    if (!skipConfirm && !confirm(`Mark ${customerName} as ${action}d?`)) return;

    try {
      await fetch(`/api/queue/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...paymentData
        }),
      });
      setShowPaymentModal(false);
      setCompletingItem(null);
      loadQueue(salon._id);
    } catch (error) {
      console.error("Error removing:", error);
    }
  }

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeItem = queue.find(i => i._id === active.id);
    if (!activeItem) return;

    const overData = over.data.current;
    let targetContainer = null;

    if (overData?.type === 'container') {
      targetContainer = overData.container;
    } else if (overData?.type === 'item') {
      targetContainer = overData.container;
    } else {
      if (over.id === 'serving' || over.id === 'waiting' || over.id === 'done') {
        targetContainer = over.id;
      }
    }

    if (!targetContainer) return;

    const currentStatus = activeItem.status;

    if (currentStatus === "waiting" && targetContainer.startsWith("serving-")) {
      const staffId = targetContainer.replace("serving-", "");
      await startServe(activeItem._id, staffId);
    } else if (currentStatus === "waiting" && targetContainer === "serving") {
      await startServe(activeItem._id);
    } else if (currentStatus === "serving" && targetContainer === "waiting") {
      await unserve(activeItem._id);
    } else if (targetContainer === "done") {
      if (activeItem.status === "serving") {
        setCompletingItem(activeItem);
        setShowPaymentModal(true);
      } else {
        await handleRemove(activeItem._id, activeItem.customerName, false, true);
      }
    } else if (targetContainer.startsWith("serving-") && currentStatus === "serving" && activeItem.staffId !== targetContainer.replace("serving-", "")) {
      const staffId = targetContainer.replace("serving-", "");
      await startServe(activeItem._id, staffId);
    } else if (currentStatus === "waiting" && targetContainer === "waiting" && active.id !== over.id) {
      const waitingItems = queue.filter(i => i.status === "waiting");
      const servingItems = queue.filter(i => i.status === "serving");
      const oldIndex = waitingItems.findIndex(i => i._id === active.id);
      const newIndex = waitingItems.findIndex(i => i._id === over.id);

      if (newIndex !== -1 && oldIndex !== -1) {
        const newOrder = arrayMove(waitingItems, oldIndex, newIndex);
        setQueue([...servingItems, ...newOrder.map((item, idx) => ({ ...item, position: idx + 1 }))]);

        try {
          await fetch('/api/queue/reorder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: newOrder.map((item, idx) => ({ id: item._id, position: idx + 1 }))
            })
          });
        } catch (err) {
          console.error("Reorder fail:", err);
          loadQueue(salon._id);
        }
      }
    }
  }

  function getServiceName(serviceId: string) {
    const service = services.find(s => s._id === serviceId);
    return service?.name || "Unknown";
  }

  function getEstimatedWait(position: number) {
    if (position === 1) return "Next Up";
    const avgTime = 30;
    const waitTime = (position - 1) * avgTime;
    if (waitTime < 60) return `~${waitTime} min`;
    const hours = Math.floor(waitTime / 60);
    const mins = waitTime % 60;
    return mins > 0 ? `~${hours}h ${mins}m` : `~${hours}h`;
  }

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  if (!salon) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-purple-200 border-t-purple-600 mx-auto"></div>
          <p className="mt-3 text-slate-600 font-medium">Loading Queue...</p>
        </div>
      </div>
    );
  }

  const servingItems = queue.filter(i => i.status === "serving");
  const waitingItems = queue.filter(i => i.status === "waiting");
  const activeItem = activeId ? (queue.find(i => i._id === activeId) || null) : null;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Queue Management</h1>
        <p className="mt-1 text-sm text-slate-600">
          Drag and drop to manage your service queue for {salon?.name || "your salon"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3 rounded-lg text-center">
          <div className="text-xl font-semibold text-white">{waitingItems.length}</div>
          <div className="text-[9px] uppercase font-medium text-purple-100 tracking-wide mt-0.5">Waiting</div>
        </div>
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-3 rounded-lg text-center">
          <div className="text-xl font-semibold text-white">{servingItems.length}</div>
          <div className="text-[9px] uppercase font-medium text-emerald-100 tracking-wide mt-0.5">Serving</div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 rounded-lg text-center">
          <div className="text-xl font-semibold text-white">{staff.length}</div>
          <div className="text-[9px] uppercase font-medium text-blue-100 tracking-wide mt-0.5">Staff</div>
        </div>
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-3 rounded-lg text-center">
          <div className="text-xl font-semibold text-white">{services.length}</div>
          <div className="text-[9px] uppercase font-medium text-slate-300 tracking-wide mt-0.5">Services</div>
        </div>
      </div>

      {/* Add to Queue Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Add New Customer</h3>
            <p className="text-xs text-slate-500 mt-0.5">Enter customer details and select services</p>
          </div>
        </div>

        <form onSubmit={addToQueue} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Name Input */}
            <div className="relative group">
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Customer Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-purple-600 transition-colors pointer-events-none" />
                <input
                  type="text"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all font-medium text-sm"
                />
              </div>
            </div>

            {/* Customer Phone Input */}
            <div className="relative group">
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-purple-600 transition-colors pointer-events-none" />
                <input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  maxLength={10}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all font-medium text-sm"
                />
              </div>
            </div>
          </div>

          {/* Services Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-3">
              Select Services *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {services.map((service) => {
                const isSelected = selectedServices.includes(service._id);
                return (
                  <button
                    key={service._id}
                    type="button"
                    onClick={() => toggleService(service._id)}
                    className={`
                      relative flex items-center gap-3 p-3 rounded-lg border transition-all text-left
                      ${isSelected
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 bg-white hover:border-purple-300'
                      }
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 transition-all
                      ${isSelected
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                        : 'bg-slate-100 text-slate-400'
                      }
                    `}>
                      <Scissors className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 text-sm truncate">{service.name}</div>
                      <div className="text-xs text-slate-500 font-medium">₹{service.price} • {service.duration} min</div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedServices.length > 0 && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-slate-600">Selected:</span>
                {selectedServices.map(sid => (
                  <span key={sid} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                    {getServiceName(sid)}
                    <button
                      type="button"
                      onClick={() => toggleService(sid)}
                      className="hover:bg-purple-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !customerName || selectedServices.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add to Queue
              </>
            )}
          </button>
        </form>
      </div>

      {/* Drag & Drop Area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-6">
          {/* Done Drop Zone */}
          <DoneDropZone />

          {/* Queue Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Staff Seats & Unassigned */}
            <div className="space-y-4">
              {/* Staff Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Armchair className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Staff Seats</h2>
                  <p className="text-xs text-slate-500">{staff.length} available seats</p>
                </div>
              </div>

              {/* Grid of Seats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {staff.map((s) => (
                  <StaffSeat
                    key={s._id}
                    staff={s}
                    servingItems={servingItems}
                    getServiceName={getServiceName}
                    onRemove={handleRemove}
                    onServe={startServe}
                    startServe={startServe}
                    allServices={services}
                    onUpdateServices={handleUpdateServices}
                  />
                ))}
              </div>

              {/* Unassigned Serving */}
              {servingItems.some(i => !i.staffId) && (
                <div className="mt-4 bg-white rounded-lg border border-amber-200 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs font-medium text-slate-900 uppercase">Unassigned</h3>
                  </div>
                  <div className="space-y-2">
                    {servingItems.filter(i => !i.staffId).map((item) => (
                      <SortableItem
                        key={item._id}
                        item={item}
                        isServing={true}
                        getServiceName={getServiceName}
                        getEstimatedWait={getEstimatedWait}
                        onRemove={handleRemove}
                        onServe={startServe}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Waiting List */}
            <DropZone
              id="waiting"
              label="Waiting List"
              icon={Users}
              colorClass="bg-purple-100"
              count={waitingItems.length}
            >
              <SortableContext items={waitingItems.map(i => i._id)} strategy={verticalListSortingStrategy}>
                {waitingItems.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-purple-200 rounded-lg py-12 bg-purple-50">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                      <Users className="w-6 h-6 text-purple-400" />
                    </div>
                    <p className="text-purple-600 text-sm font-medium">Queue is Empty</p>
                    <p className="text-purple-400 text-xs mt-0.5">Add customers to get started</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {waitingItems.map((item) => (
                      <SortableItem
                        key={item._id}
                        item={item}
                        isServing={false}
                        getServiceName={getServiceName}
                        getEstimatedWait={getEstimatedWait}
                        onRemove={handleRemove}
                        onServe={startServe}
                      />
                    ))}
                  </div>
                )}
              </SortableContext>
            </DropZone>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay
          adjustScale={true}
          dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: { active: { opacity: '0.3' } }
            }),
          }}
        >
          {activeItem ? (
            <QueueCard
              item={activeItem}
              isServing={activeItem.status === 'serving'}
              getServiceName={getServiceName}
              getEstimatedWait={getEstimatedWait}
              onRemove={() => { }}
              onServe={() => { }}
              dragOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => { setShowPaymentModal(false); setCompletingItem(null); }}
        customer={completingItem}
        services={services}
        onComplete={(paymentData: any) => {
          if (completingItem) {
            handleRemove(completingItem._id, completingItem.customerName, true, true, paymentData);
          }
        }}
      />

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Queue Management Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Drag customers from Waiting List to Staff Seats to start service</li>
              <li>• Drag serving customers to Done zone to complete and collect payment</li>
              <li>• Reorder waiting customers by dragging them within the Waiting List</li>
              <li>• Click the + button on serving customers to add additional services</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}