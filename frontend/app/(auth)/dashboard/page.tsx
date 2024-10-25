"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { PlanDisplay } from "@/components/PlanDisplay";
import { useAuth } from "@/contexts/AuthContext";
import axios from "@/lib/axios";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  department: string;
}

interface DevelopmentPlan {
  formattedPlan: string;
  rawPlan: {
    assessmentOverview: {
      interpretation: string;
    };
    executiveSummary: {
      keyStrengths: string[];
      areasForImprovement: string[];
    };
    additionalResources: {
      additionalResourceLinks: Array<{
        title: string;
        link: string;
        description: string;
      }>;
    };
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [developmentPlan, setDevelopmentPlan] =
    useState<DevelopmentPlan | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchUserProfile(), loadDevelopmentPlan()]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/profile`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setEditedProfile(data.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Failed to load profile",
      });
    }
  };

  const loadDevelopmentPlan = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/development-plan`
      );
      if (response.data) {
        setDevelopmentPlan(response.data);
      }
    } catch (error) {
      console.error("Error loading development plan:", error);
      toast({
        title: "Failed to load development plan",
        description: "Unable to fetch your development plan.",
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(editedProfile),
        }
      );

      if (response.ok) {
        setProfile(editedProfile);
        setIsEditing(false);
        toast({
          title: "Profile updated successfully",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Failed to update profile",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Welcome back, {profile?.name}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Section */}
          <Card className="shadow-lg">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-xl font-semibold">
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {profile && (
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={editedProfile?.name}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile!,
                                name: e.target.value,
                              })
                            }
                            className="border-gray-300 focus:border-primary focus:ring-primary"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            value={editedProfile?.department}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile!,
                                department: e.target.value,
                              })
                            }
                            className="border-gray-300 focus:border-primary focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="text-gray-700"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleUpdateProfile}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-700">
                            Name:
                          </span>
                          <span>{profile.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-700">
                            Email:
                          </span>
                          <span>{profile.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-700">
                            Role:
                          </span>
                          <span>{profile.role}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-700">
                            Department:
                          </span>
                          <span>{profile.department}</span>
                        </div>
                      </div>
                      <div className="flex justify-end mt-6">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(true)}
                          className="text-primary hover:bg-primary/10"
                        >
                          Edit Profile
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Development Plan Section */}
          <Card className="shadow-lg">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-xl font-semibold">
                Development Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {developmentPlan ? (
                <PlanDisplay plan={developmentPlan} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No development plan available yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
