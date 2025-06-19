
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type Service } from '../schema';

export const getServices = async (): Promise<Service[]> => {
  try {
    const results = await db.select()
      .from(servicesTable)
      .execute();

    // Convert numeric fields back to numbers
    return results.map(service => ({
      ...service,
      price: service.price ? parseFloat(service.price) : null
    }));
  } catch (error) {
    console.error('Failed to fetch services:', error);
    throw error;
  }
};
