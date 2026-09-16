import React, { useState } from 'react';
import {
  StyleSheet, View, Text, Image,
  TouchableOpacity, ScrollView, SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { STORE_DATA } from '../../constants/storeData';
import { useCart } from '../../hooks/useCart';

// PRODUCT DETAILS — a Stack screen that slides on top of the Home tab.
// useLocalSearchParams() reads the [id] from the URL.
export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);

  // Find the product that matches the id from the URL
  const product = STORE_DATA.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.notFound}>
        <Text>Product not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#6366F1', marginTop: 12 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={product.image} style={styles.image} />

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{product.title}</Text>
            <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
              <Text style={{ fontSize: 28 }}>{isLiked ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.price}>{product.price}</Text>
          <Text style={styles.description}>{product.description}</Text>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => { addToCart(product); router.back(); }}
          >
            <Text style={styles.addTxt}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 380 },
  content: { padding: 24 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 24, fontWeight: 'bold', flex: 1, marginRight: 12 },
  price: { fontSize: 22, color: '#2e7d32', fontWeight: '600', marginVertical: 12 },
  description: { fontSize: 16, color: '#555', lineHeight: 24, marginBottom: 32 },
  addBtn: {
    backgroundColor: '#6366F1', padding: 18,
    borderRadius: 14, alignItems: 'center',
  },
  addTxt: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});