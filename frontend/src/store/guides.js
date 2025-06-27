import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useGuideStore = create()(
  devtools((set) => ({
    guidesData: [], // Initialize with an empty array for guides
    setGuidesData: (guides) => set(() => ({ guidesData: guides })), // Method to set guides
  }))
);

export default useGuideStore;
