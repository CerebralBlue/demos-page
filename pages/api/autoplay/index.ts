import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
    try {
        const { url, action } = await request.json();

        // Launch browser
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Navigate to URL
        await page.goto(url, { waitUntil: 'networkidle0' });

        let result;
        switch (action) {
            case 'search':
                const searchInput = await page.$('input[name="q"]');
                if (searchInput) {
                    await searchInput.type('Automated search query');
                    await searchInput.press('Enter');
                    result = await page.content();
                }
                break;

            case 'login':
                const usernameInput = await page.$('#username');
                const passwordInput = await page.$('#password');

                if (usernameInput && passwordInput) {
                    await usernameInput.type('automated_user');
                    await passwordInput.type('automated_password');
                    await passwordInput.press('Enter');
                    result = await page.url();
                }
                break;

            default:
                result = 'No action specified';
        }

        // Close browser
        await browser.close();

        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error('Autoplay error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}