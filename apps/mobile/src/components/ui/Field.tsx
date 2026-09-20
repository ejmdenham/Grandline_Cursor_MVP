import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { color, radius, type } from '../../theme/tokens';

interface FieldProps extends TextInputProps {
  error?: string | null;
}

export function Field({ error, style, onFocus, onBlur, ...rest }: FieldProps) {
  const [focused, setFocused] = useState(false);
  const ring = error ? color.flare : focused ? color.ember : color.dusk;

  return (
    <View>
      <TextInput
        {...rest}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        placeholderTextColor={color.stone}
        selectionColor={color.ember}
        cursorColor={color.ember}
        underlineColorAndroid="transparent"
        style={[styles.input, { borderColor: ring }, style]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: color.sand,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 40,
    color: color.ink,
    ...type.body,
  },
  error: {
    ...type.caption,
    color: color.flare,
    marginTop: 6,
  },
});
