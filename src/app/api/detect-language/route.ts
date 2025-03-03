import { NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const detectionModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
});

export async function POST(req: Request) {
    try {
        const { text } = await req.json();
        // console.log('Received text:', text, 'Length:', text?.length);

        if (!text || text.trim().length < 2) {
            // console.log('Text too short or empty, returning "English" by default.');
            return NextResponse.json({ language: 'English' });
        }

        const prompt = ChatPromptTemplate.fromMessages([
            [
                'system',
                `You are a language detection system. 
         Your task is to identify the language of the user's text. 
         Return ONLY the language name in English (e.g. "English", "Spanish", "Urdu").`,
            ],
            ['user', '{text}'],
        ]);

        const promptValue = await prompt.invoke({ text });
        // console.log('Formatted prompt messages:', promptValue.toChatMessages());

        const response = await detectionModel.invoke(promptValue);
        // console.log('Raw model output:', response.content);

        return NextResponse.json({ language: response.content.trim() });
    } catch (error) {
        // console.error('Language detection error:', error);
        return NextResponse.json(
            { error: 'Could not detect language.' },
            { status: 500 }
        );
    }
}
