'use client'
import {useState, createContext, ReactNode} from 'react'
import { API_LOGIN } from "@/config/apiconfig";

///
interface StateLoginContextType{
    user:string;
    login: (value:any) => void;
    logout: () => void;

}
export const stateLogin = createContext<StateLoginContextType|undefined>(undefined);
const StateLoginProvider = ({children}:{
    children: ReactNode
}) =>{

    const [user, setUser] = useState<any>(null);
    const login = (userData:string)=>{setUser(userData)};
    const logout = ()=>{setUser(null)};
    return(
    <stateLogin.Provider value={{login, user, logout}}>
       {children}
    </stateLogin.Provider>

    )
}

export default StateLoginProvider;