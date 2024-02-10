import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

//authentication context type
export type authType = {
  auth: {
    username: string;
    accessToken: string;
    refreshToken: string;
    userId: string;
  };
  setAuth: React.Dispatch<
    React.SetStateAction<{
      username: string;
      accessToken: string;
      refreshToken: string;
      userId: string;
    }>
  >;
 
};

//create authentication context
const AuthenticationContext = createContext<authType>({
  auth: {
    username: "",
    accessToken: "",
    refreshToken: "",
    userId: "",
  },
  setAuth: () => {}
});

type ProviderProps = {
  children: React.ReactNode;
};
export const AuthenticationContextProvider = ({ children }: ProviderProps) => {
  const [auth, setAuth] = useState({
    username: "",
    accessToken: "",
    refreshToken: "",
    userId: "",
  });

  

  return (
    <AuthenticationContext.Provider
      value={{ auth, setAuth}}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContext;
