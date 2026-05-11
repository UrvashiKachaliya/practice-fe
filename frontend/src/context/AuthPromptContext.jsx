import React, { createContext, useContext, useState } from "react";

const AuthPromptContext = createContext(null);

export const AuthPromptProvider = ({ children }) => {
  const [state, setState] = useState({ open: false, redirectTo: null });

  const openAuthPrompt = (redirectTo = null) => setState({ open: true, redirectTo });
  const closeAuthPrompt = () => setState({ open: false, redirectTo: null });

  return (
    <AuthPromptContext.Provider value={{ ...state, openAuthPrompt, closeAuthPrompt }}>
      {children}
    </AuthPromptContext.Provider>
  );
};

export const useAuthPrompt = () => useContext(AuthPromptContext);
