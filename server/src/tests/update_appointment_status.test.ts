
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { appointmentsTable, patientsTable } from '../db/schema';
import { type UpdateAppointmentStatusInput, type CreatePatientInput, type CreateAppointmentInput } from '../schema';
import { updateAppointmentStatus } from '../handlers/update_appointment_status';
import { eq } from 'drizzle-orm';

describe('updateAppointmentStatus', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  let patientId: number;
  let appointmentId: number;

  beforeEach(async () => {
    // Create a test patient first
    const patientInput: CreatePatientInput = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '555-1234',
      date_of_birth: new Date('1980-01-01'),
      address: '123 Main St',
      medical_history: 'No significant history'
    };

    const patientResult = await db.insert(patientsTable)
      .values(patientInput)
      .returning()
      .execute();

    patientId = patientResult[0].id;

    // Create a test appointment
    const appointmentInput: CreateAppointmentInput = {
      patient_id: patientId,
      service_type: 'pedicurie_medicale',
      appointment_date: new Date('2024-01-15T10:00:00Z'),
      duration_minutes: 60,
      notes: 'Initial consultation'
    };

    const appointmentResult = await db.insert(appointmentsTable)
      .values({
        ...appointmentInput,
        status: 'pending'
      })
      .returning()
      .execute();

    appointmentId = appointmentResult[0].id;
  });

  it('should update appointment status to confirmed', async () => {
    const input: UpdateAppointmentStatusInput = {
      id: appointmentId,
      status: 'confirmed'
    };

    const result = await updateAppointmentStatus(input);

    expect(result.id).toEqual(appointmentId);
    expect(result.status).toEqual('confirmed');
    expect(result.patient_id).toEqual(patientId);
    expect(result.service_type).toEqual('pedicurie_medicale');
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update appointment status to completed', async () => {
    const input: UpdateAppointmentStatusInput = {
      id: appointmentId,
      status: 'completed'
    };

    const result = await updateAppointmentStatus(input);

    expect(result.status).toEqual('completed');
    expect(result.id).toEqual(appointmentId);
  });

  it('should update appointment status to cancelled', async () => {
    const input: UpdateAppointmentStatusInput = {
      id: appointmentId,
      status: 'cancelled'
    };

    const result = await updateAppointmentStatus(input);

    expect(result.status).toEqual('cancelled');
    expect(result.id).toEqual(appointmentId);
  });

  it('should save updated status to database', async () => {
    const input: UpdateAppointmentStatusInput = {
      id: appointmentId,
      status: 'confirmed'
    };

    await updateAppointmentStatus(input);

    // Verify the status was updated in the database
    const appointments = await db.select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.id, appointmentId))
      .execute();

    expect(appointments).toHaveLength(1);
    expect(appointments[0].status).toEqual('confirmed');
    expect(appointments[0].updated_at).toBeInstanceOf(Date);
  });

  it('should throw error for non-existent appointment', async () => {
    const input: UpdateAppointmentStatusInput = {
      id: 99999,
      status: 'confirmed'
    };

    await expect(updateAppointmentStatus(input)).rejects.toThrow(/not found/i);
  });

  it('should update the updated_at timestamp', async () => {
    // Get the original updated_at timestamp
    const originalAppointment = await db.select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.id, appointmentId))
      .execute();

    const originalUpdatedAt = originalAppointment[0].updated_at;

    // Wait a bit to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    const input: UpdateAppointmentStatusInput = {
      id: appointmentId,
      status: 'confirmed'
    };

    const result = await updateAppointmentStatus(input);

    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });
});
