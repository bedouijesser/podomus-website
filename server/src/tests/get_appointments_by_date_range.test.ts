
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { patientsTable, appointmentsTable } from '../db/schema';
import { type GetAppointmentsByDateRangeInput, type CreatePatientInput, type CreateAppointmentInput } from '../schema';
import { getAppointmentsByDateRange } from '../handlers/get_appointments_by_date_range';

// Test data
const testPatient: CreatePatientInput = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  date_of_birth: new Date('1980-01-01'),
  address: '123 Main St',
  medical_history: 'No known allergies'
};

describe('getAppointmentsByDateRange', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return appointments within date range', async () => {
    // Create patient first
    const patientResult = await db.insert(patientsTable)
      .values(testPatient)
      .returning()
      .execute();
    const patient = patientResult[0];

    // Create test appointments with different dates
    const baseDate = new Date('2024-01-15T10:00:00Z');
    const appointment1Date = new Date('2024-01-10T10:00:00Z');
    const appointment2Date = new Date('2024-01-15T14:00:00Z');
    const appointment3Date = new Date('2024-01-20T09:00:00Z');
    const appointment4Date = new Date('2024-01-25T11:00:00Z'); // Outside range

    const appointmentInputs: CreateAppointmentInput[] = [
      {
        patient_id: patient.id,
        service_type: 'pedicurie_medicale',
        appointment_date: appointment1Date,
        duration_minutes: 60,
        notes: 'First appointment'
      },
      {
        patient_id: patient.id,
        service_type: 'semelles_orthopediques',
        appointment_date: appointment2Date,
        duration_minutes: 90,
        notes: 'Second appointment'
      },
      {
        patient_id: patient.id,
        service_type: 'orthoplastie_onychoplastie',
        appointment_date: appointment3Date,
        duration_minutes: 45,
        notes: 'Third appointment'
      },
      {
        patient_id: patient.id,
        service_type: 'pedicurie_medicale',
        appointment_date: appointment4Date,
        duration_minutes: 60,
        notes: 'Fourth appointment - outside range'
      }
    ];

    // Insert all appointments
    await db.insert(appointmentsTable)
      .values(appointmentInputs)
      .execute();

    // Query appointments within date range
    const input: GetAppointmentsByDateRangeInput = {
      start_date: new Date('2024-01-10T00:00:00Z'),
      end_date: new Date('2024-01-20T23:59:59Z')
    };

    const result = await getAppointmentsByDateRange(input);

    // Should return 3 appointments (excluding the one on 2024-01-25)
    expect(result).toHaveLength(3);

    // Verify appointment dates are within range
    result.forEach(appointment => {
      expect(appointment.appointment_date).toBeInstanceOf(Date);
      expect(appointment.appointment_date >= input.start_date).toBe(true);
      expect(appointment.appointment_date <= input.end_date).toBe(true);
    });

    // Verify specific appointments are included
    const appointmentDates = result.map(apt => apt.appointment_date.toISOString());
    expect(appointmentDates).toContain(appointment1Date.toISOString());
    expect(appointmentDates).toContain(appointment2Date.toISOString());
    expect(appointmentDates).toContain(appointment3Date.toISOString());
    expect(appointmentDates).not.toContain(appointment4Date.toISOString());
  });

  it('should return empty array when no appointments in date range', async () => {
    // Create patient first
    const patientResult = await db.insert(patientsTable)
      .values(testPatient)
      .returning()
      .execute();
    const patient = patientResult[0];

    // Create appointment outside the query range
    const appointmentInput: CreateAppointmentInput = {
      patient_id: patient.id,
      service_type: 'pedicurie_medicale',
      appointment_date: new Date('2024-02-15T10:00:00Z'),
      duration_minutes: 60,
      notes: 'Outside range appointment'
    };

    await db.insert(appointmentsTable)
      .values(appointmentInput)
      .execute();

    // Query for different date range
    const input: GetAppointmentsByDateRangeInput = {
      start_date: new Date('2024-01-01T00:00:00Z'),
      end_date: new Date('2024-01-31T23:59:59Z')
    };

    const result = await getAppointmentsByDateRange(input);

    expect(result).toHaveLength(0);
  });

  it('should return appointments on exact boundary dates', async () => {
    // Create patient first
    const patientResult = await db.insert(patientsTable)
      .values(testPatient)
      .returning()
      .execute();
    const patient = patientResult[0];

    // Create appointments on exact boundary dates
    const startDate = new Date('2024-01-10T10:00:00Z');
    const endDate = new Date('2024-01-20T15:00:00Z');

    const appointmentInputs: CreateAppointmentInput[] = [
      {
        patient_id: patient.id,
        service_type: 'pedicurie_medicale',
        appointment_date: startDate,
        duration_minutes: 60,
        notes: 'Start boundary appointment'
      },
      {
        patient_id: patient.id,
        service_type: 'semelles_orthopediques',
        appointment_date: endDate,
        duration_minutes: 90,
        notes: 'End boundary appointment'
      }
    ];

    await db.insert(appointmentsTable)
      .values(appointmentInputs)
      .execute();

    // Query with exact boundary dates
    const input: GetAppointmentsByDateRangeInput = {
      start_date: startDate,
      end_date: endDate
    };

    const result = await getAppointmentsByDateRange(input);

    expect(result).toHaveLength(2);
    
    // Verify both boundary appointments are included
    const appointmentDates = result.map(apt => apt.appointment_date.toISOString());
    expect(appointmentDates).toContain(startDate.toISOString());
    expect(appointmentDates).toContain(endDate.toISOString());
  });

  it('should return all appointment fields correctly', async () => {
    // Create patient first
    const patientResult = await db.insert(patientsTable)
      .values(testPatient)
      .returning()
      .execute();
    const patient = patientResult[0];

    // Create test appointment
    const appointmentInput: CreateAppointmentInput = {
      patient_id: patient.id,
      service_type: 'orthoplastie_onychoplastie',
      appointment_date: new Date('2024-01-15T14:30:00Z'),
      duration_minutes: 75,
      notes: 'Test appointment with all fields'
    };

    await db.insert(appointmentsTable)
      .values(appointmentInput)
      .execute();

    const input: GetAppointmentsByDateRangeInput = {
      start_date: new Date('2024-01-01T00:00:00Z'),
      end_date: new Date('2024-01-31T23:59:59Z')
    };

    const result = await getAppointmentsByDateRange(input);

    expect(result).toHaveLength(1);
    
    const appointment = result[0];
    expect(appointment.id).toBeDefined();
    expect(appointment.patient_id).toEqual(patient.id);
    expect(appointment.service_type).toEqual('orthoplastie_onychoplastie');
    expect(appointment.appointment_date).toBeInstanceOf(Date);
    expect(appointment.duration_minutes).toEqual(75);
    expect(appointment.status).toEqual('pending'); // Default status
    expect(appointment.notes).toEqual('Test appointment with all fields');
    expect(appointment.created_at).toBeInstanceOf(Date);
    expect(appointment.updated_at).toBeInstanceOf(Date);
  });
});
