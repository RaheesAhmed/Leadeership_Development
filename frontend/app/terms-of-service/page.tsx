"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Book,
  Users,
  ShieldCheck,
  AlertTriangle,
  Scale,
  RefreshCw,
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

const TermsOfService = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: Book,
      content:
        "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. Additionally, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.",
    },
    {
      title: "User Conduct",
      icon: Users,
      content:
        "You agree to use our website for lawful purposes only and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our website.",
    },
    {
      title: "Intellectual Property",
      icon: ShieldCheck,
      content:
        "The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary rights. The copying, redistribution, use or publication by you of any such matters or any part of the Site is strictly prohibited.",
    },
    {
      title: "Disclaimer of Warranties",
      icon: AlertTriangle,
      content:
        "This site is provided on an 'as is' and 'as available' basis. We make no representations or warranties of any kind, express or implied, as to the operation of this site or the information, content, materials, or products included on this site. You expressly agree that your use of this site is at your sole risk.",
    },
    {
      title: "Limitation of Liability",
      icon: Scale,
      content:
        "We will not be liable for any damages of any kind arising from the use of this site, including, but not limited to direct, indirect, incidental, punitive, and consequential damages. Certain state laws do not allow limitations on implied warranties or the exclusion or limitation of certain damages. If these laws apply to you, some or all of the above disclaimers, exclusions, or limitations may not apply to you.",
    },
    {
      title: "Changes to Terms",
      icon: RefreshCw,
      content:
        "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.",
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
              Terms of Service
            </span>
          </h1>
          <p className="text-center text-muted-foreground mb-12">
            Please read these terms of service carefully before using our
            website. By using our service, you agree to be bound by these terms.
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="w-full">
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
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            If you have any questions about these Terms of Service, please
            contact us.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
