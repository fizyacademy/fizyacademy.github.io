import ThemeToggle from "../components/ThemeToggle";

const Loading = () => {
  return (
    <div className="">
      <ThemeToggle className="z-[-1]"/>
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-950 h-screen transition-colors duration-500 w-full fixed top-0 left-0">
        <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default Loading;
