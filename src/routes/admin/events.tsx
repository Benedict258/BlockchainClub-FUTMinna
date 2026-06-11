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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Plus, Pencil, Trash2, Eye, Calendar, MapPin, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/events')({
  component: AdminEvents,
});

type EventFilter = 'all' | 'upcoming' | 'past';
type EventType = 'WORKSHOP' | 'HACKATHON' | 'TALK' | 'BOOTCAMP' | 'SOCIAL' | 'OTHER';

const EVENT_TYPES: EventType[] = ['WORKSHOP', 'HACKATHON', 'TALK', 'BOOTCAMP', 'SOCIAL', 'OTHER'];

interface EventForm {
  title: string;
  description: string;
  type: string;
  location: string;
  isVirtual: boolean;
  virtualLink: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  isPublished: boolean;
}

const defaultForm: EventForm = {
  title: '',
  description: '',
  type: 'OTHER',
  location: '',
  isVirtual: false,
  virtualLink: '',
  startDate: '',
  endDate: '',
  coverImage: '',
  isPublished: false,
};

function AdminEvents() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [deleteItem, setDeleteItem] = useState<Record<string, unknown> | null>(null);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<EventForm>(defaultForm);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-events', filter, typeFilter],
    queryFn: async () => {
      const filters: Record<string, any> = {};
      const now = new Date().toISOString();
      if (filter === 'upcoming') {
        filters.start_date = { __op: 'gte', value: now };
      } else if (filter === 'past') {
        filters.start_date = { __op: 'lt', value: now };
      }
      if (typeFilter) filters.type = typeFilter;
      const res = await apiQuery('events', {
        select: '*,event_rsvps(id,user_id),event_resources(id)',
        filters,
        order: { column: 'start_date', ascending: false },
        range: [0, 49],
        count: 'exact',
      });
      return { events: res.data || [], total: res.count || 0, page: 1, limit: 50, totalPages: Math.ceil((res.count || 0) / 50) };
    },
  });

  const { data: rsvpData } = useQuery({
    queryKey: ['admin-event-rsvps', selectedEvent?.id],
    queryFn: async () => {
      const res = await apiQuery('events', {
        select: '*,event_rsvps(*,users(id,profile:profiles(full_name,avatar_url))),event_resources(*)',
        filters: { id: selectedEvent?.id as string },
        single: true,
      });
      return res.data;
    },
    enabled: rsvpOpen && !!selectedEvent?.id,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      apiInsert('events', {
        title: form.title,
        description: form.description || undefined,
        type: form.type as EventType,
        location: form.location || undefined,
        is_virtual: form.isVirtual,
        virtual_link: form.virtualLink || undefined,
        start_date: new Date(form.startDate).toISOString(),
        end_date: new Date(form.endDate).toISOString(),
        cover_image: form.coverImage || undefined,
        is_published: form.isPublished,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setDialogOpen(false);
      setForm(defaultForm);
      toast.success('Event created');
    },
    onError: () => toast.error('Failed to create event'),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      apiUpdate('events', {
        title: form.title,
        description: form.description || undefined,
        type: form.type as EventType,
        location: form.location || undefined,
        is_virtual: form.isVirtual,
        virtual_link: form.virtualLink || undefined,
        start_date: new Date(form.startDate).toISOString(),
        end_date: new Date(form.endDate).toISOString(),
        cover_image: form.coverImage || undefined,
        is_published: form.isPublished,
      }, { id: editItem?.id as string }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setDialogOpen(false);
      setEditItem(null);
      setForm(defaultForm);
      toast.success('Event updated');
    },
    onError: () => toast.error('Failed to update event'),
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      apiDelete('events', { id: deleteItem?.id as string }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setDeleteItem(null);
      toast.success('Event deleted');
    },
    onError: () => toast.error('Failed to delete event'),
  });

  const openCreate = () => {
    setEditItem(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (event: Record<string, unknown>) => {
    setEditItem(event);
    setForm({
      title: event.title as string,
      description: (event.description as string) || '',
      type: event.type as string,
      location: (event.location as string) || '',
      isVirtual: (event.isVirtual as boolean) || false,
      virtualLink: (event.virtualLink as string) || '',
      startDate: event.startDate ? new Date(event.startDate as string).toISOString().slice(0, 16) : '',
      endDate: event.endDate ? new Date(event.endDate as string).toISOString().slice(0, 16) : '',
      coverImage: (event.coverImage as string) || '',
      isPublished: (event.isPublished as boolean) || false,
    });
    setDialogOpen(true);
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      WORKSHOP: 'bg-blue-500/20 text-blue-400',
      HACKATHON: 'bg-purple-500/20 text-purple-400',
      TALK: 'bg-green-500/20 text-green-400',
      BOOTCAMP: 'bg-orange-500/20 text-orange-400',
      SOCIAL: 'bg-pink-500/20 text-pink-400',
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg">Events</h1>
          <p className="text-muted-foreground">Manage club events</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex gap-2">
          {(['all', 'upcoming', 'past'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {EVENT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>RSVPs</TableHead>
              <TableHead>Status</TableHead>
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
            ) : data?.events && data.events.length > 0 ? (
              data.events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    <Badge className={getTypeBadge(event.type)}>{event.type}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(event.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{(event.rsvps as unknown[])?.length || 0}</TableCell>
                  <TableCell>
                    <Badge variant={event.isPublished ? 'default' : 'secondary'}>
                      {event.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedEvent(event);
                          setRsvpOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(event)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteItem(event)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No events found
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
            <DialogTitle>{editItem ? 'Edit Event' : 'Create Event'}</DialogTitle>
            <DialogDescription>
              {editItem ? 'Update event details' : 'Add a new event'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Event title"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Event description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Physical location"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isVirtual}
                  onCheckedChange={(v) => setForm({ ...form, isVirtual: v })}
                />
                <Label>Virtual Event</Label>
              </div>
              {form.isVirtual && (
                <div className="flex-1">
                  <Label>Virtual Link</Label>
                  <Input
                    value={form.virtualLink}
                    onChange={(e) => setForm({ ...form, virtualLink: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date *</Label>
                <Input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>End Date *</Label>
                <Input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Cover Image URL</Label>
              <Input
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.isPublished}
                onCheckedChange={(v) => setForm({ ...form, isPublished: v })}
              />
              <Label>Published</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => (editItem ? updateMutation.mutate() : createMutation.mutate())}
                disabled={!form.title || !form.startDate || !form.endDate}
              >
                {editItem ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* RSVP Dialog */}
      <Dialog open={rsvpOpen} onOpenChange={setRsvpOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Event RSVPs</DialogTitle>
            <DialogDescription>{selectedEvent?.title as string}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {rsvpData?.rsvps && rsvpData.rsvps.length > 0 ? (
              rsvpData.rsvps.map((rsvp: Record<string, unknown>) => {
                const user = rsvp.user as Record<string, unknown>;
                const profile = user?.profile as Record<string, unknown> | undefined;
                return (
                  <div key={rsvp.id as string} className="flex items-center gap-3 border-b border-border pb-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {profile?.fullName
                        ? (profile.fullName as string).split(' ').map((n: string) => n[0]).join('')
                        : '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{(profile?.fullName as string) || 'Unknown'}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No RSVPs yet</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteItem?.title as string}&quot;? This action cannot be undone.
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
