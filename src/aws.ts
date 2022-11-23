import { Amplify, Auth } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_WEB_CLIENT_ID,
    identityPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,

    mandatorySignIn: true,
    // authenticationFlowType: 'USER_PASSWORD_AUTH',
  },
  API: {
    endpoints: [
      {
        region: process.env.NEXT_PUBLIC_AWS_REGION,
        name: process.env.NEXT_PUBLIC_AWS_ENDPOINT_NAME,
        endpoint: process.env.NEXT_PUBLIC_AWS_ENDPOINT_URL,
      },
    ],
  },
  Storage: {
    AWSS3: {
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    },
  },
});

export const awsConfig = Auth.configure();
