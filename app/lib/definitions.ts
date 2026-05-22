// This file contains type definitions for your database schema.
// It describes the shape of the data, and what data type each property should accept.

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
};

export type VesselType = 'Container Ship' | 'Bulk Carrier' | 'Tanker' | 'Cargo';
export type VesselStatus = 'En Route' | 'In Port' | 'Delayed' | 'Maintenance' | 'Active' | 'Inactive';

export type Vessel = {
  id: string;
  vessel_code: string;
  name: string;
  type: VesselType;
  captain_name: string;
  status: VesselStatus;
  created_at?: string;
};

export type VesselSchedule = {
  vessel_id: string;
  origin_port: string;
  destination_port: string;
  eta: string;
  is_active: boolean;
  created_at?: string;
};

export type ShippingRate = {
  id: string;
  destination_city: string;
  country: string;
  rate_per_kg: number;
  est_delivery_min_days: number;
  est_delivery_max_days: number;
};

export type Shipment = {
  id: string;
  tracking_number: string;
  user_id: string;
  destination_id: string;
  weight_kg: number;
  total_cost: number;
  created_at?: string;
};

export type InvoiceStatus = 'paid' | 'pending';

export type Invoice = {
  id: string;
  invoice_number: string;
  user_id: string;
  shipment_id: string | null;
  description: string | null;
  amount: number;
  status: InvoiceStatus;
  issued_date: string;
  created_at?: string;
};

// ================= COMPATIBILITY SHIMS & ALIASES =================

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
  invoice_number?: string;
  user_id?: string;
  description?: string | null;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: InvoiceStatus;
  invoice_number?: string;
  user_id?: string;
  shipment_id?: string | null;
  description?: string | null;
  issued_date?: string;
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};
