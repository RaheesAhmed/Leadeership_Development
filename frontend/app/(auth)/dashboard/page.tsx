"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  department: string;
}

export default function DashboardPage() {
  const [developmentPlan, setDevelopmentPlan] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUserProfile();
    loadDevelopmentPlan();
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

  const loadDevelopmentPlan = () => {
    const storedPlan = localStorage.getItem("developmentPlan");
    if (storedPlan) {
      setDevelopmentPlan(storedPlan);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

      {/* Profile Section */}
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
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
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateProfile}>Save Changes</Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-2">
                    <p>
                      <strong>Name:</strong> {profile.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {profile.email}
                    </p>
                    <p>
                      <strong>Role:</strong> {profile.role}
                    </p>
                    <p>
                      <strong>Department:</strong> {profile.department}
                    </p>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
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
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Your Development Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {developmentPlan ? (
            <>
              <div className="mt-4 p-6 bg-gray-100 rounded-md overflow-auto max-h-[60vh]">
                <pre className="whitespace-pre-wrap text-sm">
                  {developmentPlan}
                </pre>
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => window.print()}>
                  Print Plan
                </Button>
              </div>
            </>
          ) : (
            <p>
              No development plan available. Please complete the assessment to
              generate a plan.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
