import React, {createContext} from 'react';



const AlertContext = createContext<{showAlert(message:string)=>void}:undefined>(undefined);

export const useAlert=()=>{
    const context = useContext(A)
}