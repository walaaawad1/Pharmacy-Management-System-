
import React, { useState, useEffect, useCallback } from 'react';
import { Medicine, Sale, Page, InvoiceItem } from './types';
import { ICONS, COLORS } from './constants';


const SidebarItem: React.FC<{ 
  label: string; 
  icon: React.ReactNode; 
  active: boolean; 
  onClick: () => void 
}> = ({ label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 space-x-reverse px-6 py-4 transition-all duration-300 ${
      active 
        ? 'bg-navy text-white border-l-4 border-peach shadow-lg transform translate-x-1' 
        : 'text-gray-400 hover:bg-white/10 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-semibold">{label}</span>
  </button>
);

// --- Main App ---

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  // Initialize data from LocalStorage
  useEffect(() => {
    const savedMedicines = localStorage.getItem('pharma_medicines');
    const savedSales = localStorage.getItem('pharma_sales');
    
    if (savedMedicines) setMedicines(JSON.parse(savedMedicines));
    if (savedSales) setSales(JSON.parse(savedSales));
    
    if (!savedMedicines) {
      const initial: Medicine[] = [
        { id: '1', name: 'باندول إكسترا', price: 15.5, quantity: 50, expiryDate: '2025-12-01' },
        { id: '2', name: 'أوجمنتين 1جم', price: 85.0, quantity: 5, expiryDate: '2024-06-15' },
        { id: '3', name: 'أوميبرازول', price: 22.0, quantity: 120, expiryDate: '2026-01-20' },
      ];
      setMedicines(initial);
      localStorage.setItem('pharma_medicines', JSON.stringify(initial));
    }
  }, []);

  // Persist data
  useEffect(() => {
    localStorage.setItem('pharma_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('pharma_sales', JSON.stringify(sales));
  }, [sales]);

  const handleAddMedicine = (med: Medicine) => {
    setMedicines(prev => [...prev, med]);
  };

  const handleUpdateMedicine = (updated: Medicine) => {
    setMedicines(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  const handleAddSale = (sale: Sale) => {
    setSales(prev => [...prev, sale]);
    setMedicines(prevMeds => prevMeds.map(med => {
      const soldItem = sale.items.find(item => item.medicineId === med.id);
      if (soldItem) {
        return { ...med, quantity: med.quantity - soldItem.quantity };
      }
      return med;
    }));
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-transparent overflow-hidden font-cairo">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-white flex-shrink-0 flex flex-col no-print border-l border-white/10 z-20">
        <div className="p-8 text-center border-b border-white/5">
          <h1 className="text-2xl font-black text-peach tracking-wider">PHARMA<span className="text-primaryGreen">FLOW</span></h1>
          <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">نظام إدارة الصيدلية الذكي</p>
        </div>
        
        <nav className="mt-8 flex-grow">
          <SidebarItem 
            label="لوحة التحكم" 
            icon={<ICONS.Dashboard />} 
            active={currentPage === 'dashboard'} 
            onClick={() => setCurrentPage('dashboard')} 
          />
          <SidebarItem 
            label="إدارة الأدوية" 
            icon={<ICONS.Medicines />} 
            active={currentPage === 'medicines'} 
            onClick={() => setCurrentPage('medicines')} 
          />
          <SidebarItem 
            label="إصدار فاتورة" 
            icon={<ICONS.Billing />} 
            active={currentPage === 'billing'} 
            onClick={() => setCurrentPage('billing')} 
          />
          <SidebarItem 
            label="التقارير" 
            icon={<ICONS.Reports />} 
            active={currentPage === 'reports'} 
            onClick={() => setCurrentPage('reports')} 
          />
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="w-full py-2 text-sm text-gray-400 hover:text-peach flex items-center justify-center gap-2 transition-colors"
          >
            خروج آمن
          </button>
        </div>
      </aside>

      {/* الرئيسية */}
      <main className="flex-grow overflow-y-auto p-4 md:p-8 relative">
        <header className="flex justify-between items-center mb-8 no-print bg-white/40 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-navy rounded-2xl flex items-center justify-center text-peach shadow-lg">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
               </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-navy leading-none mb-1">PHARMAFLOW</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                {currentPage === 'dashboard' && 'نظام الإدارة - لوحة التحكم'}
                {currentPage === 'medicines' && 'نظام الإدارة - المخزون'}
                {currentPage === 'billing' && 'نظام الإدارة - المبيعات'}
                {currentPage === 'reports' && 'نظام الإدارة - التقارير'}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/80 p-2 px-4 rounded-2xl shadow-sm border border-white flex items-center gap-3">
              <div className="w-8 h-8 bg-primaryGreen text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md shadow-primaryGreen/20">
                DR
              </div>
              <div className="hidden md:block leading-tight text-right">
                <p className="text-xs font-black text-navy">د. أحمد خالد</p>
                <p className="text-[10px] text-gray-400">مدير النظام</p>
              </div>
            </div>
          </div>
        </header>

        <div className="animate-fade-in transition-all duration-500">
          {currentPage === 'dashboard' && (
            <DashboardPage 
              medicines={medicines} 
              sales={sales} 
            />
          )}
          {currentPage === 'medicines' && (
            <MedicinesPage 
              medicines={medicines} 
              onAdd={handleAddMedicine} 
              onUpdate={handleUpdateMedicine} 
              onDelete={handleDeleteMedicine} 
            />
          )}
          {currentPage === 'billing' && (
            <BillingPage 
              medicines={medicines} 
              onAddSale={handleAddSale} 
            />
          )}
          {currentPage === 'reports' && <ReportsPage sales={sales} />}
        </div>
      </main>
    </div>
  );
};

// --- صفحة التسجيل ---
const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden p-10 space-y-8 card-3d border border-white">
        <div className="text-center">
          <div className="w-20 h-20 bg-navy rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-2xl rotate-3">
             <span className="text-peach text-3xl font-black">PF</span>
          </div>
          <h1 className="text-4xl font-black text-navy tracking-tighter">PHARMA<span className="text-primaryGreen">FLOW</span></h1>
          <p className="text-gray-400 mt-2 text-sm font-bold">بوابة إدارة النظام</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input 
            type="email" 
            required
            className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primaryGreen focus:outline-none font-bold"
            placeholder="admin@pharmaflow.sa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            required
            className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primaryGreen focus:outline-none font-bold"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full py-5 bg-navy text-white rounded-2xl font-black shadow-2xl shadow-navy/30 hover:bg-black transition-all">
            دخول المسؤول
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Dashboard Page ---
const DashboardPage: React.FC<{ 
  medicines: Medicine[], 
  sales: Sale[]
}> = ({ medicines, sales }) => {
  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(s => s.date.startsWith(today));
  const totalToday = todaySales.reduce((acc, s) => acc + s.totalAmount, 0);
  const lowStock = medicines.filter(m => m.quantity <= 10);
  const expiringSoon = medicines.filter(m => {
    const expiry = new Date(m.expiryDate);
    const threeMonths = new Date();
    threeMonths.setMonth(threeMonths.getMonth() + 3);
    return expiry < threeMonths;
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="إجمالي الأصناف" value={medicines.length} icon={<ICONS.Medicines />} color="navy" />
        <StatCard title="مبيعات اليوم" value={`${totalToday.toFixed(2)} ر.س`} icon={<ICONS.Billing />} color="primaryGreen" />
        <StatCard title="نواقص حرجة" value={lowStock.length} icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} color="orange-600" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StockTable title="تحذيرات المخزون" items={lowStock} />
        <ExpiryTable title="تواريخ الصلاحية" items={expiringSoon} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-white card-3d relative overflow-hidden group">
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-gray-400 text-xs font-black uppercase mb-1">{title}</p>
        <h3 className={`text-3xl font-black text-${color} tracking-tighter`}>{value}</h3>
      </div>
      <div className={`p-4 bg-${color} text-white rounded-2xl shadow-xl`}>{icon}</div>
    </div>
  </div>
);

const StockTable = ({ title, items }: any) => (
  <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-white">
    <h4 className="text-xl font-black text-navy mb-8">{title}</h4>
    <div className="space-y-4">
      {items.length > 0 ? items.map((med: any) => (
        <div key={med.id} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white hover:bg-white transition-colors">
          <span className="font-bold text-navy">{med.name}</span>
          <span className="font-black text-navy">{med.quantity} <span className="text-[10px]">وحدة</span></span>
        </div>
      )) : <div className="text-center py-10 opacity-30 italic font-bold">المخزون مكتمل</div>}
    </div>
  </div>
);

const ExpiryTable = ({ title, items }: any) => (
  <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-white">
    <h4 className="text-xl font-black text-navy mb-8">{title}</h4>
    <div className="space-y-4">
      {items.length > 0 ? items.map((med: any) => (
        <div key={med.id} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white hover:bg-white transition-colors">
          <span className="font-bold text-navy">{med.name}</span>
          <span className="bg-red-50 text-red-600 px-4 py-1 rounded-xl font-black font-mono text-xs">{med.expiryDate}</span>
        </div>
      )) : <div className="text-center py-10 opacity-30 italic font-bold">جميع الأدوية صالحة</div>}
    </div>
  </div>
);

// --- صفحة الادوية ---
const MedicinesPage: React.FC<{ 
  medicines: Medicine[], 
  onAdd: (m: Medicine) => void,
  onUpdate: (m: Medicine) => void,
  onDelete: (id: string) => void
}> = ({ medicines, onAdd, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = medicines.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const med: Medicine = {
      id: editingMed ? editingMed.id : Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      quantity: parseInt(formData.get('quantity') as string),
      expiryDate: formData.get('expiryDate') as string,
    };
    if (editingMed) onUpdate(med);
    else onAdd(med);
    setShowModal(false);
    setEditingMed(null);
  };

  return (
    <div className="space-y-6 pb-20 no-print">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/40 backdrop-blur-md p-4 rounded-[2rem] border border-white shadow-sm">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="ابحث عن اسم الدواء..." 
            className="w-full pl-4 pr-12 py-4 rounded-2xl bg-white border-transparent focus:ring-2 focus:ring-primaryGreen shadow-inner focus:outline-none transition-all font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setShowModal(true); setEditingMed(null); }}
          className="bg-navy text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-navy/20 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
        >
          <ICONS.Add /> إضافة دواء
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-sm border border-white overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-navy/5 text-navy font-black text-xs uppercase tracking-widest">
            <tr>
              <th className="px-8 py-6">المنتج</th>
              <th className="px-8 py-6">السعر</th>
              <th className="px-8 py-6">المخزون</th>
              <th className="px-8 py-6 text-center">الصلاحية</th>
              <th className="px-8 py-6 text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/50">
            {filtered.map(med => (
              <tr key={med.id} className="hover:bg-white/50 transition-colors group">
                <td className="px-8 py-5 font-black text-navy">{med.name}</td>
                <td className="px-8 py-5 font-mono text-primaryGreen font-black">{med.price.toFixed(2)} ر.س</td>
                <td className="px-8 py-5 font-black font-mono">{med.quantity}</td>
                <td className="px-8 py-5 text-center">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black font-mono ${new Date(med.expiryDate) < new Date() ? 'bg-red-600 text-white' : 'bg-navy/10 text-navy'}`}>
                    {med.expiryDate}
                  </span>
                </td>
                <td className="px-8 py-5 text-left">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingMed(med); setShowModal(true); }} className="p-2 bg-navy/5 text-navy hover:bg-navy hover:text-white rounded-xl transition-all font-bold">تعديل</button>
                    <button onClick={() => onDelete(med.id)} className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold">حذف</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 border border-white">
            <h3 className="text-3xl font-black text-navy mb-8">{editingMed ? 'تعديل الصنف' : 'صنف جديد'}</h3>
            <form onSubmit={handleSave} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">الاسم</label>
                <input name="name" defaultValue={editingMed?.name} required className="w-full px-5 py-4 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-primaryGreen focus:outline-none font-bold" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">السعر</label>
                <input name="price" type="number" step="0.01" defaultValue={editingMed?.price} required className="w-full px-5 py-4 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-primaryGreen focus:outline-none font-bold" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">الكمية</label>
                <input name="quantity" type="number" defaultValue={editingMed?.quantity} required className="w-full px-5 py-4 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-primaryGreen focus:outline-none font-bold" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">الصلاحية</label>
                <input name="expiryDate" type="date" defaultValue={editingMed?.expiryDate} required className="w-full px-5 py-4 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-primaryGreen focus:outline-none font-bold" />
              </div>
              <div className="col-span-2 flex gap-4 mt-6">
                <button type="submit" className="flex-grow py-5 bg-navy text-white font-black rounded-2xl shadow-2xl transition-all hover:-translate-y-1">حفظ</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-5 bg-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-200">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Billing Page ---
const BillingPage: React.FC<{ 
  medicines: Medicine[], 
  onAddSale: (s: Sale) => void 
}> = ({ medicines, onAddSale }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<InvoiceItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const filtered = medicines.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) && m.quantity > 0);

  const addToCart = (med: Medicine) => {
    const existing = cart.find(item => item.medicineId === med.id);
    if (existing) {
      if (existing.quantity < med.quantity) {
        setCart(prev => prev.map(item => item.medicineId === med.id ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price } : item));
      }
    } else {
      setCart(prev => [...prev, { medicineId: med.id, name: med.name, price: med.price, quantity: 1, total: med.price }]);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const sale: Sale = {
      id: Math.floor(100000 + Math.random() * 900000).toString(),
      date: new Date().toISOString(),
      items: [...cart],
      totalAmount: cart.reduce((acc, i) => acc + i.total, 0),
      customerName: customerName || 'عميل نقدي'
    };
    onAddSale(sale);
    setLastSale(sale);
    setShowInvoiceModal(true);
    setCart([]);
    setCustomerName('');
  };

  const handlePrint = () => {
    window.print();
    setShowInvoiceModal(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20 no-print">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white/40 backdrop-blur-md p-4 rounded-[2rem] border border-white shadow-sm">
          <input 
            type="text" 
            placeholder="ابحث عن الدواء لإضافته..." 
            className="w-full px-6 py-4 rounded-2xl bg-white border-transparent focus:ring-2 focus:ring-primaryGreen shadow-inner focus:outline-none transition-all font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(med => (
            <button key={med.id} onClick={() => addToCart(med)} className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-white text-right hover:scale-[1.02] transition-all shadow-sm group">
              <h5 className="font-black text-navy text-lg">{med.name}</h5>
              <div className="flex justify-between items-center mt-3">
                <span className="text-primaryGreen font-black font-mono">{med.price.toFixed(2)} ر.س</span>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">المتوفر: {med.quantity}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-navy text-white p-8 rounded-[3rem] shadow-2xl flex flex-col h-fit sticky top-8">
        <h4 className="text-2xl font-black mb-8 border-b border-white/10 pb-4">السلة</h4>
        <input 
          type="text"
          className="w-full bg-white/10 border-none rounded-2xl px-4 py-3 text-sm focus:ring-1 focus:ring-peach placeholder-white/20 mb-6 font-bold"
          placeholder="اسم العميل..."
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <div className="flex-grow space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {cart.map(item => (
            <div key={item.medicineId} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
              <div>
                <p className="font-bold text-sm">{item.name}</p>
                <p className="text-[10px] text-gray-400">{item.quantity} x {item.price.toFixed(2)}</p>
              </div>
              <p className="font-black font-mono text-peach">{item.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 space-y-6">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-400">الإجمالي</span>
            <span className="text-4xl font-black text-peach tracking-tighter">{cart.reduce((acc, i) => acc + i.total, 0).toFixed(2)} <span className="text-xs">ر.س</span></span>
          </div>
          <button 
            onClick={handleCheckout} 
            disabled={cart.length === 0}
            className="w-full py-5 bg-primaryGreen text-white rounded-[2rem] font-black shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
          >
            تأكيد العملية
          </button>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && lastSale && (
        <div className="fixed inset-0 bg-navy/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-10">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-black text-navy">PHARMAFLOW</h2>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1 font-bold">إيصال استلام إلكتروني</p>
              </div>
              <div className="flex justify-between mb-8 pb-4 border-b border-gray-100 text-sm">
                <div>
                  <p className="font-bold text-gray-400">العميل</p>
                  <p className="font-bold text-navy">{lastSale.customerName}</p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-400">رقم الفاتورة</p>
                  <p className="font-bold text-navy font-mono">#{lastSale.id}</p>
                </div>
              </div>
              <div className="space-y-4 mb-8 max-h-48 overflow-y-auto">
                {lastSale.items.map(item => (
                  <div key={item.medicineId} className="flex justify-between items-center text-sm">
                    <span className="font-bold text-navy">{item.name} <span className="text-gray-400 font-normal">×{item.quantity}</span></span>
                    <span className="font-mono font-bold">{item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="bg-primaryGreen/5 rounded-2xl p-6 border border-primaryGreen/10 flex justify-between items-center">
                <span className="text-gray-500 font-bold">الإجمالي النهائي</span>
                <span className="text-3xl font-black text-primaryGreen font-mono">{lastSale.totalAmount.toFixed(2)} <span className="text-xs">ر.س</span></span>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={handlePrint} className="flex-grow py-4 bg-primaryGreen text-white rounded-2xl font-black shadow-xl transition-all hover:-translate-y-1">طباعة الآن</button>
                <button onClick={() => setShowInvoiceModal(false)} className="px-8 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black transition-all hover:bg-gray-200">إغلاق</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Print Section */}
      <div className="hidden print-only fixed inset-0 bg-white p-12 text-black text-right dir-rtl">
        <div className="text-center mb-10 border-b-2 border-black pb-4">
          <h2 className="text-5xl font-black">PHARMAFLOW</h2>
          <p className="text-sm mt-2 font-bold italic">نظام إدارة الصيدلية الذكي - فاتورة مبيعات</p>
        </div>
        <div className="flex justify-between mb-10">
          <div>
            <p className="font-bold text-lg">العميل: {lastSale?.customerName}</p>
            <p className="text-gray-600">التاريخ: {new Date(lastSale?.date || '').toLocaleString('ar-SA')}</p>
          </div>
          <div className="text-left">
            <p className="font-bold text-lg">فاتورة رقم: #{lastSale?.id}</p>
          </div>
        </div>
        <table className="w-full text-right mb-10 border-collapse">
          <thead className="border-b-2 border-black">
            <tr>
              <th className="py-2">الصنف</th>
              <th className="py-2">الكمية</th>
              <th className="py-2">سعر الوحدة</th>
              <th className="py-2">المجموع</th>
            </tr>
          </thead>
          <tbody>
            {lastSale?.items.map(item => (
              <tr key={item.medicineId} className="border-b">
                <td className="py-3 font-bold">{item.name}</td>
                <td className="py-3">{item.quantity}</td>
                <td className="py-3 font-mono">{item.price.toFixed(2)}</td>
                <td className="py-3 font-bold font-mono">{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-left text-3xl font-black mt-10">
          المجموع الإجمالي: {lastSale?.totalAmount.toFixed(2)} ر.س
        </div>
        <div className="mt-40 text-center text-xs text-gray-400 italic">شكراً لثقتكم - نتمنى لكم دوام الصحة والعافية</div>
      </div>
    </div>
  );
};

// --- Reports Page ---
const ReportsPage: React.FC<{ sales: Sale[] }> = ({ sales }) => {
  const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  return (
    <div className="space-y-8 pb-20 no-print">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-white flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs font-black uppercase mb-1">الإيرادات</p>
            <h3 className="text-4xl font-black text-primaryGreen font-mono">{totalRevenue.toFixed(2)} ر.س</h3>
          </div>
          <div className="p-4 bg-primaryGreen/10 text-primaryGreen rounded-2xl"><ICONS.Billing /></div>
        </div>
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-white flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs font-black uppercase mb-1">الفواتير</p>
            <h3 className="text-4xl font-black text-navy tracking-tighter">{sales.length}</h3>
          </div>
          <div className="p-4 bg-navy/10 text-navy rounded-2xl"><ICONS.Reports /></div>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-sm border border-white overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">المعرف</th>
              <th className="px-8 py-5">التاريخ</th>
              <th className="px-8 py-5">العميل</th>
              <th className="px-8 py-5 text-left">المجموع</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/50">
            {[...sales].reverse().map(sale => (
              <tr key={sale.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-8 py-5 font-mono text-xs text-gray-400">#{sale.id}</td>
                <td className="px-8 py-5 font-bold text-navy text-sm">{new Date(sale.date).toLocaleDateString('ar-SA')}</td>
                <td className="px-8 py-5 text-navy font-bold">{sale.customerName}</td>
                <td className="px-8 py-5 text-left font-black font-mono text-primaryGreen">{sale.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
