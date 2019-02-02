import {h} from 'hyperapp'

// Import styles
import './style.css'

// Root container component
export const Html = ({state}, children) => (
  <html>
    <head>
      <meta charset="utf-8"/>
      <meta http-equiv="x-ua-compatible" content="ie=edge,chrome=1"/>

      <title>{state.title}</title>
      <meta name="description" content={state.description}/>

      <link rel="home" href="https://github.com/loteoo/hyperapp-boilerplate"/>
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/>
      <link rel="icon" type="image/png" href="../assets/favicon.png"/>
      <link rel="canonical" href="https://github.com/loteoo/hyperapp-boilerplate" />

      {/* Open graph */}
      <meta property="og:title" content={state.title} />
      <meta property="og:description" content={state.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://github.com/loteoo/hyperapp-boilerplate" />
      <meta property="og:image" content="../assets/card.png" />
      <meta property="og:image:secure_url" content="../assets/card.png" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={state.title} />

      {/* Twitter */}
      <meta name="twitter:card" value="summary"/>
      <meta name="twitter:url" content="https://github.com/loteoo/hyperapp-boilerplate"/>
      <meta name="twitter:title" content={state.title}/>

      {/* Android */}
      <link rel="manifest" href="../assets/manifest.json"/>
      <meta name="mobile-web-app-capable" content="yes"/>
      <meta name="theme-color" content="#ffffff"/>

      {/* IOS */}
      <meta name="apple-mobile-web-app-capable" content="yes"/>
      <meta name="apple-mobile-web-app-status-bar-style" content="#ffffff"/>
      <meta name="apple-mobile-web-app-title" content={state.title}/>
      <link rel="apple-touch-icon" sizes="180x180" href="../assets/icon-512x512.png"/>

      {/* Windows */}
      <meta name="msapplication-TileImage" content="../assets/icon-512x512.png"/>
      <meta name="msapplication-TileColor" content="#ffffff"/>

      {/* Parcel bundles */}
      <link rel="stylesheet" href="/client.62456f60.css"/>

    </head>
    <body>
      {children}
      {
        // This will only appear in the Server-side rendered views.
        // We use this to directly pass state to the app before 
        // it's initialization.
        typeof window === 'undefined' && [
          <script>window.initialState = [INJECT_INIT_STATE]</script>,
          <script src="/client.62456f60.js"></script>
        ]
      }
    </body>
  </html>
)
