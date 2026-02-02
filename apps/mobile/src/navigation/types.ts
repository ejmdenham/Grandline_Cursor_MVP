import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ConfirmSignUp: { email: string; password: string };
};

export type MainDrawerParamList = {
  Map: undefined;
  Profile: { title?: string };
  ActiveRace: { title?: string };
  Leaderboard: { title?: string };
  JoinRace: undefined;
  RulesSafety: { title?: string };
  Placeholder: { title: string };
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainDrawerParamList>;
};

/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-object-type */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
