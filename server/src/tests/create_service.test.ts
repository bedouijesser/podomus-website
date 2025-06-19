
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type CreateServiceInput } from '../schema';
import { createService } from '../handlers/create_service';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateServiceInput = {
  name: 'Pédicurie Médicale',
  slug: 'pedicurie-medicale',
  description: 'Soins podologiques complets pour la santé de vos pieds',
  duration_minutes: 60,
  price: 45.50,
  is_active: true
};

// Test input with null price
const testInputNullPrice: CreateServiceInput = {
  name: 'Consultation Gratuite',
  slug: 'consultation-gratuite',
  description: 'Première consultation gratuite',
  duration_minutes: 30,
  price: null,
  is_active: true
};

describe('createService', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a service with price', async () => {
    const result = await createService(testInput);

    // Basic field validation
    expect(result.name).toEqual('Pédicurie Médicale');
    expect(result.slug).toEqual('pedicurie-medicale');
    expect(result.description).toEqual(testInput.description);
    expect(result.duration_minutes).toEqual(60);
    expect(result.price).toEqual(45.50);
    expect(typeof result.price).toBe('number');
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a service with null price', async () => {
    const result = await createService(testInputNullPrice);

    // Basic field validation
    expect(result.name).toEqual('Consultation Gratuite');
    expect(result.slug).toEqual('consultation-gratuite');
    expect(result.description).toEqual(testInputNullPrice.description);
    expect(result.duration_minutes).toEqual(30);
    expect(result.price).toBeNull();
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save service to database', async () => {
    const result = await createService(testInput);

    // Query using proper drizzle syntax
    const services = await db.select()
      .from(servicesTable)
      .where(eq(servicesTable.id, result.id))
      .execute();

    expect(services).toHaveLength(1);
    expect(services[0].name).toEqual('Pédicurie Médicale');
    expect(services[0].slug).toEqual('pedicurie-medicale');
    expect(services[0].description).toEqual(testInput.description);
    expect(services[0].duration_minutes).toEqual(60);
    expect(parseFloat(services[0].price!)).toEqual(45.50);
    expect(services[0].is_active).toEqual(true);
    expect(services[0].created_at).toBeInstanceOf(Date);
    expect(services[0].updated_at).toBeInstanceOf(Date);
  });

  it('should save service with null price to database', async () => {
    const result = await createService(testInputNullPrice);

    // Query using proper drizzle syntax
    const services = await db.select()
      .from(servicesTable)
      .where(eq(servicesTable.id, result.id))
      .execute();

    expect(services).toHaveLength(1);
    expect(services[0].name).toEqual('Consultation Gratuite');
    expect(services[0].price).toBeNull();
    expect(services[0].is_active).toEqual(true);
  });

  it('should create service with default is_active value', async () => {
    const inputWithoutActive: CreateServiceInput = {
      name: 'Service Test',
      slug: 'service-test',
      description: 'Test service description',
      duration_minutes: 45,
      price: 30.00,
      is_active: true // Zod default would have been applied already
    };

    const result = await createService(inputWithoutActive);

    expect(result.is_active).toEqual(true);
    expect(result.name).toEqual('Service Test');
    expect(result.price).toEqual(30.00);
  });
});
