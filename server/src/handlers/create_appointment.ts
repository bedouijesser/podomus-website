
import { db } from '../db';
import { appointmentsTable } from '../db/schema';
import { type CreateAppointmentInput, type Appointment } from '../schema';

export const createAppointment = async (input: CreateAppointmentInput): Promise<Appointment> => {
  try {
    // Insert appointment record
    const result = await db.insert(appointmentsTable)
      .values({
        patient_id: input.patient_id,
        service_type: input.service_type,
        appointment_date: input.appointment_date,
        duration_minutes: input.duration_minutes,
        notes: input.notes
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Appointment creation failed:', error);
    throw error;
  }
};
