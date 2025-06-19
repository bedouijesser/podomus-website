
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactMessagesTable } from '../db/schema';
import { type CreateContactMessageInput, type UpdateContactMessageStatusInput } from '../schema';
import { updateContactMessageStatus } from '../handlers/update_contact_message_status';
import { eq } from 'drizzle-orm';

// Helper to create a test contact message
const createTestContactMessage = async (): Promise<number> => {
  const testInput: CreateContactMessageInput = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '0123456789',
    subject: 'Test Subject',
    message: 'Test message content',
    is_appointment_request: false
  };

  const result = await db.insert(contactMessagesTable)
    .values({
      name: testInput.name,
      email: testInput.email,
      phone: testInput.phone,
      subject: testInput.subject,
      message: testInput.message,
      is_appointment_request: testInput.is_appointment_request
    })
    .returning()
    .execute();

  return result[0].id;
};

describe('updateContactMessageStatus', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update contact message status successfully', async () => {
    // Create a test contact message
    const messageId = await createTestContactMessage();

    const updateInput: UpdateContactMessageStatusInput = {
      id: messageId,
      status: 'read'
    };

    const result = await updateContactMessageStatus(updateInput);

    // Verify the returned result
    expect(result.id).toEqual(messageId);
    expect(result.status).toEqual('read');
    expect(result.name).toEqual('Test User');
    expect(result.email).toEqual('test@example.com');
    expect(result.phone).toEqual('0123456789');
    expect(result.subject).toEqual('Test Subject');
    expect(result.message).toEqual('Test message content');
    expect(result.is_appointment_request).toEqual(false);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should persist status change in database', async () => {
    // Create a test contact message
    const messageId = await createTestContactMessage();

    const updateInput: UpdateContactMessageStatusInput = {
      id: messageId,
      status: 'responded'
    };

    await updateContactMessageStatus(updateInput);

    // Query the database to verify the change was persisted
    const messages = await db.select()
      .from(contactMessagesTable)
      .where(eq(contactMessagesTable.id, messageId))
      .execute();

    expect(messages).toHaveLength(1);
    expect(messages[0].status).toEqual('responded');
    expect(messages[0].id).toEqual(messageId);
  });

  it('should update from new to read status', async () => {
    // Create a test contact message (defaults to 'new' status)
    const messageId = await createTestContactMessage();

    // Verify initial status is 'new'
    const initialMessages = await db.select()
      .from(contactMessagesTable)
      .where(eq(contactMessagesTable.id, messageId))
      .execute();

    expect(initialMessages[0].status).toEqual('new');

    // Update to 'read'
    const updateInput: UpdateContactMessageStatusInput = {
      id: messageId,
      status: 'read'
    };

    const result = await updateContactMessageStatus(updateInput);

    expect(result.status).toEqual('read');
  });

  it('should throw error for non-existent contact message', async () => {
    const updateInput: UpdateContactMessageStatusInput = {
      id: 999999, // Non-existent ID
      status: 'read'
    };

    await expect(updateContactMessageStatus(updateInput))
      .rejects
      .toThrow(/Contact message with id 999999 not found/i);
  });

  it('should handle all valid status transitions', async () => {
    // Create a test contact message
    const messageId = await createTestContactMessage();

    const statuses = ['read', 'responded', 'new'] as const;

    for (const status of statuses) {
      const updateInput: UpdateContactMessageStatusInput = {
        id: messageId,
        status: status
      };

      const result = await updateContactMessageStatus(updateInput);

      expect(result.status).toEqual(status);
      expect(result.id).toEqual(messageId);

      // Verify persistence
      const messages = await db.select()
        .from(contactMessagesTable)
        .where(eq(contactMessagesTable.id, messageId))
        .execute();

      expect(messages[0].status).toEqual(status);
    }
  });

  it('should preserve all other fields when updating status', async () => {
    // Create a test contact message
    const messageId = await createTestContactMessage();

    // Get original data
    const originalMessages = await db.select()
      .from(contactMessagesTable)
      .where(eq(contactMessagesTable.id, messageId))
      .execute();

    const originalMessage = originalMessages[0];

    // Update status
    const updateInput: UpdateContactMessageStatusInput = {
      id: messageId,
      status: 'responded'
    };

    const result = await updateContactMessageStatus(updateInput);

    // Verify all other fields are preserved
    expect(result.name).toEqual(originalMessage.name);
    expect(result.email).toEqual(originalMessage.email);
    expect(result.phone).toEqual(originalMessage.phone);
    expect(result.subject).toEqual(originalMessage.subject);
    expect(result.message).toEqual(originalMessage.message);
    expect(result.is_appointment_request).toEqual(originalMessage.is_appointment_request);
    expect(result.created_at).toEqual(originalMessage.created_at);
    expect(result.status).toEqual('responded'); // Only status should change
  });
});
