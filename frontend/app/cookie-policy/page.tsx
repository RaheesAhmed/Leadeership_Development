"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Cookie,
  Info,
  Shield,
  Settings,
  BarChart,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CookiePolicy = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sections = [
    {
      title: "What Are Cookies",
      icon: Info,
      content:
        "Cookies are small pieces of data stored on your device (computer or mobile device) when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the owners of the site.",
    },
    {
      title: "How We Use Cookies",
      icon: Cookie,
      content:
        "We use cookies for a variety of reasons, including to understand and save user preferences for future visits, compile aggregate data about site traffic and site interactions, and to provide a better, more personalized user experience.",
    },
    {
      title: "Types of Cookies We Use",
      icon: Settings,
      content:
        "We use both session cookies, which expire when you close your browser, and persistent cookies, which stay on your device until you delete them. Additionally, we use first-party cookies, which are set by us, and third-party cookies, which are set by other domains.",
    },
    {
      title: "Your Cookie Choices",
      icon: Shield,
      content:
        "Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, as it will no longer be personalized to you.",
    },
    {
      title: "Analytics and Performance",
      icon: BarChart,
      content:
        "We use analytics cookies to collect information about how visitors use our website. These cookies help us to improve our website by providing insights into how users interact with our site, which pages are visited most often, and how users navigate through the site.",
    },
    {
      title: "Third-Party Cookies",
      icon: ExternalLink,
      content:
        "Some of our pages may contain content from other sites, like YouTube or Vimeo, which may set their own cookies. Also, if you share a link to our page, the service you share it on may set a cookie on your browser. We have no control over third-party cookies.",
    },
  ];

  const handleCookieSettings = () => {
    if (typeof window !== "undefined") {
      if (
        window.CookieConsent &&
        typeof window.CookieConsent.showSettings === "function"
      ) {
        window.CookieConsent.showSettings();
      } else {
        console.warn("CookieConsent object or showSettings method not found");
        setIsDialogOpen(true);
      }
    }
  };

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
              Cookie Policy
            </span>
          </h1>
          <p className="text-center text-muted-foreground mb-12">
            This Cookie Policy explains how we use cookies and similar
            technologies to recognize you when you visit our website.
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="w-full mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger>
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl font-semibold">
                        <section.icon className="w-6 h-6 mr-2 text-primary" />
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="pt-4">
                      <CardDescription>{section.content}</CardDescription>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">
            Managing Your Cookie Preferences
          </h2>
          <p className="mb-6 text-muted-foreground">
            You can manage your cookie preferences at any time by clicking the
            button below.
          </p>
          <Button
            className="bg-primary text-white hover:bg-primary/90"
            onClick={handleCookieSettings}
          >
            Manage Cookie Settings
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            If you have any questions about our Cookie Policy, please contact
            us.
          </p>
        </motion.div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cookie Settings Unavailable</DialogTitle>
              <DialogDescription>
                We apologize, but the cookie settings management tool is not
                currently available. To manage your cookie preferences, you can:
                <ul className="list-disc list-inside mt-2">
                  <li>
                    Check your browser settings for cookie management options
                  </li>
                  <li>Use your browser's incognito/private mode</li>
                  <li>Clear your browser's cookies and site data</li>
                </ul>
                We're working on implementing a comprehensive cookie management
                solution. Thank you for your understanding.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CookiePolicy;
