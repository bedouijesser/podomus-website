
import { db } from '../db';
import { appointmentsTable } from '../db/schema';
import { type GetAppointmentsByDateRangeInput, type Appointment } from '../schema';
import { gte, lte, and } from 'drizzle-orm';

export const getAppointmentsByDateRange = async (input: GetAppointmentsByDateRangeInput): Promise<Appointment[]> => {
  try {
    // Query appointments within the date range (inclusive of both start and end dates)
    const results = await db.select()
      .from(appointmentsTable)
      .where(
        and(
          gte(appointmentsTable.appointment_date, input.start_date),
          lte(appointmentsTable.appointment_date, input.end_date)
        )
      )
      .orderBy(appointmentsTable.appointment_date)
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to get appointments by date range:', error);
    throw error;
  }
};
