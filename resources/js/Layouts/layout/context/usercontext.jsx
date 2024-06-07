import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { props } = usePage();
    const [userRole, setUserRole] = useState(props.userRole);

    return (
        <UserContext.Provider value={{ userRole }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
