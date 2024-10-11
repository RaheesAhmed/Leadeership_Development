"use client";
import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, Server, Bell } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Information Collection",
      icon: FileText,
      content:
        "We collect information you provide directly to us, such as when you create an account, use our services, or communicate with us. This may include your name, email address, and other personal information.",
    },
    {
      title: "Data Usage",
      icon: Eye,
      content:
        "We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our company and users. We may also use the information to communicate with you about our services.",
    },
    {
      title: "Data Protection",
      icon: Shield,
      content:
        "We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights.",
    },
    {
      title: "Data Sharing",
      icon: Server,
      content:
        "We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you.",
    },
    {
      title: "Cookies",
      icon: Lock,
      content:
        "We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.",
    },
    {
      title: "Updates to This Policy",
      icon: Bell,
      content:
        "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'last updated' date at the top of this page.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-center mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              Privacy Policy
            </span>
          </h1>
          <p className="text-center text-muted-foreground mb-12">
            Your privacy is important to us. It is our policy to respect your
            privacy regarding any information we may collect from you across our
            website.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-semibold mb-2">
                    <section.icon className="w-6 h-6 mr-2 text-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{section.content}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact
            us.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
