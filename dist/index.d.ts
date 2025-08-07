import * as pdf from 'html-pdf';
export interface PDFOptions {
	html: string;
	data: Record<string, any>;
	path?: string;
	buffer?: boolean;
	type?: string;
	pdfOptions?: pdf.CreateOptions;
}
export interface PDFBufferResult {
	buffer: Buffer;
	size: number;
	type: string;
}
export type PDFFileResult = pdf.FileInfo;
/**
 * Generates a PDF from an HTML template and data
 * @param options PDF generation options
 * @returns Promise that resolves with the generated PDF (as buffer or file info)
 * @throws {Error} If required options are missing or PDF generation fails
 */
export declare function generatePDF(
	options: PDFOptions
): Promise<PDFBufferResult | PDFFileResult>;
/**
 * Adds a page break to the PDF
 * @returns HTML string with a page break
 */
export declare function addNewPage(): string;
declare const pdfNode: {
	generatePDF: typeof generatePDF;
	addNewPage: typeof addNewPage;
};
export default pdfNode;
