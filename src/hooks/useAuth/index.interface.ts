import { CognitoUser } from '@aws-amplify/auth';
import { UsernamePasswordOpts } from '@aws-amplify/auth/lib-esm/types';

export interface IAuthContext {
  user?: CognitoUserExt;
  apiAttributes?: ApiAttributes;
  isLoading: boolean;
  error?: string;
  login: LoginOpts;
  logout: () => void;
}

export type LoginOpts = (_: UsernamePasswordOpts) => void;

export interface CognitoUserExt extends CognitoUser {
  attributes: UserAttributes;
}

export interface ApiAttributes {
  domainId: string;
  role: string;
}

export interface UserAttributes {
  sub: string;
  name: string;
  family_name: string;
  given_name: string;
  email: string;
  phone_number: string;
  updated_at: string;
  email_verified: Boolean;
  phone_number_verified: Boolean;
  'custom:domainId': string;
  'custom:groupId': string;
  'custom:userClassType': string;
}
