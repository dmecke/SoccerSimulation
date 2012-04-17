module.exports = require('http').createServer(function(req, res) {
    if (req.url == '/') {
        file = '/index.html';
    } else {
        file = req.url;
    }
    require('fs').readFile(
        __dirname + file,
        function(err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading "' + req.url + '"');
            }

            res.writeHead(200);
            res.end(data);
        }
    );
});
