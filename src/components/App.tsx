import { useState, useEffect, useMemo } from 'react';
import { 
  Package, ArrowDownToLine, Send, Users, Mic, Route, MessageCircle, Cpu, Smartphone, Globe, Database, Loader2, LayoutDashboard, Search
} from 'lucide-react';

// API helper
import { apiFetch } from '../lib/api';
import { callAI } from '../lib/openrouter';

// Import modular components
import SidebarItem from './SidebarItem';
import DesktopDashboardView from './DesktopDashboardView';
import CrudView from './CrudView';
import VoicePickingView from './VoicePickingView';
import RoutesView from './RoutesView';
import WhatsAppAgentView from './WhatsAppAgentView';
import SapIntegrationView from './SapIntegrationView';
import MobileAppSimulator from './MobileAppSimulator';

// initial mock/fallback data matching backend seed database
const INITIAL_PRODUCTS = [
  { id: 1, sku: 'SKU-001', name: 'Palet Europeo 120x80', category: 'Palets', stock: 450, minStock: 100, location: 'A-01-01', price: 12.50 },
  { id: 2, sku: 'SKU-002', name: 'Caja Cartón 60x40x40', category: 'Embalaje', stock: 2500, minStock: 500, location: 'A-02-03', price: 1.20 },
  { id: 3, sku: 'SKU-003', name: 'Film Estirable 500mm', category: 'Embalaje', stock: 180, minStock: 50, location: 'B-05-02', price: 18.90 },
  { id: 4, sku: 'SKU-004', name: 'Etiquetas Térmicas 100x150', category: 'Etiquetado', stock: 95, minStock: 30, location: 'B-03-01', price: 25.00 },
  { id: 5, sku: 'SKU-005', name: 'Cinta Adhesiva 50mm', category: 'Embalaje', stock: 8, minStock: 20, location: 'A-04-02', price: 2.50 },
  { id: 6, sku: 'SKU-006', name: 'Transpaleta Manual 2500kg', category: 'Equipamiento', stock: 12, minStock: 5, location: 'C-01-01', price: 285.00 },
  { id: 8, sku: 'SKU-008', name: 'Contenedor Plástico 60L', category: 'Almacenaje', stock: 320, minStock: 100, location: 'B-08-03', price: 15.50 },
  { id: 9, sku: 'SKU-009', name: 'Guantes Trabajo Talla L', category: 'EPI', stock: 145, minStock: 50, location: 'A-06-04', price: 28.00 },
  { id: 11, sku: 'SKU-011', name: 'Scanner Código Barras', category: 'Tecnología', stock: 25, minStock: 10, location: 'C-05-02', price: 85.00 },
  { id: 12, sku: 'SKU-012', name: 'PDA Industrial Zebra', category: 'Tecnología', stock: 18, minStock: 8, location: 'C-05-03', price: 1250.00 }
];

const INITIAL_CUSTOMERS = [
  { id: 1, code: 'CUST001', name: 'Mercadona S.A.', type: 'Cliente', email: 'pedidos@mercadona.es', phone: '+34 900 123 456', status: 'Activo' },
  { id: 2, code: 'CUST002', name: 'Carrefour España', type: 'Cliente', email: 'compras@carrefour.es', phone: '+34 900 234 567', status: 'Activo' },
  { id: 3, code: 'CUST003', name: 'El Corte Inglés', type: 'Cliente', email: 'logistica@elcorteingles.es', phone: '+34 900 345 678', status: 'Activo' },
  { id: 4, code: 'SUPP001', name: 'Distribuciones García SL', type: 'Proveedor', email: 'ventas@distgarcia.com', phone: '+34 963 123 456', status: 'Activo' },
  { id: 5, code: 'SUPP002', name: 'Logística Martínez', type: 'Proveedor', email: 'info@logmartinez.es', phone: '+34 932 234 567', status: 'Activo' }
];

