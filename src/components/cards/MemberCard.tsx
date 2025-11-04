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
      className={`border rounded-lg p-3 cursor-pointer ${
        isSelected ? 'border-[#63461E] bg-[#63461E]/5' : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="font-semibold">{nickname || '닉네임 없음'}</div>
      <div className="text-sm text-gray-600">{email}</div>
      {boxName && <div className="text-xs text-gray-500">{boxName}</div>}
    </div>
  );
};
