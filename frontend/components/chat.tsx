"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${apiUrl}/api/assistant/create-thread`,
        {}
      );
      const threadId = response.data.id;

      await axios.post(`${apiUrl}/api/assistant/create-message/${threadId}`, {
        role: "user",
        content: input,
      });

      const runResponse = await axios.post(
        `${apiUrl}/api/assistant/create-run/${threadId}`,
        {
          assistant_id: process.env.NEXT_PUBLIC_ASSISTANT_ID,
        }
      );
      const runId = runResponse.data.id;

      const eventSource = new EventSource(
        `${apiUrl}/api/assistant/stream-run/${threadId}/${runId}`
      );

      let assistantMessage = "";

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "status") {
          console.log("Run status:", data.content);
        } else if (data.type === "message") {
          assistantMessage += data.content;
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: "assistant", content: assistantMessage },
          ]);
        } else if (data.type === "error") {
          console.error("Error:", data.content);
          setIsLoading(false);
        } else if (data === "[DONE]") {
          eventSource.close();
          setIsLoading(false);
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
        setIsLoading(false);
      };
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-[350px] h-[500px] flex flex-col shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Chat with AI Assistant
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                  <AnimatePresence initial={false}>
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        } mb-4`}
                      >
                        <div
                          className={`flex items-end ${
                            message.role === "user"
                              ? "flex-row-reverse"
                              : "flex-row"
                          }`}
                        >
                          <Avatar
                            className={
                              message.role === "user" ? "ml-2" : "mr-2"
                            }
                          >
                            <AvatarImage
                              src={
                                message.role === "user"
                                  ? "/user-avatar.png"
                                  : "/ai-avatar.png"
                              }
                              alt={message.role}
                            />
                            <AvatarFallback>
                              {message.role === "user" ? "U" : "AI"}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isLoading && (
                    <div className="flex justify-start mb-4">
                      <div className="flex items-end">
                        <Avatar className="mr-2">
                          <AvatarImage src="/ai-avatar.png" alt="AI" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                  <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading} size="icon">
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              size="icon"
              className="rounded-full w-12 h-12 shadow-lg"
              onClick={() => setIsOpen(true)}
              aria-label="Open chat"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
