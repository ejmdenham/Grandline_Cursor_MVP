import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRace } from '../contexts/RaceContext';
import { getRaceByInviteCode } from '../services/races';

export function JoinRaceScreen() {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { joinRace } = useRace();
  const navigation = useNavigation();

  const handleJoin = async () => {
    const code = inviteCode.trim();
    if (!code) {
      setError('Enter an invite code');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const race = await getRaceByInviteCode(code);
      joinRace(race);
      navigation.navigate('Map' as never);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not join race';
      setError(message);
      if (__DEV__) {
        console.warn('[JoinRace]', e);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.label}>Invite code</Text>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          value={inviteCode}
          onChangeText={(text) => {
            setInviteCode(text.toUpperCase());
            if (error) setError(null);
          }}
          placeholder="e.g. ABC123"
          placeholderTextColor="#888"
          autoCapitalize="characters"
          autoCorrect={false}
          editable={!loading}
          maxLength={20}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.button, loading ? styles.buttonDisabled : null]}
          onPress={handleJoin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Join race</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    fontSize: 18,
    marginBottom: 8,
  },
  inputError: {
    borderColor: '#c00',
  },
  error: {
    color: '#c00',
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
