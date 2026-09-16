import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../constants/storeData';

type Props = {
  item: Product;
  onAddToCart: () => void;
  onPress: () => void;   // NEW: tapping the card opens Product Details
};

// PRODUCT CARD — now accepts onPress to navigate to the Stack screen.
export const ProductCard = ({ item, onAddToCart, onPress }: Props) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    // Wrap the whole card in a TouchableOpacity to make it tappable
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.92}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.desc}>{item.description}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => setIsLiked(!isLiked)} style={styles.likeBtn}>
          <Text style={{ fontSize: 24 }}>{isLiked ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={(e) => { e.stopPropagation(); onAddToCart(); }}
          style={styles.cartBtn}
        >
          <Text style={styles.cartTxt}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white', margin: 20, borderRadius: 15,
    overflow: 'hidden', elevation: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 3.84,
  },
  image: { width: '100%', height: 300 },
  details: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  price: { fontSize: 18, color: '#2e7d32', fontWeight: '600', marginBottom: 10 },
  desc: { color: '#666', lineHeight: 20 },
  actions: {
    flexDirection: 'row', padding: 20,
    borderTopWidth: 1, borderTopColor: '#eee',
    alignItems: 'center', justifyContent: 'space-between',
  },
  likeBtn: { padding: 10, backgroundColor: '#f9f9f9', borderRadius: 50 },
  cartBtn: { backgroundColor: 'black', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  cartTxt: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});