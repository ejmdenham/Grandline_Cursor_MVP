import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { ConfirmSignUpScreen } from '../screens/ConfirmSignUpScreen';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, title: 'Grandline' }}>
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Sign in' }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign up' }} />
      <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUpScreen} options={{ title: 'Confirm your email' }} />
    </Stack.Navigator>
  );
}
