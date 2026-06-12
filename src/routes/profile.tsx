import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { AuthGuard } from "@/components/auth-guard";
import { useAuthStore } from "@/stores/auth-store";
import { profileUpdateSchema, type ProfileUpdateInput } from "@/lib/validators/auth";
import { getBadgeConfig } from "@/lib/badges";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile | BlockchainClub FUTMINNA" },
      { name: "description", content: "View and edit your Blockchain Club FUTMINNA profile." },
    ],
  }),
  component: ProfilePage,
});

const SKILLS = [
  "Solidity",
  "Move",
  "Rust",
  "JavaScript",
  "Python",
  "Frontend Dev",
  "UI/UX Design",
  "Content Writing",
  "Marketing",
  "Community Management",
  "Research",
  "Other",
] as const;

const LEVELS = ["100", "200", "300", "400", "500", "600"] as const;

const EXPERIENCE_LEVELS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
] as const;

function ProfilePage() {
  const { user, setUser, accessToken } = useAuthStore();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile = user?.profile;

  const form = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: profile?.fullName || "",
      nickname: profile?.nickname || "",
      bio: profile?.bio || "",
      department: profile?.department || "",
      level: (profile?.level as any) || undefined,
      experienceLevel: (profile?.experienceLevel as any) || undefined,
      skills: (profile?.skills as any) || [],
      funFact: profile?.funFact || "",
      xLink: profile?.xLink || "",
      githubLink: profile?.githubLink || "",
      portfolioLink: profile?.portfolioLink || "",
      avatarUrl: profile?.avatarUrl || "",
    },
  });

  function getInitials(name?: string) {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !accessToken) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/auth/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Upload failed");

      const profileRes = await fetch("/api/auth/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ avatarUrl: result.url }),
      });
      const profileResult = await profileRes.json();
      if (!profileRes.ok) throw new Error(profileResult.error || "Failed to update avatar");

      if (user) {
        setUser({
          ...user,
          profile: { ...user.profile, ...profileResult.user.profile } as any,
        });
      }

      toast.success("Avatar updated!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function onSubmit(values: ProfileUpdateInput) {
    if (!accessToken) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(values),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Update failed");

      if (user) {
        setUser({
          ...user,
          profile: { ...user.profile, ...result.user.profile } as any,
        });
      }

      toast.success("Profile updated!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setIsSaving(false);
    }
  }

  if (!user) {
    router.navigate({ to: "/auth" });
    return null;
  }

  const badges = profile?.badges || [];

  return (
    <AuthGuard>
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4 relative group">
              <Avatar className="h-24 w-24">
                {profile?.avatarUrl && (
                  <AvatarImage src={profile.avatarUrl} alt={profile?.fullName} />
                )}
                <AvatarFallback className="bg-primary/20 text-primary text-3xl font-bold">
                  {getInitials(profile?.fullName)}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {isUploading ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            <CardTitle className="text-2xl font-bold">{profile?.fullName || "Member"}</CardTitle>
            {profile?.nickname && (
              <p className="text-sm text-muted-foreground">&ldquo;{profile.nickname}&rdquo;</p>
            )}
            <CardDescription>{user.email}</CardDescription>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {profile?.department && <Badge variant="secondary">{profile.department}</Badge>}
              {profile?.level && <Badge variant="outline">Level {profile.level}</Badge>}
              {profile?.experienceLevel && (
                <Badge variant="outline">{profile.experienceLevel}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <div className="space-y-6">
                {badges.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Badges</h3>
                    <div className="flex flex-wrap gap-2">
                      {badges.map((b) => {
                        const config = getBadgeConfig(b.name);
                        const Icon = config?.icon;
                        return (
                          <div
                            key={b.name}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${config?.bgColor || "bg-muted"} ${config?.color || "text-muted-foreground"}`}
                            title={b.description}
                          >
                            {Icon && <Icon className="h-3.5 w-3.5" />}
                            {b.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {profile?.bio && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Bio</h3>
                    <p className="text-sm">{profile.bio}</p>
                  </div>
                )}
                {profile?.funFact && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Fun Fact</h3>
                    <p className="text-sm">{profile.funFact}</p>
                  </div>
                )}
                {profile?.skills && profile.skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  {profile?.xLink && (
                    <a
                      href={profile.xLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      X / Twitter
                    </a>
                  )}
                  {profile?.githubLink && (
                    <a
                      href={profile.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                  {profile?.portfolioLink && (
                    <a
                      href={profile.portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      Portfolio
                    </a>
                  )}
                </div>
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  Edit Profile
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nickname</FormLabel>
                        <FormControl>
                          <Input placeholder="What should we call you?" {...field} />
                        </FormControl>
                        <FormDescription>A short nickname (max 30 characters).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us about yourself..." rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                Level {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select experience" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EXPERIENCE_LEVELS.map((exp) => (
                              <SelectItem key={exp.value} value={exp.value}>
                                {exp.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skills"
                    render={() => (
                      <FormItem>
                        <FormLabel>Skills</FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                          {SKILLS.map((skill) => (
                            <FormField
                              key={skill}
                              control={form.control}
                              name="skills"
                              render={({ field }) => {
                                const checked = field.value?.includes(skill as never);
                                return (
                                  <label
                                    key={skill}
                                    className="flex items-center gap-2 text-sm cursor-pointer"
                                  >
                                    <Checkbox
                                      checked={checked}
                                      onCheckedChange={(isChecked) => {
                                        const current = field.value || [];
                                        if (isChecked) {
                                          field.onChange([...current, skill]);
                                        } else {
                                          field.onChange(current.filter((s) => s !== skill));
                                        }
                                      }}
                                    />
                                    {skill}
                                  </label>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="funFact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fun Fact</FormLabel>
                        <FormControl>
                          <Input placeholder="Tell us something fun about yourself" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="xLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>X / Twitter Link</FormLabel>
                        <FormControl>
                          <Input placeholder="https://x.com/username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="githubLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub Link</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="portfolioLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portfolio / Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yoursite.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" disabled={isSaving} className="flex-1">
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
