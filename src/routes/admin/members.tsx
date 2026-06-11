import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { apiQuery, apiUpdate } from '@/lib/api-client';
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Eye, Shield, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/members')({
  component: AdminMembers,
});

function AdminMembers() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<Record<string, unknown> | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-members', page, search, roleFilter],
    queryFn: async () => {
      const filters: Record<string, any> = {};
      if (roleFilter) filters.role = roleFilter;
      const from = (page - 1) * 20;
      const res = await apiQuery('users', {
        select: 'id,email,role,is_active,is_approved,created_at,profiles(full_name,avatar_url,department,level),leaderboard_entries(total_points)',
        filters,
        order: { column: 'created_at', ascending: false },
        range: [from, from + 19],
        count: 'exact',
      });

      let members = res.data || [];
      if (search) {
        const lower = search.toLowerCase();
        members = members.filter((m: any) =>
          m.email?.toLowerCase().includes(lower) ||
          m.profiles?.full_name?.toLowerCase().includes(lower)
        );
      }

      return {
        members,
        total: res.count || 0,
        page,
        limit: 20,
        totalPages: Math.ceil((res.count || 0) / 20),
      };
    },
    enabled: !!accessToken,
  });

  const roleMutation = useMutation({
    mutationFn: (variables: { userId: string; role: string }) =>
      apiUpdate('users', { role: variables.role }, { id: variables.userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-members'] });
      toast.success('Role updated successfully');
    },
    onError: () => {
      toast.error('Failed to update role');
    },
  });

  const approveMutation = useMutation({
    mutationFn: (variables: { userId: string; isApproved: boolean }) =>
      apiUpdate('users', { is_approved: variables.isApproved }, { id: variables.userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-members'] });
      toast.success('Member status updated');
    },
    onError: () => {
      toast.error('Failed to update member status');
    },
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'destructive';
      case 'ADMIN':
        return 'default';
      case 'MEMBER':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-headline-lg">Members</h1>
        <p className="text-muted-foreground">Manage club members and their roles</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(value) => {
            setRoleFilter(value === 'all' ? '' : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="GUEST">Guest</SelectItem>
            <SelectItem value="MEMBER">Member</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.members && data.members.length > 0 ? (
              data.members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.profile?.fullName || 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(member.role)}>
                      {member.role.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{member.profile?.department || 'N/A'}</TableCell>
                  <TableCell>{member.profile?.level || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={member.isActive ? 'default' : 'destructive'}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedMember(member);
                          setProfileOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Select
                        value={member.role}
                        onValueChange={(value) =>
                          roleMutation.mutate({ userId: member.id, role: value })
                        }
                      >
                        <SelectTrigger className="w-[100px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GUEST">Guest</SelectItem>
                          <SelectItem value="MEMBER">Member</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          approveMutation.mutate({
                            userId: member.id,
                            isApproved: !member.isApproved,
                          })
                        }
                      >
                        {member.isApproved ? (
                          <UserX className="h-4 w-4 text-destructive" />
                        ) : (
                          <UserCheck className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No members found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(Math.max(1, page - 1))}
                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, data.totalPages) }).map((_, i) => {
              const pageNum = Math.max(1, Math.min(page - 2, data.totalPages - 4)) + i;
              if (pageNum > data.totalPages) return null;
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setPage(pageNum)}
                    isActive={pageNum === page}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(Math.min(data.totalPages, page + 1))}
                className={page === data.totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Member Profile Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Member Profile</DialogTitle>
            <DialogDescription>Detailed member information</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
                  {(selectedMember.profile as Record<string, unknown>)?.fullName
                    ? ((selectedMember.profile as Record<string, unknown>).fullName as string)
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                    : '?'}
                </div>
                <div>
                  <p className="font-semibold">
                    {(selectedMember.profile as Record<string, unknown>)?.fullName || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedMember.email as string}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Role</p>
                  <p className="font-medium">{selectedMember.role as string}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p className="font-medium">
                    {(selectedMember.profile as Record<string, unknown>)?.department as string || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Level</p>
                  <p className="font-medium">
                    {(selectedMember.profile as Record<string, unknown>)?.level as string || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">{selectedMember.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Approved</p>
                  <p className="font-medium">{selectedMember.isApproved ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Joined</p>
                  <p className="font-medium">
                    {new Date(selectedMember.createdAt as string).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
