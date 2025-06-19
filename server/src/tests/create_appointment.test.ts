
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { appointmentsTable, patientsTable } from '../db/schema';
import { type CreateAppointmentInput } from '../schema';
import { createAppointment } from '../handlers/create_appointment';
import { eq } from 'drizzle-orm';

// Test patient data
const testPatient = {
  first_name: 'Jean',
  last_name: 'Dupont',
  email: 'jean.dupont@example.com',
  phone: '+33 1 23 45 67 89',
  date_of_birth: new Date('1980-05-15'),
  address: '123 Rue de la Paix, 75001 Paris',
  medical_history: 'Diabète type 2, problèmes de circulation'
};

// Test appointment input
const testAppointmentInput: CreateAppointmentInput = {
  patient_id: 1, // Will be set after patient creation
  service_type: 'pedicurie_medicale',
  appointment_date: new Date('2024-02-15T10:00:00Z'),
  duration_minutes: 60,
  notes: 'Première consultation pour soins de pédicurie'
};

describe('createAppointment', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create an appointment successfully', async () => {
    // Create prerequisite patient
    const patientResult = await db.insert(patientsTable)
      .values(testPatient)
      .returning()
      .execute();
    
    const createdPatient = patientResult[0];
    
    // Create appointment with correct patient_id
    const appointmentInput = {
      ...testAppointmentInput,
      patient_id: createdPatient.id
    };

    const result = await createAppointment(appointmentInput);

    // Verify appointment fields
    expect(result.patient_id).toEqual(createdPatient.id);
    expect(result.service_type).toEqual('pedicurie_medicale');
    expect(result.appointment_date).toEqual(appointmentInput.appointment_date);
    expect(result.duration_minutes).toEqual(60);
    expect(result.status).toEqual('pending'); // Default status
    expect(result.notes).toEqual(appointmentInput.notes);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save appointment to database', async () => {
    // Create prerequisite patient
    const patientResult = await db.insert(patientsTable)
      .values(testPatient)
      .returning()
      .execute();
    
    const createdPatient = patientResult[0];
    
    // Create appointment
    const appointmentInput = {
      ...testAppointmentInput,
      patient_id: createdPatient.id
    };

    const result = await createAppointment(appointmentInput);

    // Verify appointment was saved to database
    const appointments = await db.select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.id, result.id))
      .execute();

    expect(appointments).toHaveLength(1);
    expect(appointments[0].patient_id).toEqual(createdPatient.id);
    expect(appointments[0].service_type).toEqual('pedicurie_medicale');
    expect(appointments[0].appointment_date).toEqual(appointmentInput.appointment_date);
    expect(appointments[0].duration_minutes).toEqual(60);
    expect(appointments[0].status).toEqual('pending');
    expect(appointments[0].notes).toEqual(appointmentInput.notes);
  });

  it('should create appointment with different service types', async () => {
    // Create prerequisite patient
    const patientResult = await db.insert(patientsTable)
      .values(testPatient)
      .returning()
      .execute();
    
    const createdPatient = patientResult[0];

    // Test semelles orthopédiques service
    const semellesInput = {
      ...testAppointmentInput,
      patient_id: createdPatient.id,
      service_type: 'semelles_orthopediques' as const,
      duration_minutes: 90,
      notes: 'Consultation pour semelles orthopédiques sur mesure'
    };

    const semellesResult = await createAppointment(semellesInput);
    expect(semellesResult.service_type).toEqual('semelles_orthopediques');
    expect(semellesResult.duration_minutes).toEqual(90);

    // Test orthoplastie service
    const orthoplastieInput = {
      ...testAppointmentInput,
      patient_id: createdPatient.id,
      service_type: 'orthoplastie_onychoplastie' as const,
      duration_minutes: 45,
      notes: 'Traitement orthoplastie onychoplastie'
    };

    const orthoplastieResult = await createAppointment(orthoplastieInput);
    expect(orthoplastieResult.service_type).toEqual('orthoplastie_onychoplastie');
    expect(orthoplastieResult.duration_minutes).toEqual(45);
  });

  it('should create appointment with null notes', async () => {
    // Create prerequisite patient
    const patientResult = await db.insert(patientsTable)
      .values(testPatient)
      .returning()
      .execute();
    
    const createdPatient = patientResult[0];

    // Create appointment without notes
    const appointmentInput = {
      ...testAppointmentInput,
      patient_id: createdPatient.id,
      notes: null
    };

    const result = await createAppointment(appointmentInput);
    expect(result.notes).toBeNull();

    // Verify in database
    const appointments = await db.select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.id, result.id))
      .execute();

    expect(appointments[0].notes).toBeNull();
  });

  it('should throw error when patient does not exist', async () => {
    // Try to create appointment with non-existent patient_id
    const appointmentInput = {
      ...testAppointmentInput,
      patient_id: 999 // Non-existent patient
    };

    await expect(createAppointment(appointmentInput))
      .rejects
      .toThrow(/Patient with id 999 does not exist/i);
  });

  it('should handle future appointment dates', async () => {
    // Create prerequisite patient
    const patientResult = await db.insert(patientsTable)
      .values(testPatient)
      .returning()
      .execute();
    
    const createdPatient = patientResult[0];

    // Create appointment for next month
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);
    futureDate.setHours(14, 30, 0, 0);

    const appointmentInput = {
      ...testAppointmentInput,
      patient_id: createdPatient.id,
      appointment_date: futureDate
    };

    const result = await createAppointment(appointmentInput);
    expect(result.appointment_date).toEqual(futureDate);
  });

  it('should handle different duration values', async () => {
    // Create prerequisite patient
    const patientResult = await db.insert(patientsTable)
      .values(testPatient)
      .returning()
      .execute();
    
    const createdPatient = patientResult[0];

    // Test various duration values
    const durations = [30, 45, 60, 90, 120];

    for (const duration of durations) {
      const appointmentInput = {
        ...testAppointmentInput,
        patient_id: createdPatient.id,
        appointment_date: new Date(`2024-03-${10 + durations.indexOf(duration)}T10:00:00Z`),
        duration_minutes: duration
      };

      const result = await createAppointment(appointmentInput);
      expect(result.duration_minutes).toEqual(duration);
    }
  });
});
