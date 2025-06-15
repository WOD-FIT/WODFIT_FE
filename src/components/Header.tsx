// src/components/Header.tsx
export default function Header() {
  return (
    <header className="w-full max-w-[375px] mx-auto flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
      {/* Left: Logo */}
      <div className="text-2xl font-bold tracking-wide">
        <img src="/icons/Logo.svg" alt="WOD 로고" />
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-4">
        <img src="/icons/notice.svg" alt="알림 아이콘" className="w-5 h-5" />
        <img src="/icons/setting.svg" alt="설정 아이콘" className="w-5 h-5" />
      </div>
    </header>
  );
}
