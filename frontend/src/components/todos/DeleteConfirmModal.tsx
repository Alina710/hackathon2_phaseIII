"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  todoTitle: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  todoTitle,
}: DeleteConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Todo">
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete &quot;{todoTitle}&quot;? This action
        cannot be undone.
      </p>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirm}
          isLoading={isLoading}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}
