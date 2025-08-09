import * as pdf from 'html-pdf';
import Handlebars from 'handlebars';
import * as ejs from 'ejs';
import handleError from 'cli-error-handler';

// Extend EJS types
type TemplateEngine = 'handlebars' | 'ejs' | 'html';

type TemplateFunction = (data: Record<string, any>) => Promise<string>;

interface TemplateCache {
	[key: string]: TemplateFunction | string;
}

const templateCache: TemplateCache = {};

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

export {Handlebars, ejs};

/**
 * Generates a PDF from an HTML template and data
 * @param options PDF generation options
 * @returns Promise that resolves with the generated PDF (as buffer or file info)
 * @throws {Error} If required options are missing or PDF generation fails
 */
export function generatePDF(
	options: PDFOptions
): Promise<PDFBufferResult | PDFFileResult> {
	return new Promise((resolve, reject) => {
		void (async () => {
			if (!options || !options.html || !options.data) {
				reject(new Error('Some, or all, options are missing.'));
				return;
			}

			if (options.type !== undefined && options.type !== 'pdf') {
				reject(new Error('Only PDF file type is supported'));
				return;
			}

			const pdfOptions = options.pdfOptions || {};
			const useCache = options.cacheTemplate !== false; // Default to true
			const engine: TemplateEngine = options.engine || 'handlebars';

			// Get compiled template
			let html: string;
			try {
				html = await compileTemplate(
					options.html,
					options.data,
					engine,
					useCache
				);
			} catch (error) {
				handleError('Error generating PDF', error as Error);
				reject(error);
				return;
			}

			// Check if buffer output is requested
			if (options.buffer === true) {
				// Output will be PDF buffer (useful for APIs/web services)
				pdf.create(html, pdfOptions).toBuffer(function (
					err: Error | null,
					buffer: Buffer
				) {
					if (err) {
						handleError('error in creating buffer', err);
						reject(err);
						return;
					}

					// PDF buffer generated successfully

					resolve({
						buffer: buffer,
						size: buffer.length,
						type: 'application/pdf'
					});
				});
			} else {
				// Output will be PDF file (default behavior)
				if (!options.path) {
					reject(
						new Error(
							'Path is required when buffer option is not set to true.'
						)
					);
					return;
				}

				const filepath = options.path;
				pdf.create(html, pdfOptions).toFile(
					filepath,
					function (err: Error | null, res: pdf.FileInfo) {
						if (err) {
							handleError('error in creating file', err);
							reject(err);
							return;
						}

						// File generated successfully
						resolve(res);
					}
				);
			}
		})();
	});
}

/**
 * Adds a page break to the PDF
 * @returns HTML string with a page break
 */
export function addNewPage(): string {
	return '<div style="page-break-after: always;"></div>';
}

/**
 * Compiles a template with the specified engine
 * @param template The template string
 * @param data Data to inject into the template
 * @param engine Template engine to use ('handlebars', 'ejs', or 'html')
 * @param useCache Whether to cache the compiled template
 * @returns Compiled HTML string
 */
async function compileTemplate(
	template: string,
	data: Record<string, any>,
	engine: TemplateEngine = 'handlebars',
	useCache: boolean = true
): Promise<string> {
	const cacheKey = useCache ? `${engine}:${template}` : null;

	// Return cached template if available
	if (cacheKey && templateCache[cacheKey]) {
		const cached = templateCache[cacheKey];
		if (typeof cached === 'function') {
			return cached(data);
		}
		return cached;
	}

	// Compile and cache the template
	let compiled: TemplateFunction | string;

	switch (engine) {
		case 'ejs': {
			try {
				const ejs = await import('ejs');
				const templateFn = ejs.compile(template, {async: true});
				compiled = async (data: Record<string, any>) =>
					await templateFn(data);
			} catch (error) {
				throw new Error(`Failed to compile EJS template: ${error}`);
			}
			break;
		}

		case 'html': {
			// Simple variable replacement for HTML mode
			compiled = template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
				return data[key.trim()] || '';
			});
			break;
		}

		case 'handlebars':
		default: {
			const handlebarsTemplate = Handlebars.compile(template);
			compiled = (templateData: Record<string, any>) =>
				Promise.resolve(handlebarsTemplate(templateData));
			break;
		}
	}

	// Cache the compiled template if needed
	if (useCache && cacheKey) {
		templateCache[cacheKey] = compiled;
	}

	return typeof compiled === 'function' ? compiled(data) : compiled;
}

/**
 * Clears the template cache
 */
export function clearTemplateCache(): void {
	Object.keys(templateCache).forEach(key => {
		delete templateCache[key];
	});
}

const pdfNode = {
	generatePDF,
	addNewPage,
	clearTemplateCache,
	// Export template engines for advanced usage
	engines: {
		handlebars: Handlebars,
		ejs
	}
};

export default pdfNode;
