import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type WodEntry = {
  id: string;
  date: string;
  text: string;
  time: { min: string; sec: string };
  exercises: { name: string; weight: string }[];
  tags?: string[];
};

type SavedWod = {
  id: string;
  date: string;
  title: string;
  description: string;
};

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

  // localStorage에서 데이터 로드 함수
  const loadWods = () => {
    const wodsData = localStorage.getItem('wods');
    const savedWodsData = localStorage.getItem('wod_admin_saved');

    if (wodsData) {
      try {
        const parsed = JSON.parse(wodsData);
        setWods(parsed);
        console.log('WOD 데이터 로드 완료:', parsed.length, '개');
      } catch (error) {
        console.error('WOD 데이터 파싱 실패:', error);
        setWods([]);
      }
    } else {
      setWods([]);
    }

    if (savedWodsData) {
      try {
        setSavedWods(JSON.parse(savedWodsData));
      } catch (error) {
        console.error('저장된 WOD 데이터 파싱 실패:', error);
        setSavedWods([]);
      }
    }
  };

  useEffect(() => {
    // 초기 로드
    loadWods();

    // storage 이벤트 리스너 추가 (다른 탭에서 localStorage 변경 시 동기화)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wods') {
        console.log('wods localStorage 변경 감지 (다른 탭), 재로드');
        loadWods();
      }
    };

    // 커스텀 이벤트 리스너 추가 (같은 탭에서 localStorage 변경 시 동기화)
    const handleWodsUpdated = () => {
      console.log('wodsUpdated 이벤트 감지, 재로드');
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
  }, []);

  const addWod = (wod: Omit<WodEntry, 'id'>) => {
    const newWod = { ...wod, id: crypto.randomUUID() };
    // localStorage에서 최신 데이터를 읽어서 추가 (state 동기화 문제 방지)
    const existingWods = JSON.parse(localStorage.getItem('wods') || '[]');
    const updatedWods = [newWod, ...existingWods];

    // localStorage에 먼저 저장
    localStorage.setItem('wods', JSON.stringify(updatedWods));

    // state 업데이트
    setWods(updatedWods);

    console.log('WOD 추가 완료:', newWod);
    console.log('전체 WOD 개수:', updatedWods.length);

    // 커스텀 이벤트를 트리거하여 다른 컴포넌트에 알림
    window.dispatchEvent(new CustomEvent('wodsUpdated', { detail: updatedWods }));
  };

  const updateWod = (id: string, updates: Partial<WodEntry>) => {
    const updatedWods = wods.map((wod) => (wod.id === id ? { ...wod, ...updates } : wod));
    setWods(updatedWods);
    localStorage.setItem('wods', JSON.stringify(updatedWods));
  };

  const deleteWod = (id: string) => {
    const updatedWods = wods.filter((wod) => wod.id !== id);
    setWods(updatedWods);
    localStorage.setItem('wods', JSON.stringify(updatedWods));
  };

  const addSavedWod = (wod: Omit<SavedWod, 'id'>) => {
    const newWod = { ...wod, id: crypto.randomUUID() };
    const updatedWods = [newWod, ...savedWods];
    setSavedWods(updatedWods);
    localStorage.setItem('wod_admin_saved', JSON.stringify(updatedWods));
  };

  const updateSavedWod = (id: string, updates: Partial<SavedWod>) => {
    const updatedWods = savedWods.map((wod) => (wod.id === id ? { ...wod, ...updates } : wod));
    setSavedWods(updatedWods);
    localStorage.setItem('wod_admin_saved', JSON.stringify(updatedWods));
  };

  const deleteSavedWod = (id: string) => {
    const updatedWods = savedWods.filter((wod) => wod.id !== id);
    setSavedWods(updatedWods);
    localStorage.setItem('wod_admin_saved', JSON.stringify(updatedWods));
  };

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
