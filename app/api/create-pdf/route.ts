import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
  try {
    const { html } = await req.json();

    if (!html) {
      return NextResponse.json({ message: 'Missing html in request body' }, { status: 400 });
    }

    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome', // SERVER
      // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',  // LOCAL
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error generating PDF', error: error.message || String(error) },
      { status: 500 }
    );
  }
}