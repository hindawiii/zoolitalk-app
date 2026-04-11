import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Gender = 'male' | 'female'
export type SocialStatus = 'single' | 'taken' | 'engaged' | 'married' | 'complicated' | 'gave_up'
export type ProfessionalStatus = 'student' | 'employee' | 'freelancer' | 'unemployed'
export type UserRank = 'lion' | 'knight' | 'advisor' | 'newbie'

export interface User {
  id: string
  username?: string
  name: string
  nameAr: string
  nickname?: string // اللقب - e.g., "هنداوي"
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
  isVerified?: boolean
  location?: string
  // Gender for Arabic feminization
  gender?: Gender
  // New Sudanese Identity Fields
  socialStatus?: SocialStatus
  professionalStatus?: ProfessionalStatus
  rank?: UserRank
  rankTitle?: string // أسد/لبوة، فارس/فارسة، ناصح/ناصحة، راسطة
  // Gifts received
  gifts?: ReceivedGift[]
  // Featured posts (highlights)
  featuredPosts?: FeaturedPost[]
}

export interface ReceivedGift {
  id: string
  giftType: string
  giftName: string
  giftNameAr: string
  giftEmoji: string
  senderName?: string
  senderNameAr?: string
  isPrivate: boolean // فاعل خير
  receivedAt: Date
}

export interface FeaturedPost {
  id: string
  thumbnail: string
  likes: number
  comments: number
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
        username: 'hindawiii',
        name: 'Hindawi',
        nameAr: 'هنداوي',
        nickname: 'هنداوي',
        email: 'hindawi@rakobatna.sd',
        phone: '+249912345678',
        avatar: '/avatars/default.jpg',
        coverPhoto: '/covers/default.jpg',
        bio: 'Proud Sudanese! Love coffee and good conversations.',
        bioAr: 'مواطن سوداني! ولربما يفاجئك ما قد يحدث.',
        zoolPoints: 1250,
        followers: 342,
        following: 156,
        postsCount: 47,
        isOnline: true,
        lastSeen: null,
        isVerified: true,
        location: 'الخرطوم',
        gender: 'male',
        socialStatus: 'single',
        professionalStatus: 'freelancer',
        rank: 'knight',
        rankTitle: 'فارس',
        gifts: [
          { id: 'g1', giftType: 'heritage', giftName: 'Jabana', giftNameAr: 'جبنة', giftEmoji: '☕', senderName: 'Ahmed', senderNameAr: 'أحمد', isPrivate: false, receivedAt: new Date() },
          { id: 'g2', giftType: 'heritage', giftName: 'Markoub', giftNameAr: 'مركوب', giftEmoji: '👞', isPrivate: true, receivedAt: new Date() },
          { id: 'g3', giftType: 'flowers', giftName: 'Jasmine', giftNameAr: 'ياسمين', giftEmoji: '🌸', senderName: 'Sara', senderNameAr: 'سارة', isPrivate: false, receivedAt: new Date() },
          { id: 'g4', giftType: 'luxury', giftName: 'Gold Ring', giftNameAr: 'خاتم ذهب', giftEmoji: '💍', isPrivate: true, receivedAt: new Date() },
          { id: 'g5', giftType: 'flowers', giftName: 'Red Rose', giftNameAr: 'ورد أحمر', giftEmoji: '🌹', senderName: 'Mohamed', senderNameAr: 'محمد', isPrivate: false, receivedAt: new Date() },
        ],
        featuredPosts: [
          { id: 'fp1', thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', likes: 234, comments: 45 },
          { id: 'fp2', thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', likes: 567, comments: 89 },
          { id: 'fp3', thumbnail: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400', likes: 123, comments: 23 },
        ],
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
      name: 'rakobatna-user-storage',
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
