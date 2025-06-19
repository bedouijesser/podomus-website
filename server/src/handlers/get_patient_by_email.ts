
import { db } from '../db';
import { patientsTable } from '../db/schema';
import { type GetPatientByEmailInput, type Patient } from '../schema';
import { eq } from 'drizzle-orm';

export const getPatientByEmail = async (input: GetPatientByEmailInput): Promise<Patient | null> => {
  try {
    const result = await db.select()
      .from(patientsTable)
      .where(eq(patientsTable.email, input.email))
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result[0];
  } catch (error) {
    console.error('Failed to get patient by email:', error);
    throw error;
  }
};
