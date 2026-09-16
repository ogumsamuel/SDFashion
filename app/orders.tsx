import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, FlatList,
  ActivityIndicator, TouchableOpacity, RefreshControl,
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../constants/firebase';
import { useAuth } from '../constants/AuthContext';

type Order = {
  id:         string;
  total:      string;
  email:      string;
  reference:  string;
  createdAt:  any;
  items:      { title: string; price: string }[];
};

export default function OrdersScreen() {
  const { user } = useAuth();
  const [orders,     setOrders]     = useState<Order[]>([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      // FIX: removed orderBy from the query to avoid needing a composite index.
      // We sort in JavaScript after fetching instead — same pattern as useProducts.
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Order))
        .sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() ?? 0;
          const bTime = b.createdAt?.toMillis?.() ?? 0;
          return bTime - aTime; // newest first
        });
      setOrders(data);
    } catch (e: any) {
      console.error('fetchOrders error:', e);
      setError('Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchOrders}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyEmoji}>📦</Text>
        <Text style={styles.emptyTitle}>No orders yet</Text>
        <Text style={styles.emptySub}>Your completed orders will appear here</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={orders}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={fetchOrders} tintColor="#6366F1" />
      }
      renderItem={({ item }) => (
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderRef}>Ref: {item.reference}</Text>
            <Text style={styles.orderTotal}>{item.total}</Text>
          </View>
          <Text style={styles.orderEmail}>{item.email}</Text>
          {item.items?.map((product, i) => (
            <Text key={i} style={styles.orderItem}>
              • {product.title} — {product.price}
            </Text>
          ))}
          <Text style={styles.orderDate}>
            {item.createdAt?.toDate?.().toLocaleDateString() ?? 'Recent'}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#f5f5f5' },
  centered:    { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyEmoji:  { fontSize: 60, marginBottom: 16 },
  emptyTitle:  { fontSize: 20, fontWeight: 'bold', color: '#333' },
  emptySub:    { color: '#64748B', marginTop: 8, textAlign: 'center' },
  errorText:   { color: '#6B7280', fontSize: 14, textAlign: 'center', marginBottom: 16 },
  retryBtn:    { backgroundColor: '#6366F1', paddingHorizontal: 24,
                 paddingVertical: 12, borderRadius: 10 },
  retryText:   { color: 'white', fontWeight: '700' },
  orderCard:   { backgroundColor: 'white', borderRadius: 14, padding: 16,
                 marginBottom: 14, elevation: 2,
                 shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                 shadowOpacity: 0.08, shadowRadius: 3 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  orderRef:    { fontSize: 11, color: '#94A3B8', fontFamily: 'Courier' },
  orderTotal:  { fontSize: 16, fontWeight: 'bold', color: '#10B981' },
  orderEmail:  { fontSize: 13, color: '#64748B', marginBottom: 8 },
  orderItem:   { fontSize: 13, color: '#374151', marginBottom: 2 },
  orderDate:   { fontSize: 11, color: '#94A3B8', marginTop: 8 },
});