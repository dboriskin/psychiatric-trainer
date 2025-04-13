# Psychiatric Trainer for Telegram Mini Apps

This project is a psychiatric trainer application that runs as a Telegram Mini App. It provides clinical case simulations for psychiatric training.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Zustand for state management
- MSW for API mocking
- Telegram Mini Apps SDK

## Development Setup

1. Install dependencies:

```bash
yarn install
```

2. Create a `.env.local` file with the following content:

```
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_API_URL=
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

3. Run the development server:

```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Using the Telegram SDK Emulator

In development mode, the application uses a Telegram SDK emulator by default. This allows you to develop and test without having to deploy to a Telegram bot.

The debug panel can be toggled by clicking the "Debug" button in the header. It provides controls for:

- Showing/hiding the MainButton
- Showing/hiding the BackButton
- Testing popups and alerts
- Toggling between light and dark themes

## Project Structure

- `/src/components` - React components
  - `/base` - Base UI components
  - `/container` - Container components
  - `/telegram` - Telegram SDK integration components
- `/src/store` - Zustand state stores
- `/src/mocks` - MSW API mocks and mock data
- `/src/pages` - Next.js pages
- `/src/utils` - Utility functions
- `/src/services` - API services

## Building for Production

```bash
yarn build
```

## Deployment

This application is designed to be deployed as a Telegram Mini App. Follow the [Telegram Mini Apps documentation](https://core.telegram.org/bots/webapps) for instructions on how to set up your bot and connect it to your deployed web application.

## License

This project is licensed under the MIT License.