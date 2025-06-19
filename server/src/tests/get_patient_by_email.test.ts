
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { patientsTable } from '../db/schema';
import { type GetPatientByEmailInput, type CreatePatientInput } from '../schema';
import { getPatientByEmail } from '../handlers/get_patient_by_email';

// Test patient data
const testPatient: CreatePatientInput = {
  first_name: 'Marie',
  last_name: 'Dubois',
  email: 'marie.dubois@example.com',
  phone: '+33123456789',
  date_of_birth: new Date('1985-03-15'),
  address: '123 Rue de la Paix, Paris',
  medical_history: 'Previous foot surgery in 2020'
};

const testPatient2: CreatePatientInput = {
  first_name: 'Jean',
  last_name: 'Martin',
  email: 'jean.martin@example.com',
  phone: '+33987654321',
  date_of_birth: new Date('1970-08-22'),
  address: '456 Avenue des Champs, Lyon',
  medical_history: null
};

describe('getPatientByEmail', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return patient when email exists', async () => {
    // Create test patient
    await db.insert(patientsTable)
      .values({
        first_name: testPatient.first_name,
        last_name: testPatient.last_name,
        email: testPatient.email,
        phone: testPatient.phone,
        date_of_birth: testPatient.date_of_birth,
        address: testPatient.address,
        medical_history: testPatient.medical_history
      })
      .execute();

    const input: GetPatientByEmailInput = {
      email: 'marie.dubois@example.com'
    };

    const result = await getPatientByEmail(input);

    // Verify patient data
    expect(result).not.toBeNull();
    expect(result!.first_name).toEqual('Marie');
    expect(result!.last_name).toEqual('Dubois');
    expect(result!.email).toEqual('marie.dubois@example.com');
    expect(result!.phone).toEqual('+33123456789');
    expect(result!.date_of_birth).toBeInstanceOf(Date);
    expect(result!.date_of_birth!.getFullYear()).toEqual(1985);
    expect(result!.address).toEqual('123 Rue de la Paix, Paris');
    expect(result!.medical_history).toEqual('Previous foot surgery in 2020');
    expect(result!.id).toBeDefined();
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return null when email does not exist', async () => {
    const input: GetPatientByEmailInput = {
      email: 'nonexistent@example.com'
    };

    const result = await getPatientByEmail(input);

    expect(result).toBeNull();
  });

  it('should return correct patient when multiple patients exist', async () => {
    // Create multiple test patients
    await db.insert(patientsTable)
      .values([
        {
          first_name: testPatient.first_name,
          last_name: testPatient.last_name,
          email: testPatient.email,
          phone: testPatient.phone,
          date_of_birth: testPatient.date_of_birth,
          address: testPatient.address,
          medical_history: testPatient.medical_history
        },
        {
          first_name: testPatient2.first_name,
          last_name: testPatient2.last_name,
          email: testPatient2.email,
          phone: testPatient2.phone,
          date_of_birth: testPatient2.date_of_birth,
          address: testPatient2.address,
          medical_history: testPatient2.medical_history
        }
      ])
      .execute();

    const input: GetPatientByEmailInput = {
      email: 'jean.martin@example.com'
    };

    const result = await getPatientByEmail(input);

    // Verify correct patient is returned
    expect(result).not.toBeNull();
    expect(result!.first_name).toEqual('Jean');
    expect(result!.last_name).toEqual('Martin');
    expect(result!.email).toEqual('jean.martin@example.com');
    expect(result!.medical_history).toBeNull();
  });

  it('should handle case sensitivity correctly', async () => {
    // Create test patient with lowercase email
    await db.insert(patientsTable)
      .values({
        first_name: testPatient.first_name,
        last_name: testPatient.last_name,
        email: testPatient.email.toLowerCase(),
        phone: testPatient.phone,
        date_of_birth: testPatient.date_of_birth,
        address: testPatient.address,
        medical_history: testPatient.medical_history
      })
      .execute();

    // Search with uppercase email
    const input: GetPatientByEmailInput = {
      email: 'MARIE.DUBOIS@EXAMPLE.COM'
    };

    const result = await getPatientByEmail(input);

    // Should not find patient due to case sensitivity
    expect(result).toBeNull();
  });

  it('should handle patient with null optional fields', async () => {
    // Create patient with minimal required fields
    await db.insert(patientsTable)
      .values({
        first_name: 'Pierre',
        last_name: 'Durand',
        email: 'pierre.durand@example.com',
        phone: '+33555666777',
        date_of_birth: null,
        address: null,
        medical_history: null
      })
      .execute();

    const input: GetPatientByEmailInput = {
      email: 'pierre.durand@example.com'
    };

    const result = await getPatientByEmail(input);

    expect(result).not.toBeNull();
    expect(result!.first_name).toEqual('Pierre');
    expect(result!.last_name).toEqual('Durand');
    expect(result!.email).toEqual('pierre.durand@example.com');
    expect(result!.phone).toEqual('+33555666777');
    expect(result!.date_of_birth).toBeNull();
    expect(result!.address).toBeNull();
    expect(result!.medical_history).toBeNull();
    expect(result!.id).toBeDefined();
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return only one result when limit is applied', async () => {
    // Create test patient
    await db.insert(patientsTable)
      .values({
        first_name: testPatient.first_name,
        last_name: testPatient.last_name,
        email: testPatient.email,
        phone: testPatient.phone,
        date_of_birth: testPatient.date_of_birth,
        address: testPatient.address,
        medical_history: testPatient.medical_history
      })
      .execute();

    const input: GetPatientByEmailInput = {
      email: 'marie.dubois@example.com'
    };

    const result = await getPatientByEmail(input);

    // Verify single result
    expect(result).not.toBeNull();
    expect(typeof result).toEqual('object');
    expect(Array.isArray(result)).toBe(false);
  });
});
