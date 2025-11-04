import axios from 'axios';

interface WodSortProps {
  wods: string[];
  weights: number[];
}

export const wodSort = async ({ wods, weights }: WodSortProps) => {
  const response = await axios.post(
    'http://13.124.38.153:3000/wod/cluster',
    {
      wods: wods,
      weights,
    },
    {
      timeout: 2000, // 2초 타임아웃
    },
  );
  console.log(response);

  return response.data;
};
