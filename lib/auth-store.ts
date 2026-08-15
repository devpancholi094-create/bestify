"use client";

import { create } from "zustand";
import { nanoid } from "nanoid";
import { User } from "./types";
import { storage } from "./storage";

interface AuthState {
  user: User | null;
  hydrated: boolean;
  hydrate: () => void;
  loginWithEmail: (name: string, email: string) => User;
  continueAsGuest: () => User;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  hydrated: false,

  hydrate: () => {
    const user = storage.getUser();
    set({ user, hydrated: true });
  },

  loginWithEmail: (name: string, email: string) => {
    const user: User = {
      id: nanoid(10),
      name: name.trim() || email.split("@")[0],
      email,
      isGuest: false,
      createdAt: Date.now(),
    };
    storage.saveUser(user);
    set({ user });
    return user;
  },

  continueAsGuest: () => {
    const user: User = {
      id: nanoid(10),
      name: "Guest",
      email: "",
      isGuest: true,
      createdAt: Date.now(),
    };
    storage.saveUser(user);
    set({ user });
    return user;
  },

  logout: () => {
    storage.clearUser();
    set({ user: null });
  },
}));
