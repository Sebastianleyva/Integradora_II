import * as Notifications from "expo-notifications";

export default async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();

  return status === "granted";
}
