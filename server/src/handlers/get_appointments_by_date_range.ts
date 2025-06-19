
import { db } from '../db';
import { appointmentsTable } from '../db/schema';
import { type GetAppointmentsByDateRangeInput, type Appointment } from '../schema';
import { and, gte, lte } from 'drizzle-orm';

export const getAppointmentsByDateRange = async (input: GetAppointmentsByDateRangeInput): Promise<Appointment[]> => {
  try {
    const result = await db.select()
      .from(appointmentsTable)
      .where(
        and(
          gte(appointmentsTable.appointment_date, input.start_date),
          lte(appointmentsTable.appointment_date, input.end_date)
        )
      )
      .execute();

    return result;
  } catch (error) {
    console.error('Get appointments by date range failed:', error);
    throw error;
  }
};
