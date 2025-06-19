
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { patientsTable } from '../db/schema';
import { type CreatePatientInput } from '../schema';
import { createPatient } from '../handlers/create_patient';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreatePatientInput = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  phone: '+33123456789',
  date_of_birth: new Date('1985-05-15'),
  address: '123 Main St, Paris, France',
  medical_history: 'No known allergies'
};

describe('createPatient', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a patient with all fields', async () => {
    const result = await createPatient(testInput);

    // Basic field validation
    expect(result.first_name).toEqual('John');
    expect(result.last_name).toEqual('Doe');
    expect(result.email).toEqual('john.doe@example.com');
    expect(result.phone).toEqual('+33123456789');
    expect(result.date_of_birth).toEqual(new Date('1985-05-15'));
    expect(result.address).toEqual('123 Main St, Paris, France');
    expect(result.medical_history).toEqual('No known allergies');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a patient with nullable fields as null', async () => {
    const inputWithNulls: CreatePatientInput = {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+33987654321',
      date_of_birth: null,
      address: null,
      medical_history: null
    };

    const result = await createPatient(inputWithNulls);

    expect(result.first_name).toEqual('Jane');
    expect(result.last_name).toEqual('Smith');
    expect(result.email).toEqual('jane.smith@example.com');
    expect(result.phone).toEqual('+33987654321');
    expect(result.date_of_birth).toBeNull();
    expect(result.address).toBeNull();
    expect(result.medical_history).toBeNull();
    expect(result.id).toBeDefined();
  });

  it('should save patient to database', async () => {
    const result = await createPatient(testInput);

    // Query using proper drizzle syntax
    const patients = await db.select()
      .from(patientsTable)
      .where(eq(patientsTable.id, result.id))
      .execute();

    expect(patients).toHaveLength(1);
    expect(patients[0].first_name).toEqual('John');
    expect(patients[0].last_name).toEqual('Doe');
    expect(patients[0].email).toEqual('john.doe@example.com');
    expect(patients[0].phone).toEqual('+33123456789');
    expect(patients[0].date_of_birth).toEqual(new Date('1985-05-15'));
    expect(patients[0].address).toEqual('123 Main St, Paris, France');
    expect(patients[0].medical_history).toEqual('No known allergies');
    expect(patients[0].created_at).toBeInstanceOf(Date);
    expect(patients[0].updated_at).toBeInstanceOf(Date);
  });

  it('should enforce unique email constraint', async () => {
    // Create first patient
    await createPatient(testInput);

    // Try to create another patient with same email
    const duplicateInput: CreatePatientInput = {
      ...testInput,
      first_name: 'Jane',
      last_name: 'Smith'
    };

    expect(createPatient(duplicateInput)).rejects.toThrow(/unique/i);
  });

  it('should auto-generate timestamps', async () => {
    const beforeCreation = new Date();
    const result = await createPatient(testInput);
    const afterCreation = new Date();

    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.created_at.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
    expect(result.created_at.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    expect(result.updated_at.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
    expect(result.updated_at.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
  });
});
