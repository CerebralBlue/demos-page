"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LandingPage = () => {
    const words = ["ecommerce", "portfolio", "landing"];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-screen">
            <section
                id="hero"
                className="hero bg-gradient-to-r from-[#7E6BC3] to-[#5A4E8E] px-6 md:px-12 flex flex-col md:flex-row items-center justify-center h-full"
            >
                <div className="flex flex-col items-center text-center md:items-start md:text-left w-full md:w-1/2">
                    <h1 className="text-3xl font-bold text-white md:text-4xl">
                        Automate all processes. Automate your{" "}
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className="text-yellow-300"
                        >
                            {words[index]}
                        </motion.span>.
                    </h1>
                    <p className="mt-4 text-base md:text-lg text-white">
                        Create smooth and handy automations with NeuralSeek.
                    </p>
                    <button className="bg-gray-800 text-white mt-4 px-8 py-2 rounded transition-all transform hover:bg-purple-600 hover:scale-105 hover:shadow-lg">
                        Get Started
                    </button>

                </div>
            </section>
        </div>
    );
};

export default LandingPage;
