import { Auth0Provider } from '@auth0/auth0-react';
import type { ReactNode } from 'react';

const AUTH0_DOMAIN = 'esinsa-sga.eu.auth0.com';
const AUTH0_CLIENT_ID = 'zVppLE7iBOYICXgk8T7cOfouvHRB1UQx';

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{ redirect_uri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4321' }}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
}
