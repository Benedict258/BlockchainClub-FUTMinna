import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { registerSchema, type RegisterInput } from '@/lib/validators/auth';

export const Route = createFileRoute('/join')({
  head: () => ({
    meta: [
      { title: 'Join the Club | BlockchainClub FUTMinna' },
      { name: 'description', content: 'Apply for membership to Blockchain Club FUTMinna.' },
    ],
  }),
  component: JoinPage,
});

const SKILLS = [
  'Solidity',
  'Move',
  'Rust',
  'JavaScript',
  'Python',
  'Frontend Dev',
  'UI/UX Design',
  'Content Writing',
  'Marketing',
  'Community Management',
  'Research',
  'Other',
] as const;

const LEVELS = ['100', '200', '300', '400', '500', '600'] as const;

const EXPERIENCE_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
] as const;

function JoinBranding() {
  return (
    <div className="flex flex-col justify-center px-8 py-12 lg:px-16">
      <Link to="/" className="inline-flex items-center gap-2 mb-12">
        <img src="/lightlogo.png" alt="BCF" className="h-10 w-auto" />
      </Link>
      <h2 className="text-headline-lg text-foreground">Join the Club</h2>
      <p className="mt-3 text-muted-foreground leading-relaxed">
        Become part of FUTMinna's premier Web3 community. Learn, build, and connect with blockchain enthusiasts across the university.
      </p>
      <div className="mt-10 space-y-5">
        <div className="flex gap-3">
          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border bg-surface-high text-xs font-bold text-primary">1</span>
          <div>
            <p className="text-sm font-semibold text-foreground">Create your account</p>
            <p className="text-xs text-muted-foreground">Fill in your details and pick your skills</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border bg-surface-high text-xs font-bold text-primary">2</span>
          <div>
            <p className="text-sm font-semibold text-foreground">Get approved</p>
            <p className="text-xs text-muted-foreground">Our admins review applications within 24 hours</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border bg-surface-high text-xs font-bold text-primary">3</span>
          <div>
            <p className="text-sm font-semibold text-foreground">Start building</p>
            <p className="text-xs text-muted-foreground">Access tracks, events, and project teams</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function JoinPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      department: '',
      level: undefined,
      skills: [],
      experienceLevel: undefined,
      funFact: '',
      xLink: '',
      githubLink: '',
      portfolioLink: '',
    },
  });

  async function onSubmit(values: RegisterInput) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Registration failed');
      toast.success('Account created! Please sign in.');
      router.navigate({ to: '/auth' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="grid lg:grid-cols-2 lg:min-h-[calc(100vh-4rem)]">
        <div className="hidden lg:flex bg-surface-low border-r border-border">
          <JoinBranding />
        </div>
        <div className="flex items-start justify-center px-6 py-12 lg:py-16 lg:overflow-y-auto">
          <Card className="w-full max-w-xl border-border bg-card">
            <CardContent className="pt-8">
              <div className="mb-6 lg:hidden">
                <h1 className="text-headline-md">Join the Club</h1>
                <p className="text-sm text-muted-foreground mt-1">Create your member profile</p>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <fieldset className="space-y-4">
                    <legend className="text-label-bold text-outline mb-1">Account</legend>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
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
                        name="email"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="you@futminna.edu.ng" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input placeholder="Min. 8 characters" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input placeholder="Re-enter password" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </fieldset>

                  <fieldset className="space-y-4">
                    <legend className="text-label-bold text-outline mb-1">Academic</legend>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
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
                                  <SelectValue placeholder="Select level" />
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
                    </div>
                  </fieldset>

                  <fieldset className="space-y-4">
                    <legend className="text-label-bold text-outline mb-1">Skills & Social</legend>
                    <FormField
                      control={form.control}
                      name="skills"
                      render={() => (
                        <FormItem>
                          <FormLabel>Skills</FormLabel>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {SKILLS.map((skill) => (
                              <FormField
                                key={skill}
                                control={form.control}
                                name="skills"
                                render={({ field }) => {
                                  const checked = field.value?.includes(skill as never);
                                  return (
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
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
                          <FormLabel>Fun Fact (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Tell us something fun about yourself" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-4 sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="xLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>X / Twitter</FormLabel>
                            <FormControl>
                              <Input placeholder="username" {...field} />
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
                            <FormLabel>GitHub</FormLabel>
                            <FormControl>
                              <Input placeholder="username" {...field} />
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
                            <FormLabel>Portfolio</FormLabel>
                            <FormControl>
                              <Input placeholder="yoursite.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </fieldset>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </Form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/auth" className="font-medium text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
