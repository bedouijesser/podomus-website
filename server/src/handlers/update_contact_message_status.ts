
import { db } from '../db';
import { contactMessagesTable } from '../db/schema';
import { type UpdateContactMessageStatusInput, type ContactMessage } from '../schema';
import { eq } from 'drizzle-orm';

export const updateContactMessageStatus = async (input: UpdateContactMessageStatusInput): Promise<ContactMessage> => {
  try {
    // Update the contact message status
    const result = await db.update(contactMessagesTable)
      .set({
        status: input.status
      })
      .where(eq(contactMessagesTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Contact message with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Contact message status update failed:', error);
    throw error;
  }
};
