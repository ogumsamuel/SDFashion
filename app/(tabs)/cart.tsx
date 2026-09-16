import React from 'react';
import {
  StyleSheet, View, Text, FlatList,
  TouchableOpacity, Image, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, type Href } from 'expo-router';
import { useCart, CartItem } from '../../constants/CartContext';
import { colors, spacing, radius, typography, shadow } from '../../constants/theme';

export default function CartScreen() {
  const router = useRouter();
  const { cartItems, removeFromCart, increaseQty, decreaseQty, clearCart, cartTotal, cartCount } = useCart();

  const handleRemove = (item: CartItem) => {
    Alert.alert('Remove Item', `Remove ${item.title} from your cart?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.id) },
    ]);
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer} edges={['top']}>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySub}>Go back to the Home tab to add items!</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.headerCount}>{cartCount} item{cartCount !== 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.md - 2 }}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={item.image} style={styles.cartImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.itemPrice}>
                ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
              </Text>
              <Text style={styles.unitPrice}>{item.price} each</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => decreaseQty(item.id)}>
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => increaseQty(item.id)}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item)}>
                  <Text style={styles.removeTxt}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{cartTotal}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/checkout' as Href)}>
          <Text style={styles.checkoutTxt}>Proceed to Checkout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearBtn} onPress={() => {
          Alert.alert('Clear Cart', 'Remove all items from your cart?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: clearCart },
          ]);
        }}>
          <Text style={styles.clearTxt}>Clear Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: colors.bgSubtle },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bgSubtle },
  emptyEmoji:     { fontSize: 64, marginBottom: spacing.lg },
  emptyTitle:     { ...typography.h2, color: colors.textPrimary },
  emptySub:       { ...typography.bodySm, color: colors.textSecondary, marginTop: spacing.sm },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    backgroundColor: colors.bgCard, paddingHorizontal: spacing.xl,
                    paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle:    { ...typography.h2, color: colors.textPrimary },
  headerCount:    { ...typography.bodySm, color: colors.textSecondary },
  cartItem:       { flexDirection: 'row', backgroundColor: colors.bgCard,
                    borderRadius: radius.lg, padding: spacing.md + 2, alignItems: 'flex-start', ...shadow.card },
  cartImage:      { width: 80, height: 80, borderRadius: radius.md, marginRight: spacing.md + 2,
                    backgroundColor: colors.bgSubtle },
  itemInfo:       { flex: 1 },
  itemTitle:      { ...typography.bodySm, color: colors.textPrimary, marginBottom: 4, lineHeight: 20 },
  itemPrice:      { fontSize: 16, fontWeight: '700', color: colors.primary, marginBottom: 2 },
  unitPrice:      { fontSize: 11, color: colors.textTertiary, marginBottom: spacing.sm + 2 },
  qtyRow:         { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  qtyBtn:         { width: 30, height: 30, borderRadius: radius.sm, backgroundColor: colors.primaryLight,
                    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#C7D2FE' },
  qtyBtnText:     { fontSize: 18, fontWeight: '700', color: colors.primary, lineHeight: 22 },
  qtyText:        { fontSize: 15, fontWeight: '700', color: colors.textPrimary, minWidth: 24, textAlign: 'center' },
  removeBtn:      { marginLeft: spacing.sm, paddingHorizontal: spacing.sm + 2, paddingVertical: 5,
                    backgroundColor: colors.dangerLight, borderRadius: radius.sm - 2 },
  removeTxt:      { fontSize: 12, color: colors.danger, fontWeight: '600' },
  footer:         { backgroundColor: colors.bgCard, padding: spacing.xl,
                    borderTopWidth: 1, borderTopColor: colors.border,
                    shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.06, shadowRadius: 8, elevation: 8 },
  totalRow:       { flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: spacing.lg },
  totalLabel:     { fontSize: 16, color: colors.textSecondary, fontWeight: '500' },
  totalValue:     { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  checkoutBtn:    { backgroundColor: colors.primary, padding: spacing.lg, borderRadius: radius.lg,
                    alignItems: 'center', marginBottom: spacing.sm + 2 },
  checkoutTxt:    { color: colors.white, fontWeight: '700', fontSize: 16 },
  clearBtn:       { alignItems: 'center', padding: spacing.sm },
  clearTxt:       { color: colors.danger, fontWeight: '600', fontSize: 14 },
});