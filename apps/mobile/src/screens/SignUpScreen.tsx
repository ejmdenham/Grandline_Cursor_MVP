import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import * as auth from '../services/auth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';
import { AuthSheet } from '../components/ui/AuthSheet';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { PressableScale } from '../components/ui/PressableScale';
import { color, type } from '../theme/tokens';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!email.trim() || !password) {
      setError('Enter email and password');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await auth.signUp(email.trim(), password, name.trim() || undefined);
      navigation.navigate('ConfirmSignUp', { email: email.trim(), password });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSheet eyebrow="Create an account.">
      <Field
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        editable={!loading}
      />
      <Field
        placeholder="Password (min 8 chars)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        editable={!loading}
        error={error}
      />
      <Field
        placeholder="Name (optional)"
        value={name}
        onChangeText={setName}
        autoComplete="name"
        editable={!loading}
      />
      <Button label="Continue" kind="quiet" onPress={handleSignUp} loading={loading} />
      <PressableScale onPress={() => navigation.navigate('SignIn')} disabled={loading}>
        <Text style={styles.link}>
          Already have an account? <Text style={styles.linkEmber}>Sign in</Text>
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
