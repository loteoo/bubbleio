
// ==============================================================================
// Use this function to pre-fetch data into your app's state on the server
//
// Common usage: calling the database directly in node.js for the first render, 
// and saving the client from having to fetch that data asynchronously
// ==============================================================================


export const populateState = state => {
  
  // Return the populated state
  return {
    ...state,
    extraData: 'This came from the server!'
  }
}