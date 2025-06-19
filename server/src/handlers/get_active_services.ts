
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type Service } from '../schema';
import { eq } from 'drizzle-orm';

export const getActiveServices = async (): Promise<Service[]> => {
  try {
    const results = await db.select()
      .from(servicesTable)
      .where(eq(servicesTable.is_active, true))
      .execute();

    // Convert numeric price field back to number
    return results.map(service => ({
      ...service,
      price: service.price ? parseFloat(service.price) : null
    }));
  } catch (error) {
    console.error('Failed to get active services:', error);
    throw error;
  }
};
