"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { TransactionForm } from "./TransactionForm";
import { Transaction } from "@/types";

export interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
}

export function TransactionModal({
  isOpen,
  onClose,
  transactionToEdit,
}: TransactionModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transactionToEdit ? "Edit Transaction" : "Record New Transaction"}
      description={
        transactionToEdit
          ? "Update details of this financial record."
          : "Keep track of everyday student expenses or incoming allowances."
      }
    >
      <TransactionForm
        initialData={transactionToEdit}
        onSuccess={onClose}
        onCancel={onClose}
      />
    </Modal>
  );
}
