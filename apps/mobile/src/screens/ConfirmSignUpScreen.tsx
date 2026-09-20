import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import * as auth from '../services/auth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';
import { AuthSheet } from '../components/ui/AuthSheet';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { PressableScale } from '../components/ui/PressableScale';
import { color, type } from '../theme/tokens';

type Props = NativeStackScreenProps<AuthStackParamList, 'ConfirmSignUp'>;

export function ConfirmSignUpScreen({ route }: Props) {
  const { email, password } = route.params;
  const { setSession } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!code.trim()) {
      setError('Enter the code');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await auth.confirmSignUp(email, code.trim());
      const session = await auth.signIn(email, password);
      setSession(session);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Confirmation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setNotice(null);
    try {
      await auth.resendConfirmationCode(email);
      setNotice('Code sent.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Resend failed');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthSheet eyebrow="Enter the code.">
      <Text style={styles.message}>Sent to {email}.</Text>
      <Field
        placeholder="Confirmation code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        editable={!loading}
        error={error}
      />
      <Button label="Continue" kind="quiet" onPress={handleConfirm} loading={loading} />
      <PressableScale onPress={handleResend} disabled={loading || resending}>
        <Text style={styles.link}>{resending ? 'Sending…' : 'Resend code'}</Text>
      </PressableScale>
      {notice ? <Text style={styles.notice}>{notice}</Text> : null}
    </AuthSheet>
  );
}

const styles = StyleSheet.create({
  message: {
    ...type.caption,
    color: color.stone,
  },
  link: {
    ...type.caption,
    color: color.ember,
    textAlign: 'center',
    marginTop: 8,
  },
  notice: {
    ...type.caption,
    color: color.mark,
    textAlign: 'center',
  },
});
