"use client";
import { motion } from "framer-motion";
import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <header className=" bg-transparent">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.svg
              className="w-12 h-12 mr-3"
              viewBox="0 0 50 50"
              initial="hidden"
              animate="visible"
            >
              <motion.path
                d="M25 10L10 20L25 30L40 20L25 10Z"
                fill="url(#gradient)"
                strokeWidth="2"
                stroke="#4F46E5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.path
                d="M10 30L25 40L40 30"
                fill="none"
                strokeWidth="2"
                stroke="#4F46E5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="10"
                  y1="20"
                  x2="40"
                  y2="20"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4F46E5" />
                  <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </motion.svg>

            <span className="text-2xl font-bold text-gray-800">
              <Link href="/">CareerPro </Link>
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-indigo-600 transition duration-300"
            >
              Features
            </a>
            <a
              href="#process"
              className="text-gray-700 hover:text-indigo-600 transition duration-300"
            >
              Process
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-indigo-600 transition duration-300"
            >
              Testimonials
            </a>
          </div>
          <Link href="/start">
            <Button className="hidden md:block bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
