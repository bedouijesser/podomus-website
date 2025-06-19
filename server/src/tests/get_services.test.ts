
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { getServices } from '../handlers/get_services';

describe('getServices', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no services exist', async () => {
    const results = await getServices();
    expect(results).toEqual([]);
  });

  it('should return all services with correct data types', async () => {
    // Insert test services
    await db.insert(servicesTable).values([
      {
        name: 'Pédicurie Médicale',
        slug: 'pedicurie-medicale',
        description: 'Soins des pieds professionnels',
        duration_minutes: 60,
        price: '75.00',
        is_active: true
      },
      {
        name: 'Semelles Orthopédiques',
        slug: 'semelles-orthopediques',
        description: 'Semelles sur mesure',
        duration_minutes: 90,
        price: '150.50',
        is_active: false
      },
      {
        name: 'Consultation Gratuite',
        slug: 'consultation-gratuite',
        description: 'Première consultation',
        duration_minutes: 30,
        price: null, // Free service
        is_active: true
      }
    ]).execute();

    const results = await getServices();

    expect(results).toHaveLength(3);

    // Check first service
    expect(results[0].name).toEqual('Pédicurie Médicale');
    expect(results[0].slug).toEqual('pedicurie-medicale');
    expect(results[0].description).toEqual('Soins des pieds professionnels');
    expect(results[0].duration_minutes).toEqual(60);
    expect(results[0].price).toEqual(75.00);
    expect(typeof results[0].price).toEqual('number');
    expect(results[0].is_active).toEqual(true);
    expect(results[0].id).toBeDefined();
    expect(results[0].created_at).toBeInstanceOf(Date);
    expect(results[0].updated_at).toBeInstanceOf(Date);

    // Check service with null price
    const freeService = results.find(s => s.slug === 'consultation-gratuite');
    expect(freeService).toBeDefined();
    expect(freeService!.price).toBeNull();

    // Check inactive service
    const inactiveService = results.find(s => s.slug === 'semelles-orthopediques');
    expect(inactiveService).toBeDefined();
    expect(inactiveService!.is_active).toEqual(false);
    expect(inactiveService!.price).toEqual(150.50);
    expect(typeof inactiveService!.price).toEqual('number');
  });

  it('should handle services with decimal prices correctly', async () => {
    await db.insert(servicesTable).values({
      name: 'Service Test',
      slug: 'service-test',
      description: 'Test service with decimal price',
      duration_minutes: 45,
      price: '99.99',
      is_active: true
    }).execute();

    const results = await getServices();

    expect(results).toHaveLength(1);
    expect(results[0].price).toEqual(99.99);
    expect(typeof results[0].price).toEqual('number');
  });

  it('should return services ordered by insertion order', async () => {
    // Insert services in specific order
    await db.insert(servicesTable).values([
      {
        name: 'Service A',
        slug: 'service-a',
        description: 'First service',
        duration_minutes: 30,
        price: '50.00',
        is_active: true
      },
      {
        name: 'Service B',
        slug: 'service-b',
        description: 'Second service',
        duration_minutes: 60,
        price: '100.00',
        is_active: true
      },
      {
        name: 'Service C',
        slug: 'service-c',
        description: 'Third service',
        duration_minutes: 90,
        price: '150.00',
        is_active: true
      }
    ]).execute();

    const results = await getServices();

    expect(results).toHaveLength(3);
    expect(results[0].name).toEqual('Service A');
    expect(results[1].name).toEqual('Service B');
    expect(results[2].name).toEqual('Service C');
  });
});
