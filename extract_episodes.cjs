const fs = require('fs');
const text = fs.readFileSync('public/podcast/index.html', 'utf8');
const searchStr = 'id:"ep-01"';
const start = text.indexOf(searchStr);
const arrStart = text.lastIndexOf('[', start);
const arrEnd = text.indexOf(']', start);
console.log(text.substring(arrStart, arrEnd + 1));
