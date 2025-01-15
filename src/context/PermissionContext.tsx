// context/PermissionContext.js
import React from 'react';
import { createContext, useContext } from 'react';
interface Props {
    children: React.ReactNode;
    permissions: any; // Replace 'any' with the appropriate type if known
  }
const PermissionContext = createContext([]);

export const PermissionProvider = ({ children, permissions }: Props) => {
   
   return(
   <PermissionContext.Provider value={permissions}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionContext);
