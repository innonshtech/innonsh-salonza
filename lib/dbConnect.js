// src/lib/mongodb.js
import mongoose from 'mongoose'
import { env } from './env'

const MONGODB_URI = env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables')
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

console.log('✅ MONGODB_URI is defined, attempting connection...')

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    console.log('✓ Using existing MongoDB connection')
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB Connected Successfully')
      return mongoose
    }).catch(err => {
      console.error('❌ MongoDB Connection Failed:', err.message)
      cached.promise = null
      throw err
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    console.error('❌ MongoDB Connection Error (catch block):', e)
    throw e
  }

  return cached.conn
}

export default dbConnect