import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL?.trim()

if (!connectionString) {
	throw new Error('DATABASE_URL is not set. Configure it in .env.local, for example: postgresql://USER@localhost:5432/gochill')
}

let parsedConnectionString: URL

try {
	parsedConnectionString = new URL(connectionString)
} catch {
	throw new Error('DATABASE_URL is invalid. Expected a PostgreSQL URL such as postgresql://USER@localhost:5432/gochill')
}

if (!parsedConnectionString.pathname || parsedConnectionString.pathname === '/') {
	throw new Error('DATABASE_URL must include a database name, for example: postgresql://USER@localhost:5432/gochill')
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client, { schema })