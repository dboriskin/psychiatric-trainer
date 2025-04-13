/**
 * MSW v2.7.4 specific setup
 */
import { handlers } from './handlers/api';

// Define a type that matches the structure of the MSW worker
interface MockWorker {
  start: () => Promise<any>; // Return type can be any to accommodate both mock and real worker
  stop: () => Promise<any>;
  use: (...handlers: any[]) => void;
  resetHandlers: () => void;
}

// Create a simple mock worker as fallback
const mockWorker: MockWorker = {
  start: () => Promise.resolve(undefined),
  stop: () => Promise.resolve(undefined),
  use: () => {},
  resetHandlers: () => {},
};

// Explicitly define the worker to avoid errors
let worker: MockWorker = mockWorker;

// Only attempt to use MSW in browser context
if (typeof window !== 'undefined') {
  try {
    // We need to use a dynamic import approach for MSW
    // This will be processed at runtime, not during TypeScript compilation
    const importMSW = async () => {
      try {
        const mswModule = await import('msw/browser');
        if (mswModule && typeof mswModule.setupWorker === 'function') {
          // The imported worker will replace our mock
          worker = mswModule.setupWorker(...handlers) as unknown as MockWorker;
          console.log('MSW worker created successfully');
        }
      } catch (e) {
        console.error('MSW import failed:', e);
      }
    };
    
    // Start the import process
    importMSW();
  } catch (error) {
    console.error('MSW setup failed, using mock worker:', error);
  }
}

export { worker };