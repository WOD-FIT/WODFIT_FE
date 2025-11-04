import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useCallback, useState } from 'react';

export default function PasswordChange() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = useCallback(() => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    const usersRaw = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersRaw);
    const userIndex = users.findIndex((u: any) => u.email === user.email);

    if (userIndex >= 0) {
      if (!newPassword || newPassword.trim() === '') {
        alert('새 비밀번호를 입력해주세요.');
        return;
      }

      if (newPassword !== confirmPassword) {
        alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
        return;
      }

      // 비밀번호 변경 시 현재 비밀번호 확인
      if (password && password !== users[userIndex].password) {
        alert('현재 비밀번호가 올바르지 않습니다.');
        return;
      }

      const updatedUser = {
        ...users[userIndex],
        password: newPassword,
      };
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));

      alert('비밀번호가 변경되었습니다.');
      navigate('/settings');
    } else {
      alert('로컬 사용자 정보가 없습니다. 먼저 로그인해주세요.');
    }
  }, [user, password, newPassword, confirmPassword, navigate]);

  return (
    <PageContainer>
      <PageHeader title="비밀번호 변경" />
      <div className="mt-4 space-y-6">
        <div className="rounded-2xl bg-white dark:bg-[#2d2d2d] shadow-sm border border-gray-100 dark:border-[#404040] overflow-hidden">
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                현재 비밀번호
              </label>
              <input
                placeholder="현재 비밀번호를 입력하세요"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 dark:border-[#404040] rounded-lg px-3 py-2 bg-white dark:bg-[#3a3a3a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#63461E] dark:focus:ring-[#D4A574]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                새 비밀번호
              </label>
              <input
                placeholder="새 비밀번호를 입력하세요"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 dark:border-[#404040] rounded-lg px-3 py-2 bg-white dark:bg-[#3a3a3a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#63461E] dark:focus:ring-[#D4A574]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                새 비밀번호 확인
              </label>
              <input
                placeholder="새 비밀번호를 다시 입력하세요"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 dark:border-[#404040] rounded-lg px-3 py-2 bg-white dark:bg-[#3a3a3a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#63461E] dark:focus:ring-[#D4A574]"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full h-11 rounded-lg bg-[#63461E] dark:bg-[#8B5A2B] text-white font-medium hover:bg-[#8B5A2B] dark:hover:bg-[#A67C52] transition-colors"
        >
          비밀번호 변경하기
        </button>
      </div>
    </PageContainer>
  );
}

