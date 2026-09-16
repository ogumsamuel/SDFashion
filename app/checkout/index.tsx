import React, { useMemo, useState } from 'react';
import {
  StyleSheet, Text, View, TextInput,
  TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, type Href } from 'expo-router';
import { usePaystack } from 'react-native-paystack-webview';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../constants/firebase';
import { useCart } from '../../constants/CartContext';
import { useAuth } from '../../constants/AuthContext';
import { sendPaymentSuccessNotification } from '../../utils/notifications';

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartTotal, cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const { popup } = usePaystack();
  const [email, setEmail] = useState(user?.email ?? '');

  const numericTotal = useMemo(() => {
    return Number.parseFloat(cartTotal.replace('$', '').replace(/,/g, '')) || 0;
  }, [cartTotal]);

  const isDisabled = !email.trim() || numericTotal <= 0;

  // FIX: saveOrderToFirestore now correctly reads item.quantity from
  // cartItems (which includes quantity since the Week 13 cart upgrade).
  // Also added a console.log so failures are visible during testing,
  // and the userId field matches exactly what the orders query expects.
  const saveOrderToFirestore = async (reference: string) => {
    if (!user) {
      console.warn('saveOrderToFirestore: no user — order not saved');
      return;
    }
    try {
      await addDoc(collection(db, 'orders'), {
        userId:    user.uid,               // must match request.auth.uid in rules
        email:     email.trim(),
        total:     cartTotal,
        reference,
        items:     cartItems.map((i) => ({
          title:    i.title,
          price:    i.price,
          quantity: i.quantity,            // now included
        })),
        createdAt: serverTimestamp(),
      });
      console.log('Order saved successfully:', reference);
    } catch (e) {
      console.error('Failed to save order:', e);
      Alert.alert(
        'Order Save Failed',
        'Your payment succeeded but we could not save the order record. Please contact support.'
      );
    }
  };

  const handleSuccess = async (_res: unknown) => {
    const reference = `SD-${Date.now()}`;
    await saveOrderToFirestore(reference);
    await sendPaymentSuccessNotification(cartTotal);
    clearCart();
    Alert.alert('Success', 'Payment successful! Thank you for shopping with SD Fashion.');
    router.replace('/' as Href);
  };

  const handlePay = () => {
    if (isDisabled) return;
    popup.checkout({
      email:     email.trim(),
      amount:    numericTotal,
      reference: `SD-${Date.now()}`,
      onSuccess: handleSuccess,
      onCancel:  () => Alert.alert('Cancelled', 'Payment cancelled.'),
      onError:   (err: unknown) => {
        console.log('Paystack error:', err);
        Alert.alert('Payment Failed', 'Something went wrong while processing payment.');
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={styles.summaryCard}>
        <Text style={styles.title}>Checkout</Text>
        <Text style={styles.totalText}>Amount Due: {cartTotal}</Text>
        <Text style={styles.itemCount}>
          {cartItems.reduce((sum, i) => sum + i.quantity, 0)} item
          {cartItems.reduce((sum, i) => sum + i.quantity, 0) !== 1 ? 's' : ''}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email to receive receipt"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={[styles.payButton, isDisabled ? styles.disabledButton : null]}
        onPress={handlePay}
        disabled={isDisabled}
      >
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Go Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  summaryCard:    { backgroundColor: 'white', padding: 20, borderRadius: 12,
                    marginBottom: 20, alignItems: 'center', elevation: 3,
                    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1, shadowRadius: 4 },
  title:          { fontSize: 24, fontWeight: 'bold', marginBottom: 6 },
  totalText:      { fontSize: 20, color: '#2e7d32', fontWeight: '600' },
  itemCount:      { fontSize: 13, color: '#64748B', marginTop: 4 },
  inputContainer: { marginBottom: 30 },
  label:          { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input:          { backgroundColor: 'white', padding: 15, borderRadius: 8,
                    borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
  payButton:      { backgroundColor: '#6366F1', padding: 18,
                    borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  disabledButton: { backgroundColor: '#a5a6f6' },
  payButtonText:  { color: 'white', fontSize: 18, fontWeight: 'bold' },
  cancelButton:   { padding: 15, alignItems: 'center' },
  cancelButtonText:{ color: '#64748B', fontSize: 16, fontWeight: '600' },
});