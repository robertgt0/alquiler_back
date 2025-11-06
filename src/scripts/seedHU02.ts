import 'dotenv/config';
import mongoose from 'mongoose';
import Job from '../models/job.model';         // ajusta la ruta si tu modelo está en otra carpeta
import User from '../models/user.model';       // idem

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Falta MONGODB_URI');
  await mongoose.connect(uri);
  console.log('✅ Conectado para seed');

  // Limpia solo lo necesario (opcional)
  // await Job.deleteMany({});
  // await User.deleteMany({ role: 'fixer' });

  // 1) Inserta trabajos
  const jobs = await Job.insertMany([
    { name: 'Carpintería', slug: 'carpinteria' },
    { name: 'Plomería', slug: 'plomeria' },
    { name: 'Electricidad', slug: 'electricidad' },
  ]);
  const carp = jobs.find(j => j.slug === 'carpinteria')!._id;
  const plom = jobs.find(j => j.slug === 'plomeria')!._id;
  const elec = jobs.find(j => j.slug === 'electricidad')!._id;

  // 2) Inserta fixers con skills (ids de Job)
  await User.insertMany([
    {
      name: 'Elmer Romero',
      role: 'fixer',
      city: 'Cochabamba',
      rating: 4.8,
      reviewsCount: 127,
      skills: [carp], // ← relación
      summary: 'Especialista en carpintería fina y muebles a medida.',
    },
    {
      name: 'Carlos Terán',
      role: 'fixer',
      city: 'La Paz',
      rating: 4.9,
      reviewsCount: 203,
      skills: [plom],
      summary: 'Instalaciones sanitarias, reparaciones y mantenimiento.',
    },
    {
      name: 'Federico Balderrama',
      role: 'fixer',
      city: 'Santa Cruz',
      rating: 4.7,
      reviewsCount: 156,
      skills: [elec],
      summary: 'Residencial, comercial y sistemas de energía solar.',
    },
    {
      name: 'Alex Guzmán',
      role: 'fixer',
      city: 'Cochabamba',
      rating: 4.6,
      reviewsCount: 98,
      skills: [jobs[2]._id, jobs[0]._id], // Electricidad + Carpintería (ejemplo multi)
      summary: 'Acabados y remodelación con alta calidad.',
    },
  ]);

  console.log('✅ Seed HU02 completado');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('❌ Seed error', err);
  process.exit(1);
});
