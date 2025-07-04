"use client";
import React from "react";
 
export default function ClientThemeProvider({ children }: { children: React.ReactNode }) {
  // Uvek mounted, uvek light mod
  return <>{children}</>;
} 