import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import * as auth from '../services/auth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ConfirmSignUp'>;

export function ConfirmSignUpScreen({ route }: Props) {
  const { email, password } = route.params;
  const { setSession } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleConfirm = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      await auth.confirmSignUp(email, code.trim());
      const session = await auth.signIn(email, password);
      setSession(session);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Confirmation failed';
      Alert.alert('Confirmation failed', message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await auth.resendConfirmationCode(email);
      Alert.alert('Code sent', 'Check your email for a new code.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Resend failed';
      Alert.alert('Resend failed', message);
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Confirm your email</Text>
      <Text style={styles.message}>We sent a code to {email}. Enter it below.</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirmation code (6 digits)"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        editable={!loading}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleConfirm}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Confirm</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.link}
        onPress={handleResend}
        disabled={loading || resending}
      >
        <Text style={styles.linkText}>
          {resending ? 'Sending…' : 'Resend code'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: '#0066cc',
    fontSize: 14,
  },
});
