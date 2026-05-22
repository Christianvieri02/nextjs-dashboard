import bcrypt from 'bcrypt';
import postgres from 'postgres';
import {
  users,
  vessels,
  vesselSchedules,
  shippingRates,
  shipments,
  invoices
} from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers(sql: any) {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedVessels(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS vessels (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      vessel_code VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      type vessel_type NOT NULL,
      captain_name VARCHAR(255) NOT NULL,
      status vessel_status NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedVessels = await Promise.all(
    vessels.map(
      (vessel) => sql`
        INSERT INTO vessels (id, vessel_code, name, type, captain_name, status)
        VALUES (${vessel.id}, ${vessel.vessel_code}, ${vessel.name}, ${vessel.type}, ${vessel.captain_name}, ${vessel.status})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedVessels;
}

async function seedVesselSchedules(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS vessel_schedules (
      vessel_id UUID PRIMARY KEY REFERENCES vessels(id) ON DELETE CASCADE,
      origin_port VARCHAR(255) NOT NULL,
      destination_port VARCHAR(255) NOT NULL,
      eta TIMESTAMPTZ NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedSchedules = await Promise.all(
    vesselSchedules.map(
      (schedule) => sql`
        INSERT INTO vessel_schedules (vessel_id, origin_port, destination_port, eta, is_active)
        VALUES (${schedule.vessel_id}, ${schedule.origin_port}, ${schedule.destination_port}, ${schedule.eta}, ${schedule.is_active})
        ON CONFLICT (vessel_id) DO NOTHING;
      `,
    ),
  );

  return insertedSchedules;
}

async function seedShippingRates(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS shipping_rates (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      destination_city VARCHAR(255) NOT NULL,
      country VARCHAR(255) NOT NULL,
      rate_per_kg NUMERIC(10, 2) NOT NULL,
      est_delivery_min_days INT NOT NULL,
      est_delivery_max_days INT NOT NULL
    );
  `;

  const insertedRates = await Promise.all(
    shippingRates.map(
      (rate) => sql`
        INSERT INTO shipping_rates (id, destination_city, country, rate_per_kg, est_delivery_min_days, est_delivery_max_days)
        VALUES (${rate.id}, ${rate.destination_city}, ${rate.country}, ${rate.rate_per_kg}, ${rate.est_delivery_min_days}, ${rate.est_delivery_max_days})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedRates;
}

async function seedShipments(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS shipments (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      tracking_number VARCHAR(255) NOT NULL UNIQUE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      destination_id UUID NOT NULL REFERENCES shipping_rates(id) ON DELETE CASCADE,
      weight_kg NUMERIC(10, 2) NOT NULL,
      total_cost NUMERIC(10, 2) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedShipments = await Promise.all(
    shipments.map(
      (shipment) => sql`
        INSERT INTO shipments (id, tracking_number, user_id, destination_id, weight_kg, total_cost)
        VALUES (${shipment.id}, ${shipment.tracking_number}, ${shipment.user_id}, ${shipment.destination_id}, ${shipment.weight_kg}, ${shipment.total_cost})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedShipments;
}

async function seedInvoices(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      invoice_number VARCHAR(255) NOT NULL UNIQUE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      shipment_id UUID REFERENCES shipments(id) ON DELETE SET NULL,
      description TEXT,
      amount NUMERIC(10, 2) NOT NULL,
      status invoice_status NOT NULL,
      issued_date DATE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (id, invoice_number, user_id, shipment_id, description, amount, status, issued_date)
        VALUES (${invoice.id}, ${invoice.invoice_number}, ${invoice.user_id}, ${invoice.shipment_id}, ${invoice.description}, ${invoice.amount}, ${invoice.status}, ${invoice.issued_date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

export async function GET() {
  try {
    await sql.begin(async (sql: any) => {
      // 1. Drop existing tables and types in dependencies order
      await sql`DROP TABLE IF EXISTS invoices CASCADE`;
      await sql`DROP TABLE IF EXISTS shipments CASCADE`;
      await sql`DROP TABLE IF EXISTS shipping_rates CASCADE`;
      await sql`DROP TABLE IF EXISTS vessel_schedules CASCADE`;
      await sql`DROP TABLE IF EXISTS vessels CASCADE`;
      await sql`DROP TABLE IF EXISTS users CASCADE`;
      await sql`DROP TABLE IF EXISTS customers CASCADE`;
      await sql`DROP TABLE IF EXISTS revenue CASCADE`;

      await sql`DROP TYPE IF EXISTS invoice_status CASCADE`;
      await sql`DROP TYPE IF EXISTS vessel_status CASCADE`;
      await sql`DROP TYPE IF EXISTS vessel_type CASCADE`;

      // 2. Create enums
      await sql`CREATE TYPE vessel_type AS ENUM ('Container Ship', 'Bulk Carrier', 'Tanker', 'Cargo')`;
      await sql`CREATE TYPE vessel_status AS ENUM ('En Route', 'In Port', 'Delayed', 'Maintenance', 'Active', 'Inactive')`;
      await sql`CREATE TYPE invoice_status AS ENUM ('paid', 'pending')`;

      // 3. Create tables & insert data
      await seedUsers(sql);
      await seedVessels(sql);
      await seedVesselSchedules(sql);
      await seedShippingRates(sql);
      await seedShipments(sql);
      await seedInvoices(sql);
    });

    return Response.json({ message: 'Database schema reset and seeded successfully' });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return Response.json({ error: error.message || error }, { status: 500 });
  }
}
