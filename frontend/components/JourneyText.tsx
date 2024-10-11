"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

const JourneyText = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg border border-indigo-200">
      <h2 className="text-4xl font-extrabold text-indigo-800 mb-6 text-center">
        Your Leadership <span className="text-indigo-600">Journey</span> Begins
      </h2>
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-indigo-600 first-letter:mr-3 first-letter:float-left">
          You stand at the{" "}
          <span className="font-semibold text-indigo-700">
            threshold of a transformative journey
          </span>
          —one of self-discovery and empowerment that will elevate your career
          to new heights. This process is far more than a simple assessment;
          it's a <span className="italic">strategic pathway</span> to unlocking
          your full potential in management and leadership.
        </p>
        <p>
          As you embark on this adventure, you'll gain{" "}
          <span className="underline decoration-indigo-400 decoration-2">
            profound insights
          </span>{" "}
          into:
        </p>
        <ul className="list-none space-y-2 pl-6">
          <li className="flex items-center">
            <ArrowUpRight className="text-indigo-500 mr-2" size={20} />
            <span className="font-medium">Your strengths</span>
          </li>
          <li className="flex items-center">
            <ArrowUpRight className="text-indigo-500 mr-2" size={20} />
            <span className="font-medium">Areas for growth</span>
          </li>
          <li className="flex items-center">
            <ArrowUpRight className="text-indigo-500 mr-2" size={20} />
            <span className="font-medium">
              Unique value you bring to your organization
            </span>
          </li>
        </ul>
        <p className="text-center font-bold text-lg bg-indigo-600 text-white py-4 px-6 rounded-lg shadow-md">
          Prepare to challenge yourself, expand your perspectives, and emerge as
          a more <span className="underline">confident, capable leader</span>{" "}
          ready to tackle the complexities of today's business world.
        </p>
      </div>
    </div>
  );
};

export default JourneyText;
