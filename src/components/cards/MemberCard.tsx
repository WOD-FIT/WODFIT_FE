type MemberCardProps = {
  id: string;
  nickname: string;
  email: string;
  boxName?: string;
  isSelected?: boolean;
  onClick?: () => void;
};

export const MemberCard = ({
  id: _id,
  nickname,
  email,
  boxName,
  isSelected = false,
  onClick,
}: MemberCardProps) => {
  return (
    <div
      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
        isSelected
          ? 'border-[#63461E] dark:border-[#D4A574] bg-[#63461E]/5 dark:bg-[#8B5A2B]/20'
          : 'border-gray-200 dark:border-[#404040] bg-white dark:bg-[#2d2d2d]'
      }`}
      onClick={onClick}
    >
      <div className="font-semibold text-gray-900 dark:text-white">
        {nickname || '닉네임 없음'}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{email}</div>
      {boxName && <div className="text-xs text-gray-500 dark:text-gray-500">{boxName}</div>}
    </div>
  );
};
