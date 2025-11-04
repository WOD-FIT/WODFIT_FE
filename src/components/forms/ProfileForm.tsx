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
  // 사용자별로 프로필을 분리하여 저장
  const profileKey = user?.email ? `member_profile_${user.email}` : 'member_profile';
  const [profile, setProfile] = useLocalStorage<Profile>(profileKey, {
    name: '',
    age: '',
    heightCm: '',
    weightKg: '',
    muscleKg: '',
    boxName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState<Profile>(profile);

  useEffect(() => {
    if (user?.nickname && !profile.name) {
      setProfile((prev) => ({ ...prev, name: user.nickname }));
    }
  }, [user, profile.name, setProfile]);

  useEffect(() => {
    setEditProfile(profile);
  }, [profile]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (editProfile.age && !isValidAge(Number(editProfile.age))) {
      newErrors.age = '올바른 나이를 입력해주세요';
    }

    if (editProfile.heightCm && !isValidHeight(Number(editProfile.heightCm))) {
      newErrors.heightCm = '올바른 키를 입력해주세요';
    }

    if (editProfile.weightKg && !isValidWeight(Number(editProfile.weightKg))) {
      newErrors.weightKg = '올바른 체중을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    setProfile(editProfile);
    updateUser({ nickname: editProfile.name });
    setIsEditing(false);
    alert('프로필이 저장되었습니다.');
    onSave?.();
  };

  const handleChange = (field: keyof Profile, value: string | number) => {
    setEditProfile((prev) => ({
      ...prev,
      [field]: field === 'name' || field === 'boxName' ? value : value === '' ? '' : Number(value),
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
    setErrors({});
  };

  // 숫자만 입력 가능하도록 제한
  const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
    ];
    const isNumber = /^[0-9]$/.test(e.key);
    const isAllowedKey = allowedKeys.includes(e.key);
    const isCtrlA = e.ctrlKey && e.key === 'a';
    const isCtrlC = e.ctrlKey && e.key === 'c';
    const isCtrlV = e.ctrlKey && e.key === 'v';
    const isCtrlX = e.ctrlKey && e.key === 'x';

    if (!isNumber && !isAllowedKey && !isCtrlA && !isCtrlC && !isCtrlV && !isCtrlX) {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-6">
      {/* 프로필 정보 표시/편집 */}
      <div className="grid gap-4">
        <div>
          <label className="text-sm">
            <div className="mb-1 text-gray-700 dark:text-gray-300 font-medium">닉네임</div>
            {isEditing ? (
              <input
                name="name"
                value={editProfile.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full border border-gray-300 dark:border-[#404040] rounded-lg px-3 py-2 bg-white dark:bg-[#3a3a3a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#63461E] dark:focus:ring-[#D4A574]"
              />
            ) : (
              <div className="w-full border border-gray-200 dark:border-[#404040] rounded-lg px-3 py-2 bg-gray-50 dark:bg-[#3a3a3a] text-gray-900 dark:text-white min-h-[42px] flex items-center">
                {profile.name || '-'}
              </div>
            )}
          </label>
        </div>

        <div>
          <label className="text-sm">
            <div className="mb-1 text-gray-700 dark:text-gray-300 font-medium">나이</div>
            {isEditing ? (
              <>
                <input
                  name="age"
                  type="number"
                  value={editProfile.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  onKeyDown={handleNumberInput}
                  className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-[#3a3a3a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#63461E] dark:focus:ring-[#D4A574] ${
                    errors.age ? 'border-red-500' : 'border-gray-300 dark:border-[#404040]'
                  }`}
                />
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
              </>
            ) : (
              <div className="w-full border border-gray-200 dark:border-[#404040] rounded-lg px-3 py-2 bg-gray-50 dark:bg-[#3a3a3a] text-gray-900 dark:text-white min-h-[42px] flex items-center">
                {profile.age || '-'}
              </div>
            )}
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            <div className="mb-1 text-gray-700 dark:text-gray-300 font-medium">키 (cm)</div>
            {isEditing ? (
              <>
                <input
                  name="heightCm"
                  type="number"
                  value={editProfile.heightCm}
                  onChange={(e) => handleChange('heightCm', e.target.value)}
                  onKeyDown={handleNumberInput}
                  className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-[#3a3a3a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#63461E] dark:focus:ring-[#D4A574] ${
                    errors.heightCm ? 'border-red-500' : 'border-gray-300 dark:border-[#404040]'
                  }`}
                />
                {errors.heightCm && <p className="text-red-500 text-xs mt-1">{errors.heightCm}</p>}
              </>
            ) : (
              <div className="w-full border border-gray-200 dark:border-[#404040] rounded-lg px-3 py-2 bg-gray-50 dark:bg-[#3a3a3a] text-gray-900 dark:text-white min-h-[42px] flex items-center">
                {profile.heightCm || '-'}
              </div>
            )}
          </label>
          <label className="text-sm">
            <div className="mb-1 text-gray-700 dark:text-gray-300 font-medium">체중 (kg)</div>
            {isEditing ? (
              <>
                <input
                  name="weightKg"
                  type="number"
                  value={editProfile.weightKg}
                  onChange={(e) => handleChange('weightKg', e.target.value)}
                  onKeyDown={handleNumberInput}
                  className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-[#3a3a3a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#63461E] dark:focus:ring-[#D4A574] ${
                    errors.weightKg ? 'border-red-500' : 'border-gray-300 dark:border-[#404040]'
                  }`}
                />
                {errors.weightKg && <p className="text-red-500 text-xs mt-1">{errors.weightKg}</p>}
              </>
            ) : (
              <div className="w-full border border-gray-200 dark:border-[#404040] rounded-lg px-3 py-2 bg-gray-50 dark:bg-[#3a3a3a] text-gray-900 dark:text-white min-h-[42px] flex items-center">
                {profile.weightKg || '-'}
              </div>
            )}
          </label>
        </div>

        <div>
          <label className="text-sm">
            <div className="mb-1 text-gray-700 dark:text-gray-300 font-medium">소속 박스</div>
            {isEditing ? (
              <input
                name="boxName"
                value={editProfile.boxName || ''}
                onChange={(e) => handleChange('boxName', e.target.value)}
                className="w-full border border-gray-300 dark:border-[#404040] rounded-lg px-3 py-2 bg-white dark:bg-[#3a3a3a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#63461E] dark:focus:ring-[#D4A574]"
              />
            ) : (
              <div className="w-full border border-gray-200 dark:border-[#404040] rounded-lg px-3 py-2 bg-gray-50 dark:bg-[#3a3a3a] text-gray-900 dark:text-white min-h-[42px] flex items-center">
                {profile.boxName || '-'}
              </div>
            )}
          </label>
        </div>

        <div>
          <label className="text-sm">
            <div className="mb-1 text-gray-700 dark:text-gray-300 font-medium">근육량 (kg)</div>
            {isEditing ? (
              <input
                name="muscleKg"
                type="number"
                value={editProfile.muscleKg}
                onChange={(e) => handleChange('muscleKg', e.target.value)}
                onKeyDown={handleNumberInput}
                className="w-full border border-gray-300 dark:border-[#404040] rounded-lg px-3 py-2 bg-white dark:bg-[#3a3a3a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#63461E] dark:focus:ring-[#D4A574]"
              />
            ) : (
              <div className="w-full border border-gray-200 dark:border-[#404040] rounded-lg px-3 py-2 bg-gray-50 dark:bg-[#3a3a3a] text-gray-900 dark:text-white min-h-[42px] flex items-center">
                {profile.muscleKg || '-'}
              </div>
            )}
          </label>
        </div>
      </div>

      {/* 버튼 영역 */}
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full h-11 rounded-lg bg-[#63461E] dark:bg-[#8B5A2B] text-white font-medium hover:bg-[#8B5A2B] dark:hover:bg-[#A67C52] transition-colors"
        >
          수정하기
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 h-11 rounded-lg border border-gray-300 dark:border-[#404040] text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-[#3a3a3a] transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-1 h-11 rounded-lg bg-[#63461E] dark:bg-[#8B5A2B] text-white font-medium hover:bg-[#8B5A2B] dark:hover:bg-[#A67C52] transition-colors"
          >
            저장하기
          </button>
        </div>
      )}
    </div>
  );
};
