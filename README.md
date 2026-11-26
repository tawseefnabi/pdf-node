# pdf-node

A powerful PDF generation library for Node.js with first-class TypeScript support

[![CI](https://github.com/tawseefnabi/pdf-node/actions/workflows/ci.yml/badge.svg)](https://github.com/tawseefnabi/pdf-node/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/pdf-node.svg)](https://badge.fury.io/js/pdf-node)
[![TypeScript](https://img.shields.io/badge/TypeScript-Supported-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

-   🚀 Generate PDFs from HTML templates with multiple template engines (Handlebars, EJS, or plain HTML)
-   ⚡ Template pre-compilation and caching for better performance
-   📦 Works with both JavaScript and TypeScript
-   ✨ Supports both CommonJS and ES Modules
-   🎨 Customize PDF options (format, orientation, borders, etc.)
-   🔥 Async/await support
-   📝 Type definitions included
-   🛠️ CLI support

## Table of Contents

-   [Installation](#installation)
-   [Quick Start](#quick-start)
-   [JavaScript Usage](#javascript-usage)
-   [TypeScript Usage](#typescript-usage)
-   [API Reference](#api-reference)
-   [Template Guide](#template-guide)
-   [CLI Usage](#cli-usage)
-   [Contributing](#contributing)
-   [License](#license)

## Installation

```bash
# Using npm
npm install pdf-node

# Using yarn
yarn add pdf-node

# Using pnpm
pnpm add pdf-node
```

### Template Engine Dependencies

By default, pdf-node includes support for Handlebars. To use EJS templates, you'll need to install the EJS package:

```bash
# Install EJS for EJS template support
npm install ejs @types/ejs
```

### TypeScript Support

This package includes TypeScript type definitions. For the best experience, install these dev dependencies:

```bash
npm install --save-dev typescript @types/node @types/handlebars
```

## Quick Start

### 1. Create a simple HTML template (`template.html`)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>User Report</title>
		<style>
			body {
				font-family: Arial, sans-serif;
			}
			.user {
				margin-bottom: 20px;
				padding: 10px;
				border: 1px solid #eee;
			}
			.header {
				background: #f5f5f5;
				padding: 20px;
				text-align: center;
			}
		</style>
	</head>
	<body>
		<div class="header">
			<h1>User Report</h1>
			<p>Generated on {{date}}</p>
		</div>

		{{#each users}}
		<div class="user">
			<h2>{{name}}</h2>
			<p>Age: {{age}}</p>
			<p>Email: {{email}}</p>
		</div>
		{{/each}}
	</body>
</html>
```

### 2. Generate PDF (JavaScript)

```javascript
// CommonJS
const {generatePDF} = require('pdf-node');
const fs = require('fs');
const path = require('path');

// Or ES Modules
// import { generatePDF } from 'pdf-node';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

async function createPDF() {
	// Read HTML template
	const html = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');

	// Sample data
	const users = [
		{name: 'John Doe', age: 30, email: 'john@example.com'},
		{name: 'Jane Smith', age: 25, email: 'jane@example.com'}
	];

	// PDF options
	const options = {
		format: 'A4',
		orientation: 'portrait',
		border: '10mm',
		header: {
			height: '15mm',
			contents:
				'<div style="text-align: center;">Confidential Report</div>'
		},
		footer: {
			height: '15mm',
			contents: {
				default:
					'<div style="text-align: center; color: #666;">Page {{page}} of {{pages}}</div>'
			}
		}
	};

	// Generate PDF
	try {
		const result = await generatePDF({
			html: html,
			data: {
				users: users,
				date: new Date().toLocaleDateString()
			},
			path: './user-report.pdf',
			type: 'pdf',
			pdfOptions: options
		});

		console.log('PDF generated successfully:', result.filename);
	} catch (error) {
		console.error('Error generating PDF:', error);
	}
}

createPDF();
```

## TypeScript Usage

```typescript
import {generatePDF, PDFOptions} from 'pdf-node';
import * as fs from 'fs';
import * as path from 'path';
import {fileURLToPath} from 'url';

// For ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define TypeScript interfaces
interface User {
	name: string;
	age: number;
	email: string;
}

interface TemplateData {
	users: User[];
	date: string;
}

async function generateUserReport() {
	// Read HTML template
	const html = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');

	// Sample typed data
	const users: User[] = [
		{name: 'John Doe', age: 30, email: 'john@example.com'},
		{name: 'Jane Smith', age: 25, email: 'jane@example.com'}
	];

	// PDF options with TypeScript type
	const options: PDFOptions = {
		format: 'A4',
		orientation: 'portrait',
		border: '10mm',
		header: {
			height: '15mm',
			contents:
				'<div style="text-align: center;">Confidential Report</div>'
		},
		footer: {
			height: '15mm',
			contents: {
				default:
					'<div style="text-align: center; color: #666;">Page {{page}} of {{pages}}</div>'
			}
		}
	};

	// Generate PDF with buffer output
	try {
		const result = await generatePDF({
			html: html,
			data: {
				users: users,
				date: new Date().toLocaleDateString()
			},
			type: 'pdf',
			buffer: true, // Get PDF as buffer
			pdfOptions: options
		});

		// Example: Save buffer to file
		if ('buffer' in result) {
			fs.writeFileSync('./user-report-buffer.pdf', result.buffer);
			console.log('PDF generated from buffer');
		}

		// Or use the file path if not using buffer
		if ('filename' in result) {
			console.log('PDF generated at:', result.filename);
		}
	} catch (error) {
		console.error('Error generating PDF:', error);
	}
}

generateUserReport();
```

-   Step 2 - Create your HTML Template

    ```html
    <!DOCTYPE html>
    <html lang="en"></html>
    ```

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello world!</title>
</head>

<body>
    <h1>User List</h1>
    <ul>
        {{#each users}}
        <li>Name: {{this.name}}</li>
        <li>Age: {{this.age}}</li>
        <br >
        {{/each}}
    </ul>
</body>

</html>
<!-- a '/' at end is required for single tags -->
  ```

-   Step 3 - Provide format and orientation as per your need

    > "height": "10.5in", // allowed units: mm, cm, in, px

    > "width": "8in", // allowed units: mm, cm, in, px

    -   or -

    > "format": "Letter", // allowed units: A3, A4, A5, Legal, Letter, Tabloid

    > "orientation": "portrait", // portrait or landscape

    ```javascript
    var options = {
    	format: 'A3',
    	orientation: 'portrait',
    	border: '10mm',
    	header: {
    		height: '45mm',
    		contents:
    			'<div style="text-align: center;">Author: Shyam Hajare</div>'
    	},
    	footer: {
    		height: '28mm',
    		contents: {
    			first: 'Cover page',
    			2: 'Second page', // Any page number is working. 1-based index
    			default:
    				'<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
    			last: 'Last Page'
    		}
    	}
    };
    ```

-   Step 4 - Provide HTML, user data and output configuration

    ```javascript
    var users = [
    	{
    		name: 'alpha',
    		age: '21'
    	},
    	{
    		name: 'beta',
    		age: '23'
    	},
    	{
    		name: 'gamma',
    		age: '29'
    	}
    ];

    // For file output (default)
    var document = {
    	html: html,
    	data: {
    		users: users
    	},
    	path: './output.pdf',
    	type: 'pdf'
    };

    // For buffer output (useful for APIs/web services)
    var documentBuffer = {
    	html: html,
    	data: {
    		users: users
    	},
    	type: 'pdf',
    	buffer: true // Enable buffer output
    };
    ```

-   Step 5- After setting all parameters, just pass document and options to `pdf` method.

    ```javascript
    pdf.generatePDF(document, options)
    	.then(res => {
    		console.log(res);
    	})
    	.catch(error => {
    		console.error(error);
    	});
    ```

-   Step 5 (Alternative) - Generate PDF (Buffer Output)

    ```javascript
    pdf.generatePDF(documentBuffer, options)
    	.then(res => {
    		console.log('Buffer size:', res.size, 'bytes');
    		console.log('Content type:', res.type);
    		// Use res.buffer for HTTP responses, saving to database, etc.
    	})
    	.catch(error => {
    		console.error(error);
    	});
    ```

## Template Guide

### Supported Template Engines

pdf-node supports multiple template engines out of the box:

#### 1. Handlebars (Default)

[Handlebars](https://handlebarsjs.com/) is the default template engine. It provides a simple syntax for inserting data into templates.

```handlebars
<h1>{{title}}</h1>
<ul>
	{{#each items}}
		<li>{{this.name}} - ${{this.price}}</li>
	{{/each}}
</ul>
```

#### 2. EJS

[EJS](https://ejs.co/) allows you to embed JavaScript directly in your templates.

```ejs
<h1><%= title %></h1>
<ul>
  <% items.forEach(function(item) { %>
    <li><%= item.name %> - $<%= item.price.toFixed(2) %></li>
  <% }); %>
</ul>
```

#### 3. Plain HTML

For simple use cases, you can use plain HTML with basic variable substitution:

```html
<h1>Static Report</h1>
<p>This is a static HTML template that will be converted to PDF.</p>
```

### Template Caching

For better performance, templates are compiled and cached by default. You can control this behavior using the `cacheTemplate` option:

```javascript
// Disable caching for this template
const result = await generatePDF({
	html: template,
	data: {
		/* ... */
	},
	engine: 'handlebars', // or 'ejs' or 'html'
	cacheTemplate: false // Disable caching
	// ...other options
});

// Clear the template cache if needed
import {clearTemplateCache} from 'pdf-node';
clearTemplateCache();
```

### Template Data

You can pass any JavaScript object as template data. The data will be available in your templates according to the template engine's syntax.

```javascript
const data = {
	title: 'Sales Report',
	date: new Date().toLocaleDateString(),
	items: [
		{name: 'Product A', price: 19.99},
		{name: 'Product B', price: 29.99}
	],
	total: 49.98
};
```

## Buffer Output for APIs and Web Services

The buffer output feature is perfect for web APIs and services where you need to return PDF data directly to clients without saving temporary files:

```javascript
// Express.js API example
const express = require('express');
const pdf = require('pdf-node');
const app = express();

app.get('/generate-report/:userId', async (req, res) => {
	try {
		// Your HTML template
		const html = `
      <h1>User Report</h1>
      <p>Report for user: {{user.name}}</p>
      <p>Generated on: {{date}}</p>
    `;

		// Document configuration for buffer output
		const document = {
			html: html,
			data: {
				user: {name: 'John Doe'},
				date: new Date().toLocaleDateString()
			},
			type: 'pdf',
			buffer: true // Enable buffer output
		};

		// Generate PDF buffer
		const result = await pdf.generatePDF(document);

		// Set appropriate headers and send buffer
		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader(
			'Content-Disposition',
			'attachment; filename="report.pdf"'
		);
		res.setHeader('Content-Length', result.size);
		res.send(result.buffer);
	} catch (error) {
		res.status(500).json({error: 'Failed to generate PDF'});
	}
});
```

## Output Options

### File Output (Default)

```javascript
const document = {
	html: htmlTemplate,
	data: templateData,
	type: 'pdf',
	path: './output.pdf' // Required for file output
};

// Returns: { filename: '/path/to/output.pdf' }
```

### Buffer Output (New Feature)

```javascript
const document = {
	html: htmlTemplate,
	data: templateData,
	type: 'pdf',
	buffer: true // Enable buffer output
};

// Returns: { buffer: Buffer, size: number, type: 'application/pdf' }
```

## Manual Page Breaks

You can manually insert a page break in your PDF using the `addNewPage` function:

```javascript
var pdf = require('pdf-node');

// Add a page break in your HTML template
var html = `
  <h1>Page 1 Content</h1>
  <p>This is on the first page.</p>
  
  ${pdf.addNewPage()}
  
  <h1>Page 2 Content</h1>
  <p>This is on the second page.</p>
`;
```

## Advanced Usage Examples

### Database Integration with Buffer Output

```javascript
const pdf = require('pdf-node');
const fs = require('fs');

// Generate invoice PDF and save to database
async function generateInvoiceBuffer(invoiceData) {
	const htmlTemplate = fs.readFileSync('./templates/invoice.html', 'utf8');

	const document = {
		html: htmlTemplate,
		data: invoiceData,
		type: 'pdf',
		buffer: true
	};

	const result = await pdf.generatePDF(document);

	// Save buffer to database (example with MongoDB)
	await db.collection('invoices').insertOne({
		invoiceId: invoiceData.id,
		pdfData: result.buffer,
		size: result.size,
		createdAt: new Date()
	});

	return result;
}
```

### REST API with Different Response Types

```javascript
const express = require('express');
const pdf = require('pdf-node');
const app = express();

app.get('/api/report/:format', async (req, res) => {
	const {format} = req.params; // 'download', 'inline', 'base64'

	const document = {
		html: reportTemplate,
		data: reportData,
		type: 'pdf',
		buffer: true
	};

	try {
		const result = await pdf.generatePDF(document);

		switch (format) {
			case 'download':
				res.setHeader('Content-Type', 'application/pdf');
				res.setHeader(
					'Content-Disposition',
					'attachment; filename="report.pdf"'
				);
				res.send(result.buffer);
				break;

			case 'inline':
				res.setHeader('Content-Type', 'application/pdf');
				res.setHeader('Content-Disposition', 'inline');
				res.send(result.buffer);
				break;

			case 'base64':
				res.json({
					pdf: result.buffer.toString('base64'),
					size: result.size,
					type: result.type
				});
				break;

			default:
				res.status(400).json({error: 'Invalid format'});
		}
	} catch (error) {
		res.status(500).json({error: 'PDF generation failed'});
	}
});
```

### Microservice Architecture Example

```javascript
// PDF Generation Microservice
const express = require('express');
const pdf = require('pdf-node');
const app = express();

app.post('/generate-pdf', async (req, res) => {
	const {template, data, options = {}} = req.body;

	try {
		const document = {
			html: template,
			data: data,
			type: 'pdf',
			buffer: true
		};

		const result = await pdf.generatePDF(document);

		// Return buffer as base64 for JSON response
		res.json({
			success: true,
			pdf: result.buffer.toString('base64'),
			metadata: {
				size: result.size,
				type: result.type,
				generatedAt: new Date().toISOString()
			}
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message
		});
	}
});
```

## Configuration Options

### Document Object Properties

| Property        | Type    | Required | Description                                                                                     |
| --------------- | ------- | -------- | ----------------------------------------------------------------------------------------------- |
| `html`          | String  | ✅       | HTML template string (supports Handlebars syntax)                                               |
| `data`          | Object  | ✅       | Data to inject into the template                                                                |
| `type`          | String  | ❌       | Output type (`'pdf'` or `'buffer'`). Default: `'pdf'`                                           |
| `path`          | String  | ⚠️       | Required for file output. Absolute or relative path                                             |
| `buffer`        | Boolean | ⚠️       | Set to `true` for buffer output. Cannot use with `path`                                         |
| `engine`        | String  | ❌       | Template engine to use (`'handlebars'`, `'ejs'`, or `'html'`). Default: `'handlebars'`          |
| `cacheTemplate` | Boolean | ❌       | Whether to cache the compiled template. Default: `true`                                         |
| `pdfOptions`    | Object  | ❌       | Options for PDF generation (see [html-pdf](https://www.npmjs.com/package/html-pdf) for details) |

### Return Values

#### File Output

```javascript
{
	filename: '/absolute/path/to/output.pdf';
}
```

#### Buffer Output

```javascript
{
  buffer: Buffer,      // PDF data as Node.js Buffer
  size: 25600,        // Size in bytes
  type: 'application/pdf'  // MIME type
}
```

## Error Handling

```javascript
try {
	const result = await pdf.generatePDF(document);
	console.log('PDF generated successfully');
} catch (error) {
	if (error.message.includes('options are missing')) {
		console.error('Invalid document configuration');
	} else if (error.message.includes('Path is required')) {
		console.error('Path required when buffer is not enabled');
	} else if (error === 'only pdf file type supported') {
		console.error('Invalid document type');
	} else {
		console.error('PDF generation failed:', error.message);
	}
}
```

## Best Practices

### Memory Management

-   **Buffer output** is ideal for small to medium PDFs (< 50MB)
-   **File output** is better for large PDFs to avoid memory issues
-   Always handle buffers promptly to prevent memory leaks

### Performance Tips

-   Cache compiled Handlebars templates for repeated use
-   Use streaming for large file downloads
-   Consider PDF compression for smaller file sizes

### Security Considerations

-   Sanitize user input in templates to prevent XSS
-   Validate file paths to prevent directory traversal
-   Implement rate limiting for PDF generation endpoints

## Reference

Please refer to the following if you want to use conditions in your HTML template:

[Handlebars](https://handlebarsjs.com/guide/#what-is-handlebars)

<br>

## Connect

<div align="left">
    <p><a href="https://github.com/tawseefnabi/"><img alt="GitHub @tawseefnabi" align="center" src="https://img.shields.io/badge/GITHUB-gray.svg?colorB=6cc644&style=flat" /></a>&nbsp;<small><strong>(follow)</strong> To stay up to date on free & open-source software</small></p>
    <p><a href="https://twitter.com/NabiTowseef/"><img alt="Twitter @NabiTowseef" align="center" src="https://img.shields.io/badge/TWITTER-gray.svg?colorB=1da1f2&style=flat" /></a>&nbsp;<small><strong>(follow)</strong> To get tech updates/small></p>
    <p><a href="https://www.linkedin.com/in/tawseef-ahmad-bhat-61830385/"><img alt="LinkedIn @TawseefAhmad" align="center" src="https://img.shields.io/badge/LINKEDIN-gray.svg?colorB=0077b5&style=flat" /></a>&nbsp;<small><strong>(connect)</strong> On the LinkedIn profile y'all</small></p>
</div>

<br>

[n]: https://nodecli.com/?utm_source=FOSS&utm_medium=FOSS&utm_campaign=create-node-app
[repo]: https://github.com/AhmadAwais/create-node-app
