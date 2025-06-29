"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit3, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NameInputProps {
  value: string;
  onChange: (name: string) => Promise<void>;
  disabled?: boolean;
}

export function NameInput({ value, onChange, disabled = false }: NameInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSave = async () => {
    if (!localValue.trim()) {
      toast({
        title: "Invalid Name",
        description: "Strategy name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      await onChange(localValue.trim());
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Strategy name updated.",
      });
    } catch (error) {
      console.error('Failed to update name:', error);
      toast({
        title: "Error",
        description: "Failed to update strategy name.",
        variant: "destructive",
      });
      // Reset to original value
      setLocalValue(value);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Label htmlFor="strategy-name" className="text-sm font-medium">
          Strategy Name
        </Label>
        <div className="flex items-center space-x-2">
          <Input
            id="strategy-name"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter strategy name..."
            className="flex-1"
            disabled={isSaving}
            autoFocus
          />
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !localValue.trim()}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Strategy Name</Label>
      <div className="flex items-center space-x-2">
        <div className="flex-1 px-3 py-2 bg-gray-50 rounded-md border">
          <span className="text-gray-900">{value}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsEditing(true)}
          disabled={disabled}
        >
          <Edit3 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}