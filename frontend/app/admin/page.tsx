"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  AlertCircle,
  Users,
  CreditCard,
  ClipboardList,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminStats {
  usersCount: number;
  activeSubscriptions: number;
  assessmentsCount: number;
  consultantsCount: number;
}

interface RecentActivity {
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    created_at: string;
  }>;
  recentAssessments: Array<{
    id: string;
    created_at: string;
    users: {
      name: string;
      email: string;
    };
  }>;
}

export default function AdminDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activity, setActivity] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsResponse, activityResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/stats`),
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/activity`),
        ]);

        if (!statsResponse.ok || !activityResponse.ok) {
          throw new Error("Failed to fetch admin data");
        }

        const statsData = await statsResponse.json();
        const activityData = await activityResponse.json();

        setStats(statsData);
        setActivity(activityData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setErrorMessage("Failed to load admin dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadStatus(null);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      const response = await fetch(`${apiUrl}/api/admin/upload-training`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      setUploadStatus("success");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setUploading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
  }: {
    title: string;
    value: number;
    icon: any;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? <Skeleton className="h-8 w-20" /> : value}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen w-full bg-muted/40">
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard
            title="Total Users"
            value={stats?.usersCount ?? 0}
            icon={Users}
          />
          <StatCard
            title="Active Subscriptions"
            value={stats?.activeSubscriptions ?? 0}
            icon={CreditCard}
          />
          <StatCard
            title="Total Assessments"
            value={stats?.assessmentsCount ?? 0}
            icon={ClipboardList}
          />
          <StatCard
            title="Consultants"
            value={stats?.consultantsCount ?? 0}
            icon={Briefcase}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activity */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest users and assessments</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Recent Users</h3>
                    <div className="space-y-2">
                      {activity?.recentUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{user.name}</span>
                          <span className="text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Recent Assessments</h3>
                    <div className="space-y-2">
                      {activity?.recentAssessments.map((assessment) => (
                        <div
                          key={assessment.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{assessment.users.name}</span>
                          <span className="text-muted-foreground">
                            {new Date(
                              assessment.created_at
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload Training File */}
          <div className="space-y-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Upload Training File</CardTitle>
                <CardDescription>
                  Upload a new training file to update the AI model.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="file">Training File</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      accept=".csv,.txt,.json"
                      className="h-full py-2"
                    />
                  </div>
                  {file && (
                    <p className="text-sm text-muted-foreground flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      {file.name}
                    </p>
                  )}
                  <Button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full"
                  >
                    {uploading ? (
                      <>
                        <Upload className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload File
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status Messages */}
            {(uploadStatus || errorMessage) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert
                  variant={
                    uploadStatus === "success" ? "default" : "destructive"
                  }
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>
                    {uploadStatus === "success" ? "Success" : "Error"}
                  </AlertTitle>
                  <AlertDescription>
                    {uploadStatus === "success"
                      ? "The training file was uploaded successfully."
                      : errorMessage ||
                        "There was an error uploading the file. Please try again."}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
