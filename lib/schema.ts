import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core'

export const participations = pgTable('participations', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  email: text('email').notNull(),
  telemovel: text('telemovel').notNull(),
  talaoBlob: text('talao_blob'), // Store base64 encoded image
  fotoBlob: text('foto_blob'), // Store base64 encoded image
  aceiteMaior18: boolean('aceite_maior_18').notNull(),
  aceiteTermos: boolean('aceite_termos').notNull(),
  aceitePrivacidade: boolean('aceite_privacidade').notNull(),
  aceiteMarketing: boolean('aceite_marketing').notNull(),
  status: text('status').default('pending').notNull(), // 'pending', 'approved', 'rejected'
  createdAt: timestamp('created_at').defaultNow().notNull(),
})