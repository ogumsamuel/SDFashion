import React, { useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useAuth } from '../../constants/AuthContext';

// ── Validation ────────────────────────────────────────────────────────────────
const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const validatePassword = (password: string) => password.length >= 6;

type FieldErrors = { email?: string; password?: string };

// ── Component ─────────────────────────────────────────────────────────────────
export default function LoginScreen() {
  const router = useRouter();
  const { logIn } = useAuth();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [errors, setErrors]       = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validate fields before submitting
  const validate = useCallback((): boolean => {
    const newErrors: FieldErrors = {};
    if (!email.trim())           newErrors.email    = 'Email is required.';
    else if (!validateEmail(email)) newErrors.email = 'Enter a valid email address.';
    if (!password)               newErrors.password = 'Password is required.';
    else if (!validatePassword(password)) newErrors.password = 'Password must be at least 6 characters.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const handleLogin = useCallback(async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await logIn(email.trim().toLowerCase(), password);
      // Success — Expo Router will redirect based on auth state
      router.replace('/' as Href);
    } catch (e: any) {
      // Map Firebase error codes to friendly messages
      const code = e?.code ?? '';
      const message =
        code === 'auth/user-not-found'    ? 'No account found with this email.' :
        code === 'auth/wrong-password'    ? 'Incorrect password. Please try again.' :
        code === 'auth/too-many-requests' ? 'Too many attempts. Please wait and try again.' :
        code === 'auth/network-request-failed' ? 'Network error. Check your connection.' :
        'Login failed. Please try again.';
      Alert.alert('Login Failed', message);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, validate, logIn, router]);

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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>SD Fashion</Text>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, errors.email ? styles.inputError : null]}
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: undefined })); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                returnKeyType="next"
                editable={!isLoading}
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.passwordRow, errors.password ? styles.inputError : null]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: undefined })); }}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.btn, isLoading && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading
                ? <ActivityIndicator color="white" size="small" />
                : <Text style={styles.btnText}>Sign In</Text>
              }
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign up link */}
            <TouchableOpacity
              style={styles.linkBtn}
              onPress={() => router.push('/auth/signup' as Href)}
              disabled={isLoading}
            >
              <Text style={styles.linkText}>
                Don&apos;t have an account?{' '}
                <Text style={styles.linkBold}>Create one</Text>
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: '#FAFAFA' },
  scroll:       { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header:       { alignItems: 'center', marginBottom: 36 },
  logo:         { fontSize: 28, fontWeight: '800', color: '#6366F1', letterSpacing: -0.5, marginBottom: 12 },
  title:        { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle:     { fontSize: 15, color: '#6B7280' },
  form:         { backgroundColor: 'white', borderRadius: 20, padding: 24,
                  shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  fieldGroup:   { marginBottom: 18 },
  label:        { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input:        { backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#E5E7EB',
                  borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13,
                  fontSize: 15, color: '#111827' },
  inputError:   { borderColor: '#EF4444', backgroundColor: '#FFF5F5' },
  passwordRow:  { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB',
                  borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12,
                  paddingHorizontal: 16 },
  passwordInput:{ flex: 1, paddingVertical: 13, fontSize: 15, color: '#111827' },
  eyeBtn:       { padding: 4 },
  eyeIcon:      { fontSize: 18 },
  errorText:    { fontSize: 12, color: '#EF4444', marginTop: 5, marginLeft: 2 },
  btn:          { backgroundColor: '#6366F1', borderRadius: 14, paddingVertical: 16,
                  alignItems: 'center', marginTop: 4 },
  btnDisabled:  { backgroundColor: '#A5B4FC' },
  btnText:      { color: 'white', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  divider:      { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine:  { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText:  { marginHorizontal: 12, fontSize: 13, color: '#9CA3AF' },
  linkBtn:      { alignItems: 'center', paddingVertical: 4 },
  linkText:     { fontSize: 14, color: '#6B7280' },
  linkBold:     { color: '#6366F1', fontWeight: '700' },
});