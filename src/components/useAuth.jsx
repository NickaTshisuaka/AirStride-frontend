import { useContext, createContext } from "react";


export const useAuthentication = () => {

    const AuthContext = createContext();
 
 
    const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthentication must be used within an AuthProvider");
  }
  return context;
};