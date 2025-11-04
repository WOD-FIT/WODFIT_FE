import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { isValidAge, isValidHeight, isValidWeight } from '@/utils/validator';

type Profile = {
  name: string;
  age: number | '';
  heightCm: number | '';
  weightKg: number | '';
  muscleKg: number | '';
  boxName?: string;
};

type ProfileFormProps = {
  onSave?: () => void;
};

export const ProfileForm = ({ onSave }: ProfileFormProps) => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useLocalStorage<Profile>('member_profile', {
    name: '',
    age: '',
    heightCm: '',
    weightKg: '',
    muscleKg: '',
    boxName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.nickname && !profile.name) {
      setProfile((prev) => ({ ...prev, name: user.nickname }));
    }
  }, [user, profile.name, setProfile]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (profile.age && !isValidAge(Number(profile.age))) {
      newErrors.age = '올바른 나이를 입력해주세요';
    }

    if (profile.heightCm && !isValidHeight(Number(profile.heightCm))) {
      newErrors.heightCm = '올바른 키를 입력해주세요';
    }

    if (profile.weightKg && !isValidWeight(Number(profile.weightKg))) {
      newErrors.weightKg = '올바른 체중을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    // 프로필 저장 (이미 setProfile로 상태가 업데이트됨)
    updateUser({ nickname: profile.name });
    alert('프로필이 저장되었습니다.');
    onSave?.();
  };

  const handleChange = (field: keyof Profile, value: string | number) => {
    setProfile((prev) => ({
      ...prev,
      [field]: field === 'name' || field === 'boxName' ? value : value === '' ? '' : Number(value),
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="grid gap-3">
      <div>
        <label className="text-sm">
          <div className="mb-1">닉네임</div>
          <input
            name="name"
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </label>
      </div>

      <div>
        <label className="text-sm">
          <div className="mb-1">나이</div>
          <input
            name="age"
            type="number"
            value={profile.age}
            onChange={(e) => handleChange('age', e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 ${errors.age ? 'border-red-500' : ''}`}
          />
          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          <div className="mb-1">키 (cm)</div>
          <input
            name="heightCm"
            type="number"
            value={profile.heightCm}
            onChange={(e) => handleChange('heightCm', e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 ${
              errors.heightCm ? 'border-red-500' : ''
            }`}
          />
          {errors.heightCm && <p className="text-red-500 text-xs mt-1">{errors.heightCm}</p>}
        </label>
        <label className="text-sm">
          <div className="mb-1">체중 (kg)</div>
          <input
            name="weightKg"
            type="number"
            value={profile.weightKg}
            onChange={(e) => handleChange('weightKg', e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 ${
              errors.weightKg ? 'border-red-500' : ''
            }`}
          />
          {errors.weightKg && <p className="text-red-500 text-xs mt-1">{errors.weightKg}</p>}
        </label>
      </div>

      <div>
        <label className="text-sm">
          <div className="mb-1">소속 박스</div>
          <input
            name="boxName"
            value={profile.boxName || ''}
            onChange={(e) => handleChange('boxName', e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </label>
      </div>

      <div>
        <label className="text-sm">
          <div className="mb-1">근육량 (kg)</div>
          <input
            name="muscleKg"
            type="number"
            value={profile.muscleKg}
            onChange={(e) => handleChange('muscleKg', e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </label>
      </div>

      <button onClick={handleSave} className="mt-2 h-11 rounded-lg bg-[#63461E] text-white">
        저장
      </button>
    </div>
  );
};
