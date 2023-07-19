// create web server
// 1. load modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
// 2. create web server
var server = http.createServer(function(request,response){
    var parsedUrl = url.parse(request.url);
    var resource = parsedUrl.pathname;
    console.log('resource='+resource);
    // 3. process logic
    if(resource == '/create'){
        // create
        // 1. get post data
        request.on('data', function(data){
            // 2. parse data
            var parsedData = qs.parse(data.toString());
            var title = parsedData.title;
            var description = parsedData.description;
            // 3. save data to file
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                // 4. redirect to home page
                response.statusCode = 302;
                response.setHeader('Location', `/?id=${title}`);
                response.end();
            });
        });
    } else if(resource == '/update'){
        // update
        // 1. get post data
        request.on('data', function(data){
            // 2. parse data
            var parsedData = qs.parse(data.toString());
            var id = parsedData.id;
            var title = parsedData.title;
            var description = parsedData.description;
            // 3. save data to file
            fs.rename(`data/${id}`, `data/${title}`, function(err){
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                    // 4. redirect to home page
                    response.statusCode = 302;
                    response.setHeader('Location', `/?id=${title}`);
                    response.end();
                });
            });
        });
    } else if(resource == '/delete'){
        // delete
        // 1. get post data
        request.on('data', function(data){
            // 2. parse data
            var parsedData = qs.parse(data.toString());
            var id = parsedData.id;
            // 3. delete data to file
            fs.unlink(`data/${id}`, function(err){
                // 4. redirect to home page
                response.statusCode = 302;
                response.setHeader('Location', `/`);
                response.end();
            });
        });
    } else {
        // home
        if(resource == '/'){
            if(parsedUrl.query == undefined){
                // 1. read all files in data directory
                fs.readdir('./data', function(err, files){
                    var title = 'Welcome';
                    var description = 'Hello, Node.js';
                    var list = '<ul>';
                    var i = 0;
                    while(i < files.length){
                        list = list + `<li><a href="/?id=${files[i]}">${files[i]}</a></li>`;
                        i = i + 1;
                    }
                    list = list + '</ul>';
                    var template = '<html>';
                    template = template + '<head>';
                    template = template + '<title>WEB1 - ${title}</title>';
                    template = template + '<meta charset="utf-8">';
                    template = template + '</head>';
                    template = template + '<body>';
                    template = template + '<h1><a href="/">WEB</a></h1>';
                    template = template + list;
                    template = template + '<h2>${title}</h2>';
                    template = template + '<p>${description}</p>';
                    template = template + '</body>';
                    template = template + '</html>';
                    // 2. send data to client
                    response.writeHead(200);
                    response.end(template);
                });
            } else {
                // 1. read all files in data directory
                fs.readdir('./data', function(err, files){
                    var parsedUrl = url.parse(request.url);
                    var queryData = parsedUrl.query;
                    var parsedQuery = qs.parse(queryData);
                    console.log(parsedQuery);
                    var id = parsedQuery.id;
                    var title = id;
                    var description = 'Hello, Node.js';
                    var list = '<ul>';
                    var i = 0;
                    while(i < files.length){
                        list = list + `<li><a href="/?id=${files[i]}">${files[i]}</a></li>`;
                        i = i + 1;
                    }
                    list = list + '</ul>';
                    var template = '<html>';
                    template = template + '<head>';
                    template = template + '<title>WEB1 - ${title}</title>';
                    template = template + '<meta charset="utf-8">';
                    template = template + '</head>';
                    template = template + '<body>';
                    template = template + '<h1><a href="/">WEB</a></h1>';
                    template = template + list;
                    template = template + `<h2>${title}</h2>`;
                    template = template + `<p>${description}</p>`;
                    template = template + '</body>';
                    template = template + '</html>';
                    // 2. send data to client
                    response.writeHead(200);
                    response.end(template);
                });
            }
        } else {
            response.writeHead(404);
            response.end('Not found');
        }
    }
});