
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { appointmentsTable, patientsTable } from '../db/schema';
import { type CreateAppointmentInput } from '../schema';
import { createAppointment } from '../handlers/create_appointment';
import { eq } from 'drizzle-orm';

describe('createAppointment', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  let testPatientId: number;

  beforeEach(async () => {
    // Create a test patient first since appointments require a valid patient_id
    const patientResult = await db.insert(patientsTable)
      .values({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890'
      })
      .returning()
      .execute();
    
    testPatientId = patientResult[0].id;
  });

  const testInput: CreateAppointmentInput = {
    patient_id: 0, // Will be set to testPatientId in tests
    service_type: 'pedicurie_medicale',
    appointment_date: new Date('2024-01-15T10:00:00Z'),
    duration_minutes: 60,
    notes: 'Initial consultation'
  };

  it('should create an appointment', async () => {
    const input = { ...testInput, patient_id: testPatientId };
    const result = await createAppointment(input);

    // Basic field validation
    expect(result.patient_id).toEqual(testPatientId);
    expect(result.service_type).toEqual('pedicurie_medicale');
    expect(result.appointment_date).toEqual(new Date('2024-01-15T10:00:00Z'));
    expect(result.duration_minutes).toEqual(60);
    expect(result.notes).toEqual('Initial consultation');
    expect(result.status).toEqual('pending'); // Default status
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save appointment to database', async () => {
    const input = { ...testInput, patient_id: testPatientId };
    const result = await createAppointment(input);

    // Query using proper drizzle syntax
    const appointments = await db.select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.id, result.id))
      .execute();

    expect(appointments).toHaveLength(1);
    expect(appointments[0].patient_id).toEqual(testPatientId);
    expect(appointments[0].service_type).toEqual('pedicurie_medicale');
    expect(appointments[0].appointment_date).toEqual(new Date('2024-01-15T10:00:00Z'));
    expect(appointments[0].duration_minutes).toEqual(60);
    expect(appointments[0].notes).toEqual('Initial consultation');
    expect(appointments[0].status).toEqual('pending');
    expect(appointments[0].created_at).toBeInstanceOf(Date);
    expect(appointments[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create appointment with null notes', async () => {
    const input = { ...testInput, patient_id: testPatientId, notes: null };
    const result = await createAppointment(input);

    expect(result.notes).toBeNull();
    
    const appointments = await db.select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.id, result.id))
      .execute();

    expect(appointments[0].notes).toBeNull();
  });

  it('should create appointment with different service types', async () => {
    const input1 = { ...testInput, patient_id: testPatientId, service_type: 'semelles_orthopediques' as const };
    const result1 = await createAppointment(input1);
    expect(result1.service_type).toEqual('semelles_orthopediques');

    const input2 = { ...testInput, patient_id: testPatientId, service_type: 'orthoplastie_onychoplastie' as const };
    const result2 = await createAppointment(input2);
    expect(result2.service_type).toEqual('orthoplastie_onychoplastie');
  });

  it('should fail when patient_id does not exist', async () => {
    const input = { ...testInput, patient_id: 99999 }; // Non-existent patient
    
    await expect(createAppointment(input)).rejects.toThrow(/violates foreign key constraint/i);
  });
});
