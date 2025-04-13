import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { TelegramProvider } from '../components/telegram/TelegramProvider';
import { ErrorBoundary } from '../components/base/ErrorBoundary';
import { LoadingSpinner } from '../components/base';

// Flag to toggle MSW on/off easily
const USE_MSW = false; // Set to false if you want to disable MSW temporarily

function MyApp({ Component, pageProps }: AppProps) {
  // Start with not ready - will be true for both client and server render
  const [isClientReady, setIsClientReady] = useState(false);
  const [mswError, setMswError] = useState<string | null>(null);

  // This effect runs only on the client after hydration
  useEffect(() => {
    // This signals we're now on the client
    setIsClientReady(true);
    
    // This will only run in the browser
    async function setupApp() {
      // Only try to initialize MSW in development and browser environment
      if (process.env.NODE_ENV === 'development' && USE_MSW) {
        try {
          // Dynamically import to avoid SSR issues
          const { default: initMocks } = await import('../mocks');
          await initMocks();
        } catch (error) {
          console.error('Failed to initialize MSW:', error);
          setMswError('Failed to initialize Mock Service Worker. API calls will not be mocked.');
        }
      }
    }
    
    setupApp();
  }, []);

  return (
    <ErrorBoundary>
      {/* Don't show loading screen during SSR or first render to avoid hydration mismatch */}
      {/* Use isClientReady to show content only after client-side code has run */}
      {isClientReady ? (
        <TelegramProvider mockByDefault={process.env.NODE_ENV === 'development'}>
          {mswError && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
              <p className="font-bold">API Mocking Warning</p>
              <p>{mswError}</p>
              <p className="text-sm mt-2">
                To enable API mocking, run: <code className="bg-yellow-50 px-1">npx msw init public</code>
              </p>
            </div>
          )}
          <Component {...pageProps} />
        </TelegramProvider>
      ) : (
        // This will be the same on both server and client for the first render
        // After hydration completes, the useEffect will run and update isClientReady
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </ErrorBoundary>
  );
}

export default MyApp;