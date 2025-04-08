"use client";
import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url }) => {
  return (
    <div className="w-2/3 h-1/2">
      <Document file={url}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
};

export default PDFViewer;