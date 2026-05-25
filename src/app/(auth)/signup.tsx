import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, Pressable,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { Icon } from '@/components/icon';

const BLUE = '#0C5AC3';

export default function SignUpScreen() {
  const [tab, setTab] = useState<'login' | 'signup'>('signup');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const { signUp, loading, error, clearError } = useAuthStore();

  const handleSignUp = async () => {
    if (!displayName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    clearError();
    await signUp(email, password, displayName);
  };

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View style={s.titleWrap}>
            <Text style={s.brand}>Gold List</Text>
            <Text style={s.tagline}>Master memory with low-stress intervals.</Text>
          </View>

          {/* Card */}
          <View style={s.card}>
            {/* Tab Toggle */}
            <View style={s.tabRow}>
              <Link href="/(auth)/login" asChild>
                <Pressable style={[s.tabBtn, tab === 'login' && s.tabActive]}>
                  <Text style={[s.tabTxt, tab === 'login' && s.tabTxtActive]}>Log In</Text>
                </Pressable>
              </Link>
              <Pressable
                style={StyleSheet.flatten([s.tabBtn, tab === 'signup' && s.tabActive])}
                onPress={() => setTab('signup')}
              >
                <Text style={[s.tabTxt, tab === 'signup' && s.tabTxtActive]}>Sign Up</Text>
              </Pressable>
            </View>

            {/* Error */}
            {error && (
              <View style={s.errorBox}>
                <Text style={s.errorTxt}>{error}</Text>
                <Pressable onPress={clearError}><Text style={s.errorDismiss}>✕</Text></Pressable>
              </View>
            )}

            {/* Display Name */}
            <View style={s.field}>
              <Text style={s.fieldLabel}>Display Name</Text>
              <TextInput
                style={s.input}
                placeholder="John Doe"
                placeholderTextColor="#9CA3AF"
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>

            {/* Email */}
            <View style={s.field}>
              <Text style={s.fieldLabel}>Email Address</Text>
              <TextInput
                style={s.input}
                placeholder="name@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Password */}
            <View style={s.field}>
              <Text style={s.fieldLabel}>Password</Text>
              <View style={s.pwWrap}>
                <TextInput
                  style={[s.input, { flex: 1, borderWidth: 0 }]}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPw}
                />
                <Pressable onPress={() => setShowPw(!showPw)} style={s.eyeBtn}>
                  <Icon name="person.circle.fill" size={20} color="#94A3B8" />
                </Pressable>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={s.field}>
              <Text style={s.fieldLabel}>Confirm Password</Text>
              <View style={s.pwWrap}>
                <TextInput
                  style={[s.input, { flex: 1, borderWidth: 0 }]}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPw}
                />
              </View>
            </View>

            {/* SignUp Button */}
            <Pressable style={[s.btn, loading && s.btnDisabled]} onPress={handleSignUp} disabled={loading}>
              <Text style={s.btnTxt}>{loading ? 'Creating account...' : 'Sign Up'}</Text>
            </Pressable>
          </View>

          {/* Quote */}
          <Text style={s.quote}>
            "Long-term memory is a process, not an event. Take the first step today."
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FC' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  titleWrap: { alignItems: 'center', marginBottom: 32, marginTop: 40 },
  brand: {
    fontSize: 32, fontWeight: '800', color: BLUE,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', marginBottom: 8,
  },
  tagline: { fontSize: 15, color: '#475569', textAlign: 'center' },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24,
    borderWidth: 1, borderColor: '#E8EEF9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 14, elevation: 4,
  },
  tabRow: {
    flexDirection: 'row', backgroundColor: '#F1F5F9',
    borderRadius: 12, padding: 4, marginBottom: 24,
  },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  tabTxt: { fontSize: 15, fontWeight: '600', color: '#64748B' },
  tabTxtActive: { color: BLUE },
  errorBox: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12, marginBottom: 16,
  },
  errorTxt: { color: '#EF4444', flex: 1, fontSize: 13 },
  errorDismiss: { color: '#EF4444', fontWeight: '700', paddingLeft: 8 },
  field: { marginBottom: 18 },
  fieldLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  pwWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12,
    backgroundColor: '#F8FAFC', paddingRight: 12,
  },
  eyeBtn: { padding: 4 },
  btn: {
    backgroundColor: BLUE, borderRadius: 12, paddingVertical: 16,
    alignItems: 'center', marginTop: 6, marginBottom: 10,
  },
  btnDisabled: { opacity: 0.6 },
  btnTxt: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  quote: { textAlign: 'center', fontSize: 13, color: '#94A3B8', marginTop: 28, lineHeight: 20, paddingHorizontal: 10 },
});
