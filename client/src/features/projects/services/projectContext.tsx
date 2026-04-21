import { createContext, useState, useEffect } from "react";
import { fetchProjectContext, type ProjectContextData } from "./projects.services";
import { supabase } from "@/core/supabase/supabase.client"; 
import { useUser } from "@/core/auth/userContext";

interface ProjectContextValue {
    project: ProjectContextData | null;
    loading: boolean;
    hasAccess: boolean; 
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ projectId, children }: {projectId: number, children: React.ReactNode }) {
    const {user, loading: userLoading } = useUser(); 
    const [project, setProject] = useState<ProjectContextData | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false); 

    useEffect(() => {
        if (userLoading || !user) return;

        const load = async () => {
            setLoading(true);
            try {
                if (user.idRolGlobal === 1 || user.idRolGlobal === 2){
                    setHasAccess(true);
                    const data = await fetchProjectContext(projectId);
                    setProject(data);
                    return;
                }
                
            }
        }
    })
}