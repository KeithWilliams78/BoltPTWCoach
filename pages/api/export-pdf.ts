import { NextApiRequest, NextApiResponse } from 'next';
import { PDFGenerator } from '@/lib/pdf';
import type { ExportPDFRequest, ExportPDFResponse } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExportPDFResponse | Buffer>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { cascade, coachComments }: ExportPDFRequest = req.body;

    // Validate request body
    if (!cascade) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid payload - cascade data required' 
      });
    }

    // Generate PDF
    const pdfGenerator = new PDFGenerator();
    const pdfBytes = await pdfGenerator.generatePDF(cascade, coachComments || []);

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="strategy-cascade.pdf"');
    res.setHeader('Content-Length', pdfBytes.length);

    // Send PDF
    res.status(200).send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error('PDF generation error:', error);
    
    return res.status(500).json({ 
      success: false, 
      error: 'Export error - unable to generate PDF' 
    });
  }
}