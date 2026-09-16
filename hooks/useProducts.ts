import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../constants/firebase';

export type Category = 'new_arrival' | 'trending' | 'recommendation';

export type FirestoreProduct = {
  id:           string;
  title:        string;
  price:        string;
  description:  string;
  category:     Category;
  localImageId: string;
  inStock:      boolean;
  createdAt:    Timestamp;
};

type UseProductsReturn = {
  newArrivals:     FirestoreProduct[];
  trending:        FirestoreProduct[];
  recommendations: FirestoreProduct[];
  allProducts:     FirestoreProduct[];
  isLoading:       boolean;
  error:           string | null;
  refetch:         () => void;
};

async function fetchByCategory(category: Category): Promise<FirestoreProduct[]> {
  const q = query(
    collection(db, 'products'),
    where('category', '==', category)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as FirestoreProduct))
    .filter((p) => p.inStock !== false)
    .sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() ?? 0;
      const bTime = b.createdAt?.toMillis?.() ?? 0;
      return bTime - aTime;
    });
}

export function useProducts(isLoggedIn: boolean): UseProductsReturn {
  const [newArrivals,     setNewArrivals]     = useState<FirestoreProduct[]>([]);
  const [trending,        setTrending]        = useState<FirestoreProduct[]>([]);
  const [recommendations, setRecommendations] = useState<FirestoreProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    setError(null);
    try {
      const [arrivals, trend, recs] = await Promise.all([
        fetchByCategory('new_arrival'),
        fetchByCategory('trending'),
        fetchByCategory('recommendation'),
      ]);
      setNewArrivals(arrivals);
      setTrending(trend);
      setRecommendations(recs);
    } catch (e: any) {
      console.error('useProducts error:', e);
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Combine all categories into one flat list for General screen
  const allProducts = [...newArrivals, ...trending, ...recommendations];

  return {
    newArrivals,
    trending,
    recommendations,
    allProducts,
    isLoading,
    error,
    refetch: loadProducts,
  };
}