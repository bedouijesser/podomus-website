
import { z } from 'zod';

// Patient schema
export const patientSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  date_of_birth: z.coerce.date().nullable(),
  address: z.string().nullable(),
  medical_history: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Patient = z.infer<typeof patientSchema>;

// Appointment schema
export const appointmentSchema = z.object({
  id: z.number(),
  patient_id: z.number(),
  service_type: z.enum(['pedicurie_medicale', 'semelles_orthopediques', 'orthoplastie_onychoplastie']),
  appointment_date: z.coerce.date(),
  duration_minutes: z.number().int(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
  notes: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Appointment = z.infer<typeof appointmentSchema>;

// Contact message schema
export const contactMessageSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  subject: z.string(),
  message: z.string(),
  is_appointment_request: z.boolean(),
  status: z.enum(['new', 'read', 'responded']),
  created_at: z.coerce.date()
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;

// Service schema
export const serviceSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  duration_minutes: z.number().int(),
  price: z.number().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Service = z.infer<typeof serviceSchema>;

// Input schemas for creating records
export const createPatientInputSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  date_of_birth: z.coerce.date().nullable(),
  address: z.string().nullable(),
  medical_history: z.string().nullable()
});

export type CreatePatientInput = z.infer<typeof createPatientInputSchema>;

export const createAppointmentInputSchema = z.object({
  patient_id: z.number().int().positive(),
  service_type: z.enum(['pedicurie_medicale', 'semelles_orthopediques', 'orthoplastie_onychoplastie']),
  appointment_date: z.coerce.date(),
  duration_minutes: z.number().int().positive(),
  notes: z.string().nullable()
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentInputSchema>;

export const createContactMessageInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().nullable(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  is_appointment_request: z.boolean().default(false)
});

export type CreateContactMessageInput = z.infer<typeof createContactMessageInputSchema>;

export const createServiceInputSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  slug: z.string().min(1, 'Service slug is required'),
  description: z.string().min(1, 'Description is required'),
  duration_minutes: z.number().int().positive(),
  price: z.number().positive().nullable(),
  is_active: z.boolean().default(true)
});

export type CreateServiceInput = z.infer<typeof createServiceInputSchema>;

// Update schemas
export const updateAppointmentStatusInputSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled'])
});

export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusInputSchema>;

export const updateContactMessageStatusInputSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(['new', 'read', 'responded'])
});

export type UpdateContactMessageStatusInput = z.infer<typeof updateContactMessageStatusInputSchema>;

// Query schemas
export const getAppointmentsByDateRangeInputSchema = z.object({
  start_date: z.coerce.date(),
  end_date: z.coerce.date()
});

export type GetAppointmentsByDateRangeInput = z.infer<typeof getAppointmentsByDateRangeInputSchema>;

export const getPatientByEmailInputSchema = z.object({
  email: z.string().email()
});

export type GetPatientByEmailInput = z.infer<typeof getPatientByEmailInputSchema>;
