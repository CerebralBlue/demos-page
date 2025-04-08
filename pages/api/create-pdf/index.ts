// import puppeteer from 'puppeteer';
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const browser = await puppeteer.launch({
//     headless: true,
//     args: ['--no-sandbox', '--disable-setuid-sandbox'],
//   });
//   const page = await browser.newPage();

//   const html = `
//     <html>
//       <head>
//         <script src="https://cdn.tailwindcss.com"></script>
//       </head>
//       <body class="p-10">
//         <div class="bg-white p-6 rounded shadow text-gray-800">
//           <h1 class="text-xl font-bold mb-2">Generated PDF</h1>
//           <p>This is rendered on the server with Tailwind CSS from CDN.</p>
//         </div>
//       </body>
//     </html>
//   `;

//   await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

//   const pdfBuffer = await page.pdf({ format: 'A4' });
//   await browser.close();

//   res.setHeader('Content-Type', 'application/pdf');
//   res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
//   res.end(pdfBuffer); // ✅ Correct way to send binary data
// }

import puppeteer from 'puppeteer';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { html } = req.body;

  if (!html) {
    return res.status(400).json({ message: 'Missing html in request body' });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

    const pdfBuffer = await page.pdf({ format: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
    res.end(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Error generating PDF', error: String(error) });
  } finally {
    await browser.close();
  }
}
