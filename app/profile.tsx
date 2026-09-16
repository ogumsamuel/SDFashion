import React, { useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '../constants/AuthContext';

type EditableFields = {
  username: string; phone: string;
  address:  string; bio:   string; dob: string;
};

// ── EditField OUTSIDE the component — prevents keyboard closing bug ──────────
// (Same fix as the signup screen: components defined inside a parent
//  get re-created on every keystroke, remounting the TextInput and
//  dismissing the keyboard.)
const EditField = ({
  label, value, onChangeText, placeholder,
  keyboardType = 'default', multiline = false, editable = true,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: any;
  multiline?: boolean;
  editable?: boolean;
}) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.editLabel}>{label}</Text>
    <TextInput
      style={[styles.editInput, multiline && styles.editInputMulti]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
      autoCapitalize="none"
      autoCorrect={false}
      editable={editable}
    />
  </View>
);

// ── Read-only row ─────────────────────────────────────────────────────────────
const ReadRow = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.readRow}>
    <Text style={styles.readLabel}>{label}</Text>
    <Text style={styles.readValue}>
      {value || <Text style={styles.empty}>Not set</Text>}
    </Text>
  </View>
);

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const { user, profile, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving,  setIsSaving]  = useState(false);

  const [fields, setFields] = useState<EditableFields>({
    username: profile?.username ?? '',
    phone:    profile?.phone    ?? '',
    address:  profile?.address  ?? '',
    bio:      profile?.bio      ?? '',
    dob:      profile?.dob      ?? '',
  });

  const setField = useCallback((key: keyof EditableFields) => (val: string) => {
    setFields((f) => ({ ...f, [key]: val }));
  }, []);

  // Fix 5 — avatar + name fallback to email prefix instead of ? and generic
  const emailPrefix  = user?.email?.split('@')[0] ?? '';
  const avatarLetter = (profile?.username?.[0] ?? emailPrefix[0] ?? 'S').toUpperCase();
  const displayName  = profile?.username || emailPrefix || 'SD Fashion Member';

  const handleSave = useCallback(async () => {
    if (!fields.username.trim()) {
      Alert.alert('Validation', 'Username cannot be empty.');
      return;
    }
    setIsSaving(true);
    try {
      await updateProfile(fields);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (e) {
      console.error('Profile save error:', e);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [fields, updateProfile]);

  const handleCancel = useCallback(() => {
    setFields({
      username: profile?.username ?? '',
      phone:    profile?.phone    ?? '',
      address:  profile?.address  ?? '',
      bio:      profile?.bio      ?? '',
      dob:      profile?.dob      ?? '',
    });
    setIsEditing(false);
  }, [profile]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#F3F4F6' }}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* Avatar + name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{avatarLetter}</Text>
          </View>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.displayEmail}>{user?.email}</Text>
        </View>

        {/* Profile card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>My Profile</Text>
            {!isEditing && (
              <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {isEditing ? (
            <>
              <EditField
                label="Username *"
                value={fields.username}
                onChangeText={setField('username')}
                placeholder="Your username"
                editable={!isSaving}
              />
              <EditField
                label="Phone Number"
                value={fields.phone}
                onChangeText={setField('phone')}
                placeholder="+234 800 000 0000"
                keyboardType="phone-pad"
                editable={!isSaving}
              />
              <EditField
                label="Address"
                value={fields.address}
                onChangeText={setField('address')}
                placeholder="Your delivery address"
                multiline
                editable={!isSaving}
              />
              <EditField
                label="Bio"
                value={fields.bio}
                onChangeText={setField('bio')}
                placeholder="Tell us about yourself"
                multiline
                editable={!isSaving}
              />
              <EditField
                label="Date of Birth"
                value={fields.dob}
                onChangeText={setField('dob')}
                placeholder="e.g. 1995-08-25"
                editable={!isSaving}
              />

              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={handleCancel}
                  disabled={isSaving}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving
                    ? <ActivityIndicator color="white" size="small" />
                    : <Text style={styles.saveBtnText}>Save Changes</Text>
                  }
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <ReadRow label="Username" value={profile?.username} />
              <ReadRow label="Email"    value={user?.email ?? ''} />
              <ReadRow label="Phone"    value={profile?.phone} />
              <ReadRow label="Address"  value={profile?.address} />
              <ReadRow label="Bio"      value={profile?.bio} />
              <ReadRow label="Birthday" value={profile?.dob} />
            </>
          )}
        </View>

        {/* Fix 4 (Option B) — Member Since only, Account ID removed */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Info</Text>
          <ReadRow
            label="Member Since"
            value={
              user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : '—'
            }
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll:          { padding: 20, paddingBottom: 40 },
  avatarSection:   { alignItems: 'center', marginBottom: 20, marginTop: 10 },
  avatarCircle:    { width: 88, height: 88, borderRadius: 44, backgroundColor: '#6366F1',
                     justifyContent: 'center', alignItems: 'center', marginBottom: 12,
                     shadowColor: '#6366F1', shadowOffset: { width: 0, height: 4 },
                     shadowOpacity: 0.35, shadowRadius: 8, elevation: 6 },
  avatarLetter:    { fontSize: 36, fontWeight: '800', color: 'white' },
  displayName:     { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 },
  displayEmail:    { fontSize: 14, color: '#6B7280' },
  card:            { backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 14,
                     shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                     shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardHeader:      { flexDirection: 'row', justifyContent: 'space-between',
                     alignItems: 'center', marginBottom: 16 },
  cardTitle:       { fontSize: 15, fontWeight: '700', color: '#111827' },
  editBtn:         { backgroundColor: '#EEF2FF', paddingHorizontal: 14,
                     paddingVertical: 6, borderRadius: 8 },
  editBtnText:     { color: '#6366F1', fontWeight: '600', fontSize: 13 },
  readRow:         { flexDirection: 'row', justifyContent: 'space-between',
                     alignItems: 'flex-start', paddingVertical: 10,
                     borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  readLabel:       { fontSize: 13, color: '#9CA3AF', fontWeight: '500', flex: 1 },
  readValue:       { fontSize: 13, color: '#111827', fontWeight: '500',
                     flex: 2, textAlign: 'right' },
  empty:           { color: '#D1D5DB', fontStyle: 'italic' },
  fieldGroup:      { marginBottom: 14 },
  editLabel:       { fontSize: 12, fontWeight: '600', color: '#374151', marginBottom: 5 },
  editInput:       { backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#E5E7EB',
                     borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11,
                     fontSize: 14, color: '#111827' },
  editInputMulti:  { height: 80, textAlignVertical: 'top' },
  editActions:     { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelBtn:       { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 12,
                     paddingVertical: 13, alignItems: 'center' },
  cancelBtnText:   { color: '#6B7280', fontWeight: '600', fontSize: 14 },
  saveBtn:         { flex: 2, backgroundColor: '#6366F1', borderRadius: 12,
                     paddingVertical: 13, alignItems: 'center' },
  saveBtnDisabled: { backgroundColor: '#A5B4FC' },
  saveBtnText:     { color: 'white', fontWeight: '700', fontSize: 14 },
});