
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextApiResponse) {

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { url } = await req.json();
    console.log("url: ", url)
    try {
        const response = await fetch(`https://r.jina.ai/${url}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const markdown = await response.text();
        console.log("markdown: ", markdown)
        return NextResponse.json({ message: "Hello World" }, { status: 200 });
    } catch (error) {
        console.error('There was an error!', error);
        return NextResponse.json({ message: error }, { status: 500 });
    }
}