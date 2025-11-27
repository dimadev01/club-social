import { Link } from 'react-router';

import { APP_ROUTES } from './app.enum';

export function Home() {
  return (
    <div>
      Home
      <Link to={APP_ROUTES.LOGOUT}>Logout</Link>
    </div>
  );
}
