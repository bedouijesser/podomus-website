
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactMessagesTable } from '../db/schema';
import { type CreateContactMessageInput } from '../schema';
import { getContactMessages } from '../handlers/get_contact_messages';

const testInput1: CreateContactMessageInput = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '123-456-7890',
  subject: 'General Inquiry',
  message: 'I have a question about your services.',
  is_appointment_request: false
};

const testInput2: CreateContactMessageInput = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone: null,
  subject: 'Appointment Request',
  message: 'I would like to schedule an appointment.',
  is_appointment_request: true
};

describe('getContactMessages', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no messages exist', async () => {
    const result = await getContactMessages();
    expect(result).toEqual([]);
  });

  it('should return all contact messages', async () => {
    // Create first message
    await db.insert(contactMessagesTable).values({
      name: testInput1.name,
      email: testInput1.email,
      phone: testInput1.phone,
      subject: testInput1.subject,
      message: testInput1.message,
      is_appointment_request: testInput1.is_appointment_request
    }).execute();

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Create second message
    await db.insert(contactMessagesTable).values({
      name: testInput2.name,
      email: testInput2.email,
      phone: testInput2.phone,
      subject: testInput2.subject,
      message: testInput2.message,
      is_appointment_request: testInput2.is_appointment_request
    }).execute();

    const result = await getContactMessages();

    expect(result).toHaveLength(2);
    
    // Check first message (should be newest due to DESC ordering)
    expect(result[0].name).toEqual('Jane Smith');
    expect(result[0].email).toEqual('jane@example.com');
    expect(result[0].phone).toBeNull();
    expect(result[0].subject).toEqual('Appointment Request');
    expect(result[0].message).toEqual('I would like to schedule an appointment.');
    expect(result[0].is_appointment_request).toBe(true);
    expect(result[0].status).toEqual('new');
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);

    // Check second message
    expect(result[1].name).toEqual('John Doe');
    expect(result[1].email).toEqual('john@example.com');
    expect(result[1].phone).toEqual('123-456-7890');
    expect(result[1].subject).toEqual('General Inquiry');
    expect(result[1].message).toEqual('I have a question about your services.');
    expect(result[1].is_appointment_request).toBe(false);
    expect(result[1].status).toEqual('new');
    expect(result[1].id).toBeDefined();
    expect(result[1].created_at).toBeInstanceOf(Date);
  });

  it('should return messages ordered by created_at descending', async () => {
    // Create messages with slight delay to ensure different timestamps
    await db.insert(contactMessagesTable).values({
      name: 'First Message',
      email: 'first@example.com',
      subject: 'First',
      message: 'This was created first'
    }).execute();

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(contactMessagesTable).values({
      name: 'Second Message',
      email: 'second@example.com',
      subject: 'Second',
      message: 'This was created second'
    }).execute();

    const result = await getContactMessages();

    expect(result).toHaveLength(2);
    expect(result[0].name).toEqual('Second Message');
    expect(result[1].name).toEqual('First Message');
    
    // Verify ordering by timestamp
    expect(result[0].created_at >= result[1].created_at).toBe(true);
  });

  it('should include all required fields', async () => {
    await db.insert(contactMessagesTable).values({
      name: testInput1.name,
      email: testInput1.email,
      phone: testInput1.phone,
      subject: testInput1.subject,
      message: testInput1.message,
      is_appointment_request: testInput1.is_appointment_request
    }).execute();

    const result = await getContactMessages();

    expect(result).toHaveLength(1);
    const message = result[0];
    
    // Verify all required fields are present
    expect(message.id).toBeDefined();
    expect(message.name).toBeDefined();
    expect(message.email).toBeDefined();
    expect(message.subject).toBeDefined();
    expect(message.message).toBeDefined();
    expect(message.is_appointment_request).toBeDefined();
    expect(message.status).toBeDefined();
    expect(message.created_at).toBeDefined();
    
    // Verify types
    expect(typeof message.id).toBe('number');
    expect(typeof message.name).toBe('string');
    expect(typeof message.email).toBe('string');
    expect(typeof message.subject).toBe('string');
    expect(typeof message.message).toBe('string');
    expect(typeof message.is_appointment_request).toBe('boolean');
    expect(typeof message.status).toBe('string');
    expect(message.created_at).toBeInstanceOf(Date);
  });
});
