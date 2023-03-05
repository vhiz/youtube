import { createContext, useEffect, useState } from "react";
import { makeRequest } from "../axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("useryoutube")) || null
  );

  const login = async (inputs) => {
    const res = await makeRequest.post("auth/login", inputs);

    setCurrentUser(res.data);
  };
  const register = async (info) => {
    const res = await makeRequest.post("auth/register", info);

    setCurrentUser(res.data);
  };

  const loginGoogle = async (info) => {
    const res = await makeRequest.post("auth/google", info);

    setCurrentUser(res.data);
  };

  const logout = async () => {
    await makeRequest.post("auth/logout");
    setCurrentUser(null);
  };

  useEffect(() => {
    localStorage.setItem("useryoutube", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, loginGoogle, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
