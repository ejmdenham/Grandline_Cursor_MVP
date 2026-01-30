import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type MainDrawerParamList = {
  Map: undefined;
  Profile: { title?: string };
  ActiveRace: { title?: string };
  Leaderboard: { title?: string };
  JoinRace: { title?: string };
  RulesSafety: { title?: string };
  Placeholder: { title: string };
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainDrawerParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
