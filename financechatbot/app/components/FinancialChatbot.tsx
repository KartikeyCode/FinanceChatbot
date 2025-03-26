"use client"
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { FinancialTransaction, FinancialAnalysis, ChatMessage, ChatResponse } from '../types';

Chart.register(...registerables);

export default function FinancialChatbot() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', content: 'Hello! Upload your financial Excel file or ask me anything.' }
      ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<FinancialAnalysis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsLoading(true);
    
    try {
      const data = await readExcelFile(uploadedFile);
      const analysisResult = analyzeFinancialData(data);
      setAnalysis(analysisResult);
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'user', 
          content: `I uploaded a financial file: ${uploadedFile.name}`,
          fileData: data
        },
        { 
          role: 'assistant', 
          content: generateInitialAnalysisMessage(analysisResult) 
        }
      ]);
      
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, 
        { 
          role: 'assistant', 
          content: 'Sorry, I couldn\'t process that file. Please ensure it has columns for Date, Description, Amount, and Category.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const readExcelFile = (file: File): Promise<FinancialTransaction[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          const transactions: FinancialTransaction[] = jsonData.map((row: any) => ({
            date: row.Date || row.date || '',
            description: row.Description || row.description || '',
            amount: parseFloat(row.Amount || row.amount || 0),
            category: row.Category || row.category || 'Uncategorized'
          }));
          
          resolve(transactions);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const analyzeFinancialData = (transactions: FinancialTransaction[]): FinancialAnalysis => {
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const categories: Record<string, number> = {};
    transactions
      .filter(t => t.amount < 0)
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
      });
    
    return {
      totalIncome,
      totalExpenses,
      savings: totalIncome - totalExpenses,
      categories,
      transactions
    };
  };

  const generateInitialAnalysisMessage = (analysis: FinancialAnalysis): string => {
    return `Here's a quick analysis of your finances:
- Total Income: $${analysis.totalIncome.toFixed(2)}
- Total Expenses: $${analysis.totalExpenses.toFixed(2)}
- Net Savings: $${analysis.savings.toFixed(2)}

Top Spending Categories:
${Object.entries(analysis.categories)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3)
  .map(([cat, amount]) => `  • ${cat}: $${amount.toFixed(2)}`)
  .join('\n')}

What specific analysis would you like me to perform?`;
  };

  // Update the handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
  
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
  
    try {
      const fileData = messages.find(m => m.fileData)?.fileData;
      
      const response = await axios.post('/api/chat', {
        messages: messages.filter(m => m.role !== 'system'),
        fileData
      });
  
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.output.choices[0].text
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-3 p-3 rounded-lg ${message.role === 'user' 
              ? 'bg-blue-100 ml-auto max-w-xs' 
              : 'bg-gray-200 mr-auto max-w-md'}`}
          >
            <p className="font-semibold">{message.role === 'user' ? 'You' : 'Assistant'}</p>
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.role === 'assistant' && index === messages.length - 1 && analysis && (
              <div className="mt-3 w-64">
                <Pie data={{
                  labels: Object.keys(analysis.categories),
                  datasets: [{
                    data: Object.values(analysis.categories),
                    backgroundColor: [
                      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                      '#9966FF', '#FF9F40', '#8AC24A'
                    ]
                  }]
                }} />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
        {isLoading && (
          <div className="bg-gray-200 p-3 rounded-lg mr-auto max-w-xs">
            <p className="font-semibold">Assistant</p>
            <p>Analyzing...</p>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Financial Excel File
        </label>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={isLoading}
        />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask for financial analysis..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}