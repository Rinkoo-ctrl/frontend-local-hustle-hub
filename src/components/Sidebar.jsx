const Sidebar = ({ setActiveTab }) => {
    return (
        <aside className="w-64 bg-gray-900 text-gray-100 h-full p-6 flex flex-col">
            <div className="mb-8">
                <h2 className="text-2xl font-semibold tracking-tight text-white">Freelancer</h2>
            </div>

            <nav className="flex-grow">
                <ul className="space-y-2">
                    <li>
                        <button
                            onClick={() => setActiveTab("dashboard")}
                            className="flex items-center w-full p-3 rounded-md transition-colors duration-200 hover:bg-gray-800 focus:outline-none focus:ring focus:ring-blue-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab("addService")}
                            className="flex items-center w-full p-3 rounded-md transition-colors duration-200 hover:bg-gray-800 focus:outline-none focus:ring focus:ring-blue-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            Add Service
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab("myServices")}
                            className="flex items-center w-full p-3 rounded-md transition-colors duration-200 hover:bg-gray-800 focus:outline-none focus:ring focus:ring-blue-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 17a2 2 0 11-4 0m5-14l-9 9a2 2 0 102.83 2.83L15 11m-9 14l5 5m5-5L9 9"
                                />
                            </svg>
                            My Services
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab("profile")}
                            className="flex items-center w-full p-3 rounded-md transition-colors duration-200 hover:bg-gray-800 focus:outline-none focus:ring focus:ring-blue-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Profile
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;