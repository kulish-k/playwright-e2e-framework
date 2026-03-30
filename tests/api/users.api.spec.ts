import { test, expect } from '@playwright/test';

// Tagging system isolates these completely from standard UI workers
test.describe('External Integration API Validation @api @smoke', () => {

  test('GET /users accurately resolves with paginated data limits', async ({ request }) => {
    // We send a raw API call using Playwright's specialized request context
    const response = await request.get('/users?limit=5');
    
    // Core structural validations proving microservice health
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const json = await response.json();

    // Validating specific enterprise logic
    expect(json.users).toBeInstanceOf(Array);
    expect(json.users).toHaveLength(5);
    expect(json.total).toBeGreaterThan(0);
  });

  test('POST /users accurately enforces required schema', async ({ request }) => {
    // Playwright natively handles JSON serialization
    const payload = {
      firstName: 'Test',
      lastName: 'Automation',
      age: 35
    };

    const response = await request.post('/users/add', {
      data: payload
    });

    expect(response.status()).toBe(201); // Created
    
    const body = await response.json();
    expect(body).toMatchObject(payload);
    expect(body.id).toBeDefined(); // Confirms database allocation logic
  });
});
