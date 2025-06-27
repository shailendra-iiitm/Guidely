import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// This store is now primarily used for caching purposes
// The main source of truth is the backend availability API
const useScheduleStore = create(
  persist(
    (set, get) => ({
      // Cache for guide's weekly schedule
      weeklySchedule: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      },
      unavailableDates: [],
      lastUpdated: null,
      
      // Update the cached schedule
      updateScheduleCache: (weeklySchedule, unavailableDates) => set({ 
        weeklySchedule,
        unavailableDates,
        lastUpdated: new Date().toISOString()
      }),
      
      // Clear the cache
      clearScheduleCache: () => set({ 
        weeklySchedule: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        },
        unavailableDates: [],
        lastUpdated: null
      }),
      
      // Check if cache is stale (older than 5 minutes)
      isCacheStale: () => {
        const lastUpdated = get().lastUpdated;
        if (!lastUpdated) return true;
        
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        return new Date(lastUpdated) < fiveMinutesAgo;
      }
    }),
    {
      name: 'schedule-cache',
      getStorage: () => localStorage,
    }
  )
);

export default useScheduleStore;
