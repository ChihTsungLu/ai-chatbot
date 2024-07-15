
import { StreamingTextResponse, createStreamDataTransformer, Message as VercelChatMessgae } from 'ai';
import { ChatOpenAI } from '@langchain/openai';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts'


const formatMessage = (message: VercelChatMessgae) => {
    return `${message.role}: ${message.content}`;
}

const TEMPLATE = `

Current conversation:
{chat_history}

user: {input}
assistant:
`

export async function POST(req: Request) {

    const { messages } = await req.json();

    const formattedPreMessages = messages.slice(0, -1).map(formatMessage)

    const currentMessageContent = messages.at(-1).content

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
        model: "gpt-3.5-turbo",
        apiKey: process.env.OPENAI_API_KEY,
        verbose: true,
    })

    const parser = new HttpResponseOutputParser();

    const chain = prompt.pipe(model).pipe(parser)

    const stream = await chain.stream({
        chat_history: formattedPreMessages.join('\n'),
        input: currentMessageContent,
    })

    return new StreamingTextResponse(stream.pipeThrough(createStreamDataTransformer()));
}