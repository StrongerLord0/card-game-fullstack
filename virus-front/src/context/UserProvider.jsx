import { useState } from "react";
import { UserContext } from "./UserContext"

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState({ name: '', avatar: 0, color:'#ffae00', rooms: [{users: []}]});
    const [socket, setSocket] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser, socket, setSocket }}>
            {children}
        </UserContext.Provider>
    )
}
