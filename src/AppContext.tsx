import React from "react";

interface ContextType {
  [name: string]: any
}

export const AppContext = React.createContext<ContextType>({});
