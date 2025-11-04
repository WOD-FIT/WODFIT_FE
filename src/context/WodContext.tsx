import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { WodEntry, SavedWod } from '@/types';

type WodContextType = {
  wods: WodEntry[];
  savedWods: SavedWod[];
  addWod: (wod: Omit<WodEntry, 'id'>) => void;
  updateWod: (id: string, updates: Partial<WodEntry>) => void;
  deleteWod: (id: string) => void;
  addSavedWod: (wod: Omit<SavedWod, 'id'>) => void;
  updateSavedWod: (id: string, updates: Partial<SavedWod>) => void;
  deleteSavedWod: (id: string) => void;
};

const WodContext = createContext<WodContextType | undefined>(undefined);

export const useWod = () => {
  const context = useContext(WodContext);
  if (context === undefined) {
    throw new Error('useWod must be used within a WodProvider');
  }
  return context;
};

type WodProviderProps = {
  children: ReactNode;
};

export const WodProvider = ({ children }: WodProviderProps) => {
  const [wods, setWods] = useState<WodEntry[]>([]);
  const [savedWods, setSavedWods] = useState<SavedWod[]>([]);

  const loadWods = useCallback(() => {
    try {
      const wodsData = localStorage.getItem('wods');
      const savedWodsData = localStorage.getItem('wod_admin_saved');

      if (wodsData) {
        const parsed = JSON.parse(wodsData);
        setWods(parsed);
      } else {
        setWods([]);
      }

      if (savedWodsData) {
        setSavedWods(JSON.parse(savedWodsData));
      } else {
        setSavedWods([]);
      }
    } catch {
      setWods([]);
      setSavedWods([]);
    }
  }, []);

  useEffect(() => {
    // 초기 로드
    loadWods();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wods') {
        loadWods();
      }
    };

    const handleWodsUpdated = () => {
      loadWods();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('wodsUpdated', handleWodsUpdated);

    // 페이지 포커스 시에도 최신 데이터 확인
    const handleFocus = () => {
      loadWods();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wodsUpdated', handleWodsUpdated);
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadWods]);

  const addWod = useCallback((wod: Omit<WodEntry, 'id'>) => {
    const newWod = { ...wod, id: crypto.randomUUID() };
    const existingWods = JSON.parse(localStorage.getItem('wods') || '[]');
    const updatedWods = [newWod, ...existingWods];

    localStorage.setItem('wods', JSON.stringify(updatedWods));
    setWods(updatedWods);
    window.dispatchEvent(new CustomEvent('wodsUpdated', { detail: updatedWods }));
  }, []);

  const updateWod = useCallback((id: string, updates: Partial<WodEntry>) => {
    setWods((prev) => {
      const updated = prev.map((wod) => (wod.id === id ? { ...wod, ...updates } : wod));
      localStorage.setItem('wods', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteWod = useCallback((id: string) => {
    setWods((prev) => {
      const updated = prev.filter((wod) => wod.id !== id);
      localStorage.setItem('wods', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addSavedWod = useCallback((wod: Omit<SavedWod, 'id'>) => {
    const newWod = { ...wod, id: crypto.randomUUID() };
    setSavedWods((prev) => {
      const updated = [newWod, ...prev];
      localStorage.setItem('wod_admin_saved', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateSavedWod = useCallback((id: string, updates: Partial<SavedWod>) => {
    setSavedWods((prev) => {
      const updated = prev.map((wod) => (wod.id === id ? { ...wod, ...updates } : wod));
      localStorage.setItem('wod_admin_saved', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteSavedWod = useCallback((id: string) => {
    setSavedWods((prev) => {
      const updated = prev.filter((wod) => wod.id !== id);
      localStorage.setItem('wod_admin_saved', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <WodContext.Provider
      value={{
        wods,
        savedWods,
        addWod,
        updateWod,
        deleteWod,
        addSavedWod,
        updateSavedWod,
        deleteSavedWod,
      }}
    >
      {children}
    </WodContext.Provider>
  );
};
