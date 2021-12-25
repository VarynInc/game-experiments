/**
 * Run the development server. This will serve the project directly from the source folder with a static
 * HTTP server.
 */
 const express = require("express");
 const serveStatic = require("serve-static");
 const webserver = express();
 let localPort = 8000;
 webserver.use(serveStatic("./", {"index": ["index.html"]}));
 
 const server = webserver.listen(localPort);
 
 server.on('error', function(serverError) {
     console.log('Trying port ' + localPort + '...');
     if (serverError.code === 'EADDRINUSE') {
       console.log('Port ' + localPort + ' is in use, retrying with a different port...');
       localPort += 1;
       setTimeout(function() {
         server.close();
         console.log('Trying port ' + localPort + '...');
         server.listen(localPort);
       }, 2000);
     }
 });
 server.on('listening', function() {
   console.log("Listening on port " + localPort + ": open a browser to http://localhost:" + localPort);
 });
 