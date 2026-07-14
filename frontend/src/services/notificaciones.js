import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();

  return status === "granted";
}
export async function scheduleDailyReminder() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Registro diario",
      body: "No olvides completar tu registro de bienestar de hoy.",
    },
    trigger: {
      hour: 19,
      minute: 0,
      repeats: true,
    },
  });
}
