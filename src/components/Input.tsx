import {
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/solid';
import { forwardRef, ForwardRefRenderFunction, useState } from 'react';
import { classNames } from '../lib/classNames';

interface Props {
  label: string;
  type: string;
  error?: any;
}

type Component = ForwardRefRenderFunction<HTMLInputElement, Props>;

const Open = () => <EyeIcon className="h-5 w-5 text-gray-600" />;
const Close = () => <EyeSlashIcon className="h-5 w-5 text-gray-300" />;

const Input: Component = ({ label, type, error }, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const toggle = () => setIsPasswordVisible(prev => !prev);

  return (
    <div>
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          ref={ref}
          name={label}
          type={isPasswordVisible ? 'text' : type}
          className={classNames(
            error
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500',
            'block w-full rounded-md pr-10 focus:outline-none sm:text-sm'
          )}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {error && <ExclamationCircleIcon className="h-5 w-5 text-red-500" />}
          {type === 'password' && (
            <div className="cursor-pointer" onClick={toggle}>
              {isPasswordVisible ? <Close /> : <Open />}
            </div>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm text-red-600" id="email-error">
        {error}
      </p>
    </div>
  );
};
export default forwardRef(Input);
