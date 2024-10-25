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
  ChevronRight,
  Calendar,
  BarChart,
  DollarSign,
  UserPlus,
  Activity,
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
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

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

export default function Component() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activity, setActivity] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionStats, setSubscriptionStats] = useState<
    Record<string, number>
  >({});
  const [assessmentStats, setAssessmentStats] = useState<
    Record<string, number>
  >({});
  const router = useRouter();
  const { adminLogout, isAdminAuthenticated } = useAdminAuth();

  const [userGrowth, setUserGrowth] = useState<Record<string, number>>({});
  const [revenueStats, setRevenueStats] = useState<{
    total: number;
    monthly: number;
    growth: number;
  }>({ total: 0, monthly: 0, growth: 0 });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Add authorization header to all requests
        const headers = {
          Authorization: `Bearer ${
            document.cookie.split("token=")[1]?.split(";")[0]
          }`,
        };

        const [
          statsResponse,
          activityResponse,
          subscriptionResponse,
          assessmentResponse,
          userGrowthResponse,
          revenueResponse,
        ] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/stats`, {
            headers,
          }),
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/activity`, {
            headers,
          }),
          fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/subscription-stats`,
            { headers }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/assessment-stats`,
            { headers }
          ),
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/user-growth`, {
            headers,
          }),
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/revenue`, {
            headers,
          }),
        ]);

        if (
          !statsResponse.ok ||
          !activityResponse.ok ||
          !subscriptionResponse.ok ||
          !assessmentResponse.ok
        ) {
          throw new Error("Failed to fetch admin data");
        }

        const statsData = await statsResponse.json();
        const activityData = await activityResponse.json();
        const subscriptionData = await subscriptionResponse.json();
        const assessmentData = await assessmentResponse.json();
        const userGrowthData = await userGrowthResponse.json();
        const revenueData = await revenueResponse.json();

        setStats(statsData);
        setActivity(activityData);
        setSubscriptionStats(subscriptionData);
        setAssessmentStats(assessmentData);
        setUserGrowth(userGrowthData);
        setRevenueStats(revenueData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setErrorMessage("Failed to load admin dashboard data");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we're authenticated
    if (isAdminAuthenticated) {
      fetchAdminData();
    }
  }, [isAdminAuthenticated]); // Add isAdminAuthenticated to dependencies

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/upload-training`,
        {
          method: "POST",
          body: formData,
        }
      );

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

  const handleAdminLogout = () => {
    adminLogout();
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
  }: {
    title: string;
    value: number;
    icon: any;
    trend: string;
  }) => (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? <Skeleton className="h-8 w-20" /> : value.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{trend}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500">Welcome back, Admin</p>
            </div>
            <Button onClick={handleAdminLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.usersCount ?? 0}
            icon={Users}
            trend="+12% from last month"
          />
          <StatCard
            title="Active Subscriptions"
            value={stats?.activeSubscriptions ?? 0}
            icon={CreditCard}
            trend="+5% from last month"
          />
          <StatCard
            title="Total Assessments"
            value={stats?.assessmentsCount ?? 0}
            icon={ClipboardList}
            trend="+8% from last month"
          />
          <StatCard
            title="Consultants"
            value={stats?.consultantsCount ?? 0}
            icon={Briefcase}
            trend="+3% from last month"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Revenue Overview
              </CardTitle>
              <CardDescription>Monthly revenue and growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold">
                      ${revenueStats.total.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Monthly Growth
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      +{revenueStats.growth}%
                    </p>
                  </div>
                </div>
                <Progress value={revenueStats.growth} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                User Growth
              </CardTitle>
              <CardDescription>New user registrations by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(userGrowth).map(([month, count]) => (
                  <div
                    key={month}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-muted-foreground">
                      {month}
                    </span>
                    <div className="flex items-center">
                      <span className="font-semibold">{count}</span>
                      <UserPlus className="ml-2 h-4 w-4 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Subscription Distribution
                  </CardTitle>
                  <CardDescription>
                    Active subscriptions by plan type
                  </CardDescription>
                </div>
                <BarChart className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <div className="space-y-4">
                  {Object.entries(subscriptionStats || {}).map(
                    ([plan, count]) => (
                      <div key={plan} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="capitalize font-medium text-sm">
                            {plan}
                          </span>
                          <span className="font-semibold">{count}</span>
                        </div>
                        <Progress
                          value={(count / stats?.activeSubscriptions!) * 100}
                          className="h-2"
                        />
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Assessment Trends
                  </CardTitle>
                  <CardDescription>
                    Monthly assessment completions
                  </CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <div className="space-y-4">
                  {Object.entries(assessmentStats || {}).map(
                    ([month, count]) => (
                      <div key={month} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{month}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                        <Progress
                          value={
                            (count /
                              Math.max(...Object.values(assessmentStats))) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest users and assessments
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2 text-sm">Recent Users</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activity?.recentUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.name}
                            </TableCell>

                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              {new Date(user.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-sm">
                      Recent Assessments
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activity?.recentAssessments.map((assessment) => (
                          <TableRow key={assessment.id}>
                            <TableCell className="font-medium">
                              {assessment.users.name}
                            </TableCell>
                            <TableCell>
                              {new Date(
                                assessment.created_at
                              ).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Upload Training File
                </CardTitle>
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
