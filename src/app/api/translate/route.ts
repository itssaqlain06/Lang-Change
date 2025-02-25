// src/app/api/translate/route.ts

import { NextResponse } from 'next/server';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  modelName: "gpt-3.5-turbo",
});

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", "Translate the following from English into {language}"],
  ["user", "{text}"],
]);

export async function POST(request: Request) {
  try {
    const { language, text } = await request.json();
    const promptValue = await promptTemplate.invoke({ language, text });
    const response = await model.invoke(promptValue);

    return NextResponse.json({ translation: response.content });
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation error occurred' },
      { status: 500 }
    );
  }
}
