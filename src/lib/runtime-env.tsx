"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * Public configuration that the browser needs. Values are read from the
 * environment at request time on the server (see `getPublicEnv`) and handed to
 * the client through this provider, so a single build can run against different
 * environments without baking values into the JS bundle.
 */
export type PublicEnv = {
  siteUrl: string;
  appUrl: string;
  posthogKey: string | null;
  posthogHost: string | null;
};

const RuntimeEnvContext = createContext<PublicEnv | null>(null);

export function RuntimeEnvProvider({
  value,
  children,
}: {
  value: PublicEnv;
  children: ReactNode;
}) {
  return (
    <RuntimeEnvContext.Provider value={value}>
      {children}
    </RuntimeEnvContext.Provider>
  );
}

export function usePublicEnv(): PublicEnv {
  const value = useContext(RuntimeEnvContext);
  if (!value) {
    throw new Error("usePublicEnv must be used within a RuntimeEnvProvider");
  }
  return value;
}
