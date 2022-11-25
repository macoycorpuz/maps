interface Props {
  classNames?: string;
}

const Loader: React.FC<Props> = ({ classNames = '' }) => {
  return (
    <div
      className={`h-24 w-24 animate-spin rounded-full border-8 border-solid border-blue-400 border-t-transparent ${classNames}`}
    ></div>
  );
};

export default Loader;
