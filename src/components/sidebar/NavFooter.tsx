import { UserIcon } from '@heroicons/react/24/solid';

interface Props {
  name?: string;
}

const NavFooter: React.FC<Props> = ({ name }) => {
  return (
    <div className="flex flex-shrink-0 px-4 py-4">
      <div className="group block w-full flex-shrink-0">
        <div className="flex items-center">
          <UserIcon className="h-5 w-5 text-gray-500" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {name ?? <span className="text-red-500">Invalid User</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavFooter;
