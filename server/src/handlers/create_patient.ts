
import { db } from '../db';
import { patientsTable } from '../db/schema';
import { type CreatePatientInput, type Patient } from '../schema';

export const createPatient = async (input: CreatePatientInput): Promise<Patient> => {
  try {
    // Insert patient record
    const result = await db.insert(patientsTable)
      .values({
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        phone: input.phone,
        date_of_birth: input.date_of_birth,
        address: input.address,
        medical_history: input.medical_history
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Patient creation failed:', error);
    throw error;
  }
};
