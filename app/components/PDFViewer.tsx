"use client";
import React, { useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url }) => {

  useEffect(() => {
    // Remove the error message if it appears
    const interval = setInterval(() => {
      const errorElement = document.querySelector('.react-pdf__message--error');
      if (errorElement) {
        errorElement.remove();
      }
    }, 500);

    // Clear interval after some time to prevent infinite loop
    setTimeout(() => clearInterval(interval), 5000);
  }, []);

  return (
    <Document
      file={url}
      onLoadError={(error) => console.error('Load error:', error)}
      onSourceError={(error) => console.error('Source error:', error)}
    >
      <Page pageNumber={1} />
    </Document>

  );
};

export default PDFViewer;