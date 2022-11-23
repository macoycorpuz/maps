import { UsernamePasswordOpts } from '@aws-amplify/auth/lib-esm/types';
import { Auth } from 'aws-amplify';
import Router from 'next/router';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ApiAttributes, CognitoUserExt, IAuthContext } from './index.interface';

type IAuthProvider = FC<{ children: ReactNode }>;

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const AuthProvider: IAuthProvider = ({ children }) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<CognitoUserExt>();
  const [apiAttributes, setApiAttributes] = useState<ApiAttributes>();
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  const authenticate = useCallback(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        setUser(user);
        setApiAttributes({
          domainId: user.attributes['custom:domainId'],
          role: user.attributes['custom:groupId'],
        });
      })
      .catch(error => {
        setUser(undefined);
        setApiAttributes(undefined);
        setError(error);
        if (error === 'The user is not authenticated') {
          setError(undefined);
        }
      })
      .finally(() => setIsLoadingInitial(false));
  }, []);

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  const login = (loginOpts: UsernamePasswordOpts) => {
    setIsLoading(true);
    Auth.signIn(loginOpts)
      .then(user => {
        setUser(user);
        setApiAttributes({
          domainId: user.attributes['custom:domainId'],
          role: user.attributes['custom:groupId'],
        });
        Router.push('/');
      })
      .catch(e => setError(e.message))
      .finally(() => setIsLoading(false));
  };

  const logout = () => {
    setIsLoading(true);
    Auth.signOut()
      .then(() => {
        setUser(undefined);
        setApiAttributes(undefined);
        setError(undefined);
        Router.push('/login');
      })
      .catch(e => setError(e))
      .finally(() => setIsLoading(false));
  };

  const memoedValue = useMemo(
    () => ({
      user,
      apiAttributes,
      isLoading,
      error,
      login,
      logout,
      setError,
    }),
    [user, apiAttributes, isLoading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!isLoadingInitial && children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
