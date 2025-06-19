
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { patientsTable, appointmentsTable } from '../db/schema';
import { type GetAppointmentsByDateRangeInput } from '../schema';
import { getAppointmentsByDateRange } from '../handlers/get_appointments_by_date_range';

describe('getAppointmentsByDateRange', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return appointments within date range', async () => {
    // Create test patient first
    const patientResult = await db.insert(patientsTable)
      .values({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789'
      })
      .returning()
      .execute();

    const patientId = patientResult[0].id;

    // Create test appointments with different dates
    const baseDate = new Date('2024-01-15T10:00:00Z');
    const beforeRange = new Date('2024-01-10T10:00:00Z');
    const inRange1 = new Date('2024-01-15T14:00:00Z');
    const inRange2 = new Date('2024-01-20T09:00:00Z');
    const afterRange = new Date('2024-01-25T16:00:00Z');

    await db.insert(appointmentsTable)
      .values([
        {
          patient_id: patientId,
          service_type: 'pedicurie_medicale',
          appointment_date: beforeRange,
          duration_minutes: 60,
          notes: 'Before range'
        },
        {
          patient_id: patientId,
          service_type: 'semelles_orthopediques',
          appointment_date: inRange1,
          duration_minutes: 90,
          notes: 'In range 1'
        },
        {
          patient_id: patientId,
          service_type: 'orthoplastie_onychoplastie',
          appointment_date: inRange2,
          duration_minutes: 45,
          notes: 'In range 2'
        },
        {
          patient_id: patientId,
          service_type: 'pedicurie_medicale',
          appointment_date: afterRange,
          duration_minutes: 60,
          notes: 'After range'
        }
      ])
      .execute();

    // Query appointments in range
    const input: GetAppointmentsByDateRangeInput = {
      start_date: new Date('2024-01-15T00:00:00Z'),
      end_date: new Date('2024-01-20T23:59:59Z')
    };

    const results = await getAppointmentsByDateRange(input);

    // Should return only appointments within range
    expect(results).toHaveLength(2);
    expect(results[0].notes).toEqual('In range 1');
    expect(results[1].notes).toEqual('In range 2');
    
    // Verify appointments are ordered by date
    expect(results[0].appointment_date <= results[1].appointment_date).toBe(true);
  });

  it('should return empty array when no appointments in range', async () => {
    const input: GetAppointmentsByDateRangeInput = {
      start_date: new Date('2024-01-01T00:00:00Z'),
      end_date: new Date('2024-01-05T23:59:59Z')
    };

    const results = await getAppointmentsByDateRange(input);

    expect(results).toHaveLength(0);
  });

  it('should handle single day range', async () => {
    // Create test patient
    const patientResult = await db.insert(patientsTable)
      .values({
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        phone: '987654321'
      })
      .returning()
      .execute();

    const patientId = patientResult[0].id;

    // Create appointments on same day at different times
    const sameDay = new Date('2024-01-15');
    const morning = new Date('2024-01-15T09:00:00Z');
    const afternoon = new Date('2024-01-15T15:00:00Z');
    const nextDay = new Date('2024-01-16T10:00:00Z');

    await db.insert(appointmentsTable)
      .values([
        {
          patient_id: patientId,
          service_type: 'pedicurie_medicale',
          appointment_date: morning,
          duration_minutes: 60,
          notes: 'Morning appointment'
        },
        {
          patient_id: patientId,
          service_type: 'semelles_orthopediques',
          appointment_date: afternoon,
          duration_minutes: 90,
          notes: 'Afternoon appointment'
        },
        {
          patient_id: patientId,
          service_type: 'orthoplastie_onychoplastie',
          appointment_date: nextDay,
          duration_minutes: 45,
          notes: 'Next day appointment'
        }
      ])
      .execute();

    // Query for single day
    const input: GetAppointmentsByDateRangeInput = {
      start_date: new Date('2024-01-15T00:00:00Z'),
      end_date: new Date('2024-01-15T23:59:59Z')
    };

    const results = await getAppointmentsByDateRange(input);

    expect(results).toHaveLength(2);
    expect(results[0].notes).toEqual('Morning appointment');
    expect(results[1].notes).toEqual('Afternoon appointment');
  });

  it('should handle edge case with exact boundary dates', async () => {
    // Create test patient
    const patientResult = await db.insert(patientsTable)
      .values({
        first_name: 'Bob',
        last_name: 'Wilson',
        email: 'bob.wilson@example.com',
        phone: '555123456'
      })
      .returning()
      .execute();

    const patientId = patientResult[0].id;

    // Create appointments exactly at boundaries
    const startBoundary = new Date('2024-01-15T00:00:00Z');
    const endBoundary = new Date('2024-01-20T23:59:59Z');

    await db.insert(appointmentsTable)
      .values([
        {
          patient_id: patientId,
          service_type: 'pedicurie_medicale',
          appointment_date: startBoundary,
          duration_minutes: 60,
          notes: 'Start boundary'
        },
        {
          patient_id: patientId,
          service_type: 'semelles_orthopediques',
          appointment_date: endBoundary,
          duration_minutes: 90,
          notes: 'End boundary'
        }
      ])
      .execute();

    const input: GetAppointmentsByDateRangeInput = {
      start_date: startBoundary,
      end_date: endBoundary
    };

    const results = await getAppointmentsByDateRange(input);

    expect(results).toHaveLength(2);
    expect(results[0].notes).toEqual('Start boundary');
    expect(results[1].notes).toEqual('End boundary');
  });

  it('should return all appointment fields correctly', async () => {
    // Create test patient
    const patientResult = await db.insert(patientsTable)
      .values({
        first_name: 'Alice',
        last_name: 'Johnson',
        email: 'alice.johnson@example.com',
        phone: '444555666'
      })
      .returning()
      .execute();

    const patientId = patientResult[0].id;

    // Create test appointment
    const appointmentDate = new Date('2024-01-15T14:30:00Z');
    await db.insert(appointmentsTable)
      .values({
        patient_id: patientId,
        service_type: 'orthoplastie_onychoplastie',
        appointment_date: appointmentDate,
        duration_minutes: 120,
        status: 'confirmed',
        notes: 'Special treatment notes'
      })
      .execute();

    const input: GetAppointmentsByDateRangeInput = {
      start_date: new Date('2024-01-15T00:00:00Z'),
      end_date: new Date('2024-01-15T23:59:59Z')
    };

    const results = await getAppointmentsByDateRange(input);

    expect(results).toHaveLength(1);
    const appointment = results[0];
    
    // Verify all fields are present and correct
    expect(appointment.id).toBeDefined();
    expect(appointment.patient_id).toEqual(patientId);
    expect(appointment.service_type).toEqual('orthoplastie_onychoplastie');
    expect(appointment.appointment_date).toBeInstanceOf(Date);
    expect(appointment.duration_minutes).toEqual(120);
    expect(appointment.status).toEqual('confirmed');
    expect(appointment.notes).toEqual('Special treatment notes');
    expect(appointment.created_at).toBeInstanceOf(Date);
    expect(appointment.updated_at).toBeInstanceOf(Date);
  });
});
