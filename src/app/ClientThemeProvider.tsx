"use client";
import { useTheme } from "./useTheme";
import React from "react";

export default function ClientThemeProvider({ children }: { children: React.ReactNode }) {
  const { mounted } = useTheme();
  if (!mounted) return null; // ili loader
  return <>{children}</>;
} 