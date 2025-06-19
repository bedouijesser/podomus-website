
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactMessagesTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type CreateContactMessageInput, type UpdateContactMessageStatusInput } from '../schema';
import { updateContactMessageStatus } from '../handlers/update_contact_message_status';

// Test input for creating a contact message
const testContactMessage: CreateContactMessageInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  subject: 'Appointment Request',
  message: 'I would like to schedule an appointment for a medical pedicure.',
  is_appointment_request: true
};

describe('updateContactMessageStatus', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update contact message status to read', async () => {
    // Create a contact message first
    const createResult = await db.insert(contactMessagesTable)
      .values(testContactMessage)
      .returning()
      .execute();

    const contactMessage = createResult[0];

    // Update the status
    const updateInput: UpdateContactMessageStatusInput = {
      id: contactMessage.id,
      status: 'read'
    };

    const result = await updateContactMessageStatus(updateInput);

    expect(result.id).toEqual(contactMessage.id);
    expect(result.status).toEqual('read');
    expect(result.name).toEqual('John Doe');
    expect(result.email).toEqual('john.doe@example.com');
    expect(result.subject).toEqual('Appointment Request');
    expect(result.is_appointment_request).toBe(true);
  });

  it('should update contact message status to responded', async () => {
    // Create a contact message first
    const createResult = await db.insert(contactMessagesTable)
      .values(testContactMessage)
      .returning()
      .execute();

    const contactMessage = createResult[0];

    // Update the status
    const updateInput: UpdateContactMessageStatusInput = {
      id: contactMessage.id,
      status: 'responded'
    };

    const result = await updateContactMessageStatus(updateInput);

    expect(result.id).toEqual(contactMessage.id);
    expect(result.status).toEqual('responded');
    expect(result.name).toEqual('John Doe');
  });

  it('should save updated status to database', async () => {
    // Create a contact message first
    const createResult = await db.insert(contactMessagesTable)
      .values(testContactMessage)
      .returning()
      .execute();

    const contactMessage = createResult[0];

    // Update the status
    const updateInput: UpdateContactMessageStatusInput = {
      id: contactMessage.id,
      status: 'read'
    };

    await updateContactMessageStatus(updateInput);

    // Verify the status was updated in the database
    const messages = await db.select()
      .from(contactMessagesTable)
      .where(eq(contactMessagesTable.id, contactMessage.id))
      .execute();

    expect(messages).toHaveLength(1);
    expect(messages[0].status).toEqual('read');
    expect(messages[0].name).toEqual('John Doe');
    expect(messages[0].email).toEqual('john.doe@example.com');
  });

  it('should throw error for non-existent contact message', async () => {
    const updateInput: UpdateContactMessageStatusInput = {
      id: 99999,
      status: 'read'
    };

    await expect(updateContactMessageStatus(updateInput))
      .rejects.toThrow(/contact message not found/i);
  });
});
