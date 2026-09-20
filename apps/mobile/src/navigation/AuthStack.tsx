import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { ConfirmSignUpScreen } from '../screens/ConfirmSignUpScreen';
import type { AuthStackParamList } from './types';
import { color } from '../theme/tokens';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: color.mapLand },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUpScreen} />
    </Stack.Navigator>
  );
}