const INITIAL_ORDERS = [
  { id: 1, orderNumber: 'PED-2026-001', customerName: 'Mercadona S.A.', status: 'Pendiente', priority: 'high', totalItems: 3, totalValue: 1850.50 },
  { id: 2, orderNumber: 'PED-2026-002', customerName: 'Carrefour España', status: 'Picking', priority: 'normal', totalItems: 5, totalValue: 3250.00 },
  { id: 3, orderNumber: 'PED-2026-003', customerName: 'El Corte Inglés', status: 'Pendiente', priority: 'normal', totalItems: 2, totalValue: 890.00 },
  { id: 4, orderNumber: 'PED-2026-004', customerName: 'Mercadona S.A.', status: 'Packing', priority: 'high', totalItems: 4, totalValue: 2100.00 },
  { id: 5, orderNumber: 'PED-2026-005', customerName: 'Carrefour España', status: 'Despachado', priority: 'normal', totalItems: 6, totalValue: 4500.00 },
  { id: 6, orderNumber: 'PED-2026-006', customerName: 'El Corte Inglés', status: 'Pendiente', priority: 'high', totalItems: 8, totalValue: 6750.00 },
  { id: 7, orderNumber: 'REC-2026-001', customerName: 'Distribuciones García SL', status: 'Pendiente', priority: 'normal', totalItems: 12, totalValue: 1450.00 },
  { id: 8, orderNumber: 'REC-2026-002', customerName: 'Logística Martínez', status: 'Completado', priority: 'normal', totalItems: 24, totalValue: 3800.00 }
];

const INITIAL_PICKING = [
  { id: 1, taskNumber: 'PICK-001', orderNumber: 'PED-2026-001', assignedTo: 'Carlos Ruiz', zone: 'A', status: 'Pendiente', totalItems: 3, pickedItems: 0 },
  { id: 2, taskNumber: 'PICK-002', orderNumber: 'PED-2026-002', assignedTo: 'María López', zone: 'B', status: 'En Proceso', totalItems: 5, pickedItems: 2 },
  { id: 3, taskNumber: 'PICK-003', orderNumber: 'PED-2026-003', assignedTo: 'Carlos Ruiz', zone: 'C', status: 'Pendiente', totalItems: 2, pickedItems: 0 }
];

const INITIAL_STAFF = [
  { id: 1, name: 'Juan García', role: 'Administrador', status: 'Activo', zone: 'Oficina' },
  { id: 2, name: 'María López', role: 'Operario', status: 'En Ruta', zone: 'Zona B' },
  { id: 3, name: 'Carlos Ruiz', role: 'Operario', status: 'Activo', zone: 'Zona A' },
  { id: 4, name: 'Ana Martínez', role: 'Operario', status: 'Inactivo', zone: 'Zona C' }
];

const INITIAL_WHATSAPP = [
  { id: 1, sender: 'Chofer - Luis (Transportista)', message: 'Hola, estoy llegando con el camión al muelle B. ¿Está libre?', time: '16:02', responseByAI: 'Hola Luis, sí, el muelle B está libre para descarga. Te espera el operario Carlos.' },
  { id: 2, sender: 'Supervisor - Ramón', message: 'Necesitamos reubicar los palets de la zona C a la A urgente.', time: '15:45', responseByAI: 'Mensaje recibido Ramón. Se han generado tareas prioritarias para el equipo.' }
];

const INITIAL_SAP_LOGS = [
  { id: 1, timestamp: '16:20:11', event: 'Sincronización de Stock SKU-001 exitosa', type: 'info' },
  { id: 2, timestamp: '16:15:34', event: 'SAP ERP importó orden de venta PED-2026-006', type: 'info' },
  { id: 3, timestamp: '16:00:22', event: 'Error temporal en conexión SAP RFC. Reintentando...', type: 'warning' }
];



