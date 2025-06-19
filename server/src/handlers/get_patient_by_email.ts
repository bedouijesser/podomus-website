
import { db } from '../db';
import { patientsTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type GetPatientByEmailInput, type Patient } from '../schema';

export const getPatientByEmail = async (input: GetPatientByEmailInput): Promise<Patient | null> => {
  try {
    const result = await db.select()
      .from(patientsTable)
      .where(eq(patientsTable.email, input.email))
      .limit(1)
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result[0];
  } catch (error) {
    console.error('Get patient by email failed:', error);
    throw error;
  }
};
