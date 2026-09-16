import React, { useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useAuth } from '../../constants/AuthContext';

const validateEmail    = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
const validatePassword = (p: string) => p.length >= 6;
const validatePhone    = (p: string) => /^[0-9+\-\s]{7,15}$/.test(p.trim());

type FieldErrors = {
  username?: string; email?: string;
  phone?: string; password?: string; confirm?: string;
};

// ── Field component OUTSIDE SignupScreen so it never remounts on re-render ───
type FieldProps = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  error?: string;
  keyboardType?: any;
  secure?: boolean;
  showText?: boolean;
  onToggleShow?: () => void;
  returnKeyType?: any;
  onSubmitEditing?: () => void;
  editable?: boolean;
};

const Field = ({
  label, value, onChangeText, placeholder, error,
  keyboardType = 'default', secure = false, showText = false,
  onToggleShow, returnKeyType = 'next', onSubmitEditing, editable = true,
}: FieldProps) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={[
      secure ? styles.passwordRow : styles.inputWrap,
      !!error && styles.inputError,
    ]}>
      <TextInput
        style={secure ? styles.passwordInput : styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'email-address' || keyboardType === 'phone-pad' ? 'none' : 'sentences'}
        autoCorrect={false}
        secureTextEntry={secure && !showText}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        editable={editable}
        // Prevent keyboard dismiss on re-render
        blurOnSubmit={returnKeyType === 'done'}
      />
      {secure && onToggleShow && (
        <TouchableOpacity
          onPress={onToggleShow}
          style={styles.eyeBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.eyeIcon}>{showText ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      )}
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [username, setUsername]   = useState('');
  const [email, setEmail]         = useState('');
  const [phone, setPhone]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [errors, setErrors]       = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  const clearError = useCallback((field: keyof FieldErrors) =>
    setErrors((e) => ({ ...e, [field]: undefined })), []);

  const validate = useCallback((): boolean => {
    const errs: FieldErrors = {};
    if (!username.trim())                errs.username = 'Username is required.';
    else if (username.trim().length < 3) errs.username = 'Username must be at least 3 characters.';
    if (!email.trim())                   errs.email    = 'Email is required.';
    else if (!validateEmail(email))      errs.email    = 'Enter a valid email address.';
    if (phone && !validatePhone(phone))  errs.phone    = 'Enter a valid phone number.';
    if (!password)                       errs.password = 'Password is required.';
    else if (!validatePassword(password))errs.password = 'Password must be at least 6 characters.';
    if (!confirm)                        errs.confirm  = 'Please confirm your password.';
    else if (password !== confirm)       errs.confirm  = 'Passwords do not match.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [username, email, phone, password, confirm]);

  const handleSignup = useCallback(async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await signUp(email.trim().toLowerCase(), password, {
        username: username.trim(),
        phone:    phone.trim(),
      });
      router.replace('/' as Href);
    } catch (e: any) {
      const code = e?.code ?? '';
      const message =
        code === 'auth/email-already-in-use'  ? 'An account with this email already exists.' :
        code === 'auth/invalid-email'          ? 'The email address is not valid.' :
        code === 'auth/weak-password'          ? 'Please choose a stronger password.' :
        code === 'auth/network-request-failed' ? 'Network error. Check your connection.' :
        'Signup failed. Please try again.';
      Alert.alert('Signup Failed', message);
    } finally {
      setIsLoading(false);
    }
  }, [validate, signUp, email, password, username, phone, router]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.logo}>SD Fashion</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join SD Fashion today</Text>
          </View>

          <View style={styles.form}>

            <Field
              label="Username"
              value={username}
              onChangeText={(t) => { setUsername(t); clearError('username'); }}
              placeholder="e.g. john_doe"
              error={errors.username}
              editable={!isLoading}
            />

            <Field
              label="Email Address"
              value={email}
              onChangeText={(t) => { setEmail(t); clearError('email'); }}
              placeholder="you@example.com"
              error={errors.email}
              keyboardType="email-address"
              editable={!isLoading}
            />

            <Field
              label="Phone Number (optional)"
              value={phone}
              onChangeText={(t) => { setPhone(t); clearError('phone'); }}
              placeholder="+234 800 000 0000"
              error={errors.phone}
              keyboardType="phone-pad"
              editable={!isLoading}
            />

            <Field
              label="Password"
              value={password}
              onChangeText={(t) => { setPassword(t); clearError('password'); }}
              placeholder="Min. 6 characters"
              error={errors.password}
              secure
              showText={showPassword}
              onToggleShow={() => setShowPassword((v) => !v)}
              editable={!isLoading}
            />

            <Field
              label="Confirm Password"
              value={confirm}
              onChangeText={(t) => { setConfirm(t); clearError('confirm'); }}
              placeholder="Re-enter your password"
              error={errors.confirm}
              secure
              showText={showConfirm}
              onToggleShow={() => setShowConfirm((v) => !v)}
              returnKeyType="done"
              onSubmitEditing={handleSignup}
              editable={!isLoading}
            />

            <TouchableOpacity
              style={[styles.btn, isLoading && styles.btnDisabled]}
              onPress={handleSignup}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading
                ? <ActivityIndicator color="white" size="small" />
                : <Text style={styles.btnText}>Create Account</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkBtn}
              onPress={() => router.replace('/auth/login' as Href)}
              disabled={isLoading}
            >
              <Text style={styles.linkText}>
                Already have an account?{' '}
                <Text style={styles.linkBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#FAFAFA' },
  scroll:        { flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: 40 },
  header:        { alignItems: 'center', marginBottom: 32 },
  logo:          { fontSize: 28, fontWeight: '800', color: '#6366F1', letterSpacing: -0.5, marginBottom: 12 },
  title:         { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle:      { fontSize: 15, color: '#6B7280' },
  form:          { backgroundColor: 'white', borderRadius: 20, padding: 24,
                   shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
                   shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  fieldGroup:    { marginBottom: 16 },
  label:         { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  inputWrap:     {},
  input:         { backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#E5E7EB',
                   borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13,
                   fontSize: 15, color: '#111827' },
  inputError:    { borderColor: '#EF4444', backgroundColor: '#FFF5F5', borderRadius: 12 },
  passwordRow:   { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB',
                   borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12,
                   paddingHorizontal: 16 },
  passwordInput: { flex: 1, paddingVertical: 13, fontSize: 15, color: '#111827' },
  eyeBtn:        { padding: 4 },
  eyeIcon:       { fontSize: 18 },
  errorText:     { fontSize: 12, color: '#EF4444', marginTop: 5, marginLeft: 2 },
  btn:           { backgroundColor: '#6366F1', borderRadius: 14, paddingVertical: 16,
                   alignItems: 'center', marginTop: 8 },
  btnDisabled:   { backgroundColor: '#A5B4FC' },
  btnText:       { color: 'white', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  linkBtn:       { alignItems: 'center', paddingVertical: 12, marginTop: 8 },
  linkText:      { fontSize: 14, color: '#6B7280' },
  linkBold:      { color: '#6366F1', fontWeight: '700' },
});