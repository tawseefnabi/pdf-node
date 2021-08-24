var pdf = require('./index');

let htm_template = `<!DOCTYPE html>
<html>
  <head>
    <mate charest="utf-8" />
    <title>Hello world!</title>
  </head>
  <body>
    <h1>User List</h1>
    <ul>
      {{#each users}}
      <li>Name: {{this.name}}</li>
      <li>Age: {{this.age}}</li>
      <br />
      {{/each}}
    </ul>
  </body>
</html>`;

var options = {
	format: 'A3',
	orientation: 'portrait',
	border: '10mm',
	header: {
		height: '45mm',
		contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
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

let users = [
	{
		name: 'tom',
		age: '26'
	},
	{
		name: 'dick',
		age: '26'
	},
	{
		name: 'harry',
		age: '26'
	}
];

let doc = {
	html: htm_template,
	data: {
		users: users
	},
	type: 'pdf',
	path: './output.pdf'
};

pdf(doc, options);
