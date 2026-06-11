import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { apiQuery, apiInsert, apiUpdate, apiDelete } from '@/lib/api-client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/blog')({
  component: AdminBlog,
});

interface BlogForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  isFeatured: boolean;
  status: string;
}

const defaultForm: BlogForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  category: '',
  isFeatured: false,
  status: 'DRAFT',
};

function AdminBlog() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [deleteItem, setDeleteItem] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<BlogForm>(defaultForm);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blog'],
    queryFn: async () => {
      const res = await apiQuery('blog_posts', {
        select: 'id,title,slug,excerpt,cover_image,category,is_featured,published_at,created_at,author_id,users(id,profiles(full_name,avatar_url)),blog_post_tags(*,tags(id,name))',
        order: { column: 'published_at', ascending: false },
        range: [0, 49],
        count: 'exact',
      });
      return { posts: res.data || [], total: res.count || 0, page: 1, limit: 50, totalPages: Math.ceil((res.count || 0) / 50) };
    },
  });

  const createMutation = useMutation({
    mutationFn: () =>
      apiInsert('blog_posts', {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || undefined,
        content: form.content || undefined,
        cover_image: form.coverImage || undefined,
        category: form.category || undefined,
        is_featured: form.isFeatured,
        status: form.status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      setDialogOpen(false);
      setForm(defaultForm);
      toast.success('Blog post created');
    },
    onError: () => toast.error('Failed to create blog post'),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      apiUpdate('blog_posts', {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || undefined,
        content: form.content || undefined,
        cover_image: form.coverImage || undefined,
        category: form.category || undefined,
        is_featured: form.isFeatured,
        status: form.status,
      }, { id: editItem?.id as string }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      setDialogOpen(false);
      setEditItem(null);
      setForm(defaultForm);
      toast.success('Blog post updated');
    },
    onError: () => toast.error('Failed to update blog post'),
  });

  const publishMutation = useMutation({
    mutationFn: (variables: { id: string; publish: boolean }) =>
      apiUpdate('blog_posts', {
        status: variables.publish ? 'PUBLISHED' : 'DRAFT',
        published_at: variables.publish ? new Date().toISOString() : undefined,
      }, { id: variables.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      toast.success('Post status updated');
    },
    onError: () => toast.error('Failed to update post status'),
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      apiDelete('blog_posts', { id: deleteItem?.id as string }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      setDeleteItem(null);
      toast.success('Blog post deleted');
    },
    onError: () => toast.error('Failed to delete blog post'),
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const openCreate = () => {
    setEditItem(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (post: Record<string, unknown>) => {
    setEditItem(post);
    setForm({
      title: post.title as string,
      slug: post.slug as string,
      excerpt: (post.excerpt as string) || '',
      content: '',
      coverImage: (post.coverImage as string) || '',
      category: (post.category as string) || '',
      isFeatured: (post.isFeatured as boolean) || false,
      status: 'PUBLISHED',
    });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg">Blog</h1>
          <p className="text-muted-foreground">Manage blog posts</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.posts && data.posts.length > 0 ? (
              data.posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {post.author?.profile?.fullName || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    {post.category ? (
                      <Badge variant="outline">{post.category}</Badge>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">
                      Published
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          publishMutation.mutate({
                            id: post.id as string,
                            publish: false,
                          })
                        }
                      >
                        <EyeOff className="h-4 w-4 text-yellow-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(post)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteItem(post)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No blog posts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Post' : 'New Post'}</DialogTitle>
            <DialogDescription>
              {editItem ? 'Update blog post' : 'Create a new blog post'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm({
                    ...form,
                    title,
                    slug: editItem ? form.slug : generateSlug(title),
                  });
                }}
                placeholder="Post title"
              />
            </div>
            <div>
              <Label>Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="post-slug"
              />
            </div>
            <div>
              <Label>Excerpt</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={2}
                placeholder="Brief description..."
              />
            </div>
            <div>
              <Label>Content (Markdown)</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={8}
                placeholder="Write your post..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Tutorial, News"
                />
              </div>
              <div>
                <Label>Cover Image URL</Label>
                <Input
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isFeatured}
                  onCheckedChange={(v) => setForm({ ...form, isFeatured: v })}
                />
                <Label>Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.status === 'PUBLISHED'}
                  onCheckedChange={(v) => setForm({ ...form, status: v ? 'PUBLISHED' : 'DRAFT' })}
                />
                <Label>Published</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => (editItem ? updateMutation.mutate() : createMutation.mutate())}
                disabled={!form.title || !form.slug}
              >
                {editItem ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteItem?.title as string}&quot;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteMutation.mutate()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
