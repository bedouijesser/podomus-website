
import { db } from '../db';
import { contactMessagesTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type UpdateContactMessageStatusInput, type ContactMessage } from '../schema';

export const updateContactMessageStatus = async (input: UpdateContactMessageStatusInput): Promise<ContactMessage> => {
  try {
    const result = await db.update(contactMessagesTable)
      .set({
        status: input.status
      })
      .where(eq(contactMessagesTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error('Contact message not found');
    }

    return result[0];
  } catch (error) {
    console.error('Contact message status update failed:', error);
    throw error;
  }
};
