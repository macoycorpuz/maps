import { ArrowLeftOnRectangleIcon, UserIcon } from '@heroicons/react/24/solid';

interface Props {
  name?: string;
  logout: () => void;
}

const NavFooter: React.FC<Props> = ({ name, logout }) => {
  return (
    <div className="flex flex-shrink-0 border-t px-2 py-4">
      <div className="group flex w-full flex-shrink-0">
        <div className="flex items-center">
          <UserIcon className="h-5 w-5 text-gray-500" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {name ?? <span className="text-red-500">Invalid User</span>}
            </p>
          </div>
          <button
            className="group absolute right-2 text-gray-500 hover:text-gray-900"
            onClick={logout}
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 " />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavFooter;
