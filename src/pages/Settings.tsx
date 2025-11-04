import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useCallback, useState, useEffect } from 'react';

export default function Settings() {
  const { user, logout, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [notif, setNotif] = useLocalStorage('pref_notif', true);
  const [notifTime, setNotifTime] = useLocalStorage('pref_notif_time', '08:00');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setNickname(user.nickname || '');
    }
  }, [user]);

  const saveAccount = useCallback(() => {
    if (!user) return;

    const usersRaw = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersRaw);
    const userIndex = users.findIndex((u: any) => u.email === user.email);

    if (userIndex >= 0) {
      const updatedUser = {
        ...users[userIndex],
        nickname: nickname || users[userIndex].nickname,
        password: password || users[userIndex].password,
      };
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));

      updateUser({ nickname: updatedUser.nickname });
      alert('계정 정보가 업데이트되었습니다.');
    } else {
      alert('로컬 사용자 정보가 없습니다. 먼저 로그인해주세요.');
    }
  }, [user, nickname, password, updateUser]);

  const deleteAccount = useCallback(() => {
    if (!confirm('정말로 계정을 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) return;

    if (!user) return;

    const usersRaw = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersRaw);
    const filteredUsers = users.filter((u: any) => u.email !== user.email);
    localStorage.setItem('users', JSON.stringify(filteredUsers));

    localStorage.removeItem('token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('member_profile');
    localStorage.removeItem('wods');
    localStorage.removeItem('reserved_wods');

    alert('계정이 삭제되었습니다.');
    logout();
  }, [user, logout]);

  return (
    <PageContainer>
      <PageHeader title="설정" />

      <div className="mt-4 grid gap-4">
        <label className="flex items-center justify-between border rounded-lg px-4 py-3">
          <span>다크 모드</span>
          <input type="checkbox" checked={isDark} onChange={toggleTheme} />
        </label>

        <div className="border rounded-lg px-4 py-3">
          <div className="flex items-center justify-between">
            <span>알림 받기</span>
            <input type="checkbox" checked={notif} onChange={(e) => setNotif(e.target.checked)} />
          </div>
          <div className="mt-2 text-sm text-gray-700">시간 설정</div>
          <input
            type="time"
            value={notifTime}
            onChange={(e) => setNotifTime(e.target.value)}
            className="mt-1 border rounded-lg px-3 py-2"
          />
        </div>

        <div className="border rounded-lg px-4 py-3">
          <div className="font-semibold mb-2">계정</div>
          <div className="grid gap-2">
            <input
              value={email}
              readOnly
              className="w-full border rounded-lg px-3 py-2 bg-gray-50"
            />
            <input
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              placeholder="새 비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            <div className="flex gap-2">
              <button
                onClick={saveAccount}
                className="flex-1 h-11 rounded-lg bg-[#63461E] text-white"
              >
                저장
              </button>
              <button onClick={logout} className="flex-1 h-11 rounded-lg bg-gray-600 text-white">
                로그아웃
              </button>
            </div>
            <button
              onClick={deleteAccount}
              className="w-full h-11 rounded-lg bg-red-600 text-white"
            >
              계정 탈퇴
            </button>
          </div>
        </div>

        <button
          onClick={() => alert('설정이 저장되었습니다.')}
          className="h-11 rounded-lg bg-[#63461E] text-white"
        >
          알림/모드 저장
        </button>
      </div>
    </PageContainer>
  );
}