const translations = {
  es: {
    dashboard: 'Panel General',
    inventory: 'Inventario & Stock',
    crm: 'Clientes & CRM',
    inOrders: 'Entradas (Inbounds)',
    outOrders: 'Salidas (Outbounds)',
    picking: 'Picking por Voz (IA)',
    routes: 'Rutas Internas',
    whatsapp: 'Agente WhatsApp AI',
    sap: 'SAP ERP Integration',
    users: 'Equipo y Operarios',
    search: 'Buscar en base de datos...',
    welcome: 'WarehouseFlow SGA',
    currentShift: 'Turno Activo · Muelles A, B y C Operativos',
    compRate: 'Tasa de Servicio',
    inToday: 'Recepciones Hoy',
    pendingDisp: 'Despachos Pdtes.',
    lowStock: 'Artículos Críticos',
    accuracy: 'Precisión Stock',
    activeOrders: 'Órdenes Activas',
    objective: 'Objetivo',
    add: 'Añadir',
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    actions: 'Acciones',
    welcomeAuth: 'Acceso WarehouseFlow',
    copyright: '© 2026 WarehouseFlow · WMS Enterprise Solution',
    viewMode: 'Modo de Vista',
    adminView: 'Administrador (Escritorio)',
    operatorView: 'Operario (Handheld PDA)'
  },
  en: {
    dashboard: 'Dashboard',
    inventory: 'Inventory & Stock',
    crm: 'CRM & Clients',
    inOrders: 'Inbound Orders',
    outOrders: 'Outbound Orders',
    picking: 'AI Voice Picking',
    routes: 'Internal Routes',
    whatsapp: 'WhatsApp AI Agent',
    sap: 'SAP ERP Integration',
    users: 'Team & Operators',
    search: 'Search database records...',
    welcome: 'WarehouseFlow WMS',
    currentShift: 'Active Shift · Docks A, B, and C Operational',
    compRate: 'Service Level',
    inToday: 'Inbounds Today',
    pendingDisp: 'Pending Shippings',
    lowStock: 'Critical Stock',
    accuracy: 'Stock Accuracy',
    activeOrders: 'Active Orders',
    objective: 'Target',
    add: 'Add New',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    actions: 'Actions',
    welcomeAuth: 'WarehouseFlow Login',
    copyright: '© 2026 WarehouseFlow · WMS Enterprise Solution',
    viewMode: 'View Mode',
    adminView: 'Manager (Desktop)',
    operatorView: 'Operator (Handheld PDA)'
  }
};

