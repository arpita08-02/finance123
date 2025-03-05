'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { type Transaction } from '@/types'
import { type Row } from '@tanstack/react-table'
import { type Dispatch, type HTMLAttributes, type SetStateAction } from 'react'

interface DeleteSelectedTransactionsProps extends HTMLAttributes<HTMLDivElement> {
  rows: Row<unknown>[]
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  resetRows: (defaultState?: boolean | undefined) => void
  deleteTransaction: (transactionId: string) => unknown
}

export const DeleteSelectedTransaction = ({
  children,
  className,
  rows,
  open,
  setOpen,
  resetRows,
  deleteTransaction,
}: DeleteSelectedTransactionsProps) => {
  const deleteSelections = () => {
    const transactions = rows.map((row) => row.original) as Transaction[]
    transactions.forEach((transaction) => deleteTransaction(transaction.id))
    resetRows()
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className={cn(className)}>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all your selected transactions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteSelections()}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
