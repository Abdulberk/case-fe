'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Character, CreateCharacterInput, UpdateCharacterInput } from '@/generated/graphql';

interface CharacterFormProps {
  character?: Character | null;
  onSubmit: (data: CreateCharacterInput | (UpdateCharacterInput & { id: string })) => void;
  onCancel: () => void;
  isPending: boolean;
}

interface FormErrors {
  name?: string;
  image?: string;
  description?: string;
}

export function CharacterForm({ character, onSubmit, onCancel, isPending }: CharacterFormProps) {
  const isEditing = !!character;

  const [name, setName] = useState(character?.name ?? '');
  const [image, setImage] = useState(character?.image ?? '');
  const [status, setStatus] = useState(character?.status ?? 'UNKNOWN');
  const [gender, setGender] = useState(character?.gender ?? 'UNKNOWN');
  const [description, setDescription] = useState(character?.description ?? '');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name || name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (name.length > 100) {
      newErrors.name = 'Name must be at most 100 characters';
    }

    if (!image) {
      newErrors.image = 'Image URL is required';
    } else {
      try {
        new URL(image);
      } catch {
        newErrors.image = 'Must be a valid URL';
      }
    }

    if (!description || description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (description.length > 500) {
      newErrors.description = 'Description must be at most 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && character) {
      onSubmit({
        id: character.id,
        name,
        image,
        status: status as CreateCharacterInput['status'],
        gender: gender as CreateCharacterInput['gender'],
        description,
      });
    } else {
      onSubmit({
        name,
        image,
        status: status as CreateCharacterInput['status'],
        gender: gender as CreateCharacterInput['gender'],
        description,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="rounded-lg border bg-card p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          {isEditing ? 'Edit Character' : 'Create New Character'}
        </h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="mb-6" />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="char-name" className="text-sm font-medium text-foreground">
            Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="char-name"
            placeholder="Character name (2-100 chars)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={cn(errors.name && 'border-destructive')}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <label htmlFor="char-image" className="text-sm font-medium text-foreground">
            Image URL <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-3">
            <Input
              id="char-image"
              placeholder="https://example.com/avatar.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className={cn('flex-1', errors.image && 'border-destructive')}
            />
            {image && !errors.image && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="" className="h-full w-full object-cover" onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }} />
              </div>
            )}
            {(!image || errors.image) && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
          {errors.image && (
            <p className="text-xs text-destructive">{errors.image}</p>
          )}
        </div>

        {/* Status & Gender Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALIVE">Alive</SelectItem>
                <SelectItem value="DEAD">Dead</SelectItem>
                <SelectItem value="UNKNOWN">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Gender</label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="UNKNOWN">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="char-desc" className="text-sm font-medium text-foreground">
            Description <span className="text-destructive">*</span>
          </label>
          <textarea
            id="char-desc"
            placeholder="Character description (10-500 chars)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={cn(
              'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
              'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50 resize-none',
              errors.description && 'border-destructive',
            )}
          />
          <div className="flex items-center justify-between">
            {errors.description ? (
              <p className="text-xs text-destructive">{errors.description}</p>
            ) : (
              <span />
            )}
            <span className={cn(
              'text-xs',
              description.length > 500 ? 'text-destructive' : 'text-muted-foreground',
            )}>
              {description.length}/500
            </span>
          </div>
        </div>

        {/* Actions */}
        <Separator />
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="outline" disabled={isPending}>
            <Save className="mr-2 h-4 w-4" />
            {isPending ? 'Saving…' : isEditing ? 'Update Character' : 'Create Character'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
