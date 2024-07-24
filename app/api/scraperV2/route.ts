
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from "next/server";
import puppeteer from 'puppeteer-core';
export async function GET(req: Request, res: NextApiResponse) {

    const auth = process.env.BRIGHT_DATA_KEY

    try {

        const browser = await puppeteer.connect({
            browserWSEndpoint: `wss://${auth}@brd.superproxy.io:9222`
        })

        const page = await browser.newPage();

        page.setDefaultNavigationTimeout(2 * 60 * 1000)

        await page.goto('https://www.amazon.com/Best-Sellers/zgbs')

        const selector = '.a-carousel';

        await page.waitForSelector(selector)

        const products = await page.evaluate(() => {
            const items = document.querySelectorAll('li.a-carousel-card');
            const productList: any = [];

            items.forEach(item => {
                const nameElement: any = item.querySelector('.p13n-sc-truncate-desktop-type2');
                const priceElement: any = item.querySelector('._cDEzb_p13n-sc-price_3mJ9Z');

                const name = nameElement ? nameElement.textContent.trim() : null;
                const price = priceElement ? priceElement.textContent.trim() : null;

                if (name && price) {
                    productList.push({ name, price });
                }
            });

            return productList;
        });



        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        console.error('There was an error!', error);
        return NextResponse.json({ message: error }, { status: 500 });
    }
}