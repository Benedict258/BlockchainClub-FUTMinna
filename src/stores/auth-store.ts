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
    username?: string;
    phone?: string;
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
  isHydrated: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isHydrated: false,
  login: (user, accessToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bcf-user", JSON.stringify(user));
      localStorage.setItem("bcf-token", accessToken);
    }
    set({ user, accessToken, isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("bcf-user");
      localStorage.removeItem("bcf-token");
    }
    set({ user: null, accessToken: null, isAuthenticated: false, isHydrated: false });
  },
  setUser: (user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bcf-user", JSON.stringify(user));
    }
    set({ user });
  },
  setAccessToken: (token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bcf-token", token);
    }
    set({ accessToken: token });
  },
  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const storedUser = localStorage.getItem("bcf-user");
      const storedToken = localStorage.getItem("bcf-token");
      if (storedUser && storedToken) {
        set({
          user: JSON.parse(storedUser),
          accessToken: storedToken,
          isAuthenticated: true,
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      set({ isHydrated: true });
    }
  },
}));
