import { createContext, useState, useEffect, useContext } from "react";
import { fetchCurrentUser, type UserProfile } from "./user.service";
import { supabase } from "../supabase/supabase.client";

interface UserContext {
    user: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
  }

const UserContext = createContext<UserContext | null>(null);

export function UserProvider({ children }: {children: React.ReactNode}) {
    const [user, setUser] = useState<UserProfile | null>(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({data}) => {
            if (data.session) {
                fetchCurrentUser(data.session.user.id).then(setUser);
            }
            setLoading(false);
        });

    const { data: {subscription} } = supabase.auth.onAuthStateChange( (_event, session) => {
        if (session) fetchCurrentUser(session.user.id).then(setUser);
        else setUser(null);
    });
    
    return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <UserContext.Provider value={{ user, loading, logout}}>
        {children}
        </UserContext.Provider>
    );
}

export function useUser(): UserContext {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser debe usarse dentro de UserProvider');
    return context;
  }