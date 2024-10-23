"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Send,
  Loader2,
  Plus,
  MessageSquare,
  User,
  Bot,
  FileText,
  Database,
  Settings,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Thread {
  id: string;
  title: string;
  messages: Message[];
}

interface Assistant {
  id: string;
  name: string;
  description: string;
}

interface File {
  id: string;
  filename: string;
  purpose: string;
}

interface VectorStore {
  id: string;
  name: string;
  description: string;
}

const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export default function AdminChatGPTDashboard() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [vectorStores, setVectorStores] = useState<VectorStore[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<string | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAssistants();
    fetchFiles();
    fetchVectorStores();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentThread?.messages]);

  const fetchAssistants = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/assistant/list-assistants`
      );
      setAssistants(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching assistants:", error);
      toast({
        title: "Error",
        description: "Failed to fetch assistants",
        variant: "destructive",
      });
      setAssistants([]); // Set to an empty array in case of error
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/assistant/list-files`);
      setFiles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast({
        title: "Error",
        description: "Failed to fetch files",
        variant: "destructive",
      });
      setFiles([]); // Set to an empty array in case of error
    }
  };

  const fetchVectorStores = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/assistant/list-vector-stores`
      );
      setVectorStores(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching vector stores:", error);
      toast({
        title: "Error",
        description: "Failed to fetch vector stores",
        variant: "destructive",
      });
      setVectorStores([]); // Set to an empty array in case of error
    }
  };

  const createNewThread = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/assistant/create-thread`
      );
      const newThread: Thread = {
        id: response.data.id,
        title: "New Thread",
        messages: [],
      };
      setThreads([newThread, ...threads]);
      setCurrentThread(newThread);
    } catch (error) {
      console.error("Error creating new thread:", error);
      toast({
        title: "Error",
        description: "Failed to create new thread",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentThread || !selectedAssistant) return;

    const userMessage: Message = { role: "user", content: input };
    setCurrentThread((prev) => ({
      ...prev!,
      messages: [...prev!.messages, userMessage],
    }));
    setInput("");
    setIsLoading(true);

    try {
      await axios.post(
        `${apiUrl}/api/assistant/create-message/${currentThread.id}`,
        {
          role: "user",
          content: input,
        }
      );

      const runResponse = await axios.post(
        `${apiUrl}/api/assistant/create-run/${currentThread.id}`,
        {
          assistant_id: selectedAssistant,
        }
      );
      const runId = runResponse.data.id;

      const eventSource = new EventSource(
        `${apiUrl}/api/assistant/stream-run/${currentThread.id}/${runId}`
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "message") {
          setCurrentThread((prev) => ({
            ...prev!,
            messages: [
              ...prev!.messages,
              { role: "assistant", content: data.content },
            ],
          }));
        } else if (data === "[DONE]") {
          eventSource.close();
          setIsLoading(false);
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to stream response",
          variant: "destructive",
        });
      };
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to process message",
        variant: "destructive",
      });
    }
  };

  const handleCreateAssistant = async (name: string, description: string) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/assistant/create-assistant`,
        { name, description }
      );
      setAssistants([...assistants, response.data]);
      toast({
        title: "Success",
        description: "Assistant created successfully",
      });
    } catch (error) {
      console.error("Error creating assistant:", error);
      toast({
        title: "Error",
        description: "Failed to create assistant",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAssistant = async (assistantId: string) => {
    try {
      await axios.delete(
        `${apiUrl}/api/assistant/delete-assistant/${assistantId}`
      );
      setAssistants(assistants.filter((a) => a.id !== assistantId));
      toast({
        title: "Success",
        description: "Assistant deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting assistant:", error);
      toast({
        title: "Error",
        description: "Failed to delete assistant",
        variant: "destructive",
      });
    }
  };

  const handleUploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file as unknown as Blob);
      const response = await axios.post(
        `${apiUrl}/api/assistant/upload-file`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setFiles((prevFiles) => [...prevFiles, response.data]);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await axios.delete(`${apiUrl}/api/assistant/delete-file/${fileId}`);
      setFiles(files.filter((f) => f.id !== fileId));
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const handleCreateVectorStore = async (name: string, description: string) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/assistant/create-vector-store`,
        { name, description }
      );
      setVectorStores([...vectorStores, response.data]);
      toast({
        title: "Success",
        description: "Vector store created successfully",
      });
    } catch (error) {
      console.error("Error creating vector store:", error);
      toast({
        title: "Error",
        description: "Failed to create vector store",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVectorStore = async (vectorStoreId: string) => {
    try {
      await axios.delete(
        `${apiUrl}/api/assistant/delete-vector-store/${vectorStoreId}`
      );
      setVectorStores(vectorStores.filter((vs) => vs.id !== vectorStoreId));
      toast({
        title: "Success",
        description: "Vector store deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting vector store:", error);
      toast({
        title: "Error",
        description: "Failed to delete vector store",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Toaster />
      {/* Sidebar */}
      <div className="w-64 bg-muted p-4 hidden md:block">
        <Button className="w-full mb-4" onClick={createNewThread}>
          <Plus className="mr-2 h-4 w-4" /> New Thread
        </Button>
        <Separator className="my-4" />
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {threads.map((thread) => (
            <Button
              key={thread.id}
              variant="ghost"
              className="w-full justify-start mb-2 text-left"
              onClick={() => setCurrentThread(thread)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {thread.title}
            </Button>
          ))}
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="assistants">Assistants</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="vectorStores">Vector Stores</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <AnimatePresence initial={false}>
                {currentThread?.messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex mb-4 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start max-w-[80%] ${
                        message.role === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      <Avatar
                        className={message.role === "user" ? "ml-2" : "mr-2"}
                      >
                        {message.role === "user" ? (
                          <User className="h-6 w-6" />
                        ) : (
                          <Bot className="h-6 w-6" />
                        )}
                        <AvatarFallback>
                          {message.role === "user" ? "U" : "AI"}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`p-3 rounded-lg ${
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
                  <div className="flex items-start">
                    <Avatar className="mr-2">
                      <Bot className="h-6 w-6" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-lg bg-muted">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <select
                  value={selectedAssistant || ""}
                  onChange={(e) => setSelectedAssistant(e.target.value)}
                  className="p-2 border rounded-md"
                >
                  <option value="">Select an Assistant</option>
                  {Array.isArray(assistants) &&
                    assistants.map((assistant) => (
                      <option key={assistant.id} value={assistant.id}>
                        {assistant.name}
                      </option>
                    ))}
                </select>
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading || !selectedAssistant}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !selectedAssistant}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="assistants">
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Assistants</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mb-4">
                    <Plus className="mr-2 h-4 w-4" /> Create Assistant
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Assistant</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new assistant.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      handleCreateAssistant(
                        formData.get("name") as string,
                        formData.get("description") as string
                      );
                    }}
                  >
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input id="name" name="name" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Create Assistant</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              {Array.isArray(assistants) && assistants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assistants.map((assistant) => (
                    <Card key={assistant.id}>
                      <CardHeader>
                        <CardTitle>{assistant.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{assistant.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteAssistant(assistant.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No assistants available. Create one to get started.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="files">
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Files</h2>
              <Input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadFile(file);
                }}
                className="mb-4"
              />
              {Array.isArray(files) && files.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file) => (
                    <Card key={file.id}>
                      <CardHeader>
                        <CardTitle>{file.filename}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>Purpose: {file.purpose}</p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteFile(file.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No files available. Upload a file to get started.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="vectorStores">
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Vector Stores</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mb-4">
                    <Plus className="mr-2 h-4 w-4" /> Create Vector Store
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Vector Store</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new vector store.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      handleCreateVectorStore(
                        formData.get("name") as string,
                        formData.get("description") as string
                      );
                    }}
                  >
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input id="name" name="name" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Create Vector Store</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              {Array.isArray(vectorStores) && vectorStores.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vectorStores.map((vectorStore) => (
                    <Card key={vectorStore.id}>
                      <CardHeader>
                        <CardTitle>{vectorStore.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{vectorStore.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            handleDeleteVectorStore(vectorStore.id)
                          }
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No vector stores available. Create one to get started.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
