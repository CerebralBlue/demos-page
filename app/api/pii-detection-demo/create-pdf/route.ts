// import puppeteer from 'puppeteer';
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   const { html } = req.body;

//   if (!html) {
//     return res.status(400).json({ message: 'Missing html in request body' });
//   }

//   const browser = await puppeteer.launch({
//     headless: true,
//     args: ['--no-sandbox', '--disable-setuid-sandbox'],
//   });

//   try {
//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

//     const pdfBuffer = await page.pdf({ format: 'A4' });

//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
//     res.end(pdfBuffer);
//   } catch (error) {
//     res.status(500).json({ message: 'Error generating PDF', error: String(error) });
//   } finally {
//     await browser.close();
//   }
// }

// app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
  try {
    const { html } = await req.json();

    if (!html) {
      return NextResponse.json({ message: 'Missing html in request body' }, { status: 400 });
    }

    const browser = await puppeteer.launch({
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
