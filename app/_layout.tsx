import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { PaystackProvider } from 'react-native-paystack-webview';
import { CartProvider } from '../constants/CartContext';
import { AuthProvider, useAuth } from '../constants/AuthContext';
import { requestNotificationPermission } from '../utils/notifications';

function AppLayout() {
  const { isLoading } = useAuth();

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <PaystackProvider
  publicKey={process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY!}>
      <CartProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              headerTintColor: '#6366F1',
              headerBackTitle: '',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ title: '' }} />

            <Stack.Screen
              name="profile"
              options={{
                headerShown: true, title: 'My Profile',
                headerBackTitle: '', headerBackButtonMenuEnabled: false,
              }}
            />
            <Stack.Screen
              name="orders"
              options={{
                headerShown: true, title: 'Order History',
                headerBackTitle: '', headerBackButtonMenuEnabled: false,
              }}
            />
            <Stack.Screen
              name="settings"
              options={{
                headerShown: true, title: 'Settings',
                headerBackTitle: '', headerBackButtonMenuEnabled: false,
              }}
            />

            <Stack.Screen name="product/[id]" options={{ headerBackTitle: '' }} />

            {/* FIX #6: route name must be "checkout/index" not "checkout" —
                Expo Router registers the folder+file path as the route name */}
            <Stack.Screen
              name="checkout/index"
              options={{
                headerShown: true, title: 'Checkout',
                headerBackTitle: '', headerBackButtonMenuEnabled: false,
              }}
            />

            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/signup" />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </GestureHandlerRootView>
      </CartProvider>
    </PaystackProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </SafeAreaProvider>
  );
}