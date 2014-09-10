/**
 * 启用静态服务器
 */
var connect = require('connect')
var serveStatic = require('serve-static')

var app = connect()

app.use(serveStatic('./publish', {'index': ['index.html', 'index.htm']}))
app.listen(3000);

console.log('Started on port 3000...');