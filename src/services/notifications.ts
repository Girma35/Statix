import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications are displayed
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permission not granted');
    return false;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('distillation', {
      name: 'Distillation Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#208AEF',
    });
  }

  return true;
}

export async function scheduleDistillationReminder(
  headlistId: string,
  headlistName: string,
  distillationDate: number,
): Promise<string | null> {
  const permission = await requestNotificationPermissions();
  if (!permission) return null;

  // Cancel any existing notification for this headlist
  await cancelDistillationReminder(headlistId);

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: '📚 Distillation Due!',
      body: `Time to review "${headlistName}" — your 14-day review is ready!`,
      data: { headlistId, type: 'distillation' },
      sound: true,
      ...(Platform.OS === 'android' ? { channelId: 'distillation' } : {}),
    },
    trigger: {
      date: new Date(distillationDate),
      type: Notifications.SchedulableTriggerInputTypes.DATE,
    },
  });

  return identifier;
}

export async function cancelDistillationReminder(headlistId: string): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduled) {
    if (notification.content.data?.headlistId === headlistId) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function addNotificationResponseListener(
  handler: (response: Notifications.NotificationResponse) => void,
): Notifications.EventSubscription {
  return Notifications.addNotificationResponseReceivedListener(handler);
}
