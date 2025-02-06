export interface Asset {
  id: string;
  name: string;
  type: string;
  serial_number: string;
  status: string;
  purchase_date: string;
  purchase_price: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface Assignment {
  id: string;
  asset_id: string;
  employee_id: string;
  assigned_date: string;
  return_date: string | null;
  notes: string;
  asset: Asset;
  employee: Employee;
}