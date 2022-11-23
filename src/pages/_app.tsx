import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Amplify } from 'aws-amplify';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { awsConfig } from '../aws';
import { AuthProvider } from '../hooks/useAuth/useAuth';
import '../styles/globals.css';

Amplify.configure(awsConfig);

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
};

export default App;
