// localStorage 키 상수 정의

export const STORAGE_KEYS = {
  USERS: 'users',
  TOKEN: 'token',
  CURRENT_USER: 'current_user',
  TOKEN_EXPIRY: 'token_expiry',
  WODS: 'wods',
  WOD_ADMIN_SAVED: 'wod_admin_saved',
  ADMIN_CLASSES: 'admin_classes',
  RESERVED_WODS: 'reserved_wods',
  MEMBER_PROFILE: (email: string) => `member_profile_${email}`,
  EDIT_WOD: 'edit_wod',
  CLASS_WOD_WRITE: 'class_wod_write',
  SELECTED_WOD_FOR_CLASS: 'selected_wod_for_class',
  PREF_NOTIF: 'pref_notif',
  PREF_NOTIF_TIME: 'pref_notif_time',
  NOTIFICATIONS: 'notifications',
} as const;
