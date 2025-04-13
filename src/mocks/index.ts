// This file is responsible for initializing MSW in the appropriate environment

// Define a function for mocking in the browser
async function initMocksInBrowser() {
    console.log('Starting MSW setup...');
    
    try {
      // Try to dynamically import the worker
      const workerModule = await import('./workerSetup');
      const { worker } = workerModule;
      
      // Check if worker exists and has start method
      if (!worker) {
        console.error('MSW worker is undefined');
        return;
      }
      
      if (typeof worker.start !== 'function') {
        console.error('MSW worker.start is not a function');
        return;
      }
      
      try {
        // Start the worker without options
        await worker.start();
        console.log('MSW worker started successfully');
      } catch (error: any) {
        // Handle the specific error about missing service worker
        if (error?.message?.includes('Failed to register a Service Worker') &&
            error?.message?.includes('mockServiceWorker.js')) {
          console.error(
            '\n=== MSW INITIALIZATION ERROR ===\n' +
            'You need to initialize the MSW service worker file by running:\n' +
            'npx msw init public\n' +
            'from the root of your project.\n' +
            '===============================\n'
          );
        } else {
          // For other errors, show the regular error message
          console.error('Error starting MSW worker:', error);
        }
      }
    } catch (error) {
      console.error('Error importing MSW worker:', error);
    }
  }
  
  // Define a dummy function for the server environment
  async function initMocksInServer() {
    console.log('MSW not initialized (server environment)');
    return;
  }
  
  // Default export function that decides which init to use
  async function initMocks() {
    // Check if we're in the browser or server
    if (typeof window === 'undefined') {
      return initMocksInServer();
    } else {
      return initMocksInBrowser();
    }
  }
  
  export default initMocks;