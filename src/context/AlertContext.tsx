import React, { createContext, useContext,ReactNode, useState } from "react";

const AlertContext = createContext<
  { triggerAlert: (message: string) => void } | undefined
>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("no context");
  }
  return context;
};

export const AlertProvider = ({children}:{children:ReactNode})=>{
    const [message,setMessage]=useState<string|null>(null);
    const triggerAlert=(m:string)=>{
        setMessage(m);
        // start timer to clear alert message
        setTimeout(() => {
            setMessage(null)
        }, 3000);
    };

    return (
        <AlertContext.Provider value={{triggerAlert}}>
            {message &&(
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-2 text-green-5 px-6 py-3 rounded-xl shadow-md z-50">{message}</div>
            )}
            {children}
        </AlertContext.Provider>
    )
}
