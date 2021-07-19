import { createContext, FC, useState } from 'react';
import { verify } from 'jsonwebtoken';
import { getTokenEncryptSecret } from '../utils/getTokenEncryptSecret';

interface AuthenticationContextProps {
  authenticate: boolean;
  setAuthenticate: React.Dispatch<any>;
}

export const AuthenticationContext = createContext<AuthenticationContextProps>({
  authenticate: false,
  setAuthenticate: () => {}
});

const AuthenticationProvider: FC = ({ children }) => {
  const token = localStorage.getItem('access-token');
  const [authenticate, setAuthenticate] = useState<any>(
    !!token && verify(token, getTokenEncryptSecret())
  );

  return (
    <AuthenticationContext.Provider
      value={{
        authenticate,
        setAuthenticate
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
