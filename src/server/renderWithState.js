
import {renderToString} from 'hyperapp-render'

// Injects the state used for the render, into the render, 
// so the client can pick it up and memoize efficiently,
// while also avoiding unnecessary fetches on initialization.
export const renderWithState = (view, state) => {

  // Render the app with given state
  let html = renderToString(view(state))

  // Inject state into the render
  html = html.replace('[INJECT_INIT_STATE]', JSON.stringify(state))

  // Add the doctype tag
  html = '<!DOCTYPE html>' + html

  // Return the rendered app
  return html
}
