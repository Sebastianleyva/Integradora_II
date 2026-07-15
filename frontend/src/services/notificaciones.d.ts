declare module 'services/notificaciones' {
  export function requestNotificationPermissions(): Promise<boolean>;
  export function scheduleDailyReminder(): Promise<void>;
}
