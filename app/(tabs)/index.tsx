import React, { useEffect, useCallback } from 'react';
import {
  StyleSheet, View, Text, FlatList,
  TouchableOpacity, Image, Dimensions,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../constants/AuthContext';
import { useCart } from '../../constants/CartContext';
import { useProducts, FirestoreProduct } from '../../hooks/useProducts';
import { getLocalImage } from '../../constants/storeData';
import { colors, spacing, radius, typography, shadow } from '../../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const HORIZONTAL_PADDING = spacing.xl * 2; // 20px each side

function getCardWidth(count: number): number {
  if (count === 1) return SCREEN_WIDTH - HORIZONTAL_PADDING;
  if (count === 2) return (SCREEN_WIDTH - HORIZONTAL_PADDING - spacing.md) / 2;
  return 160;
}

const HorizontalCard = ({
  item, onPress, onAddToCart, cardWidth,
}: {
  item: FirestoreProduct;
  onPress: () => void;
  onAddToCart: () => void;
  cardWidth: number;
}) => (
  <TouchableOpacity
    style={[styles.hCard, { width: cardWidth }]}
    onPress={onPress}
    activeOpacity={0.92}
  >
    <Image
      source={getLocalImage(item.localImageId)}
      style={[styles.hCardImage, { width: cardWidth }]}
    />
    <View style={styles.hCardBody}>
      <Text style={styles.hCardTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.hCardPrice}>{item.price}</Text>
    </View>
    <TouchableOpacity
      style={styles.hCardBtn}
      onPress={(e) => { e.stopPropagation(); onAddToCart(); }}
    >
      <Ionicons name="cart-outline" size={18} color={colors.white} />
    </TouchableOpacity>
  </TouchableOpacity>
);

const SectionHeader = ({ title, subtitle, color }: {
  title: string; subtitle: string; color: string;
}) => (
  <View style={styles.sectionHeader}>
    <View style={[styles.sectionAccent, { backgroundColor: color }]} />
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSub}>{subtitle}</Text>
    </View>
  </View>
);

const SectionRow = ({
  data, onPress, onAddToCart,
}: {
  data: FirestoreProduct[];
  onPress: (item: FirestoreProduct) => void;
  onAddToCart: (item: FirestoreProduct) => void;
}) => {
  const cardWidth = getCardWidth(data.length);
  const scrollable = data.length > 2;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      horizontal
      scrollEnabled={scrollable}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.hList}
      renderItem={({ item }) => (
        <HorizontalCard
          item={item}
          cardWidth={cardWidth}
          onPress={() => onPress(item)}
          onAddToCart={() => onAddToCart(item)}
        />
      )}
    />
  );
};

type SectionBlock = {
  type: 'section'; key: string; title: string;
  subtitle: string; color: string; data: FirestoreProduct[];
};

