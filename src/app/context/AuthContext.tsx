import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'mechanic' | 'receptionist';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin',
    password: 'admin',
    role: 'admin',
    isActive: true,
  },
  {
    id: '2',
    name: 'Recepcionista',
    email: 'recep',
    password: '1234',
    role: 'receptionist',
    isActive: true,
  },
  {
    id: '3',
    name: 'Mecánico',
    email: 'mec',
    password: '1234',
    role: 'mechanic',
    isActive: true,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load users from localStorage or use initial users
    const savedUsers = localStorage.getItem('autonova_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem('autonova_users', JSON.stringify(initialUsers));
    }

    // Check if user is already logged in
    const savedUser = localStorage.getItem('autonova_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password && u.isActive
    );
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('autonova_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('autonova_user');
  };

  const addUser = (newUser: Omit<User, 'id'>) => {
    const user: User = {
      ...newUser,
      id: Date.now().toString(),
    };
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem('autonova_users', JSON.stringify(updatedUsers));
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const updatedUsers = users.map((u) =>
      u.id === id ? { ...u, ...updates } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('autonova_users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, users, addUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
