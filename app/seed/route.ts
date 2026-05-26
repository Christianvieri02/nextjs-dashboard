import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedDatabase() {
  await sql.begin(async (sql: any) => {
    // 1. Drop existing tables and types in dependencies order (cascade)
    await sql`DROP TABLE IF EXISTS shipment_steps_new CASCADE`;
    await sql`DROP TABLE IF EXISTS invoices_new CASCADE`;
    await sql`DROP TABLE IF EXISTS shipments CASCADE`;
    await sql`DROP TABLE IF EXISTS shipping_rates CASCADE`;
    await sql`DROP TABLE IF EXISTS voyages CASCADE`;
    await sql`DROP TABLE IF EXISTS vessels CASCADE`;
    await sql`DROP TABLE IF EXISTS users CASCADE`;
    await sql`DROP TABLE IF EXISTS customers CASCADE`;
    await sql`DROP TABLE IF EXISTS revenue CASCADE`;

    await sql`DROP TYPE IF EXISTS invoice_status CASCADE`;
    await sql`DROP TYPE IF EXISTS vessel_status CASCADE`;
    await sql`DROP TYPE IF EXISTS vessel_type CASCADE`;

    // Enable UUID extension
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // 2. Create enums
    await sql`CREATE TYPE vessel_type AS ENUM ('Container Ship', 'Bulk Carrier', 'Tanker', 'Cargo')`;
    await sql`CREATE TYPE vessel_status AS ENUM ('En Route', 'In Port', 'Delayed', 'Maintenance', 'Active', 'Inactive')`;
    await sql`CREATE TYPE invoice_status AS ENUM ('paid', 'pending')`;

    // 3. Create tables
    await sql`
      CREATE TABLE users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    await sql`
      CREATE TABLE vessels (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        vessel_code VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        type vessel_type NOT NULL,
        captain_name VARCHAR(255) NOT NULL,
        status vessel_status NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE voyages (
        vessel_id UUID PRIMARY KEY REFERENCES vessels(id) ON DELETE CASCADE,
        origin_port VARCHAR(255) NOT NULL,
        destination_port VARCHAR(255) NOT NULL,
        eta TIMESTAMPTZ NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE shipping_rates (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        destination_city VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        rate_per_kg NUMERIC(20, 2) NOT NULL,
        est_delivery_min_days INT NOT NULL,
        est_delivery_max_days INT NOT NULL
      );
    `;

    await sql`
      CREATE TABLE shipments (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        tracking_number VARCHAR(255) NOT NULL UNIQUE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        destination_id UUID NOT NULL REFERENCES shipping_rates(id) ON DELETE CASCADE,
        weight_kg NUMERIC(20, 2) NOT NULL,
        total_cost NUMERIC(20, 2) NOT NULL,
        status VARCHAR(255) NOT NULL DEFAULT 'In Transit',
        vessel_id UUID REFERENCES vessels(id) ON DELETE SET NULL,
        est_arrival VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE shipment_steps_new (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
        status VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        step_date VARCHAR(255) NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT TRUE,
        warning BOOLEAN NOT NULL DEFAULT FALSE,
        step_order INT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE invoices_new (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        invoice_number VARCHAR(255) NOT NULL UNIQUE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        shipment_id UUID REFERENCES shipments(id) ON DELETE SET NULL,
        description TEXT,
        amount NUMERIC(20, 2) NOT NULL,
        status invoice_status NOT NULL,
        issued_date DATE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 4. Seed data
    const hashedPass = await bcrypt.hash('123456', 10);

    // Users
    await sql`
      INSERT INTO users (id, full_name, email, password) VALUES
      ('410544b2-4001-4271-9855-fec4b6a6442a', 'User One', 'user@seaparcel.com', ${hashedPass}),
      ('99999999-9999-9999-9999-999999999999', 'Admin Account', 'admin@seaparcel.com', ${hashedPass})
      ON CONFLICT (id) DO NOTHING;
    `;

    // Vessels
    await sql`
      INSERT INTO vessels (id, vessel_code, name, type, captain_name, status) VALUES
      ('d6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 'V001', 'OCEAN NAVIGATOR', 'Container Ship', 'Capt. Ahmad Rizki', 'En Route'),
      ('3958dc9e-712f-4377-85e9-fec4b6a6442a', 'V002', 'SEA WANDERER', 'Bulk Carrier', 'Capt. Sarah Chen', 'In Port'),
      ('3958dc9e-742f-4377-85e9-fec4b6a6442a', 'V003', 'PACIFIC VOYAGER', 'Container Ship', 'Capt. Budi Santoso', 'Delayed'),
      ('76d65c26-f784-44a2-ac19-586678f7c2f2', 'V004', 'ATLANTIC STAR', 'Tanker', 'Capt. Maria Santos', 'Maintenance'),
      ('CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 'V005', 'GLOBAL PIONEER', 'Container Ship', 'Capt. John Lee', 'En Route')
      ON CONFLICT (id) DO NOTHING;
    `;

    // Voyages
    await sql`
      INSERT INTO voyages (vessel_id, origin_port, destination_port, eta, is_active) VALUES
      ('d6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 'Jakarta', 'Singapore', '2026-04-19 14:30:00+07', true),
      ('3958dc9e-712f-4377-85e9-fec4b6a6442a', 'Surabaya', 'Port of Singapore', '2026-04-20 18:00:00+07', true),
      ('3958dc9e-742f-4377-85e9-fec4b6a6442a', 'Manila', 'Jakarta', '2026-04-22 16:45:00+07', true),
      ('76d65c26-f784-44a2-ac19-586678f7c2f2', 'Tanjung Priok', 'Belawan', '2026-04-25 09:00:00+07', false),
      ('CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 'Hong Kong', 'Jakarta', '2026-04-20 11:20:00+07', true)
      ON CONFLICT (vessel_id) DO NOTHING;
    `;

    // Shipping Rates
    await sql`
      INSERT INTO shipping_rates (id, destination_city, country, rate_per_kg, est_delivery_min_days, est_delivery_max_days) VALUES
      ('11111111-1111-1111-1111-111111111111', 'Singapore', 'Singapore', 5.50, 2, 4),
      ('22222222-2222-2222-2222-222222222222', 'Jakarta', 'Indonesia', 2.00, 1, 3),
      ('33333333-3333-3333-3333-333333333333', 'Manila', 'Philippines', 6.00, 3, 5),
      ('44444444-4444-4444-4444-444444444444', 'Hong Kong', 'Hong Kong', 4.50, 2, 4)
      ON CONFLICT (id) DO NOTHING;
    `;

    // Shipments
    await sql`
      INSERT INTO shipments (id, tracking_number, user_id, destination_id, weight_kg, total_cost, status, vessel_id, est_arrival) VALUES
      ('a1111111-1111-1111-1111-111111111111', 'OL2026041301', '410544b2-4001-4271-9855-fec4b6a6442a', '11111111-1111-1111-1111-111111111111', 10.00, 150.00, 'In Transit', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 'April 22, 2026'),
      ('a2222222-2222-2222-2222-222222222222', 'OL2026041302', '410544b2-4001-4271-9855-fec4b6a6442a', '33333333-3333-3333-3333-333333333333', 100.00, 600.00, 'Delivered', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 'April 15, 2026'),
      ('a3333333-3333-3333-3333-333333333333', 'OL2026041303', '410544b2-4001-4271-9855-fec4b6a6442a', '22222222-2222-2222-2222-222222222222', 250.00, 85.50, 'Delayed', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 'May 02, 2026'),
      ('a4444444-4444-4444-4444-444444444444', 'VS010', '410544b2-4001-4271-9855-fec4b6a6442a', '11111111-1111-1111-1111-111111111111', 15.00, 220.00, 'In Transit', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 'April 20, 2026')
      ON CONFLICT (id) DO NOTHING;
    `;

    // Shipment Steps New
    await sql`
      INSERT INTO shipment_steps_new (shipment_id, status, location, step_date, completed, warning, step_order) VALUES
      ('a1111111-1111-1111-1111-111111111111', 'Order Processed', 'Jakarta, ID', 'April 13, 2026 08:30 AM', true, false, 1),
      ('a1111111-1111-1111-1111-111111111111', 'Cargo Loaded', 'Jakarta Port, ID', 'April 14, 2026 14:15 PM', true, false, 2),
      ('a1111111-1111-1111-1111-111111111111', 'Departed from Origin Port', 'Jakarta Port, ID', 'April 15, 2026 09:00 AM', true, false, 3),
      ('a1111111-1111-1111-1111-111111111111', 'Arrived at Transit Port', 'Batam Port, ID', 'April 17, 2026 11:45 AM', true, false, 4),
      ('a1111111-1111-1111-1111-111111111111', 'In Transit to Destination', 'Batam Port, ID', 'April 18, 2026 08:00 AM', true, false, 5),
      ('a1111111-1111-1111-1111-111111111111', 'Arriving at Destination', 'Singapore Port, SG', 'Pending', false, false, 6);
    `;

    await sql`
      INSERT INTO shipment_steps_new (shipment_id, status, location, step_date, completed, warning, step_order) VALUES
      ('a2222222-2222-2222-2222-222222222222', 'Order Processed', 'Surabaya, ID', 'April 05, 2026 09:10 AM', true, false, 1),
      ('a2222222-2222-2222-2222-222222222222', 'Cargo Loaded', 'Surabaya Port, ID', 'April 06, 2026 16:20 PM', true, false, 2),
      ('a2222222-2222-2222-2222-222222222222', 'Departed from Origin Port', 'Surabaya Port, ID', 'April 07, 2026 10:00 AM', true, false, 3),
      ('a2222222-2222-2222-2222-222222222222', 'Arrived at Destination Port', 'Tokyo Port, JP', 'April 14, 2026 14:00 PM', true, false, 4),
      ('a2222222-2222-2222-2222-222222222222', 'Cargo Unloaded', 'Tokyo Port, JP', 'April 15, 2026 08:30 AM', true, false, 5),
      ('a2222222-2222-2222-2222-222222222222', 'Delivered', 'Tokyo Customer Center', 'April 15, 2026 13:45 PM', true, false, 6);
    `;

    await sql`
      INSERT INTO shipment_steps_new (shipment_id, status, location, step_date, completed, warning, step_order) VALUES
      ('a3333333-3333-3333-3333-333333333333', 'Order Processed', 'Medan, ID', 'April 16, 2026 10:00 AM', true, false, 1),
      ('a3333333-3333-3333-3333-333333333333', 'Cargo Loaded', 'Belawan Port, ID', 'April 17, 2026 13:00 PM', true, false, 2),
      ('a3333333-3333-3333-3333-333333333333', 'Customs Clearance Delay', 'Belawan Port, ID', 'April 18, 2026 09:00 AM', true, true, 3),
      ('a3333333-3333-3333-3333-333333333333', 'Departed from Origin Port', 'Pending', 'Pending', false, false, 4);
    `;

    await sql`
      INSERT INTO shipment_steps_new (shipment_id, status, location, step_date, completed, warning, step_order) VALUES
      ('a4444444-4444-4444-4444-444444444444', 'Order Processed', 'Hong Kong', 'April 16, 2026 11:00 AM', true, false, 1),
      ('a4444444-4444-4444-4444-444444444444', 'Cargo Loaded', 'Hong Kong Port', 'April 17, 2026 15:30 PM', true, false, 2),
      ('a4444444-4444-4444-4444-444444444444', 'Departed from Origin Port', 'Hong Kong Port', 'April 18, 2026 10:00 AM', true, false, 3),
      ('a4444444-4444-4444-4444-444444444444', 'In Transit to Jakarta', 'South China Sea', 'April 19, 2026 09:00 AM', true, false, 4),
      ('a4444444-4444-4444-4444-444444444444', 'Arriving at Destination', 'Jakarta Port, ID', 'Pending', false, false, 5);
    `;

    // Invoices
    await sql`
      INSERT INTO invoices_new (id, invoice_number, user_id, shipment_id, description, amount, status, issued_date) VALUES
      ('b1111111-1111-1111-1111-111111111111', 'INV-2026-001', '410544b2-4001-4271-9855-fec4b6a6442a', 'a1111111-1111-1111-1111-111111111111', 'Express Shipping to Singapore (OL2026041301)', 150.00, 'paid', '2026-04-13'),
      ('b2222222-2222-2222-2222-222222222222', 'INV-2026-002', '410544b2-4001-4271-9855-fec4b6a6442a', 'a3333333-3333-3333-3333-333333333333', 'Standard Shipping to Manila (OL2026041303)', 85.50, 'pending', '2026-04-14'),
      ('b3333333-3333-3333-3333-333333333333', 'INV-2026-003', '410544b2-4001-4271-9855-fec4b6a6442a', NULL, 'Freight Shipping to Kuala Lumpur', 450.00, 'pending', '2026-04-01'),
      ('b4444444-4444-4444-4444-444444444444', 'INV-2026-004', '410544b2-4001-4271-9855-fec4b6a6442a', 'a4444444-4444-4444-4444-444444444444', 'Express Shipping to Sydney (VS010)', 220.00, 'pending', '2026-04-16'),
      ('b5555555-5555-5555-5555-555555555555', 'INV-2026-005', '410544b2-4001-4271-9855-fec4b6a6442a', NULL, 'Standard Shipping to Bangkok', 65.00, 'paid', '2026-03-25')
      ON CONFLICT (id) DO NOTHING;
    `;
  });
}

export async function GET() {
  try {
    await seedDatabase();
    return Response.json({ message: 'Database schema reset and seeded successfully' });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return Response.json({ error: error.message || error }, { status: 500 });
  }
}
