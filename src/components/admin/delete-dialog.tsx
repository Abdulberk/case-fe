'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface DeleteDialogProps {
  characterName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export function DeleteDialog({ characterName, onConfirm, onCancel, isPending }: DeleteDialogProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <motion.div
        className="relative z-10 mx-4 w-full max-w-md rounded-lg border bg-card p-6 shadow-lg"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring' as const, damping: 25, stiffness: 350 }}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Delete Character
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Are you sure you want to delete{' '}
              <span className="font-medium text-foreground">{characterName}</span>?
              This action cannot be undone.
            </p>
          </div>
        </div>

        <Separator className="my-5" />

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
