import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge:  false,
    shouldShowBanner: true,
    shouldShowList:   true,
    // shouldShowAlert removed — deprecated, replaced by the two above
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function sendPaymentSuccessNotification(total: string): Promise<void> {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    console.log('Notification permission not granted — skipping notification');
    return;
  }
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🛍️ Order Confirmed!',
      body: `Your payment of ${total} was successful. Thank you for shopping at SD Fashion!`,
      sound: true,
    },
    trigger: null,
  });
}