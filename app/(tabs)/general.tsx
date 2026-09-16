import React, { useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, FlatList,
  TouchableOpacity, Image, TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProducts, FirestoreProduct } from '../../hooks/useProducts';
import { useCart } from '../../constants/CartContext';
import { getLocalImage } from '../../constants/storeData';
import { colors, spacing, radius, typography, shadow } from '../../constants/theme';

export default function GeneralScreen() {
  const router = useRouter();
  const { allProducts, isLoading, error, refetch } = useProducts(true);
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddToCart = useCallback((item: FirestoreProduct) => {
    addToCart({
      id: item.localImageId, title: item.title, price: item.price,
      description: item.description, image: getLocalImage(item.localImageId),
    });
  }, [addToCart]);

  const filteredProducts = allProducts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const badgeColor = (category: string) => {
    switch (category) {
      case 'new_arrival':    return colors.primary;
      case 'trending':       return colors.accentPink;
      case 'recommendation': return colors.accentGreen;
      default:                return colors.textTertiary;
    }
  };
  const badgeLabel = (category: string) => {
    switch (category) {
      case 'new_arrival':    return 'New';
      case 'trending':       return 'Trending';
      case 'recommendation': return 'Pick';
      default:                return category;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>All Products</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>All Products</Text>
        </View>
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={48} color={colors.textTertiary} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Products</Text>
        <Text style={styles.headerCount}>{filteredProducts.length} items</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Ionicons name="search-outline" size={48} color={colors.textDisabled} />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySub}>Try a different search term</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/product/${item.localImageId}` as any)}
            activeOpacity={0.92}
          >
            <Image source={getLocalImage(item.localImageId)} style={styles.cardImage} />
            <View style={[styles.badge, { backgroundColor: badgeColor(item.category) }]}>
              <Text style={styles.badgeText}>{badgeLabel(item.category)}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(item)}>
              <Ionicons name="cart-outline" size={16} color={colors.white} />
              <Text style={styles.addBtnText}>Add to Cart</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: colors.bgScreen },
  centered:       { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    paddingHorizontal: spacing.xl, paddingVertical: spacing.md + 2,
                    backgroundColor: colors.bgCard, borderBottomWidth: 1, borderBottomColor: colors.bgSubtle },
  headerTitle:    { ...typography.h2, color: colors.textPrimary },
  headerCount:    { ...typography.bodySm, color: colors.textTertiary },
  searchContainer:{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard,
                    marginHorizontal: spacing.lg, marginVertical: spacing.md,
                    paddingHorizontal: spacing.md + 2, paddingVertical: spacing.sm + 2,
                    borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border },
  searchIcon:     { marginRight: spacing.sm },
  searchInput:    { flex: 1, fontSize: 14, color: colors.textPrimary },
  listContent:    { paddingHorizontal: spacing.md - 2, paddingBottom: spacing.xl },
  row:            { justifyContent: 'space-between', marginBottom: spacing.md },
  card:           { width: '48%', backgroundColor: colors.bgCard, borderRadius: radius.lg,
                    overflow: 'hidden', ...shadow.card },
  cardImage:      { width: '100%', height: 150, backgroundColor: colors.bgSubtle },
  badge:          { position: 'absolute', top: spacing.sm, left: spacing.sm,
                    paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.sm },
  badgeText:      { color: colors.white, fontSize: 10, fontWeight: '700' },
  cardBody:       { padding: spacing.sm + 2 },
  cardTitle:      { ...typography.caption, color: colors.textPrimary, lineHeight: 17, marginBottom: 4 },
  cardPrice:      { ...typography.body, color: colors.primary, fontWeight: '700' },
  addBtn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: colors.primary, margin: spacing.sm + 2, marginTop: 0,
                    padding: spacing.sm, borderRadius: radius.sm, gap: spacing.xs + 2 },
  addBtnText:     { color: colors.white, fontSize: 12, fontWeight: '600' },
  loadingText:    { marginTop: spacing.md, color: colors.textTertiary, fontSize: 14 },
  errorText:      { marginTop: spacing.md, color: colors.textSecondary, fontSize: 14, textAlign: 'center' },
  retryBtn:       { marginTop: spacing.lg, backgroundColor: colors.primary,
                    paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, borderRadius: radius.md },
  retryText:      { color: colors.white, fontWeight: '700' },
  emptyTitle:     { ...typography.h3, color: colors.textSecondary, marginTop: spacing.md },
  emptySub:       { ...typography.caption, color: colors.textTertiary, marginTop: spacing.sm },
});