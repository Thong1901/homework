const { ExpressPlus } = require('./expressplus.js');

const app = new ExpressPlus();

app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World');
});

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});
