"use client";

import { createContext, useContext } from "react";

export interface DashboardUser {
  username: string;
  email: string;
  role: "admin" | "viewer";
}

const DashboardContext = createContext<DashboardUser>({
  username: "",
  email: "",
  role: "admin",
});

export const DashboardProvider = DashboardContext.Provider;

export function useDashboard() {
  return useContext(DashboardContext);
}

export function useIsViewer() {
  return useContext(DashboardContext).role === "viewer";
}