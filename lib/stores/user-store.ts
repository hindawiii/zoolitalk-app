import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  nameAr: string
  email: string
  phone: string
  avatar: string
  coverPhoto: string
  bio: string
  bioAr: string
  zoolPoints: number
  followers: number
  following: number
  postsCount: number
  isOnline: boolean
  lastSeen: Date | null
}

export interface BlockedUser {
  id: string
  name: string
  avatar: string
  blockedAt: Date
}

interface UserState {
  // Current user
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  updateProfile: (updates: Partial<User>) => void
  
  // Authentication
  isAuthenticated: boolean
  setAuthenticated: (auth: boolean) => void
  
  // Blocked users
  blockedUsers: BlockedUser[]
  blockUser: (user: BlockedUser) => void
  unblockUser: (userId: string) => void
  isBlocked: (userId: string) => boolean
  
  // Zool Points
  addZoolPoints: (points: number) => void
  
  // Following
  followUser: (userId: string) => void
  unfollowUser: (userId: string) => void
  followingIds: string[]
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Demo user for development
      currentUser: {
        id: 'user-1',
        name: 'Ahmed Mohamed',
        nameAr: 'أحمد محمد',
        email: 'ahmed@zoolitalk.sd',
        phone: '+249912345678',
        avatar: '/avatars/default.jpg',
        coverPhoto: '/covers/default.jpg',
        bio: 'Proud Sudanese! Love coffee and good conversations.',
        bioAr: 'سوداني فخور! أحب القهوة والونسة الحلوة.',
        zoolPoints: 1250,
        followers: 342,
        following: 156,
        postsCount: 47,
        isOnline: true,
        lastSeen: null,
      },
      setCurrentUser: (currentUser) => set({ currentUser }),
      updateProfile: (updates) => 
        set((state) => ({
          currentUser: state.currentUser 
            ? { ...state.currentUser, ...updates }
            : null
        })),
      
      isAuthenticated: true, // Demo: start authenticated
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      blockedUsers: [],
      blockUser: (user) => 
        set((state) => ({
          blockedUsers: [...state.blockedUsers, user]
        })),
      unblockUser: (userId) =>
        set((state) => ({
          blockedUsers: state.blockedUsers.filter(u => u.id !== userId)
        })),
      isBlocked: (userId) => get().blockedUsers.some(u => u.id === userId),
      
      addZoolPoints: (points) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, zoolPoints: state.currentUser.zoolPoints + points }
            : null
        })),
      
      followingIds: [],
      followUser: (userId) =>
        set((state) => ({
          followingIds: [...state.followingIds, userId],
          currentUser: state.currentUser
            ? { ...state.currentUser, following: state.currentUser.following + 1 }
            : null
        })),
      unfollowUser: (userId) =>
        set((state) => ({
          followingIds: state.followingIds.filter(id => id !== userId),
          currentUser: state.currentUser
            ? { ...state.currentUser, following: state.currentUser.following - 1 }
            : null
        })),
    }),
    {
      name: 'zoolitalk-user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        blockedUsers: state.blockedUsers,
        followingIds: state.followingIds,
      }),
    }
  )
)
