# pdf-node
  A JavaScript PDF generation library for NodeJs

[![CI](https://github.com/tawseefnabi/pdf-node/actions/workflows/ci.yml/badge.svg)](https://github.com/tawseefnabi/pdf-node/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/pdf-node.svg)](https://badge.fury.io/js/pdf-node)

<br>

[![📟](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/install.png)](./../../)

## Install

```sh
npm install  pdf-node --save
```

- Step 1 - Add required packages and read HTML template

  ```javascript
  //Required package
  var pdf = require("pdf-node");
  var fs = require("fs");

  // Read HTML Template
  var path = require('path');
  var html = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');

  ```

- Step 2 - Create your HTML Template

  ```html
  <!DOCTYPE html>
<html lang="en">

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

- Step 3 - Provide format and orientation as per your need

  > "height": "10.5in", // allowed units: mm, cm, in, px

  > "width": "8in", // allowed units: mm, cm, in, px

  - or -

  > "format": "Letter", // allowed units: A3, A4, A5, Legal, Letter, Tabloid

  > "orientation": "portrait", // portrait or landscape

    ```javascript
        var options = {
            format: "A3",
            orientation: "portrait",
            border: "10mm",
            header: {
                height: "45mm",
                contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
            },
            footer: {
                height: "28mm",
                contents: {
                    first: 'Cover page',
                    2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            }
        };
    ```
    
- Step 4 - Provide HTML, user data and output configuration

  ```javascript
  var users = [
    {
      name: "alpha",
      age: "21",
    },
    {
      name: "beta",
      age: "23",
    },
    {
      name: "gamma",
      age: "29",
    },
  ];

  // For file output (default)
  var document = {
    html: html,
    data: {
      users: users,
    },
    path: "./output.pdf",
    type: "pdf",
  };

  // For buffer output (useful for APIs/web services)
  var documentBuffer = {
    html: html,
    data: {
      users: users,
    },
    type: "pdf",
    buffer: true,  // Enable buffer output
  };
 
  ```

- Step 5- After setting all parameters, just pass document and options to `pdf` method.

  ```javascript
  pdf
    .generatePDF(document, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
  ```

- Step 5 (Alternative) - Generate PDF (Buffer Output)

  ```javascript
  pdf
    .generatePDF(documentBuffer, options)
    .then((res) => {
      console.log('Buffer size:', res.size, 'bytes');
      console.log('Content type:', res.type);
      // Use res.buffer for HTTP responses, saving to database, etc.
    })
    .catch((error) => {
      console.error(error);
    });
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
        user: { name: 'John Doe' },
        date: new Date().toLocaleDateString()
      },
      type: 'pdf',
      buffer: true  // Enable buffer output
    };
    
    // Generate PDF buffer
    const result = await pdf.generatePDF(document);
    
    // Set appropriate headers and send buffer
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
    res.setHeader('Content-Length', result.size);
    res.send(result.buffer);
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate PDF' });
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
  path: './output.pdf'  // Required for file output
};

// Returns: { filename: '/path/to/output.pdf' }
```

### Buffer Output (New Feature)
```javascript
const document = {
  html: htmlTemplate,
  data: templateData,
  type: 'pdf',
  buffer: true  // Enable buffer output
};

// Returns: { buffer: Buffer, size: number, type: 'application/pdf' }
```

## Manual Page Breaks

You can manually insert a page break in your PDF using the `addNewPage` function:

```javascript
var pdf = require("pdf-node");

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
  const { format } = req.params; // 'download', 'inline', 'base64'
  
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
        res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
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
        res.status(400).json({ error: 'Invalid format' });
    }
  } catch (error) {
    res.status(500).json({ error: 'PDF generation failed' });
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
  const { template, data, options = {} } = req.body;
  
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

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `html` | String | ✅ | HTML template string (supports Handlebars syntax) |
| `data` | Object | ✅ | Data object to populate the template |
| `type` | String | ✅ | Must be `'pdf'` |
| `path` | String | ⚠️ | Required for file output. Absolute or relative path |
| `buffer` | Boolean | ⚠️ | Set to `true` for buffer output. Cannot use with `path` |

### Return Values

#### File Output
```javascript
{
  filename: '/absolute/path/to/output.pdf'
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
- **Buffer output** is ideal for small to medium PDFs (< 50MB)
- **File output** is better for large PDFs to avoid memory issues
- Always handle buffers promptly to prevent memory leaks

### Performance Tips
- Cache compiled Handlebars templates for repeated use
- Use streaming for large file downloads
- Consider PDF compression for smaller file sizes

### Security Considerations
- Sanitize user input in templates to prevent XSS
- Validate file paths to prevent directory traversal
- Implement rate limiting for PDF generation endpoints

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
