import { useWod as useWodContext } from '@/context/WodContext';

export const useWod = () => {
  return useWodContext();
};
