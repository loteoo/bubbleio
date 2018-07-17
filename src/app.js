
// Load our hyperapp
import {app} from 'hyperapp'
import {location} from "@hyperapp/router"
import {state} from './state/'
import {actions} from './actions/'
import {view} from './views/'

// Dev dependencies
import freeze from 'hyperapp-freeze'
import devtools from 'hyperapp-devtools'

// Bundle css
import './global.css'


// Start hyperapp
window.main = freeze(devtools)(app)(state, actions, view, document.body);

window.main.init();




// // Activate the service worker
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', function() {
//     navigator.serviceWorker.register('/sw.js').then(function(registration) {
//       // Registration was successful
//       console.log('ServiceWorker registration successful with scope: ', registration.scope);
//     }, function(err) {
//       // registration failed :(
//       console.log('ServiceWorker registration failed: ', err);
//     });
//   });
// }
