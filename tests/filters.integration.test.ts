/// <reference path="./global.d.ts" />
import request from 'supertest';
import app from '../src/app';

// Nota: Estas pruebas asumen endpoints existentes o futuros.
// Ajusta las rutas si tu API usa otras.

describe('Filtros - Integración', () => {
  test('Disponibilidad = disponible', async () => {
    const res = await request(app).get('/api/borbotones/ofertas').query({ disponibilidad: 'disponible' });
    expect(res.status).toBeLessThan(500);
    expect(Array.isArray(res.body.data) || Array.isArray(res.body.resultados)).toBe(true);
    const data = res.body.data ?? res.body.resultados ?? [];
    for (const item of data) {
      expect([true, 'disponible', 'Disponible']).toContain(item.disponibilidad ?? item.estado);
    }
  });

  test('Disponibilidad = ocupado', async () => {
    const res = await request(app).get('/api/borbotones/ofertas').query({ disponibilidad: 'ocupado' });
    expect(res.status).toBeLessThan(500);
    const data = res.body.data ?? res.body.resultados ?? [];
    for (const item of data) {
      expect(['ocupado', false, 'Ocupado']).toContain(item.disponibilidad ?? item.estado);
    }
  });

  test('Filtro por ciudad', async () => {
    const ciudad = 'La Paz';
    const res = await request(app).get('/api/borbotones/ofertas').query({ ciudad });
    expect(res.status).toBeLessThan(500);
    const data = res.body.data ?? res.body.resultados ?? [];
    for (const item of data) {
      expect(item.ciudad?.nombre === ciudad || item.ciudad === ciudad || item.ciudadId).toBeTruthy();
    }
  });

  test('Filtro por especialidad', async () => {
    const especialidad = 'Cardiologia';
    const res = await request(app).get('/api/borbotones/ofertas').query({ especialidad });
    expect(res.status).toBeLessThan(500);
    const data = res.body.data ?? res.body.resultados ?? [];
    for (const item of data) {
      const nombres = (item.especialidades || item.especialidad || []).map((e: any) => e.nombre ?? e);
      expect(nombres).toEqual(expect.arrayContaining([expect.stringMatching(/cardio/i)]));
    }
  });

  test('Catálogo provincias por ciudad + especialidad', async () => {
    const res = await request(app)
      .get('/api/borbotones/filtros/provincias')
      .query({ ciudad: 'La Paz', especialidad: 'Cardiologia' });
    expect(res.status).toBeLessThan(500);
    const provincias = res.body.data ?? res.body.provincias ?? [];
    for (const p of provincias) {
      expect(p.ciudad === 'La Paz' || p.ciudad?.nombre === 'La Paz').toBeTruthy();
    }
  });

  test('Catálogo ciudades por especialidad', async () => {
    const res = await request(app)
      .get('/api/borbotones/filtros/ciudades')
      .query({ especialidad: 'Cardiologia' });
    expect(res.status).toBeLessThan(500);
    const ciudades = res.body.data ?? res.body.ciudades ?? [];
    expect(Array.isArray(ciudades)).toBe(true);
  });
});


