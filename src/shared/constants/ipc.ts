/**
 * IPC Channel Constants
 * Centralized location for all IPC channel names
 */

export const IPC_CHANNELS = {
  // Authentication
  AUTH_LOGIN: 'auth:login',
  AUTH_LOGOUT: 'auth:logout',
  AUTH_CHECK_SESSION: 'auth:checkSession',

  // User/Profile
  PROFILE_GET_ALL: 'profile:getAll',
  PROFILE_GET: 'profile:get',
  PROFILE_CREATE: 'profile:create',
  PROFILE_UPDATE: 'profile:update',
  PROFILE_DELETE: 'profile:delete',

  // Calendar
  CALENDAR_SYNC: 'calendar:sync',
  CALENDAR_GET_EVENTS: 'calendar:getEvents',
  CALENDAR_ADD_ACCOUNT: 'calendar:addAccount',
  CALENDAR_REMOVE_ACCOUNT: 'calendar:removeAccount',
  CALENDAR_GET_ACCOUNTS: 'calendar:getAccounts',

  // Tasks
  TASK_GET_ALL: 'task:getAll',
  TASK_GET: 'task:get',
  TASK_CREATE: 'task:create',
  TASK_UPDATE: 'task:update',
  TASK_DELETE: 'task:delete',
  TASK_COMPLETE: 'task:complete',
  TASK_GET_STATS: 'task:getStats',

  // Rewards
  REWARD_GET_POINTS: 'reward:getPoints',
  REWARD_GET_ACHIEVEMENTS: 'reward:getAchievements',
  REWARD_GET_STATS: 'reward:getStats',

  // Settings
  SETTINGS_GET: 'settings:get',
  SETTINGS_UPDATE: 'settings:update',

  // Events (one-way notifications from main to renderer)
  EVENT_LOGIN_SUCCESS: 'event:loginSuccess',
  EVENT_CALENDAR_SYNCED: 'event:calendarSynced',
  EVENT_TASK_COMPLETED: 'event:taskCompleted',
  EVENT_ACHIEVEMENT_UNLOCKED: 'event:achievementUnlocked',
} as const;

// Type helper for IPC channel names
export type IPCChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];
