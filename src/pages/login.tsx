import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FormEvent, useRef } from 'react';
import Logo from '../../public/images/colored/landscape.svg';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth/useAuth';

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { user, error, login } = useAuth();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({
      username: emailRef.current?.value ?? '',
      password: passwordRef.current?.value ?? '',
    });
  };

  if (user) {
    router.replace('/');
    return <Loader />;
  }

  return (
    <div className="h-screen sm:bg-gray-200">
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <Image src={Logo} alt="Minerva" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 sm:rounded-lg sm:px-10 sm:shadow-lg">
            {error && (
              <div className="mb-4 flex justify-center text-center text-sm text-red-600">
                <ExclamationTriangleIcon className="mr-1 h-5 w-5" />
                {error}
              </div>
            )}
            <form className="space-y-6" onSubmit={onSubmit}>
              <Input ref={emailRef} label="Email" type="email" />
              <Input ref={passwordRef} label="Password" type="password" />
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-primary-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
