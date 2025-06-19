
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
  description: 'Soins médicaux spécialisés pour les pieds',
  duration_minutes: 60,
  price: 75.50,
  is_active: true
};

// Test input without price (nullable field)
const testInputNullPrice: CreateServiceInput = {
  name: 'Consultation Gratuite',
  slug: 'consultation-gratuite',
  description: 'Première consultation d\'évaluation',
  duration_minutes: 30,
  price: null,
  is_active: true
};

// Test input with Zod defaults applied
const testInputWithDefaults: CreateServiceInput = {
  name: 'Service avec Défauts',
  slug: 'service-avec-defauts',
  description: 'Service utilisant les valeurs par défaut',
  duration_minutes: 45,
  price: 50.00,
  is_active: true // Zod default is true
};

describe('createService', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a service with all fields', async () => {
    const result = await createService(testInput);

    // Basic field validation
    expect(result.name).toEqual('Pédicurie Médicale');
    expect(result.slug).toEqual('pedicurie-medicale');
    expect(result.description).toEqual('Soins médicaux spécialisés pour les pieds');
    expect(result.duration_minutes).toEqual(60);
    expect(result.price).toEqual(75.50);
    expect(typeof result.price).toEqual('number'); // Verify numeric conversion
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a service with null price', async () => {
    const result = await createService(testInputNullPrice);

    expect(result.name).toEqual('Consultation Gratuite');
    expect(result.slug).toEqual('consultation-gratuite');
    expect(result.description).toEqual('Première consultation d\'évaluation');
    expect(result.duration_minutes).toEqual(30);
    expect(result.price).toBeNull();
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save service to database correctly', async () => {
    const result = await createService(testInput);

    // Query using proper drizzle syntax
    const services = await db.select()
      .from(servicesTable)
      .where(eq(servicesTable.id, result.id))
      .execute();

    expect(services).toHaveLength(1);
    const savedService = services[0];
    
    expect(savedService.name).toEqual('Pédicurie Médicale');
    expect(savedService.slug).toEqual('pedicurie-medicale');
    expect(savedService.description).toEqual('Soins médicaux spécialisés pour les pieds');
    expect(savedService.duration_minutes).toEqual(60);
    expect(parseFloat(savedService.price!)).toEqual(75.50); // Database stores as string
    expect(savedService.is_active).toEqual(true);
    expect(savedService.created_at).toBeInstanceOf(Date);
    expect(savedService.updated_at).toBeInstanceOf(Date);
  });

  it('should save service with null price to database', async () => {
    const result = await createService(testInputNullPrice);

    const services = await db.select()
      .from(servicesTable)
      .where(eq(servicesTable.id, result.id))
      .execute();

    expect(services).toHaveLength(1);
    const savedService = services[0];
    
    expect(savedService.name).toEqual('Consultation Gratuite');
    expect(savedService.price).toBeNull();
    expect(savedService.is_active).toEqual(true);
  });

  it('should handle Zod defaults correctly', async () => {
    const result = await createService(testInputWithDefaults);

    expect(result.name).toEqual('Service avec Défauts');
    expect(result.is_active).toEqual(true); // Should use Zod default
    expect(result.price).toEqual(50.00);
    expect(typeof result.price).toEqual('number');
  });

  it('should create multiple services with unique slugs', async () => {
    const service1Input: CreateServiceInput = {
      name: 'Service 1',
      slug: 'service-1',
      description: 'Premier service',
      duration_minutes: 30,
      price: 25.00,
      is_active: true
    };

    const service2Input: CreateServiceInput = {
      name: 'Service 2',
      slug: 'service-2',
      description: 'Deuxième service',
      duration_minutes: 45,
      price: 40.00,
      is_active: false
    };

    const result1 = await createService(service1Input);
    const result2 = await createService(service2Input);

    expect(result1.slug).toEqual('service-1');
    expect(result2.slug).toEqual('service-2');
    expect(result1.is_active).toEqual(true);
    expect(result2.is_active).toEqual(false);
    expect(result1.id).not.toEqual(result2.id);
  });

  it('should handle decimal prices correctly', async () => {
    const precisionTestInput: CreateServiceInput = {
      name: 'Service Précision',
      slug: 'service-precision',
      description: 'Test de précision des prix',
      duration_minutes: 90,
      price: 123.45,
      is_active: true
    };

    const result = await createService(precisionTestInput);

    expect(result.price).toEqual(123.45);
    expect(typeof result.price).toEqual('number');

    // Verify database storage and retrieval
    const services = await db.select()
      .from(servicesTable)
      .where(eq(servicesTable.id, result.id))
      .execute();

    expect(parseFloat(services[0].price!)).toEqual(123.45);
  });

  it('should reject duplicate slugs', async () => {
    await createService(testInput);

    // Try to create another service with the same slug
    const duplicateSlugInput: CreateServiceInput = {
      name: 'Service Différent',
      slug: 'pedicurie-medicale', // Same slug as testInput
      description: 'Description différente',
      duration_minutes: 90,
      price: 100.00,
      is_active: true
    };

    await expect(createService(duplicateSlugInput)).rejects.toThrow(/unique/i);
  });

  it('should handle very long service names and descriptions', async () => {
    const longTextInput: CreateServiceInput = {
      name: 'Service avec un nom très long qui teste la capacité du système à gérer des textes étendus',
      slug: 'service-nom-long',
      description: 'Une description très détaillée qui explique en profondeur tous les aspects du service médical proposé, incluant les techniques utilisées, les bénéfices pour le patient, et les modalités de prise en charge. Cette description teste la capacité du système à stocker et récupérer des textes longs sans perte de données.',
      duration_minutes: 120,
      price: 150.75,
      is_active: true
    };

    const result = await createService(longTextInput);

    expect(result.name.length).toBeGreaterThan(50);
    expect(result.description.length).toBeGreaterThan(200);
    expect(result.price).toEqual(150.75);
  });
});
