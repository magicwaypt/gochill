import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core'

export const participations = pgTable('participations', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  email: text('email').notNull(),
  telemovel: text('telemovel').notNull(),
  notes: text('notes'),
  talaoBlob: text('talao_blob'), // Store base64 encoded image
  fotoBlob: text('foto_blob'), // Store base64 encoded image
  aceiteMaior18: boolean('aceite_maior_18').notNull(),
  aceiteTermos: boolean('aceite_termos').notNull(),
  aceitePrivacidade: boolean('aceite_privacidade').notNull(),
  aceiteMarketing: boolean('aceite_marketing').notNull(),
  status: text('status').default('pending').notNull(), // 'pending', 'approved', 'rejected'
  d365SyncStatus: text('d365_sync_status').default('pending').notNull(), // 'pending', 'success', 'failed'
  d365AccountNumber: text('d365_account_number'),
  d365SyncError: text('d365_sync_error'),
  d365SyncedAt: timestamp('d365_synced_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const submissionAttempts = pgTable('submission_attempts', {
  id: serial('id').primaryKey(),
  hasTalao: boolean('has_talao').notNull(),
  hasFoto: boolean('has_foto').notNull(),
  outcome: text('outcome').notNull(), // 'accepted', 'rejected'
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
