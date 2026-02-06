
export interface Medicine {
  id: string;
  name: string;
  price: number;
  quantity: number;
  expiryDate: string;
  category?: string;
}

export interface InvoiceItem {
  medicineId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Sale {
  id: string;
  date: string;
  items: InvoiceItem[];
  totalAmount: number;
  customerName?: string;
}

export type Page = 'dashboard' | 'medicines' | 'billing' | 'reports';
