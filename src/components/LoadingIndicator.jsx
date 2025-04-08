const LoadingIndicator = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
            
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
            {/* <div className="mt-4 text-xl font-semibold text-gray-700">
                Loading services, please wait...
            </div> */}
        </div>
    );
};

export default LoadingIndicator;