# Club Social Web

React frontend built with Vite, React Router, and Ant Design.

## Tech Stack

- React 19
- Vite 7
- React Router 7
- TanStack Query (server state management)
- Ant Design 6 (UI components)
- Tailwind CSS 4 (styling)
- Better Auth (authentication with passkey support)

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Other Commands

```bash
# Type check
npm run check-types

# Lint and fix
npm run lint

# Format code
npm run format
```

## Project Structure

```
src/
├── app/              # App shell, routing, theme, context
├── shared/           # Shared utilities and API client
├── ui/               # Reusable UI components
├── auth/             # Authentication pages
├── members/          # Member management
├── member-ledger/    # Member financial ledger
├── payments/         # Payments
├── dues/             # Membership dues
├── movements/        # Financial movements
├── pricing/          # Pricing configuration
├── audit-logs/       # Audit log viewer
├── profile/          # User profile
└── home/             # Dashboard
```

## Environment Variables

Create a `.env` file with:

```
VITE_API_URL=http://localhost:3000
```
