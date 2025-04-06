import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TypingText from "../components/TypingText";


const Home = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-white to-green-100 px-6 py-16"
        >
            <motion.div
                variants={itemVariants}
                className="text-center"
            >
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                    Welcome to <TypingText text="Local Hustle Hub!" speed={70} pause={500} />
                </h1>

                <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                    Connect with skilled local freelancers — whether it’s plumbing, teaching, or designing.
                    Hire instantly, browse trusted reviews, and get things done locally with ease.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/login">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-700 hover:bg-blue-800 text-white px-10 py-3 rounded-full shadow-xl transition duration-300 font-medium"
                        >
                            Login
                        </motion.button>
                    </Link>
                    <Link to="/register">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-full shadow-xl transition duration-300 font-medium"
                        >
                            Register
                        </motion.button>
                    </Link>
                </div>
            </motion.div>

            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.8 } },
                }}
                className="mt-16"
            >
                <img
                    src="https://illustrations.popsy.co/gray/home-from-work.svg"
                    alt="Freelancer Illustration"
                    className="w-72 md:w-[420px] mx-auto drop-shadow-md"
                />
            </motion.div>
        </motion.div>
    );
};

export default Home;
