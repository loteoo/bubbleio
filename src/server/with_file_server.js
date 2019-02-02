import http from 'http'
import url from 'url'
import fs from 'fs'
import path from 'path'

import {renderWithState} from './renderWithState'
import {populateState} from './populateState'

import {init} from '../app/init'
import {view} from '../app/view'

const port = 8080

http.createServer((req, res) => {

  // parse URL
  const parsedUrl = url.parse(req.url)
  
  // extract URL path
  let pathname = path.join(__dirname, parsedUrl.pathname)

  // based on the URL path, extract the file extention. e.g. .js, .doc, ...
  const ext = path.parse(parsedUrl.pathname).ext

  // maps file extention to MIME typere
  const map = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword'
  }

  fs.exists(pathname, (exist) => {

    if (exist && !fs.statSync(pathname).isDirectory()) {

      // read file from file system
      fs.readFile(pathname, (err, data) => {
        if (err) {
          res.statusCode = 500
          res.end(`Error getting the file: ${err}.`)
        } else {
          // if the file is found, set Content-type and send data
          res.setHeader('Content-type', map[ext] || 'text/plain' )
          res.end(data)
        }
      })
    } else {

      // Set headers
      res.writeHead(200, {'Content-Type': 'text/html'})

      // Pre-load data into the state so the first render isn't an empty app
      const state = populateState(init)
      
      // Render the app with our populated state
      res.end(renderWithState(view, state))

    }
  })

}).listen(parseInt(port))

console.log(`SSR and file server listening on port ${port}`)