
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { patientsTable, appointmentsTable } from '../db/schema';
import { type UpdateAppointmentStatusInput } from '../schema';
import { updateAppointmentStatus } from '../handlers/update_appointment_status';
import { eq } from 'drizzle-orm';

describe('updateAppointmentStatus', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update appointment status successfully', async () => {
    // Create test patient first
    const patientResult = await db.insert(patientsTable)
      .values({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '+33123456789',
        date_of_birth: new Date('1990-01-01'),
        address: '123 Test Street',
        medical_history: 'No known allergies'
      })
      .returning()
      .execute();

    const patient = patientResult[0];

    // Create test appointment
    const appointmentResult = await db.insert(appointmentsTable)
      .values({
        patient_id: patient.id,
        service_type: 'pedicurie_medicale',
        appointment_date: new Date('2024-02-01T10:00:00Z'),
        duration_minutes: 60,
        status: 'pending',
        notes: 'Initial consultation'
      })
      .returning()
      .execute();

    const appointment = appointmentResult[0];

    // Test input
    const updateInput: UpdateAppointmentStatusInput = {
      id: appointment.id,
      status: 'confirmed'
    };

    // Update appointment status
    const result = await updateAppointmentStatus(updateInput);

    // Verify result
    expect(result.id).toEqual(appointment.id);
    expect(result.status).toEqual('confirmed');
    expect(result.patient_id).toEqual(patient.id);
    expect(result.service_type).toEqual('pedicurie_medicale');
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > appointment.updated_at).toBe(true);
  });

  it('should update appointment status in database', async () => {
    // Create test patient first
    const patientResult = await db.insert(patientsTable)
      .values({
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+33987654321',
        date_of_birth: new Date('1985-05-15'),
        address: '456 Test Avenue',
        medical_history: null
      })
      .returning()
      .execute();

    const patient = patientResult[0];

    // Create test appointment
    const appointmentResult = await db.insert(appointmentsTable)
      .values({
        patient_id: patient.id,
        service_type: 'semelles_orthopediques',
        appointment_date: new Date('2024-03-15T14:30:00Z'),
        duration_minutes: 90,
        status: 'pending',
        notes: 'Custom orthotic fitting'
      })
      .returning()
      .execute();

    const appointment = appointmentResult[0];

    // Test input
    const updateInput: UpdateAppointmentStatusInput = {
      id: appointment.id,
      status: 'completed'
    };

    // Update appointment status
    await updateAppointmentStatus(updateInput);

    // Verify database was updated
    const updatedAppointments = await db.select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.id, appointment.id))
      .execute();

    expect(updatedAppointments).toHaveLength(1);
    expect(updatedAppointments[0].status).toEqual('completed');
    expect(updatedAppointments[0].updated_at).toBeInstanceOf(Date);
    expect(updatedAppointments[0].updated_at > appointment.updated_at).toBe(true);
  });

  it('should handle all valid status transitions', async () => {
    // Create test patient first
    const patientResult = await db.insert(patientsTable)
      .values({
        first_name: 'Test',
        last_name: 'Patient',
        email: 'test.patient@example.com',
        phone: '+33111222333',
        date_of_birth: new Date('1980-12-01'),
        address: null,
        medical_history: null
      })
      .returning()
      .execute();

    const patient = patientResult[0];

    // Create test appointment
    const appointmentResult = await db.insert(appointmentsTable)
      .values({
        patient_id: patient.id,
        service_type: 'orthoplastie_onychoplastie',
        appointment_date: new Date('2024-04-10T09:00:00Z'),
        duration_minutes: 45,
        status: 'pending',
        notes: null
      })
      .returning()
      .execute();

    const appointment = appointmentResult[0];

    // Test all valid status values
    const validStatuses: Array<'pending' | 'confirmed' | 'completed' | 'cancelled'> = [
      'confirmed',
      'completed',
      'cancelled',
      'pending'
    ];

    for (const status of validStatuses) {
      const updateInput: UpdateAppointmentStatusInput = {
        id: appointment.id,
        status: status
      };

      const result = await updateAppointmentStatus(updateInput);
      expect(result.status).toEqual(status);
    }
  });

  it('should throw error when appointment not found', async () => {
    const updateInput: UpdateAppointmentStatusInput = {
      id: 99999, // Non-existent appointment ID
      status: 'confirmed'
    };

    await expect(updateAppointmentStatus(updateInput))
      .rejects
      .toThrow(/appointment with id 99999 not found/i);
  });

  it('should preserve all other appointment fields', async () => {
    // Create test patient first
    const patientResult = await db.insert(patientsTable)
      .values({
        first_name: 'Alice',
        last_name: 'Johnson',
        email: 'alice.johnson@example.com',
        phone: '+33444555666',
        date_of_birth: new Date('1975-08-20'),
        address: '789 Test Boulevard',
        medical_history: 'Diabetes Type 2'
      })
      .returning()
      .execute();

    const patient = patientResult[0];

    // Create test appointment with specific data
    const appointmentResult = await db.insert(appointmentsTable)
      .values({
        patient_id: patient.id,
        service_type: 'pedicurie_medicale',
        appointment_date: new Date('2024-05-20T16:00:00Z'),
        duration_minutes: 75,
        status: 'pending',
        notes: 'Special treatment required'
      })
      .returning()
      .execute();

    const originalAppointment = appointmentResult[0];

    // Update status
    const updateInput: UpdateAppointmentStatusInput = {
      id: originalAppointment.id,
      status: 'confirmed'
    };

    const result = await updateAppointmentStatus(updateInput);

    // Verify only status and updated_at changed
    expect(result.id).toEqual(originalAppointment.id);
    expect(result.patient_id).toEqual(originalAppointment.patient_id);
    expect(result.service_type).toEqual(originalAppointment.service_type);
    expect(result.appointment_date).toEqual(originalAppointment.appointment_date);
    expect(result.duration_minutes).toEqual(originalAppointment.duration_minutes);
    expect(result.notes).toEqual(originalAppointment.notes);
    expect(result.created_at).toEqual(originalAppointment.created_at);
    expect(result.status).toEqual('confirmed'); // This should be different
    expect(result.updated_at > originalAppointment.updated_at).toBe(true); // This should be different
  });

  it('should handle concurrent status updates correctly', async () => {
    // Create test patient first
    const patientResult = await db.insert(patientsTable)
      .values({
        first_name: 'Bob',
        last_name: 'Wilson',
        email: 'bob.wilson@example.com',
        phone: '+33777888999',
        date_of_birth: new Date('1992-03-10'),
        address: '321 Test Lane',
        medical_history: null
      })
      .returning()
      .execute();

    const patient = patientResult[0];

    // Create test appointment
    const appointmentResult = await db.insert(appointmentsTable)
      .values({
        patient_id: patient.id,
        service_type: 'semelles_orthopediques',
        appointment_date: new Date('2024-06-01T11:30:00Z'),
        duration_minutes: 120,
        status: 'pending',
        notes: 'Requires multiple fittings'
      })
      .returning()
      .execute();

    const appointment = appointmentResult[0];

    // Perform multiple updates in sequence
    const updateInput1: UpdateAppointmentStatusInput = {
      id: appointment.id,
      status: 'confirmed'
    };

    const updateInput2: UpdateAppointmentStatusInput = {
      id: appointment.id,
      status: 'completed'
    };

    const result1 = await updateAppointmentStatus(updateInput1);
    expect(result1.status).toEqual('confirmed');

    const result2 = await updateAppointmentStatus(updateInput2);
    expect(result2.status).toEqual('completed');
    expect(result2.updated_at > result1.updated_at).toBe(true);
  });
});
