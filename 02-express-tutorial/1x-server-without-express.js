const http = require('http')
const {readFileSync} = require('fs')

// get all files
const homePage = readFileSync('./navbar-app/index.html')
const homeStyles = readFileSync('./navbar-app/styles.css')
const homeLogo = readFileSync('./navbar-app/logo.svg')
const homeLogic = readFileSync('./navbar-app/browser-app.js')

const server = http.createServer((req, res) => {
    // console.log(req.method)
    // console.log(req.url)
    const url = req.url;
    console.log(url);

    // home page
    if (url === '/') {
        res.writeHead(200,{'content-type':'text/html'})
        res.write(homePage)
        //res.write('<h1 style="color:#55fe66; font-size:96px;">home page</h1>')
        res.end()
    }

    // home page styles
    else if (url === '/styles.css') {
        res.writeHead(200,{'content-type':'text/css'})
        res.write(homeStyles)
        res.end()
    }

    // home page logo
    else if (url === '/logo.svg') {
        res.writeHead(200,{'content-type':'image/svg+xml'})
        res.write(homeLogo)
        res.end()
    }

    // home page logic
    else if (url === '/browser-app.js') {
        res.writeHead(200,{'content-type':'text/javascript'})
        res.write(homeLogic)
        res.end()
    }

    // about page
    else if(url === '/about') {
        res.writeHead(200,{'content-type':'text/html'})
        res.write('<h3 style="color:blue; font-size:96px;">about page</h3>')
        res.end();
    }

    // error page 404
    else {
        res.writeHead(404,{'content-type':'text/html'})
        res.write('<h3 style="color:red">error 404:\npage not found</h3>')
        res.end();
    }
})

server.listen(5000)