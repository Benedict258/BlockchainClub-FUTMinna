import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
      { title: 'Join the Club | BCF' },
      { name: 'description', content: 'Apply for membership to Blockchain Club FUTMINNA.' },
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
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Join BCF</CardTitle>
          <CardDescription>Create your member profile to get started</CardDescription>
        </CardHeader>
        <CardContent>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
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
                    <FormLabel>Fun Fact (optional)</FormLabel>
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
                    <FormLabel>X / Twitter Link (optional)</FormLabel>
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
                    <FormLabel>GitHub Link (optional)</FormLabel>
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
                    <FormLabel>Portfolio / Website (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yoursite.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
  );
}
