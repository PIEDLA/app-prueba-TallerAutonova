import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  ownerName: string;
  ownerPhone: string;
  isActive: boolean;
  createdAt: string;
}

export interface VehicleObservation {
  id: string;
  vehicleId: string;
  observation: string;
  mechanicName: string;
  date: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  quantity: number;
  minStock: number;
}

export interface Appointment {
  id: string;
  vehicleId: string;
  clientName: string;
  date: string;
  time: string;
  description: string;
  mechanicId?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  observations?: string[];
}

interface DataContextType {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  observations: VehicleObservation[];
  addObservation: (observation: Omit<VehicleObservation, 'id'>) => void;
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, quantity: number) => void;
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock initial data
const initialVehicles: Vehicle[] = [
  {
    id: '1',
    plate: 'ABC-123',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
    type: 'Sedán',
    ownerName: 'Juan Pérez',
    ownerPhone: '555-1234',
    isActive: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    plate: 'XYZ-789',
    brand: 'Honda',
    model: 'Civic',
    year: 2019,
    type: 'Sedán',
    ownerName: 'María García',
    ownerPhone: '555-5678',
    isActive: true,
    createdAt: '2024-02-20',
  },
];

const initialObservations: VehicleObservation[] = [
  {
    id: '1',
    vehicleId: '1',
    observation: 'Cambio de aceite realizado. Motor en buen estado.',
    mechanicName: 'Carlos Rodríguez',
    date: '2024-02-01',
  },
  {
    id: '2',
    vehicleId: '1',
    observation: 'Revisión de frenos. Se reemplazaron pastillas delanteras.',
    mechanicName: 'Luis Martínez',
    date: '2024-02-15',
  },
];

const initialInventory: InventoryItem[] = [
  { id: '1', code: 'FIL-001', name: 'Filtro de aceite', quantity: 15, minStock: 10 },
  { id: '2', code: 'FIL-002', name: 'Filtro de aire', quantity: 8, minStock: 10 },
  { id: '3', code: 'PAD-001', name: 'Pastillas de freno', quantity: 5, minStock: 8 },
  { id: '4', code: 'OIL-001', name: 'Aceite 10W-40', quantity: 25, minStock: 15 },
  { id: '5', code: 'BAT-001', name: 'Batería 12V', quantity: 3, minStock: 5 },
];

const initialAppointments: Appointment[] = [
  {
    id: '1',
    vehicleId: '1',
    clientName: 'Juan Pérez',
    date: '2026-03-05',
    time: '10:00',
    description: 'Mantenimiento preventivo',
    mechanicId: '3',
    status: 'pending',
    observations: [],
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [observations, setObservations] = useState<VehicleObservation[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedVehicles = localStorage.getItem('autonova_vehicles');
    const savedObservations = localStorage.getItem('autonova_observations');
    const savedInventory = localStorage.getItem('autonova_inventory');
    const savedAppointments = localStorage.getItem('autonova_appointments');

    setVehicles(savedVehicles ? JSON.parse(savedVehicles) : initialVehicles);
    setObservations(savedObservations ? JSON.parse(savedObservations) : initialObservations);
    setInventory(savedInventory ? JSON.parse(savedInventory) : initialInventory);
    setAppointments(savedAppointments ? JSON.parse(savedAppointments) : initialAppointments);
  }, []);

  const addVehicle = (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    localStorage.setItem('autonova_vehicles', JSON.stringify(updatedVehicles));
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    const updatedVehicles = vehicles.map((v) =>
      v.id === id ? { ...v, ...updates } : v
    );
    setVehicles(updatedVehicles);
    localStorage.setItem('autonova_vehicles', JSON.stringify(updatedVehicles));
  };

  const addObservation = (observation: Omit<VehicleObservation, 'id'>) => {
    const newObservation: VehicleObservation = {
      ...observation,
      id: Date.now().toString(),
    };
    const updatedObservations = [...observations, newObservation];
    setObservations(updatedObservations);
    localStorage.setItem('autonova_observations', JSON.stringify(updatedObservations));
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    // Validar código único
    const codeExists = inventory.some((i) => i.code.toLowerCase() === item.code.toLowerCase());
    if (codeExists) {
      throw new Error('El código del repuesto ya existe');
    }

    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
    };
    const updatedInventory = [...inventory, newItem];
    setInventory(updatedInventory);
    localStorage.setItem('autonova_inventory', JSON.stringify(updatedInventory));
  };

  const updateInventoryItem = (id: string, quantity: number) => {
    const updatedInventory = inventory.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setInventory(updatedInventory);
    localStorage.setItem('autonova_inventory', JSON.stringify(updatedInventory));
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    localStorage.setItem('autonova_appointments', JSON.stringify(updatedAppointments));
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    const updatedAppointments = appointments.map((a) =>
      a.id === id ? { ...a, ...updates } : a
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('autonova_appointments', JSON.stringify(updatedAppointments));
  };

  return (
    <DataContext.Provider
      value={{
        vehicles,
        addVehicle,
        updateVehicle,
        observations,
        addObservation,
        inventory,
        addInventoryItem,
        updateInventoryItem,
        appointments,
        addAppointment,
        updateAppointment,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}