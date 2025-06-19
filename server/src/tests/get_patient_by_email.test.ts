
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { patientsTable } from '../db/schema';
import { type GetPatientByEmailInput, type CreatePatientInput } from '../schema';
import { getPatientByEmail } from '../handlers/get_patient_by_email';

// Test input
const testInput: GetPatientByEmailInput = {
  email: 'john.doe@example.com'
};

// Create patient data for testing
const testPatientData: CreatePatientInput = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  phone: '+33123456789',
  date_of_birth: new Date('1985-05-15'),
  address: '123 Main Street, Paris',
  medical_history: 'No known allergies'
};

describe('getPatientByEmail', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return patient when email exists', async () => {
    // Create a patient first
    await db.insert(patientsTable)
      .values({
        first_name: testPatientData.first_name,
        last_name: testPatientData.last_name,
        email: testPatientData.email,
        phone: testPatientData.phone,
        date_of_birth: testPatientData.date_of_birth,
        address: testPatientData.address,
        medical_history: testPatientData.medical_history
      })
      .execute();

    const result = await getPatientByEmail(testInput);

    // Verify patient data
    expect(result).not.toBeNull();
    expect(result!.first_name).toEqual('John');
    expect(result!.last_name).toEqual('Doe');
    expect(result!.email).toEqual('john.doe@example.com');
    expect(result!.phone).toEqual('+33123456789');
    expect(result!.date_of_birth).toEqual(new Date('1985-05-15'));
    expect(result!.address).toEqual('123 Main Street, Paris');
    expect(result!.medical_history).toEqual('No known allergies');
    expect(result!.id).toBeDefined();
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return null when email does not exist', async () => {
    const nonExistentEmail = { email: 'nonexistent@example.com' };
    
    const result = await getPatientByEmail(nonExistentEmail);

    expect(result).toBeNull();
  });

  it('should return correct patient when multiple patients exist', async () => {
    // Create multiple patients
    await db.insert(patientsTable)
      .values([
        {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          phone: '+33123456789',
          date_of_birth: new Date('1985-05-15'),
          address: '123 Main Street, Paris',
          medical_history: 'No known allergies'
        },
        {
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@example.com',
          phone: '+33987654321',
          date_of_birth: new Date('1990-08-20'),
          address: '456 Oak Avenue, Lyon',
          medical_history: 'Diabetes type 2'
        }
      ])
      .execute();

    const result = await getPatientByEmail(testInput);

    // Verify we get the correct patient
    expect(result).not.toBeNull();
    expect(result!.first_name).toEqual('John');
    expect(result!.last_name).toEqual('Doe');
    expect(result!.email).toEqual('john.doe@example.com');
  });

  it('should handle email case sensitivity correctly', async () => {
    // Create patient with lowercase email
    await db.insert(patientsTable)
      .values({
        first_name: testPatientData.first_name,
        last_name: testPatientData.last_name,
        email: testPatientData.email.toLowerCase(),
        phone: testPatientData.phone,
        date_of_birth: testPatientData.date_of_birth,
        address: testPatientData.address,
        medical_history: testPatientData.medical_history
      })
      .execute();

    // Search with exact case
    const result = await getPatientByEmail({ email: testPatientData.email.toLowerCase() });

    expect(result).not.toBeNull();
    expect(result!.email).toEqual(testPatientData.email.toLowerCase());
  });
});
