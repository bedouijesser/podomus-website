
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { getServices } from '../handlers/get_services';

describe('getServices', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no services exist', async () => {
    const result = await getServices();
    expect(result).toEqual([]);
  });

  it('should return all services', async () => {
    // Create test services
    await db.insert(servicesTable)
      .values([
        {
          name: 'Pédicurie Médicale',
          slug: 'pedicurie-medicale',
          description: 'Soins des pieds par un professionnel',
          duration_minutes: 60,
          price: '50.00',
          is_active: true
        },
        {
          name: 'Semelles Orthopédiques',
          slug: 'semelles-orthopediques',
          description: 'Conception de semelles sur mesure',
          duration_minutes: 45,
          price: '120.50',
          is_active: false
        },
        {
          name: 'Consultation Gratuite',
          slug: 'consultation-gratuite',
          description: 'Première consultation gratuite',
          duration_minutes: 30,
          price: null,
          is_active: true
        }
      ])
      .execute();

    const result = await getServices();

    expect(result).toHaveLength(3);
    
    // Check first service
    const service1 = result.find(s => s.slug === 'pedicurie-medicale');
    expect(service1).toBeDefined();
    expect(service1!.name).toEqual('Pédicurie Médicale');
    expect(service1!.description).toEqual('Soins des pieds par un professionnel');
    expect(service1!.duration_minutes).toEqual(60);
    expect(service1!.price).toEqual(50.00);
    expect(typeof service1!.price).toEqual('number');
    expect(service1!.is_active).toEqual(true);
    expect(service1!.id).toBeDefined();
    expect(service1!.created_at).toBeInstanceOf(Date);
    expect(service1!.updated_at).toBeInstanceOf(Date);

    // Check service with null price
    const service3 = result.find(s => s.slug === 'consultation-gratuite');
    expect(service3).toBeDefined();
    expect(service3!.price).toBeNull();

    // Check inactive service is still returned
    const service2 = result.find(s => s.slug === 'semelles-orthopediques');
    expect(service2).toBeDefined();
    expect(service2!.is_active).toEqual(false);
    expect(service2!.price).toEqual(120.50);
    expect(typeof service2!.price).toEqual('number');
  });

  it('should handle numeric price conversion correctly', async () => {
    await db.insert(servicesTable)
      .values({
        name: 'Test Service',
        slug: 'test-service',
        description: 'Test description',
        duration_minutes: 30,
        price: '99.99',
        is_active: true
      })
      .execute();

    const result = await getServices();

    expect(result).toHaveLength(1);
    expect(result[0].price).toEqual(99.99);
    expect(typeof result[0].price).toEqual('number');
  });
});