export default function HomeScreen() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading } = useAuth();
  const { cartCount, addToCart } = useCart();
  const { newArrivals, trending, recommendations, isLoading, error, refetch } = useProducts(!!user);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login' as Href);
    }
  }, [user, authLoading, router]);

  const handleAddToCart = useCallback((item: FirestoreProduct) => {
    addToCart({
      id: item.localImageId, title: item.title, price: item.price,
      description: item.description, image: getLocalImage(item.localImageId),
    });
  }, [addToCart]);

  const navigateToProduct = useCallback((item: FirestoreProduct) => {
    router.push(`/product/${item.localImageId}` as any);
  }, [router]);

  if (authLoading || !user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const greeting = profile?.username
    ? `Hey ${profile.username}! 👋`
    : user?.email
      ? `Hey ${user.email.split('@')[0]}! 👋`
      : 'Hey there! 👋';

  const sections: SectionBlock[] = [
    newArrivals.length > 0 && {
      type: 'section', key: 'new_arrivals', title: 'New Arrivals',
      subtitle: 'Fresh in — just restocked', color: colors.primary, data: newArrivals,
    },
    trending.length > 0 && {
      type: 'section', key: 'trending', title: 'Trending & Collections',
      subtitle: "What's hot right now", color: colors.accentPink, data: trending,
    },
    recommendations.length > 0 && {
      type: 'section', key: 'recommendations', title: 'Recommended For You',
      subtitle: 'Hand-picked by SD Fashion', color: colors.accentGreen, data: recommendations,
    },
  ].filter(Boolean) as SectionBlock[];

  const ListHeader = (
    <View style={styles.topHeader}>
      <View>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.subGreeting}>Discover today&apos;s picks</Text>
      </View>
      <TouchableOpacity
        style={styles.cartBtn}
        onPress={() => router.push('/(tabs)/cart' as any)}
      >
        <Ionicons name="cart-outline" size={24} color={colors.primary} />
        {cartCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {ListHeader}
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
        {ListHeader}
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
      <FlatList
        data={sections}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />
        }
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="shirt-outline" size={64} color={colors.textDisabled} />
            <Text style={styles.emptyTitle}>No products yet</Text>
            <Text style={styles.emptySub}>Add products to Firestore to see them here</Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: spacing.xxxl }} />}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <SectionHeader title={item.title} subtitle={item.subtitle} color={item.color} />
            <SectionRow data={item.data} onPress={navigateToProduct} onAddToCart={handleAddToCart} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: colors.bgScreen },
  centered:      { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  topHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                   paddingHorizontal: spacing.xl, paddingVertical: spacing.md + 2,
                   backgroundColor: colors.bgCard, borderBottomWidth: 1, borderBottomColor: colors.bgSubtle },
  greeting:      { ...typography.h1, color: colors.textPrimary },
  subGreeting:   { ...typography.bodySm, color: colors.textSecondary, marginTop: 2 },
  cartBtn:       { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryLight,
                   justifyContent: 'center', alignItems: 'center' },
  cartBadge:     { position: 'absolute', top: -2, right: -2, width: 18, height: 18,
                   borderRadius: 9, backgroundColor: colors.danger,
                   justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  section:       { marginTop: spacing.xxl - 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center',
                   paddingHorizontal: spacing.xl, marginBottom: spacing.md + 2 },
  sectionAccent: { width: 4, height: 28, borderRadius: 2, marginRight: spacing.sm + 2 },
  sectionTitle:  { ...typography.h3, color: colors.textPrimary },
  sectionSub:    { ...typography.caption, color: colors.textTertiary, marginTop: 1 },
  hList:         { paddingHorizontal: spacing.xl, gap: spacing.md },
  hCard:         { backgroundColor: colors.bgCard, borderRadius: radius.lg, overflow: 'hidden', ...shadow.card },
  hCardImage:    { height: 160, backgroundColor: colors.bgSubtle },
  hCardBody:     { padding: spacing.md - 2 },
  hCardTitle:    { ...typography.bodySm, color: colors.textPrimary, lineHeight: 18, marginBottom: 4 },
  hCardPrice:    { ...typography.body, color: colors.primary, fontWeight: '700' },
  hCardBtn:      { margin: spacing.md - 2, marginTop: 0, backgroundColor: colors.primary,
                   borderRadius: radius.sm, padding: spacing.sm, alignItems: 'center' },
  loadingText:   { marginTop: spacing.md, color: colors.textTertiary, fontSize: 14 },
  errorText:     { marginTop: spacing.md, color: colors.textSecondary, fontSize: 14, textAlign: 'center' },
  retryBtn:      { marginTop: spacing.lg, backgroundColor: colors.primary,
                   paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, borderRadius: radius.md },
  retryText:     { color: colors.white, fontWeight: '700' },
  emptyState:    { alignItems: 'center', padding: 60 },
  emptyTitle:    { ...typography.h3, color: colors.textSecondary, marginTop: spacing.lg },
  emptySub:      { ...typography.caption, color: colors.textTertiary, marginTop: spacing.sm,
                   textAlign: 'center', lineHeight: 20 },
});