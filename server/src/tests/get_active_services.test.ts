
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { type CreateServiceInput } from '../schema';
import { getActiveServices } from '../handlers/get_active_services';

const activeService: CreateServiceInput = {
  name: 'Pédicurie Médicale',
  slug: 'pedicurie-medicale',
  description: 'Soins des pieds spécialisés',
  duration_minutes: 60,
  price: 50.00,
  is_active: true
};

const inactiveService: CreateServiceInput = {
  name: 'Service Inactif',
  slug: 'service-inactif',
  description: 'Un service qui n\'est plus disponible',
  duration_minutes: 30,
  price: 25.00,
  is_active: false
};

const serviceWithoutPrice: CreateServiceInput = {
  name: 'Consultation Gratuite',
  slug: 'consultation-gratuite',
  description: 'Consultation d\'évaluation',
  duration_minutes: 15,
  price: null,
  is_active: true
};

describe('getActiveServices', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return only active services', async () => {
    // Create test services
    await db.insert(servicesTable)
      .values([
        {
          name: activeService.name,
          slug: activeService.slug,
          description: activeService.description,
          duration_minutes: activeService.duration_minutes,
          price: activeService.price?.toString() || null,
          is_active: activeService.is_active
        },
        {
          name: inactiveService.name,
          slug: inactiveService.slug,
          description: inactiveService.description,
          duration_minutes: inactiveService.duration_minutes,
          price: inactiveService.price?.toString() || null,
          is_active: inactiveService.is_active
        }
      ])
      .execute();

    const result = await getActiveServices();

    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('Pédicurie Médicale');
    expect(result[0].is_active).toBe(true);
    expect(result[0].price).toEqual(50.00);
    expect(typeof result[0].price).toBe('number');
  });

  it('should handle services with null price', async () => {
    // Create service without price
    await db.insert(servicesTable)
      .values({
        name: serviceWithoutPrice.name,
        slug: serviceWithoutPrice.slug,
        description: serviceWithoutPrice.description,
        duration_minutes: serviceWithoutPrice.duration_minutes,
        price: null,
        is_active: serviceWithoutPrice.is_active
      })
      .execute();

    const result = await getActiveServices();

    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('Consultation Gratuite');
    expect(result[0].price).toBeNull();
    expect(result[0].is_active).toBe(true);
  });

  it('should return empty array when no active services exist', async () => {
    // Create only inactive service
    await db.insert(servicesTable)
      .values({
        name: inactiveService.name,
        slug: inactiveService.slug,
        description: inactiveService.description,
        duration_minutes: inactiveService.duration_minutes,
        price: inactiveService.price?.toString() || null,
        is_active: inactiveService.is_active
      })
      .execute();

    const result = await getActiveServices();

    expect(result).toHaveLength(0);
  });

  it('should return all service fields correctly', async () => {
    // Create active service
    await db.insert(servicesTable)
      .values({
        name: activeService.name,
        slug: activeService.slug,
        description: activeService.description,
        duration_minutes: activeService.duration_minutes,
        price: activeService.price?.toString() || null,
        is_active: activeService.is_active
      })
      .execute();

    const result = await getActiveServices();

    expect(result).toHaveLength(1);
    const service = result[0];
    
    expect(service.id).toBeDefined();
    expect(service.name).toEqual('Pédicurie Médicale');
    expect(service.slug).toEqual('pedicurie-medicale');
    expect(service.description).toEqual('Soins des pieds spécialisés');
    expect(service.duration_minutes).toEqual(60);
    expect(service.price).toEqual(50.00);
    expect(service.is_active).toBe(true);
    expect(service.created_at).toBeInstanceOf(Date);
    expect(service.updated_at).toBeInstanceOf(Date);
  });
});
