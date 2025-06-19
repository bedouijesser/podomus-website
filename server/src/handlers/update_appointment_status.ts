
import { db } from '../db';
import { appointmentsTable } from '../db/schema';
import { type UpdateAppointmentStatusInput, type Appointment } from '../schema';
import { eq } from 'drizzle-orm';

export const updateAppointmentStatus = async (input: UpdateAppointmentStatusInput): Promise<Appointment> => {
  try {
    // Update appointment status
    const result = await db.update(appointmentsTable)
      .set({
        status: input.status,
        updated_at: new Date()
      })
      .where(eq(appointmentsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Appointment with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Appointment status update failed:', error);
    throw error;
  }
};
