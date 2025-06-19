
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactMessagesTable } from '../db/schema';
import { type CreateContactMessageInput } from '../schema';
import { createContactMessage } from '../handlers/create_contact_message';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateContactMessageInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '0123456789',
  subject: 'Test inquiry',
  message: 'This is a test message for contact form',
  is_appointment_request: false
};

describe('createContactMessage', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a contact message', async () => {
    const result = await createContactMessage(testInput);

    // Basic field validation
    expect(result.name).toEqual('John Doe');
    expect(result.email).toEqual('john.doe@example.com');
    expect(result.phone).toEqual('0123456789');
    expect(result.subject).toEqual('Test inquiry');
    expect(result.message).toEqual('This is a test message for contact form');
    expect(result.is_appointment_request).toEqual(false);
    expect(result.status).toEqual('new'); // Default status
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save contact message to database', async () => {
    const result = await createContactMessage(testInput);

    // Query using proper drizzle syntax
    const messages = await db.select()
      .from(contactMessagesTable)
      .where(eq(contactMessagesTable.id, result.id))
      .execute();

    expect(messages).toHaveLength(1);
    expect(messages[0].name).toEqual('John Doe');
    expect(messages[0].email).toEqual('john.doe@example.com');
    expect(messages[0].phone).toEqual('0123456789');
    expect(messages[0].subject).toEqual('Test inquiry');
    expect(messages[0].message).toEqual('This is a test message for contact form');
    expect(messages[0].is_appointment_request).toEqual(false);
    expect(messages[0].status).toEqual('new');
    expect(messages[0].created_at).toBeInstanceOf(Date);
  });

  it('should create contact message with appointment request flag', async () => {
    const appointmentRequestInput: CreateContactMessageInput = {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: null,
      subject: 'Appointment Request',
      message: 'I would like to schedule an appointment',
      is_appointment_request: true
    };

    const result = await createContactMessage(appointmentRequestInput);

    expect(result.name).toEqual('Jane Smith');
    expect(result.email).toEqual('jane.smith@example.com');
    expect(result.phone).toBeNull();
    expect(result.subject).toEqual('Appointment Request');
    expect(result.message).toEqual('I would like to schedule an appointment');
    expect(result.is_appointment_request).toEqual(true);
    expect(result.status).toEqual('new');
  });

  it('should create contact message with null phone', async () => {
    const inputWithNullPhone: CreateContactMessageInput = {
      name: 'Test User',
      email: 'test@example.com',
      phone: null,
      subject: 'Test Subject',
      message: 'Test message without phone',
      is_appointment_request: false
    };

    const result = await createContactMessage(inputWithNullPhone);

    expect(result.phone).toBeNull();
    expect(result.name).toEqual('Test User');
    expect(result.email).toEqual('test@example.com');
  });
});
