
import { serial, text, pgTable, timestamp, integer, boolean, pgEnum, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const serviceTypeEnum = pgEnum('service_type', ['pedicurie_medicale', 'semelles_orthopediques', 'orthoplastie_onychoplastie']);
export const appointmentStatusEnum = pgEnum('appointment_status', ['pending', 'confirmed', 'completed', 'cancelled']);
export const messageStatusEnum = pgEnum('message_status', ['new', 'read', 'responded']);

// Tables
export const patientsTable = pgTable('patients', {
  id: serial('id').primaryKey(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  date_of_birth: timestamp('date_of_birth'),
  address: text('address'),
  medical_history: text('medical_history'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const appointmentsTable = pgTable('appointments', {
  id: serial('id').primaryKey(),
  patient_id: integer('patient_id').notNull().references(() => patientsTable.id),
  service_type: serviceTypeEnum('service_type').notNull(),
  appointment_date: timestamp('appointment_date').notNull(),
  duration_minutes: integer('duration_minutes').notNull(),
  status: appointmentStatusEnum('status').notNull().default('pending'),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const contactMessagesTable = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  is_appointment_request: boolean('is_appointment_request').notNull().default(false),
  status: messageStatusEnum('status').notNull().default('new'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

export const servicesTable = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  duration_minutes: integer('duration_minutes').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Relations
export const patientsRelations = relations(patientsTable, ({ many }) => ({
  appointments: many(appointmentsTable)
}));

export const appointmentsRelations = relations(appointmentsTable, ({ one }) => ({
  patient: one(patientsTable, {
    fields: [appointmentsTable.patient_id],
    references: [patientsTable.id]
  })
}));

// Export all tables and relations
export const tables = {
  patients: patientsTable,
  appointments: appointmentsTable,
  contactMessages: contactMessagesTable,
  services: servicesTable
};

export const relations_config = {
  patients: patientsRelations,
  appointments: appointmentsRelations
};
