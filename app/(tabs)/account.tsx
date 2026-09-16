import React, { useCallback } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
  ScrollView, Alert, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../constants/AuthContext';
import { colors, spacing, radius, typography, shadow } from '../../constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const MenuRow = ({
  icon, label, onPress, danger = false, showChevron = true,
}: {
  icon: IoniconsName;
  label: string;
  onPress: () => void;
  danger?: boolean;
  showChevron?: boolean;
}) => (
  <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuIconWrap}>
      <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.primary} />
    </View>
    <Text style={[styles.menuLabel, danger && { color: colors.danger }]}>{label}</Text>
    {showChevron && <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />}
  </TouchableOpacity>
);

export default function AccountScreen() {
  const router = useRouter();
  const { user, profile, logOut } = useAuth();

  const emailPrefix  = user?.email?.split('@')[0] ?? '';
  const avatarLetter = (profile?.username?.[0] ?? emailPrefix[0] ?? 'S').toUpperCase();
  const displayName  = profile?.username || emailPrefix || 'SD Fashion Member';

  const handleLogout = useCallback(() => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out', style: 'destructive',
        onPress: async () => {
          try {
            await logOut();
            router.replace('/auth/login' as Href);
          } catch {
            Alert.alert('Error', 'Failed to log out. Please try again.');
          }
        },
      },
    ]);
  }, [logOut, router]);

  const openSocial = (url: string) => {
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Could not open the link.')
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push('/profile' as Href)}
          >
            <Ionicons name="pencil" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>MY ACCOUNT</Text>
        <View style={styles.menuCard}>
          <MenuRow icon="person-outline" label="My Profile"
            onPress={() => router.push('/profile' as Href)} />
          <View style={styles.divider} />
          <MenuRow icon="cube-outline" label="Order History"
            onPress={() => router.push('/orders' as Href)} />
          <View style={styles.divider} />
          <MenuRow icon="settings-outline" label="Settings"
            onPress={() => router.push('/settings' as Href)} />
        </View>

        <Text style={styles.sectionLabel}>CONNECT WITH US</Text>
        <View style={styles.menuCard}>
          <MenuRow icon="logo-instagram" label="Instagram"
            onPress={() => openSocial('https://instagram.com/sdfashion')} />
          <View style={styles.divider} />
          <MenuRow icon="logo-facebook" label="Facebook"
            onPress={() => openSocial('https://facebook.com/sdfashion')} />
          <View style={styles.divider} />
          <MenuRow icon="logo-twitter" label="Twitter / X"
            onPress={() => openSocial('https://x.com/sdfashion')} />
        </View>

        <View style={styles.menuCard}>
          <MenuRow icon="log-out-outline" label="Log Out"
            danger showChevron={false} onPress={handleLogout} />
        </View>

        <Text style={styles.version}>SD Fashion v1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: colors.bgScreen },
  scroll:       { padding: spacing.lg, paddingBottom: spacing.xxxl + spacing.md },

  userCard:     { flexDirection: 'row', alignItems: 'center',
                  backgroundColor: colors.bgCard, borderRadius: radius.lg,
                  padding: spacing.lg, marginBottom: spacing.xxl, ...shadow.card },
  avatar:       { width: 56, height: 56, borderRadius: 28,
                  backgroundColor: colors.primary,
                  justifyContent: 'center', alignItems: 'center' },
  avatarText:   { fontSize: 22, fontWeight: '800', color: colors.white },
  userInfo:     { flex: 1, marginLeft: spacing.md + 2 },
  userName:     { ...typography.h3, color: colors.textPrimary },
  userEmail:    { ...typography.bodySm, color: colors.textSecondary, marginTop: 2 },
  editBtn:      { width: 36, height: 36, borderRadius: 18,
                  backgroundColor: colors.primaryLight,
                  justifyContent: 'center', alignItems: 'center' },

  sectionLabel: { ...typography.label, color: colors.textTertiary,
                  marginBottom: spacing.sm, marginLeft: spacing.xs },

  menuCard:     { backgroundColor: colors.bgCard, borderRadius: radius.lg,
                  marginBottom: spacing.xxl, overflow: 'hidden', ...shadow.subtle },
  menuRow:      { flexDirection: 'row', alignItems: 'center',
                  paddingHorizontal: spacing.lg, paddingVertical: spacing.md + 2 },
  menuIconWrap: { width: 34, height: 34, borderRadius: radius.sm,
                  backgroundColor: colors.bgSubtle,
                  justifyContent: 'center', alignItems: 'center',
                  marginRight: spacing.md },
  menuLabel:    { flex: 1, ...typography.body, color: colors.textPrimary },
  divider:      { height: 1, backgroundColor: colors.bgSubtle, marginLeft: 62 },

  version:      { textAlign: 'center', ...typography.caption,
                  color: colors.textDisabled, marginTop: spacing.sm },
});