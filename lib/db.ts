import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

type Database = ReturnType<typeof drizzle<typeof schema>>

let database: Database | null = null

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL?.trim()

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Configure it in .env.local, for example: postgresql://USER@localhost:5432/gochill'
    )
  }

  let parsedConnectionString: URL

  try {
    parsedConnectionString = new URL(connectionString)
  } catch {
    throw new Error(
      'DATABASE_URL is invalid. Expected a PostgreSQL URL such as postgresql://USER@localhost:5432/gochill'
    )
  }

  if (!parsedConnectionString.pathname || parsedConnectionString.pathname === '/') {
    throw new Error(
      'DATABASE_URL must include a database name, for example: postgresql://USER@localhost:5432/gochill'
    )
  }

  return connectionString
}

export function getDb() {
  if (!database) {
    const connectionString = getConnectionString()
    const client = postgres(connectionString, { prepare: false })
    database = drizzle(client, { schema })
  }

  return database
}

export const db = new Proxy({} as Database, {
  get(_target, prop, receiver) {
    const instance = getDb()
    const value = Reflect.get(instance as object, prop, receiver)

    return typeof value === 'function' ? value.bind(instance) : value
  },
})
