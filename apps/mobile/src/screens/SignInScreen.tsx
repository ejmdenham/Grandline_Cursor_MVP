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

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

export function SignInScreen({ navigation }: Props) {
  const { setSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setError('Enter email and password');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const session = await auth.signIn(email.trim(), password);
      setSession(session);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSheet eyebrow="The map is waiting.">
      <Field
        placeholder="Email"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          if (error) setError(null);
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        editable={!loading}
      />
      <Field
        placeholder="Password"
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          if (error) setError(null);
        }}
        secureTextEntry
        autoComplete="password"
        editable={!loading}
        error={error}
      />
      <Button label="Continue" kind="quiet" onPress={handleSignIn} loading={loading} />
      <PressableScale onPress={() => navigation.navigate('SignUp')} disabled={loading}>
        <Text style={styles.link}>
          Need an account? <Text style={styles.linkEmber}>Sign up</Text>
        </Text>
      </PressableScale>
    </AuthSheet>
  );
}

const styles = StyleSheet.create({
  link: {
    ...type.caption,
    color: color.stone,
    textAlign: 'center',
    marginTop: 8,
  },
  linkEmber: {
    color: color.ember,
    fontWeight: '600',
  },
});
