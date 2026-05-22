// Placeholder data for the new database structure
const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
];

const vessels = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    vessel_code: 'V001',
    name: 'OCEAN NAVIGATOR',
    type: 'Container Ship',
    captain_name: 'Capt. Ahmad Rizki',
    status: 'En Route',
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    vessel_code: 'V002',
    name: 'SEA WANDERER',
    type: 'Bulk Carrier',
    captain_name: 'Capt. Sarah Chen',
    status: 'In Port',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    vessel_code: 'V003',
    name: 'PACIFIC VOYAGER',
    type: 'Container Ship',
    captain_name: 'Capt. Budi Santoso',
    status: 'Delayed',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    vessel_code: 'V004',
    name: 'ATLANTIC STAR',
    type: 'Tanker',
    captain_name: 'Capt. Maria Santos',
    status: 'Maintenance',
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    vessel_code: 'V005',
    name: 'GLOBAL PIONEER',
    type: 'Container Ship',
    captain_name: 'Capt. John Lee',
    status: 'En Route',
  },
];

const vesselSchedules = [
  {
    vessel_id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    origin_port: 'Jakarta',
    destination_port: 'Singapore',
    eta: '2026-04-19T14:30:00+07:00',
    is_active: true,
  },
  {
    vessel_id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    origin_port: 'Surabaya',
    destination_port: 'Port of Singapore',
    eta: '2026-04-20T18:00:00+07:00',
    is_active: true,
  },
  {
    vessel_id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    origin_port: 'Manila',
    destination_port: 'Jakarta',
    eta: '2026-04-22T16:45:00+07:00',
    is_active: true,
  },
  {
    vessel_id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    origin_port: 'Tanjung Priok',
    destination_port: 'Belawan',
    eta: '2026-04-25T09:00:00+07:00',
    is_active: false,
  },
  {
    vessel_id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    origin_port: 'Hong Kong',
    destination_port: 'Jakarta',
    eta: '2026-04-20T11:20:00+07:00',
    is_active: true,
  },
];

const shippingRates = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    destination_city: 'Singapore',
    country: 'Singapore',
    rate_per_kg: 5.50,
    est_delivery_min_days: 2,
    est_delivery_max_days: 4,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    destination_city: 'Jakarta',
    country: 'Indonesia',
    rate_per_kg: 2.00,
    est_delivery_min_days: 1,
    est_delivery_max_days: 3,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    destination_city: 'Manila',
    country: 'Philippines',
    rate_per_kg: 6.00,
    est_delivery_min_days: 3,
    est_delivery_max_days: 5,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    destination_city: 'Hong Kong',
    country: 'Hong Kong',
    rate_per_kg: 4.50,
    est_delivery_min_days: 2,
    est_delivery_max_days: 4,
  },
];

const shipments = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    tracking_number: 'TRK001',
    user_id: '410544b2-4001-4271-9855-fec4b6a6442a',
    destination_id: '11111111-1111-1111-1111-111111111111',
    weight_kg: 10.0,
    total_cost: 55.00,
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    tracking_number: 'TRK002',
    user_id: '410544b2-4001-4271-9855-fec4b6a6442a',
    destination_id: '33333333-3333-3333-3333-333333333333',
    weight_kg: 100.0,
    total_cost: 600.00,
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    tracking_number: 'TRK003',
    user_id: '410544b2-4001-4271-9855-fec4b6a6442a',
    destination_id: '22222222-2222-2222-2222-222222222222',
    weight_kg: 250.0,
    total_cost: 500.00,
  },
];

const invoices = [
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    invoice_number: 'INV-001',
    user_id: '410544b2-4001-4271-9855-fec4b6a6442a',
    shipment_id: 'a1111111-1111-1111-1111-111111111111',
    description: 'Maritime logistics transport',
    amount: 448.00,
    status: 'paid' as const,
    issued_date: '2026-04-10',
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    invoice_number: 'INV-002',
    user_id: '410544b2-4001-4271-9855-fec4b6a6442a',
    shipment_id: 'a2222222-2222-2222-2222-222222222222',
    description: 'Bulk shipment transport',
    amount: 600.00,
    status: 'paid' as const,
    issued_date: '2026-04-10',
  },
  {
    id: 'b3333333-3333-3333-3333-333333333333',
    invoice_number: 'INV-003',
    user_id: '410544b2-4001-4271-9855-fec4b6a6442a',
    shipment_id: 'a3333333-3333-3333-3333-333333333333',
    description: 'Port to port container delivery',
    amount: 500.00,
    status: 'paid' as const,
    issued_date: '2026-03-19',
  },
  {
    id: 'b4444444-4444-4444-4444-444444444444',
    invoice_number: 'INV-004',
    user_id: '410544b2-4001-4271-9855-fec4b6a6442a',
    shipment_id: null,
    description: 'Custom clearance fees',
    amount: 30.40,
    status: 'paid' as const,
    issued_date: '2026-02-28',
  },
  {
    id: 'b5555555-5555-5555-5555-555555555555',
    invoice_number: 'INV-005',
    user_id: '410544b2-4001-4271-9855-fec4b6a6442a',
    shipment_id: null,
    description: 'Documentation & storage services',
    amount: 345.77,
    status: 'pending' as const,
    issued_date: '2026-03-05',
  },
];

const customers = users.map((u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  image_url: '/customers/evil-rabbit.png',
}));

const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
];

export { users, vessels, vesselSchedules, shippingRates, shipments, invoices, customers, revenue };
