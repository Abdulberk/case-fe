'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';
import { CharacterForm } from '@/components/admin/character-form';
import { CharacterTable } from '@/components/admin/character-table';
import { DeleteDialog } from '@/components/admin/delete-dialog';
import { StatsBar } from '@/components/stats-bar';
import {
  useCharactersQuery,
  useCreateCharacterMutation,
  useUpdateCharacterMutation,
  useDeleteCharacterMutation,
  useCharacterStatsQuery,
  CharacterSortField,
  SortDirection,
  type Character,
  type CreateCharacterInput,
  type UpdateCharacterInput,
} from '@/generated/graphql';

type FormMode = 'idle' | 'create' | 'edit';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();

  const [formMode, setFormMode] = useState<FormMode>('idle');
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [deletingCharacter, setDeletingCharacter] = useState<Character | null>(null);

  // Fetch all characters (no pagination for admin — get first 50)
  const {
    data: charactersData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useCharactersQuery(
    { pagination: { skip: 0, take: 50 }, sort: { field: CharacterSortField.Name, direction: SortDirection.Asc } },
    { refetchOnWindowFocus: false },
  );

  const { data: statsData } = useCharacterStatsQuery();

  const characters = charactersData?.characters.items ?? [];
  const totalCount = statsData?.characterStats.totalCount ?? 0;

  // Mutations
  const createMutation = useCreateCharacterMutation({
    onSuccess: () => {
      toast('Character created successfully');
      setFormMode('idle');
    },
    onError: (error: unknown) => {
      toast(error instanceof Error ? error.message : 'Failed to create character', 'error');
    },
  });

  const updateMutation = useUpdateCharacterMutation({
    onSuccess: () => {
      toast('Character updated successfully');
      setFormMode('idle');
      setEditingCharacter(null);
    },
    onError: (error: unknown) => {
      toast(error instanceof Error ? error.message : 'Failed to update character', 'error');
    },
  });

  const deleteMutation = useDeleteCharacterMutation({
    onSuccess: () => {
      toast('Character deleted successfully');
      setDeletingCharacter(null);
    },
    onError: (error: unknown) => {
      toast(error instanceof Error ? error.message : 'Failed to delete character', 'error');
    },
  });

  // Detect client-side mounting to prevent hydration mismatch
  const emptySubscribe = () => () => {};
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // Auth guard — redirect if not authenticated or not admin
  useEffect(() => {
    if (!isClient) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!isAdmin) {
      router.replace('/');
    }
  }, [isClient, isAuthenticated, isAdmin, router]);

  const handleFormSubmit = (data: CreateCharacterInput | (UpdateCharacterInput & { id: string })) => {
    if ('id' in data) {
      const { id, ...input } = data;
      updateMutation.mutate({ id, input });
    } else {
      createMutation.mutate({ input: data });
    }
  };

  const handleEdit = (character: Character) => {
    setEditingCharacter(character);
    setFormMode('edit');
  };

  const handleDelete = (character: Character) => {
    setDeletingCharacter(character);
  };

  const handleDeleteConfirm = () => {
    if (deletingCharacter) {
      deleteMutation.mutate({ id: deletingCharacter.id });
    }
  };

  // Show loading while checking permissions
  if (!isClient || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <Spinner size={36} />
        <p className="text-sm text-muted-foreground">Checking permissions…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="h-10 w-1 rounded-full bg-primary" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage characters — create, edit, and delete
            </p>
          </div>
        </div>

        {/* Stats summary + Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1.5">
              <span className="font-semibold">{totalCount}</span> Total Characters
            </Badge>
            {isFetching && (
              <Spinner size={14} />
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingCharacter(null);
                setFormMode('create');
              }}
              disabled={formMode !== 'idle'}
            >
              <Plus className="mr-2 h-3.5 w-3.5" />
              New Character
            </Button>
          </div>
        </div>
      </motion.div>

      <Separator />

      {/* Stats Dashboard */}
      <StatsBar />

      {/* Form */}
      <AnimatePresence mode="wait">
        {formMode !== 'idle' && (
          <CharacterForm
            key={editingCharacter?.id ?? 'create'}
            character={editingCharacter}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setFormMode('idle');
              setEditingCharacter(null);
            }}
            isPending={createMutation.isPending || updateMutation.isPending}
          />
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-3 py-16"
        >
          <Spinner size={44} />
          <p className="text-sm text-muted-foreground">Loading characters…</p>
        </motion.div>
      )}

      {/* Error State */}
      {isError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border bg-card px-6 py-12 text-center"
        >
          <p className="text-sm text-destructive">Failed to load characters.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        </motion.div>
      )}

      {/* Character Table */}
      {!isLoading && !isError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <CharacterTable
            characters={characters}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deletingCharacter && (
          <DeleteDialog
            characterName={deletingCharacter.name}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeletingCharacter(null)}
            isPending={deleteMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
