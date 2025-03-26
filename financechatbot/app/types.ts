// types.ts
export interface FinancialTransaction {
  date: string;
  description: string;
  amount: number;
  category: string;
}

export interface FinancialAnalysis {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  categories: Record<string, number>;
  transactions: FinancialTransaction[];
}

export interface ChatResponse {
  output: {
    choices: {
      text: string;
    }[];
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  fileData?: FinancialTransaction[];
}