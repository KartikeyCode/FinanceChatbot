import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FinancialTransaction, ChatResponse, ChatMessage } from '../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { messages, model = 'meta-llama/Llama-2-70b-chat-hf', fileData } = req.body as {
    messages: ChatMessage[];
    model?: string;
    fileData?: FinancialTransaction[];
  };

  try {
    let systemMessage: ChatMessage = { 
      role: 'system', 
      content: 'You are a helpful financial assistant.' 
    };
    
    if (fileData) {
      systemMessage.content += ` Analyze this financial data: ${JSON.stringify(fileData)}. 
      Provide spending insights, identify trends, and offer savings recommendations. 
      Format your response with clear sections.`;
    }

    const response = await axios.post<ChatResponse>(
      'https://api.together.xyz/inference',
      {
        model,
        messages: [systemMessage, ...messages.filter(m => m.role !== 'system')],
        max_tokens: 2048,
        temperature: 0.5,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ['</s>', '[/INST]']
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('TogetherAI API error:', error instanceof Error ? error.message : error);
    res.status(500).json({ error: 'Error processing your request' });
  }
}