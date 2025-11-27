import { Link } from 'react-router';

import { APP_ROUTES } from './app.enum';

export function Home() {
  return (
    <div className="bg-red-500 px-4 py-2 text-center text-red-500">
      Home
      <Link to={APP_ROUTES.LOGOUT}>Logout</Link>
    </div>
  );
}