export default function App() {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Database status flag (connected to local sqlite vs offline mockup)
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [dbState, setDbState] = useState({
    products: INITIAL_PRODUCTS,
    customers: INITIAL_CUSTOMERS,
    orders: INITIAL_ORDERS,
    picking: INITIAL_PICKING,
    staff: INITIAL_STAFF,
    whatsapp: INITIAL_WHATSAPP,
    sapLogs: INITIAL_SAP_LOGS
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  

  
  const t = translations[lang];

  // API fetches with fallback logic
  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Products
      const prodJson = await apiFetch('/api/products');
      
      // 2. Fetch Customers
      const custJson = await apiFetch('/api/customers');
      
      // 3. Fetch Orders
      const orderJson = await apiFetch('/api/orders');

      // 4. Fetch Picking Tasks
      const pickJson = await apiFetch('/api/picking-tasks');

      setDbState(prev => ({
        ...prev,
        products: prodJson.success ? prodJson.data.items : prev.products,
        customers: custJson.success ? custJson.data.items : prev.customers,
        orders: orderJson.success ? orderJson.data.items : prev.orders,
        picking: pickJson.success ? pickJson.data.items : prev.picking
      }));
      setIsBackendConnected(true);
    } catch (e) {
      console.warn("Could not connect to SQLite backend. Operating in local fallback mode.", e);
      setIsBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter outOrders (client type or order status) and inOrders (supplier type)
  const filteredInOrders = useMemo(() => {
    return dbState.orders.filter(o => 
      o.orderNumber.startsWith('REC') || 
      o.customerName.toLowerCase().includes('garcía') || 
      o.customerName.toLowerCase().includes('martínez') || 
      o.customerName.toLowerCase().includes('distribuciones') ||
      o.customerName.toLowerCase().includes('logística')
    );
  }, [dbState.orders]);

  const filteredOutOrders = useMemo(() => {
    return dbState.orders.filter(o => !filteredInOrders.includes(o));
  }, [dbState.orders, filteredInOrders]);

  // Handle Saves / Creates
  const handleSave = async (entity: string, data: any, id: number | null) => {
    setLoading(true);
    try {
      let endpoint = '';
      if (entity === 'products') endpoint = '/products';
      else if (entity === 'customers') endpoint = '/customers';
      else if (entity === 'orders') endpoint = '/orders';
      else if (entity === 'picking') endpoint = '/picking-tasks';

      if (isBackendConnected && endpoint) {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api${endpoint}/${id}` : `/api${endpoint}`;
        
        // adapt data for backend schema if needed
        const payload = { ...data };
        if (entity === 'products') {
          payload.stock = Number(payload.stock || 0);
          payload.minStock = Number(payload.minStock || 10);
          payload.price = Number(payload.price || 0);
        } else if (entity === 'orders') {
          payload.totalItems = Number(payload.totalItems || 0);
          payload.totalValue = Number(payload.totalValue || 0);
        }

        const json = await apiFetch(url, {
          method,
          body: JSON.stringify(payload)
        });
        if (json.success) {
          loadData();
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error("API error while saving, updating locally", e);
    }

    // Local Fallback State Update
    if (id) {
      setDbState(prev => {
        const targetList = (prev as any)[entity];
        const updatedList = targetList.map((item: any) => item.id === id ? { ...item, ...data } : item);
        return { ...prev, [entity]: updatedList };
      });
    } else {
      const newId = Math.floor(1000 + Math.random() * 9000);
      setDbState(prev => {
        const targetList = (prev as any)[entity];
        return { ...prev, [entity]: [...targetList, { id: newId, ...data }] };
      });
    }
    setLoading(false);
  };

  // Handle Deletes
  const handleDelete = async (entity: string, id: number) => {
    setLoading(true);
    try {
      let endpoint = '';
      if (entity === 'products') endpoint = '/products';
      else if (entity === 'customers') endpoint = '/customers';
      else if (entity === 'orders') endpoint = '/orders';
      else if (entity === 'picking') endpoint = '/picking-tasks';

      if (isBackendConnected && endpoint) {
        const json = await apiFetch(`/api${endpoint}/${id}`, { method: 'DELETE' });
        if (json.success) {
          loadData();
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error("API error while deleting, removing locally", e);
    }

    setDbState(prev => {
      const targetList = (prev as any)[entity];
      return { ...prev, [entity]: targetList.filter((item: any) => item.id !== id) };
    });
    setLoading(false);
  };

  // AI Lote mock generator
  const handleInjectMock = async (entity: string) => {
    setLoading(true);
    try {
      // El frontend solo indica qué tipo de entidad quiere.
      // El backend decide el prompt, la API key y el modelo.
      const action =
        entity === 'products' ? 'generate_product' as const
        : entity === 'customers' ? 'generate_customer' as const
        : 'generate_order' as const;

      const res = await callAI(action);
      const cleanedJson = res.replace(/```json/g, '').replace(/```/g, '').trim();
      const generatedObj = JSON.parse(cleanedJson);
      
      await handleSave(entity, generatedObj, null);
    } catch (e) {
      // Manual mock data injection if no AI or parsing error
      if (entity === 'products') {
        const randomNum = Math.floor(100 + Math.random() * 900);
        await handleSave('products', {
          sku: `SKU-${randomNum}`,
          name: `Caja SKU-${randomNum} Premium`,
          category: 'Embalaje',
          stock: Math.floor(Math.random() * 500),
          minStock: 20,
          location: `B-0${Math.floor(1 + Math.random() * 8)}-0${Math.floor(1 + Math.random() * 5)}`,
          price: parseFloat((Math.random() * 30).toFixed(2))
        }, null);
      } else if (entity === 'customers') {
        const randomNum = Math.floor(10 + Math.random() * 89);
        await handleSave('customers', {
          code: `CUST0${randomNum}`,
          name: `Supermercados Alcampo S.A. ${randomNum}`,
          type: 'Cliente',
          email: `logistica@alcampo${randomNum}.es`,
          phone: '+34 900 777 888',
          status: 'Activo'
        }, null);
      } else if (entity === 'orders') {
        const randomNum = Math.floor(100 + Math.random() * 899);
        await handleSave('orders', {
          orderNumber: `PED-2026-${randomNum}`,
          customerName: 'Carrefour España',
          status: 'Pendiente',
          priority: 'normal',
          totalItems: Math.floor(1 + Math.random() * 15),
          totalValue: parseFloat((Math.random() * 4000).toFixed(2))
        }, null);
      }
    } finally {
      setLoading(false);
    }
  };



  // Global search filtering
  const searchFilteredProducts = useMemo(() => {
    return dbState.products.filter(p => 
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dbState.products, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top Banner / Navigation */}
      <header className="bg-[#050811] border-b border-slate-800/80 shrink-0 sticky top-0 z-40 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-600/30">
            <Package size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
              WarehouseFlow <span className="bg-indigo-900/60 text-indigo-300 text-[10px] uppercase font-bold py-0.5 px-2 rounded-full border border-indigo-700/50">SGA</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{t.currentShift}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-xs md:max-w-md hidden sm:block">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder={t.search} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-200 placeholder-slate-500 transition-all duration-200"
          />
        </div>

        <div className="flex items-center space-x-4">
          {/* SQLite DB Status Indicator */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0b0f19] border border-slate-800 rounded-lg text-xs font-semibold">
            <Database size={14} className={isBackendConnected ? 'text-emerald-500' : 'text-amber-500'} />
            <span className="hidden md:inline">{isBackendConnected ? 'Servidor SQLite' : 'Mock Offline'}</span>
          </div>

          {/* IA gestionada en el backend — sin configuración en cliente */}

          {/* View selector toggle */}
          <div className="flex bg-[#0b0f19] border border-slate-800 rounded-xl p-1 shrink-0">
            <button 
              onClick={() => setViewMode('desktop')} 
              className={`p-2 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Escritorio WMS"
            >
              <LayoutDashboard size={18} />
            </button>
            <button 
              onClick={() => setViewMode('mobile')} 
              className={`p-2 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Terminal PDA Móvil"
            >
              <Smartphone size={18} />
            </button>
          </div>

          {/* Language selection */}
          <button 
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="p-2.5 bg-[#0b0f19] border border-slate-800 rounded-xl hover:text-white text-slate-400 transition"
            title="Cambiar Idioma"
          >
            <Globe size={18} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {viewMode === 'desktop' ? (
          <>
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-[#050811] border-r border-slate-800/80 p-4 shrink-0 hidden md:flex flex-col justify-between overflow-y-auto">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-3">Módulos SGA</p>
                <SidebarItem icon={LayoutDashboard} label={t.dashboard} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                <SidebarItem icon={Package} label={t.inventory} active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} badge={dbState.products.length} />
                <SidebarItem icon={ArrowDownToLine} label={t.inOrders} active={activeTab === 'inbound'} onClick={() => setActiveTab('inbound')} badge={filteredInOrders.length} />
                <SidebarItem icon={Send} label={t.outOrders} active={activeTab === 'outbound'} onClick={() => setActiveTab('outbound')} badge={filteredOutOrders.length} />
                <SidebarItem icon={Mic} label={t.picking} active={activeTab === 'picking'} onClick={() => setActiveTab('picking')} />
                
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mt-6 mb-3">Inteligencia</p>
                <SidebarItem icon={Route} label={t.routes} active={activeTab === 'routes'} onClick={() => setActiveTab('routes')} />
                <SidebarItem icon={MessageCircle} label={t.whatsapp} active={activeTab === 'whatsapp'} onClick={() => setActiveTab('whatsapp')} />
                
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mt-6 mb-3">Configuración</p>
                <SidebarItem icon={Users} label={t.users} active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                <SidebarItem icon={Cpu} label={t.sap} active={activeTab === 'sap'} onClick={() => setActiveTab('sap')} />
              </div>
              
              <div className="p-4 bg-slate-900/20 rounded-2xl border border-slate-800 text-[10px] text-slate-500 font-semibold uppercase text-center tracking-wide">
                {t.copyright}
              </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#050811] border-t border-slate-800 h-16 flex justify-around items-center px-2 z-30">
              <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center p-2 ${activeTab === 'dashboard' ? 'text-indigo-400' : 'text-slate-500'}`}>
                <LayoutDashboard size={20} />
                <span className="text-[9px] mt-0.5">{t.dashboard}</span>
              </button>
              <button onClick={() => setActiveTab('inventory')} className={`flex flex-col items-center p-2 relative ${activeTab === 'inventory' ? 'text-indigo-400' : 'text-slate-500'}`}>
                <Package size={20} />
                <span className="text-[9px] mt-0.5">{t.inventory}</span>
              </button>
              <button onClick={() => setActiveTab('picking')} className={`flex flex-col items-center p-2 ${activeTab === 'picking' ? 'text-indigo-400' : 'text-slate-500'}`}>
                <Mic size={20} />
                <span className="text-[9px] mt-0.5">{t.picking}</span>
              </button>
              <button onClick={() => setActiveTab('whatsapp')} className={`flex flex-col items-center p-2 ${activeTab === 'whatsapp' ? 'text-indigo-400' : 'text-slate-500'}`}>
                <MessageCircle size={20} />
                <span className="text-[9px] mt-0.5">WhatsApp</span>
              </button>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 bg-[#0b0f19] overflow-y-auto p-6 md:p-8 pb-24 md:pb-8">
              {loading && (
                <div className="fixed inset-0 bg-[#050811]/45 backdrop-blur-xs flex items-center justify-center z-50">
                  <Loader2 className="animate-spin text-indigo-500" size={40} />
                </div>
              )}

              {activeTab === 'dashboard' && <DesktopDashboardView dbState={dbState} filteredIn={filteredInOrders} filteredOut={filteredOutOrders} t={t} />}
              {activeTab === 'inventory' && (
                <CrudView 
                  entityKey="products"
                  title="Inventario de Productos"
                  data={searchQuery ? searchFilteredProducts : dbState.products}
                  fields={[
                    { key: 'sku', label: 'SKU', type: 'text' },
                    { key: 'name', label: 'Nombre', type: 'text' },
                    { key: 'category', label: 'Categoría', type: 'select', options: ['Palets', 'Embalaje', 'Etiquetado', 'Equipamiento', 'Almacenaje', 'EPI', 'Tecnología', 'Herramientas'] },
                    { key: 'stock', label: 'Stock Actual', type: 'number' },
                    { key: 'minStock', label: 'Stock Mínimo', type: 'number' },
                    { key: 'location', label: 'Ubicación (Pasillo-Rack-Nivel)', type: 'text' },
                    { key: 'price', label: 'Precio (€)', type: 'number' }
                  ]}
                  onSave={(d: any, id: any) => handleSave('products', d, id)}
                  onDelete={(id: any) => handleDelete('products', id)}
                  onInject={() => handleInjectMock('products')}
                  t={t}
                />
              )}
              {activeTab === 'inbound' && (
                <CrudView 
                  entityKey="orders"
                  title="Recepciones - Entrada de Mercancía"
                  data={filteredInOrders}
                  fields={[
                    { key: 'orderNumber', label: 'Nº Orden de Entrada', type: 'text' },
                    { key: 'customerName', label: 'Proveedor', type: 'text' },
                    { key: 'status', label: 'Estado', type: 'select', options: ['Pendiente', 'Control de Calidad', 'Completado'] },
                    { key: 'totalItems', label: 'Bultos Totales', type: 'number' },
                    { key: 'totalValue', label: 'Valor (€)', type: 'number' }
                  ]}
                  onSave={(d: any, id: any) => handleSave('orders', d, id)}
                  onDelete={(id: any) => handleDelete('orders', id)}
                  onInject={() => handleInjectMock('orders')}
                  t={t}
                />
              )}
              {activeTab === 'outbound' && (
                <CrudView 
                  entityKey="orders"
                  title="Expediciones - Envío de Pedidos"
                  data={filteredOutOrders}
                  fields={[
                    { key: 'orderNumber', label: 'Nº Pedido Cliente', type: 'text' },
                    { key: 'customerName', label: 'Cliente', type: 'text' },
                    { key: 'status', label: 'Estado', type: 'select', options: ['Pendiente', 'Picking', 'Packing', 'Despachado', 'Completado'] },
                    { key: 'totalItems', label: 'Total Bultos', type: 'number' },
                    { key: 'totalValue', label: 'Valor (€)', type: 'number' }
                  ]}
                  onSave={(d: any, id: any) => handleSave('orders', d, id)}
                  onDelete={(id: any) => handleDelete('orders', id)}
                  onInject={() => handleInjectMock('orders')}
                  t={t}
                />
              )}
              {activeTab === 'picking' && <VoicePickingView pickingTasks={dbState.picking} products={dbState.products} />}
              {activeTab === 'routes' && <RoutesView />}
              {activeTab === 'whatsapp' && <WhatsAppAgentView chats={dbState.whatsapp} setDbState={setDbState} />}
              {activeTab === 'users' && (
                <CrudView 
                  entityKey="staff"
                  title="Personal & Turnos de Almacén"
                  data={dbState.staff}
                  fields={[
                    { key: 'name', label: 'Nombre Operario', type: 'text' },
                    { key: 'role', label: 'Rol', type: 'select', options: ['Administrador', 'Operario', 'Supervisor'] },
                    { key: 'zone', label: 'Zona Asignada', type: 'text' },
                    { key: 'status', label: 'Estado Operativo', type: 'select', options: ['Activo', 'Inactivo', 'En Ruta'] }
                  ]}
                  onSave={(d: any, id: any) => handleSave('staff', d, id)}
                  onDelete={(id: any) => handleDelete('staff', id)}
                  onInject={() => handleInjectMock('staff')}
                  t={t}
                />
              )}
              {activeTab === 'sap' && <SapIntegrationView logs={dbState.sapLogs} setDbState={setDbState} />}
            </main>
          </>
        ) : (
          /* Handheld PDA View Simulator */
          <main className="flex-1 bg-[#050811] flex justify-center items-center p-4 overflow-y-auto">
            <div className="w-full max-w-[390px] h-[750px] bg-[#0b0f19] rounded-[3rem] border-[10px] border-[#050811] relative overflow-hidden flex flex-col shadow-2xl shadow-indigo-950/20">
              
              {/* PDA Top Screen Header */}
              <div className="bg-indigo-600 text-white px-5 pt-7 pb-4 shrink-0 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Smartphone size={16} />
                  <span className="font-extrabold text-sm tracking-wider">PDA-02 Terminal</span>
                </div>
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
              </div>

              {/* PDA Emulator body */}
              <div className="flex-1 overflow-y-auto bg-[#0b0f19] flex flex-col">
                <MobileAppSimulator dbState={dbState} setDbState={setDbState} handleSave={handleSave} handleDelete={handleDelete} isConnected={isBackendConnected} />
              </div>
            </div>
          </main>
        )}
      </div>

      {/* La IA se configura en el backend (Render env vars) — sin modal en cliente */}
    </div>
  );
}
