
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactMessagesTable } from '../db/schema';
import { type CreateContactMessageInput } from '../schema';
import { getContactMessages } from '../handlers/get_contact_messages';
import { eq } from 'drizzle-orm';

// Test contact message inputs
const testMessage1: CreateContactMessageInput = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+33123456789',
  subject: 'Question about services',
  message: 'I would like to know more about your pedicure services.',
  is_appointment_request: false
};

const testMessage2: CreateContactMessageInput = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone: null,
  subject: 'Appointment Request',
  message: 'I need to schedule an appointment for orthotic insoles.',
  is_appointment_request: true
};

const testMessage3: CreateContactMessageInput = {
  name: 'Pierre Martin',
  email: 'pierre@example.com',
  phone: '+33987654321',
  subject: 'Follow-up question',
  message: 'Following up on my previous appointment.',
  is_appointment_request: false
};

describe('getContactMessages', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no contact messages exist', async () => {
    const result = await getContactMessages();

    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return all contact messages', async () => {
    // Create test messages separately to ensure proper ordering
    await db.insert(contactMessagesTable)
      .values({
        name: testMessage1.name,
        email: testMessage1.email,
        phone: testMessage1.phone,
        subject: testMessage1.subject,
        message: testMessage1.message,
        is_appointment_request: testMessage1.is_appointment_request
      })
      .execute();

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(contactMessagesTable)
      .values({
        name: testMessage2.name,
        email: testMessage2.email,
        phone: testMessage2.phone,
        subject: testMessage2.subject,
        message: testMessage2.message,
        is_appointment_request: testMessage2.is_appointment_request
      })
      .execute();

    const result = await getContactMessages();

    expect(result).toHaveLength(2);
    
    // The second message (Jane Smith) should be first due to DESC ordering
    expect(result[0].name).toEqual(testMessage2.name); // Most recent first
    expect(result[0].email).toEqual(testMessage2.email);
    expect(result[0].subject).toEqual(testMessage2.subject);
    expect(result[0].message).toEqual(testMessage2.message);
    expect(result[0].is_appointment_request).toBe(true);
    expect(result[0].status).toEqual('new');
    expect(result[0].created_at).toBeInstanceOf(Date);
    expect(result[0].id).toBeDefined();

    expect(result[1].name).toEqual(testMessage1.name);
    expect(result[1].email).toEqual(testMessage1.email);
    expect(result[1].phone).toEqual(testMessage1.phone);
    expect(result[1].is_appointment_request).toBe(false);
  });

  it('should return messages ordered by created_at descending (most recent first)', async () => {
    // Create messages with slight delay to ensure different timestamps
    await db.insert(contactMessagesTable)
      .values({
        name: testMessage1.name,
        email: testMessage1.email,
        phone: testMessage1.phone,
        subject: testMessage1.subject,
        message: testMessage1.message,
        is_appointment_request: testMessage1.is_appointment_request
      })
      .execute();

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(contactMessagesTable)
      .values({
        name: testMessage2.name,
        email: testMessage2.email,
        phone: testMessage2.phone,
        subject: testMessage2.subject,
        message: testMessage2.message,
        is_appointment_request: testMessage2.is_appointment_request
      })
      .execute();

    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(contactMessagesTable)
      .values({
        name: testMessage3.name,
        email: testMessage3.email,
        phone: testMessage3.phone,
        subject: testMessage3.subject,
        message: testMessage3.message,
        is_appointment_request: testMessage3.is_appointment_request
      })
      .execute();

    const result = await getContactMessages();

    expect(result).toHaveLength(3);
    
    // Verify order - most recent first
    expect(result[0].name).toEqual(testMessage3.name); // Last created
    expect(result[1].name).toEqual(testMessage2.name); // Second created
    expect(result[2].name).toEqual(testMessage1.name); // First created

    // Verify timestamps are in descending order
    expect(result[0].created_at >= result[1].created_at).toBe(true);
    expect(result[1].created_at >= result[2].created_at).toBe(true);
  });

  it('should return messages with correct field types and values', async () => {
    await db.insert(contactMessagesTable)
      .values({
        name: testMessage1.name,
        email: testMessage1.email,
        phone: testMessage1.phone,
        subject: testMessage1.subject,
        message: testMessage1.message,
        is_appointment_request: testMessage1.is_appointment_request
      })
      .execute();

    const result = await getContactMessages();

    expect(result).toHaveLength(1);
    const message = result[0];

    // Verify all required fields exist and have correct types
    expect(typeof message.id).toBe('number');
    expect(typeof message.name).toBe('string');
    expect(typeof message.email).toBe('string');
    expect(typeof message.phone).toBe('string');
    expect(typeof message.subject).toBe('string');
    expect(typeof message.message).toBe('string');
    expect(typeof message.is_appointment_request).toBe('boolean');
    expect(typeof message.status).toBe('string');
    expect(message.created_at).toBeInstanceOf(Date);

    // Verify enum values
    expect(['new', 'read', 'responded']).toContain(message.status);
  });

  it('should handle messages with null phone numbers', async () => {
    await db.insert(contactMessagesTable)
      .values({
        name: testMessage2.name,
        email: testMessage2.email,
        phone: testMessage2.phone, // null
        subject: testMessage2.subject,
        message: testMessage2.message,
        is_appointment_request: testMessage2.is_appointment_request
      })
      .execute();

    const result = await getContactMessages();

    expect(result).toHaveLength(1);
    expect(result[0].phone).toBeNull();
    expect(result[0].name).toEqual(testMessage2.name);
    expect(result[0].email).toEqual(testMessage2.email);
  });

  it('should handle messages with different status values', async () => {
    // Create messages separately to ensure different timestamps
    const firstInsert = await db.insert(contactMessagesTable)
      .values({
        name: testMessage1.name,
        email: testMessage1.email,
        phone: testMessage1.phone,
        subject: testMessage1.subject,
        message: testMessage1.message,
        is_appointment_request: testMessage1.is_appointment_request
      })
      .returning()
      .execute();

    await new Promise(resolve => setTimeout(resolve, 10));

    const secondInsert = await db.insert(contactMessagesTable)
      .values({
        name: testMessage2.name,
        email: testMessage2.email,
        phone: testMessage2.phone,
        subject: testMessage2.subject,
        message: testMessage2.message,
        is_appointment_request: testMessage2.is_appointment_request
      })
      .returning()
      .execute();

    // Update status of first message
    await db.update(contactMessagesTable)
      .set({ status: 'read' })
      .where(eq(contactMessagesTable.id, firstInsert[0].id))
      .execute();

    const result = await getContactMessages();

    expect(result).toHaveLength(2);
    
    // Find messages by name to verify status
    const readMessage = result.find(m => m.name === testMessage1.name);
    const newMessage = result.find(m => m.name === testMessage2.name);

    expect(readMessage?.status).toEqual('read');
    expect(newMessage?.status).toEqual('new');
  });
});
