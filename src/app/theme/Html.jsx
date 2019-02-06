import {h} from 'hyperapp'


// Import styles
import './theme.css'

// Root container component
export const Html = ({meta, ...rest}, children) => (
  <html>
    <head>
      <meta charset="utf-8"/>
      <meta http-equiv="x-ua-compatible" content="ie=edge,chrome=1"/>

      <title>{meta.title}</title>
      <meta name="description" content={meta.description}/>

      <link rel="home" href="https://github.com/loteoo/hyperapp-boilerplate"/>
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/>
      <link rel="icon" type="image/png" href="/favicon.png"/>
      <link rel="canonical" href="https://github.com/loteoo/hyperapp-boilerplate" />

      {/* Open graph */}
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://github.com/loteoo/hyperapp-boilerplate" />
      <meta property="og:image" content="/card.png" />
      <meta property="og:image:secure_url" content="/card.png" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={meta.title} />

      {/* Twitter */}
      <meta name="twitter:card" value="summary"/>
      <meta name="twitter:url" content="https://github.com/loteoo/hyperapp-boilerplate"/>
      <meta name="twitter:title" content={meta.title}/>

      {/* Android */}
      <link rel="manifest" href="/manifest.json"/>
      <meta name="mobile-web-app-capable" content="yes"/>
      <meta name="theme-color" content="#ffffff"/>

      {/* IOS */}
      <meta name="apple-mobile-web-app-capable" content="yes"/>
      <meta name="apple-mobile-web-app-status-bar-style" content="#ffffff"/>
      <meta name="apple-mobile-web-app-title" content={meta.title}/>
      <link rel="apple-touch-icon" sizes="180x180" href="/icon-512x512.png"/>

      {/* Windows */}
      <meta name="msapplication-TileImage" content="/icon-512x512.png"/>
      <meta name="msapplication-TileColor" content="#ffffff"/>

      {/* Parcel bundles */}
      <link rel="stylesheet" href="/client.62456f60.css"/>

    </head>
    <body {...rest}>
      {children}
      {
        // This will only appear in the Server-side rendered views.
        // We use this to directly pass meta to the app before 
        // it's initialization.
        typeof window === 'undefined' && [
          <script>window.initialState = [INJECT_INIT_STATE]</script>,
          <script src="/client.62456f60.js"></script>
        ]
      }
    </body>
  </html>
)
