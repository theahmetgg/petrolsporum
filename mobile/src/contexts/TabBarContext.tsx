import React, { createContext, useContext } from "react";

const TabBarContext = createContext<boolean>(false);

export const TabBarProvider = TabBarContext.Provider;

/**
 * Returns true if the calling component is mounted inside the main (tabs) navigator,
 * where CustomTabBar is already rendered at the bottom.
 */
export const useIsInsideTabBar = (): boolean => useContext(TabBarContext);

export default TabBarContext;
