import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { messages, fileData } = await request.json();

    const response = await axios.post(
      'https://api.together.xyz/inference',
      {
        model: 'meta-llama/Llama-2-70b-chat-hf',
        messages,
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

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('TogetherAI API error:', error);
    return NextResponse.json(
      { error: 'Error processing your request' },
      { status: 500 }
    );
  }
}