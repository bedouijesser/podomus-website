
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { patientsTable } from '../db/schema';
import { type CreatePatientInput } from '../schema';
import { createPatient } from '../handlers/create_patient';
import { eq } from 'drizzle-orm';

// Complete test input with all required fields
const testInput: CreatePatientInput = {
  first_name: 'Jean',
  last_name: 'Dupont',
  email: 'jean.dupont@example.com',
  phone: '+33123456789',
  date_of_birth: new Date('1980-05-15'),
  address: '123 Rue de la Paix, 75001 Paris',
  medical_history: 'Diabète type 2, hypertension'
};

// Minimal required input
const minimalInput: CreatePatientInput = {
  first_name: 'Marie',
  last_name: 'Martin',
  email: 'marie.martin@example.com',
  phone: '+33987654321',
  date_of_birth: null,
  address: null,
  medical_history: null
};

describe('createPatient', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a patient with all fields', async () => {
    const result = await createPatient(testInput);

    // Verify all fields are correctly set
    expect(result.first_name).toEqual('Jean');
    expect(result.last_name).toEqual('Dupont');
    expect(result.email).toEqual('jean.dupont@example.com');
    expect(result.phone).toEqual('+33123456789');
    expect(result.date_of_birth).toEqual(new Date('1980-05-15'));
    expect(result.address).toEqual('123 Rue de la Paix, 75001 Paris');
    expect(result.medical_history).toEqual('Diabète type 2, hypertension');
    
    // Verify auto-generated fields
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('number');
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a patient with minimal required fields', async () => {
    const result = await createPatient(minimalInput);

    // Verify required fields
    expect(result.first_name).toEqual('Marie');
    expect(result.last_name).toEqual('Martin');
    expect(result.email).toEqual('marie.martin@example.com');
    expect(result.phone).toEqual('+33987654321');
    
    // Verify nullable fields are null
    expect(result.date_of_birth).toBeNull();
    expect(result.address).toBeNull();
    expect(result.medical_history).toBeNull();
    
    // Verify auto-generated fields
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save patient to database', async () => {
    const result = await createPatient(testInput);

    // Query the database to verify the patient was saved
    const patients = await db.select()
      .from(patientsTable)
      .where(eq(patientsTable.id, result.id))
      .execute();

    expect(patients).toHaveLength(1);
    const savedPatient = patients[0];
    
    expect(savedPatient.first_name).toEqual('Jean');
    expect(savedPatient.last_name).toEqual('Dupont');
    expect(savedPatient.email).toEqual('jean.dupont@example.com');
    expect(savedPatient.phone).toEqual('+33123456789');
    expect(savedPatient.date_of_birth).toEqual(new Date('1980-05-15'));
    expect(savedPatient.address).toEqual('123 Rue de la Paix, 75001 Paris');
    expect(savedPatient.medical_history).toEqual('Diabète type 2, hypertension');
    expect(savedPatient.created_at).toBeInstanceOf(Date);
    expect(savedPatient.updated_at).toBeInstanceOf(Date);
  });

  it('should enforce email uniqueness constraint', async () => {
    // Create first patient
    await createPatient(testInput);

    // Try to create another patient with the same email
    const duplicateInput: CreatePatientInput = {
      ...testInput,
      first_name: 'Jacques',
      last_name: 'Dubois'
    };

    // Should throw error due to unique email constraint
    await expect(createPatient(duplicateInput)).rejects.toThrow(/unique/i);
  });

  it('should handle date_of_birth correctly', async () => {
    const birthDate = new Date('1975-12-25');
    const inputWithDate: CreatePatientInput = {
      ...minimalInput,
      date_of_birth: birthDate
    };

    const result = await createPatient(inputWithDate);

    expect(result.date_of_birth).toEqual(birthDate);
    expect(result.date_of_birth).toBeInstanceOf(Date);
  });

  it('should set created_at and updated_at timestamps', async () => {
    const beforeCreation = new Date();
    const result = await createPatient(testInput);
    const afterCreation = new Date();

    // Timestamps should be within the test execution window
    expect(result.created_at.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime() - 1000);
    expect(result.created_at.getTime()).toBeLessThanOrEqual(afterCreation.getTime() + 1000);
    expect(result.updated_at.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime() - 1000);
    expect(result.updated_at.getTime()).toBeLessThanOrEqual(afterCreation.getTime() + 1000);
  });

  it('should handle french characters in names and addresses', async () => {
    const frenchInput: CreatePatientInput = {
      first_name: 'François',
      last_name: 'Müller',
      email: 'francois.muller@example.com',
      phone: '+33145678901',
      date_of_birth: null,
      address: 'Château de Versailles, 78000 Versailles',
      medical_history: 'Allergies: pénicilline, aspirine'
    };

    const result = await createPatient(frenchInput);

    expect(result.first_name).toEqual('François');
    expect(result.last_name).toEqual('Müller');
    expect(result.address).toEqual('Château de Versailles, 78000 Versailles');
    expect(result.medical_history).toEqual('Allergies: pénicilline, aspirine');
  });

  it('should handle medical professionals phone formats', async () => {
    const professionalInput: CreatePatientInput = {
      first_name: 'Dr. Sophie',
      last_name: 'Laurent',
      email: 'dr.laurent@hopital.fr',
      phone: '01.42.34.56.78',
      date_of_birth: null,
      address: null,
      medical_history: null
    };

    const result = await createPatient(professionalInput);

    expect(result.phone).toEqual('01.42.34.56.78');
    expect(result.first_name).toEqual('Dr. Sophie');
  });
});
