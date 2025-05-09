import { NextResponse } from 'next/server';
import type { Transaction } from '@/types/expense';

// In-memory storage for demo purposes
// In a real app, you'd use a database
let transactions: Transaction[] = [];

export async function GET() {
  return NextResponse.json(transactions);
}

export async function POST(request: Request) {
  const transaction = await request.json();
  
  // Validate transaction
  if (!transaction.amount || !transaction.type || !transaction.category) {
    return NextResponse.json(
      { error: 'Invalid transaction data' },
      { status: 400 }
    );
  }

  // Add timestamp and ID
  const newTransaction: Transaction = {
    ...transaction,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
  };

  transactions.push(newTransaction);
  return NextResponse.json(newTransaction);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  
  transactions = transactions.filter(t => t.id !== id);
  return NextResponse.json({ success: true });
} 