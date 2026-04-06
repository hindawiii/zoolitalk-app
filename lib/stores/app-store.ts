import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Language = 'ar' | 'en'
export type TabId = 'wansa' | 'saha' | 'souq' | 'news' | 'profile'

interface AppState {
  // Language & RTL
  language: Language
  setLanguage: (lang: Language) => void
  
  // Navigation
  activeTab: TabId
  setActiveTab: (tab: TabId) => void
  
  // Settings drawer
  isSettingsOpen: boolean
  setSettingsOpen: (open: boolean) => void
  
  // Gift overlay
  activeGift: GiftType | null
  giftSender: string | null
  showGift: (gift: GiftType, sender: string) => void
  hideGift: () => void
  triggerGift: (gift: GiftType, sender: string) => void
  
  // Data saver mode
  dataSaverEnabled: boolean
  setDataSaver: (enabled: boolean) => void
  
  // Online status visibility
  showOnlineStatus: boolean
  setShowOnlineStatus: (show: boolean) => void
}

export type GiftType = 'jabana' | 'crown' | 'shield' | 'heart' | 'star'

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Language defaults to Arabic
      language: 'ar',
      setLanguage: (language) => set({ language }),
      
      // Default tab is Al-Wansa (chat)
      activeTab: 'wansa',
      setActiveTab: (activeTab) => set({ activeTab }),
      
      // Settings drawer
      isSettingsOpen: false,
      setSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
      
      // Gift overlay
      activeGift: null,
      giftSender: null,
      showGift: (gift, sender) => set({ activeGift: gift, giftSender: sender }),
      hideGift: () => set({ activeGift: null, giftSender: null }),
      triggerGift: (gift, sender) => {
        set({ activeGift: gift, giftSender: sender })
        // Auto-hide after animation
        setTimeout(() => set({ activeGift: null, giftSender: null }), 4000)
      },
      
      // Data saver (default on for Sudan's network conditions)
      dataSaverEnabled: true,
      setDataSaver: (dataSaverEnabled) => set({ dataSaverEnabled }),
      
      // Online status
      showOnlineStatus: true,
      setShowOnlineStatus: (showOnlineStatus) => set({ showOnlineStatus }),
    }),
    {
      name: 'zoolitalk-app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
        dataSaverEnabled: state.dataSaverEnabled,
        showOnlineStatus: state.showOnlineStatus,
      }),
    }
  )
)
