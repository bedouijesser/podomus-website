
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactMessagesTable } from '../db/schema';
import { type CreateContactMessageInput } from '../schema';
import { createContactMessage } from '../handlers/create_contact_message';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateContactMessageInput = {
  name: 'Jean Dupont',
  email: 'jean.dupont@example.com',
  phone: '+33 1 23 45 67 89',
  subject: 'Demande de rendez-vous',
  message: 'Bonjour, je souhaiterais prendre rendez-vous pour une pédicurie médicale.',
  is_appointment_request: true
};

// Test input without optional fields
const minimalInput: CreateContactMessageInput = {
  name: 'Marie Martin',
  email: 'marie.martin@example.com',
  phone: null,
  subject: 'Question générale',
  message: 'Quels sont vos tarifs pour les semelles orthopédiques?',
  is_appointment_request: false
};

describe('createContactMessage', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a contact message with all fields', async () => {
    const result = await createContactMessage(testInput);

    // Verify all basic fields
    expect(result.name).toEqual('Jean Dupont');
    expect(result.email).toEqual('jean.dupont@example.com');
    expect(result.phone).toEqual('+33 1 23 45 67 89');
    expect(result.subject).toEqual('Demande de rendez-vous');
    expect(result.message).toEqual('Bonjour, je souhaiterais prendre rendez-vous pour une pédicurie médicale.');
    expect(result.is_appointment_request).toEqual(true);
    
    // Verify auto-generated fields
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('number');
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.status).toEqual('new'); // Default status
  });

  it('should create a contact message with minimal fields', async () => {
    const result = await createContactMessage(minimalInput);

    expect(result.name).toEqual('Marie Martin');
    expect(result.email).toEqual('marie.martin@example.com');
    expect(result.phone).toBeNull();
    expect(result.subject).toEqual('Question générale');
    expect(result.message).toEqual('Quels sont vos tarifs pour les semelles orthopédiques?');
    expect(result.is_appointment_request).toEqual(false);
    expect(result.status).toEqual('new');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save contact message to database', async () => {
    const result = await createContactMessage(testInput);

    // Query the database to verify the record was saved
    const messages = await db.select()
      .from(contactMessagesTable)
      .where(eq(contactMessagesTable.id, result.id))
      .execute();

    expect(messages).toHaveLength(1);
    expect(messages[0].name).toEqual('Jean Dupont');
    expect(messages[0].email).toEqual('jean.dupont@example.com');
    expect(messages[0].phone).toEqual('+33 1 23 45 67 89');
    expect(messages[0].subject).toEqual('Demande de rendez-vous');
    expect(messages[0].message).toEqual('Bonjour, je souhaiterais prendre rendez-vous pour une pédicurie médicale.');
    expect(messages[0].is_appointment_request).toEqual(true);
    expect(messages[0].status).toEqual('new');
    expect(messages[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle appointment request flag correctly', async () => {
    // Test with appointment request
    const appointmentResult = await createContactMessage(testInput);
    expect(appointmentResult.is_appointment_request).toEqual(true);

    // Test without appointment request
    const generalResult = await createContactMessage(minimalInput);
    expect(generalResult.is_appointment_request).toEqual(false);
  });

  it('should create multiple contact messages with unique IDs', async () => {
    const result1 = await createContactMessage(testInput);
    const result2 = await createContactMessage(minimalInput);

    expect(result1.id).not.toEqual(result2.id);
    expect(result1.email).not.toEqual(result2.email);
    
    // Verify both records exist in database
    const allMessages = await db.select()
      .from(contactMessagesTable)
      .execute();

    expect(allMessages).toHaveLength(2);
    expect(allMessages.some(msg => msg.id === result1.id)).toBe(true);
    expect(allMessages.some(msg => msg.id === result2.id)).toBe(true);
  });

  it('should set created_at timestamp correctly', async () => {
    const beforeCreation = new Date();
    const result = await createContactMessage(testInput);
    const afterCreation = new Date();

    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.created_at.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
    expect(result.created_at.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
  });

  it('should handle different message types correctly', async () => {
    // Test with different subjects and content
    const medicalInquiry = await createContactMessage({
      name: 'Pierre Durand',
      email: 'pierre.durand@example.com',
      phone: null,
      subject: 'Consultation médicale',
      message: 'Je souffre de douleurs au pied, pouvez-vous m\'aider?',
      is_appointment_request: true
    });

    const generalInquiry = await createContactMessage({
      name: 'Sophie Bernard',
      email: 'sophie.bernard@example.com',
      phone: '+33 6 12 34 56 78',
      subject: 'Informations tarifs',
      message: 'Pourriez-vous me communiquer vos tarifs?',
      is_appointment_request: false
    });

    expect(medicalInquiry.subject).toEqual('Consultation médicale');
    expect(medicalInquiry.is_appointment_request).toBe(true);
    expect(generalInquiry.subject).toEqual('Informations tarifs');
    expect(generalInquiry.is_appointment_request).toBe(false);
  });
});
