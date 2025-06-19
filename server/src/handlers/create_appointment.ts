
import { db } from '../db';
import { appointmentsTable, patientsTable } from '../db/schema';
import { type CreateAppointmentInput, type Appointment } from '../schema';
import { eq } from 'drizzle-orm';

export const createAppointment = async (input: CreateAppointmentInput): Promise<Appointment> => {
  try {
    // Verify patient exists to prevent foreign key constraint violation
    const existingPatient = await db.select()
      .from(patientsTable)
      .where(eq(patientsTable.id, input.patient_id))
      .execute();

    if (existingPatient.length === 0) {
      throw new Error(`Patient with id ${input.patient_id} does not exist`);
    }

    // Insert appointment record
    const result = await db.insert(appointmentsTable)
      .values({
        patient_id: input.patient_id,
        service_type: input.service_type,
        appointment_date: input.appointment_date,
        duration_minutes: input.duration_minutes,
        notes: input.notes
        // status defaults to 'pending' per schema
        // created_at and updated_at are set automatically
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Appointment creation failed:', error);
    throw error;
  }
};
