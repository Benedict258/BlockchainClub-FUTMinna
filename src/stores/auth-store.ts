import { create } from "zustand";

export interface UserBadgeInfo {
  name: string;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  profile?: {
    fullName: string;
    nickname?: string;
    avatarUrl?: string;
    dateOfBirth?: string;
    department: string;
    level: string;
    experienceLevel?: string;
    funFact?: string;
    bio?: string;
    xLink?: string;
    githubLink?: string;
    portfolioLink?: string;
    skills?: string[];
    badges?: UserBadgeInfo[];
  };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
}

function getStoredAuth(): { user: User | null; accessToken: string | null } {
  if (typeof window === "undefined") return { user: null, accessToken: null };
  try {
    const storedUser = localStorage.getItem("bcf-user");
    const storedToken = localStorage.getItem("bcf-token");
    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      accessToken: storedToken,
    };
  } catch {
    return { user: null, accessToken: null };
  }
}

const initial = getStoredAuth();

export const useAuthStore = create<AuthState>((set) => ({
  user: initial.user,
  accessToken: initial.accessToken,
  isAuthenticated: !!initial.user && !!initial.accessToken,
  login: (user, accessToken) => {
    localStorage.setItem("bcf-user", JSON.stringify(user));
    localStorage.setItem("bcf-token", accessToken);
    set({ user, accessToken, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("bcf-user");
    localStorage.removeItem("bcf-token");
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
  setUser: (user) => {
    localStorage.setItem("bcf-user", JSON.stringify(user));
    set({ user });
  },
  setAccessToken: (token) => {
    localStorage.setItem("bcf-token", token);
    set({ accessToken: token });
  },
}));
