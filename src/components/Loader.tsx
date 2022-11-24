const Loader: React.FC<{}> = () => {
  return (
    <div className="relative h-screen w-screen">
      <div className="absolute right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2 transform ">
        <div className="h-24 w-24 animate-spin rounded-full border-8 border-solid border-blue-400 border-t-transparent"></div>
      </div>
    </div>
  );
};

export default Loader;
