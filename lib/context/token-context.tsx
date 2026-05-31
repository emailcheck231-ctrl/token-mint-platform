import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TokenProject, Network, ProjectStatus } from "@/lib/types/token";

interface TokenContextType {
  projects: TokenProject[];
  addProject: (project: Omit<TokenProject, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateProject: (id: string, updates: Partial<TokenProject>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => TokenProject | undefined;
  isLoading: boolean;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

type Action =
  | { type: "SET_PROJECTS"; payload: TokenProject[] }
  | { type: "ADD_PROJECT"; payload: TokenProject }
  | { type: "UPDATE_PROJECT"; payload: TokenProject }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };

interface State {
  projects: TokenProject[];
  isLoading: boolean;
}

const initialState: State = {
  projects: [],
  isLoading: true,
};

function tokenReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PROJECTS":
      return { ...state, projects: action.payload, isLoading: false };
    case "ADD_PROJECT":
      return { ...state, projects: [...state.projects, action.payload] };
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((p) => (p.id === action.payload.id ? action.payload : p)),
      };
    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(tokenReducer, initialState);

  // Load projects from AsyncStorage on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const stored = await AsyncStorage.getItem("token_projects");
      if (stored) {
        const projects = JSON.parse(stored) as TokenProject[];
        dispatch({ type: "SET_PROJECTS", payload: projects });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const saveProjects = async (projects: TokenProject[]) => {
    try {
      await AsyncStorage.setItem("token_projects", JSON.stringify(projects));
    } catch (error) {
      console.error("Failed to save projects:", error);
    }
  };

  const addProject = async (
    project: Omit<TokenProject, "id" | "createdAt" | "updatedAt">
  ) => {
    const newProject: TokenProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    dispatch({ type: "ADD_PROJECT", payload: newProject });
    await saveProjects([...state.projects, newProject]);
  };

  const updateProject = async (id: string, updates: Partial<TokenProject>) => {
    const project = state.projects.find((p) => p.id === id);
    if (!project) return;

    const updated: TokenProject = {
      ...project,
      ...updates,
      updatedAt: Date.now(),
    };
    dispatch({ type: "UPDATE_PROJECT", payload: updated });
    await saveProjects(
      state.projects.map((p) => (p.id === id ? updated : p))
    );
  };

  const deleteProject = async (id: string) => {
    dispatch({ type: "DELETE_PROJECT", payload: id });
    await saveProjects(state.projects.filter((p) => p.id !== id));
  };

  const getProject = (id: string) => {
    return state.projects.find((p) => p.id === id);
  };

  const value: TokenContextType = {
    projects: state.projects,
    addProject,
    updateProject,
    deleteProject,
    getProject,
    isLoading: state.isLoading,
  };

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
}

export function useTokenProjects() {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error("useTokenProjects must be used within TokenProvider");
  }
  return context;
}
