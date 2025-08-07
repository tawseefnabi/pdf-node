import {CreateOptions, CreateResult} from 'html-pdf';

export interface PDFOptions {
	/**
	 * HTML template string or path to HTML file
	 */
	html: string;

	/**
	 * Data object to be passed to the Handlebars template
	 */
	data: Record<string, any>;

	/**
	 * Output file path (required if buffer is false)
	 */
	path?: string;

	/**
	 * If true, returns a PDF buffer instead of writing to a file
	 * @default false
	 */
	buffer?: boolean;

	/**
	 * PDF generation options (passed directly to html-pdf)
	 * @see https://github.com/marcbachmann/node-html-pdf#options
	 */
	pdfOptions?: CreateOptions;
}

export interface PDFBufferResult {
	/**
	 * PDF file as a Buffer
	 */
	buffer: Buffer;

	/**
	 * Size of the PDF buffer in bytes
	 */
	size: number;

	/**
	 * MIME type of the PDF file
	 */
	type: string;
}

// Using type alias instead of empty interface extending CreateResult
export type PDFFileResult = CreateResult;

/**
 * Generates a PDF from an HTML template and data
 * @param options PDF generation options
 * @returns Promise that resolves with the generated PDF (as buffer or file info)
 * @throws {Error} If required options are missing or PDF generation fails
 */
export function generatePDF(
	options: PDFOptions
): Promise<PDFBufferResult | PDFFileResult>;

/**
 * Adds a page break to the PDF
 * @returns HTML string with a page break
 */
export function addNewPage(): string;

declare const _default: {
	generatePDF: typeof generatePDF;
	addNewPage: typeof addNewPage;
};

export default _default;
