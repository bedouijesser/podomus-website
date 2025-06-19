
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { servicesTable } from '../db/schema';
import { getActiveServices } from '../handlers/get_active_services';

describe('getActiveServices', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return only active services', async () => {
    // Create test services - one active, one inactive
    await db.insert(servicesTable).values([
      {
        name: 'Pédicurie Médicale',
        slug: 'pedicurie-medicale',
        description: 'Soins professionnels des pieds',
        duration_minutes: 60,
        price: '75.00',
        is_active: true
      },
      {
        name: 'Service Inactif',
        slug: 'service-inactif',
        description: 'Ce service n\'est plus disponible',
        duration_minutes: 30,
        price: '50.00',
        is_active: false
      },
      {
        name: 'Semelles Orthopédiques',
        slug: 'semelles-orthopediques',
        description: 'Fabrication de semelles sur mesure',
        duration_minutes: 90,
        price: '150.00',
        is_active: true
      }
    ]).execute();

    const result = await getActiveServices();

    expect(result).toHaveLength(2);
    expect(result.every(service => service.is_active)).toBe(true);
    
    const serviceNames = result.map(s => s.name);
    expect(serviceNames).toContain('Pédicurie Médicale');
    expect(serviceNames).toContain('Semelles Orthopédiques');
    expect(serviceNames).not.toContain('Service Inactif');
  });

  it('should convert numeric price fields to numbers', async () => {
    await db.insert(servicesTable).values({
      name: 'Test Service',
      slug: 'test-service',
      description: 'Service de test',
      duration_minutes: 45,
      price: '89.99',
      is_active: true
    }).execute();

    const result = await getActiveServices();

    expect(result).toHaveLength(1);
    expect(typeof result[0].price).toBe('number');
    expect(result[0].price).toEqual(89.99);
  });

  it('should handle services with null price', async () => {
    await db.insert(servicesTable).values({
      name: 'Free Consultation',
      slug: 'free-consultation',
      description: 'Consultation gratuite',
      duration_minutes: 30,
      price: null,
      is_active: true
    }).execute();

    const result = await getActiveServices();

    expect(result).toHaveLength(1);
    expect(result[0].price).toBeNull();
  });

  it('should return empty array when no active services exist', async () => {
    // Create only inactive services
    await db.insert(servicesTable).values({
      name: 'Inactive Service',
      slug: 'inactive-service',
      description: 'This service is not active',
      duration_minutes: 60,
      price: '100.00',
      is_active: false
    }).execute();

    const result = await getActiveServices();

    expect(result).toHaveLength(0);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return all required service fields', async () => {
    await db.insert(servicesTable).values({
      name: 'Complete Service',
      slug: 'complete-service',
      description: 'Service with all fields',
      duration_minutes: 120,
      price: '200.50',
      is_active: true
    }).execute();

    const result = await getActiveServices();

    expect(result).toHaveLength(1);
    const service = result[0];
    
    expect(service.id).toBeDefined();
    expect(typeof service.id).toBe('number');
    expect(service.name).toBe('Complete Service');
    expect(service.slug).toBe('complete-service');
    expect(service.description).toBe('Service with all fields');
    expect(service.duration_minutes).toBe(120);
    expect(service.price).toBe(200.50);
    expect(service.is_active).toBe(true);
    expect(service.created_at).toBeInstanceOf(Date);
    expect(service.updated_at).toBeInstanceOf(Date);
  });

  it('should handle multiple active services with mixed price types', async () => {
    await db.insert(servicesTable).values([
      {
        name: 'Service Payant',
        slug: 'service-payant',
        description: 'Service avec prix',
        duration_minutes: 60,
        price: '125.75',
        is_active: true
      },
      {
        name: 'Service Gratuit',
        slug: 'service-gratuit',
        description: 'Service sans prix',
        duration_minutes: 30,
        price: null,
        is_active: true
      },
      {
        name: 'Service Premium',
        slug: 'service-premium',
        description: 'Service haut de gamme',
        duration_minutes: 180,
        price: '300.00',
        is_active: true
      }
    ]).execute();

    const result = await getActiveServices();

    expect(result).toHaveLength(3);
    
    // Check price conversions
    const paidService = result.find(s => s.name === 'Service Payant');
    const freeService = result.find(s => s.name === 'Service Gratuit');
    const premiumService = result.find(s => s.name === 'Service Premium');
    
    expect(paidService?.price).toBe(125.75);
    expect(typeof paidService?.price).toBe('number');
    
    expect(freeService?.price).toBeNull();
    
    expect(premiumService?.price).toBe(300.00);
    expect(typeof premiumService?.price).toBe('number');
  });
});
