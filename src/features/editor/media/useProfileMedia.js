import { createContext, useContext } from "react";

export const ProfileMediaContext = createContext(null);

export function useProfileMedia() {
  return useContext(ProfileMediaContext);
}
