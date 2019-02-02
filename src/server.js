import http from 'http'

import {renderWithState} from './server/renderWithState'
import {populateState} from './server/populateState'

import {init} from './app/init' // Default initial state
import {view} from './app/view' // App view

const port = 8080;

http.createServer((req, res) => {

  // Set headers
  res.writeHead(200, {'Content-Type': 'text/html'})

  // Pre-load data into the state so the first render isn't an empty app
  const state = populateState(init)
  
  // Render the app with our populated state
  res.end(renderWithState(view, state))

}).listen(port);


console.log(`SSR and file server listening on port ${port}`)
