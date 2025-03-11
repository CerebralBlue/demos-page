import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile } from 'formidable';
import fs from 'fs/promises';
import axios from 'axios';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

const url = "https://stagingapi.neuralseek.com/v1/SEC-demo/exploreUpload";
const headers = {
  "accept": "application/json",
  "apikey": "6c5aca86-d343615d-60a44b29-c6dbb084",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error parsing form data', error: err.message });
      }

      if (!files.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      // Handle case where `files.file` could be an array
      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      if (!file || !file.filepath) {
        return res.status(400).json({ success: false, message: "Invalid file data" });
      }

      try {
        // Read file as a buffer
        const fileBuffer = await fs.readFile(file.filepath);

        // Create FormData for sending the file
        const formData = new FormData();
        formData.append("file", fileBuffer, file.originalFilename || "upload.csv");

        // Make request to NeuralSeek API
        const response = await axios.post(url, formData, { headers });

        res.status(response.status).json(response.data);
      } catch (uploadError: any) {
        console.error("Error uploading file:", uploadError);
        res.status(500).json({ success: false, message: "File upload failed", error: uploadError.message });
      }
    });
  } catch (error: any) {
    console.error("Error processing file:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}
