import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRace } from '../contexts/RaceContext';
import { getRaceByInviteCode } from '../services/races';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { InstrumentPage } from '../components/ui/InstrumentPage';

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
    <InstrumentPage title="Join race" meta="Invite code">
      <View style={styles.field}>
        <Field
          value={inviteCode}
          onChangeText={(text) => {
            setInviteCode(text.toUpperCase());
            if (error) setError(null);
          }}
          placeholder="ABC123"
          autoCapitalize="characters"
          autoCorrect={false}
          editable={!loading}
          maxLength={20}
          error={error}
        />
      </View>
      <Button label="Join" kind="ember" onPress={handleJoin} loading={loading} />
    </InstrumentPage>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
});
