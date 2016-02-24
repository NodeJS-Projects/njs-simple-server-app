var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    path = require('path');


var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "css": "text/css",
    "js": "text/javascript",
    "text": "text/plain"
};

var port = 3000;
http.createServer(function (req, res) {

    var uri = url.parse(req.url).pathname;
    var filename = path.join(process.cwd(), unescape(uri));
    console.log('Loading ' + uri);
    var stats;

    try {
        stats = fs.lstatSync(filename);
    } catch (err) {
        res.writeHead(404, {
            'Content-Type': mimeTypes.text
        });
        res.write("404 Page Not Found");
        res.end();
        return;
    }

    // check if file or dir
    if (stats.isFile()) {
        var ext = path.extname(filename).split('.').reverse()[0];
        var mimeType = mimeTypes[ext];
        res.writeHead(200, {
            'Content-Type': mimeType
        });
        var filestream = fs.createReadStream(filename);
        filestream.pipe(res);
    } else if (stats.isDirectory()) {
        res.writeHead(302, {
            'Location': 'home.html'
        });
        res.end();
    } else {
        res.writeHead(500, {
            'Content-Type': mimeTypes.text
        });
        res.write("500 Internal Server Error");
        res.end();
    }

}).listen(port, () => {
    console.log("Server listening on port " + port);
});