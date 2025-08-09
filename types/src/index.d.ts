import * as pdf from 'html-pdf';
import Handlebars from 'handlebars';
import * as ejs from 'ejs';
type TemplateEngine = 'handlebars' | 'ejs' | 'html';
export interface PDFOptions {
    html: string;
    data: Record<string, any>;
    path?: string;
    buffer?: boolean;
    type?: string;
    engine?: TemplateEngine;
    cacheTemplate?: boolean;
    pdfOptions?: pdf.CreateOptions;
}
export interface PDFBufferResult {
    buffer: Buffer;
    size: number;
    type: string;
}
export type PDFFileResult = pdf.FileInfo;
export { Handlebars, ejs };
/**
 * Generates a PDF from an HTML template and data
 * @param options PDF generation options
 * @returns Promise that resolves with the generated PDF (as buffer or file info)
 * @throws {Error} If required options are missing or PDF generation fails
 */
export declare function generatePDF(options: PDFOptions): Promise<PDFBufferResult | PDFFileResult>;
/**
 * Adds a page break to the PDF
 * @returns HTML string with a page break
 */
export declare function addNewPage(): string;
/**
 * Clears the template cache
 */
export declare function clearTemplateCache(): void;
declare const pdfNode: {
    generatePDF: typeof generatePDF;
    addNewPage: typeof addNewPage;
    clearTemplateCache: typeof clearTemplateCache;
    engines: {
        handlebars: typeof Handlebars;
        ejs: typeof ejs;
    };
};
export default pdfNode;
