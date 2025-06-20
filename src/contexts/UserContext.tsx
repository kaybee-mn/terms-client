import { createContext } from "react";

const UserContext = createContext<{
    avatarLink: string;
    setAvatarLink: (newLink: string) => void;
} | undefined>(undefined);

export const setAvatarLink=(newLink : string)=>{
    
}