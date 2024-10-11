"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const BrainIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
);

const TargetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MessageSquareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const FileTextIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const BarChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <main className="container mx-auto px-6 py-12 relative z-10">
        <section className="text-center mb-20">
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 bg-gradient-to-r from-primary to-blue-500 mt-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Elevate Your Leadership
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Unlock your potential with AI-driven insights, personalized
            development plans, and intelligent assessments.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/start">
              <Button className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold py-6 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg text-lg">
                Start Your Journey <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </section>

        <section id="features" className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BrainIcon,
                title: "AI-Powered Insights",
                description:
                  "Leverage advanced AI to gain deep insights into your leadership style and potential.",
              },
              {
                icon: TargetIcon,
                title: "Personalized Development",
                description:
                  "Receive tailored strategies to enhance your skills and advance your career.",
              },
              {
                icon: UsersIcon,
                title: "Responsibility Classification",
                description:
                  "Understand your current leadership level and chart a path for growth.",
              },
              {
                icon: MessageSquareIcon,
                title: "Intelligent Chat System",
                description:
                  "Get instant, context-aware responses to your leadership queries.",
              },
              {
                icon: FileTextIcon,
                title: "Comprehensive Assessments",
                description:
                  "Multi-level evaluations to accurately gauge your leadership capabilities.",
              },
              {
                icon: BarChartIcon,
                title: "Progress Tracking",
                description:
                  "Monitor your growth and celebrate milestones along your leadership journey.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-card hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="process" className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-stretch space-y-8 md:space-y-0 md:space-x-8">
            {[
              {
                step: 1,
                title: "Complete Assessment",
                description:
                  "Answer our comprehensive questionnaire to help us understand your current leadership style and goals.",
              },
              {
                step: 2,
                title: "Receive AI Analysis",
                description:
                  "Our advanced AI analyzes your responses and generates personalized insights and recommendations.",
              },
              {
                step: 3,
                title: "Explore Your Plan",
                description:
                  "Review your tailored development plan and start your journey towards leadership excellence.",
              },
              {
                step: 4,
                title: "Continuous Growth",
                description:
                  "Engage with our AI chat, track your progress, and receive ongoing support and resources.",
              },
            ].map((step, index) => (
              <Card
                key={index}
                className="bg-card w-full md:w-64 text-center flex flex-col justify-between hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <CardHeader>
                  <CardTitle className="text-5xl font-bold text-primary mb-4">
                    {step.step}
                  </CardTitle>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="testimonials" className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Sarah J.",
                role: "Marketing Director",
                quote:
                  "CareerPro has been instrumental in helping me navigate my leadership journey. The personalized insights and actionable advice have been invaluable.",
              },
              {
                name: "Michael T.",
                role: "Tech Startup Founder",
                quote:
                  "As a first-time founder, the guidance I've received through CareerPro has been a game-changer. It's like having a leadership coach in my pocket.",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="bg-card hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <CardContent className="pt-6">
                  <p className="italic mb-4 text-lg">"{testimonial.quote}"</p>
                  <p className="font-semibold text-lg">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="cta" className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Leadership?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already benefiting from our
            AI-driven leadership development platform.
          </p>
          <Link href="/start">
            <Button className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold py-6 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg text-lg">
              Get Started Now <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
}
