import { createContext, useState, useEffect, useContext } from "react";
import { fetchCurrentUser, type UserProfile } from "./user.service";
import { supabase } from "../supabase/supabase.client";

interface UserContextValue {
    user: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: {children: React.ReactNode}) {
    const [user, setUser] = useState<UserProfile | null>(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(async ({data}) => {
            if (data.session) {
                await fetchCurrentUser(data.session.user.id).then(setUser);
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

export function useUser(): UserContextValue {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser debe usarse dentro de UserProvider');
    return context;
  }