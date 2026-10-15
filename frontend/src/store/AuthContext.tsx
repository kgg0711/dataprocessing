import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import * as api from '../api';
import type { TasteId, User } from '../types';
import { readJSON, writeJSON } from '../utils/storage';

const USER_KEY = 'arti.user';
const ADMIN_KEY = 'arti.admin';

interface AuthValue {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, nickname: string) => Promise<User>;
  logout: () => void;
  updateTastes: (tastes: TasteId[]) => Promise<void>;
  isAdmin: boolean;
  adminLogin: (id: string, password: string) => Promise<void>;
  adminLogout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => readJSON<User | null>('local', USER_KEY, null));
  const [isAdmin, setIsAdmin] = useState(() => readJSON('session', ADMIN_KEY, false));

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    writeJSON('local', USER_KEY, u);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      async login(email, password) {
        const u = await api.login(email, password);
        setUser(u);
        return u;
      },
      async signup(email, password, nickname) {
        const u = await api.signup(email, password, nickname);
        setUser(u);
        return u;
      },
      logout: () => setUser(null),
      async updateTastes(tastes) {
        if (!user) return;
        await api.saveTastes(user.id, tastes);
        setUser({ ...user, tastes });
      },
      isAdmin,
      async adminLogin(id, password) {
        await api.adminLogin(id, password);
        setIsAdmin(true);
        writeJSON('session', ADMIN_KEY, true);
      },
      adminLogout() {
        setIsAdmin(false);
        writeJSON('session', ADMIN_KEY, null);
      },
    }),
    [user, isAdmin, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
