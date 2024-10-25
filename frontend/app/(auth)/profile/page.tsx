"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import axios from "@/lib/axios";

export default function ProfilePage() {
  const { user, refreshAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    email: "",
    department: "",
  });

  useEffect(() => {
    if (user) {
      setEditedProfile({
        name: user.name || "",
        email: user.email || "",
        department: user.department || "",
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/profile`,
        {
          name: editedProfile.name,
          department: editedProfile.department,
        }
      );

      await refreshAuth(); // Refresh user data after update
      setIsEditing(false);
      toast({
        title: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-2xl font-semibold">
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {isEditing ? (
                <>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editedProfile.name}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            name: e.target.value,
                          })
                        }
                        className="border-gray-300 focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={editedProfile.email}
                        disabled
                        className="bg-gray-50 border-gray-300"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={editedProfile.department}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
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
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="font-semibold text-gray-700">Name</span>
                      <span>{user.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="font-semibold text-gray-700">Email</span>
                      <span>{user.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="font-semibold text-gray-700">
                        Department
                      </span>
                      <span>{user.department}</span>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="text-primary hover:bg-primary/10"
                    >
                      Edit Profile
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
