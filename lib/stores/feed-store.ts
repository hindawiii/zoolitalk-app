import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type ReactionType = 'like' | 'love' | 'kaffu' | 'abshir' | 'haha' | 'sad'

export interface Post {
  id: string
  authorId: string
  authorName: string
  authorNameAr: string
  authorAvatar: string
  content: string
  contentAr: string
  images: string[]
  videoUrl?: string
  isReel?: boolean
  reactions: Record<ReactionType, number>
  userReaction?: ReactionType
  commentsCount: number
  sharesCount: number
  timestamp: Date
  location?: string
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  authorName: string
  authorAvatar: string
  content: string
  voiceNoteUrl?: string
  voiceDuration?: number
  timestamp: Date
  likes: number
  replies: Comment[]
}

interface FeedState {
  // Posts
  posts: Post[]
  setPosts: (posts: Post[]) => void
  addPost: (post: Post) => void
  
  // Reactions
  reactToPost: (postId: string, reaction: ReactionType) => void
  removeReaction: (postId: string) => void
  
  // Comments
  comments: Record<string, Comment[]>
  addComment: (postId: string, comment: Comment) => void
  addVoiceReply: (postId: string, commentId: string, voiceUrl: string, duration: number) => void
  
  // Reels
  reels: Post[]
  currentReelIndex: number
  setCurrentReelIndex: (index: number) => void
  
  // Loading states
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

// Demo posts
const demoPosts: Post[] = [
  {
    id: 'post-1',
    authorId: 'user-2',
    authorName: 'Fatima Ali',
    authorNameAr: 'فاطمة علي',
    authorAvatar: '/avatars/fatima.jpg',
    content: 'Beautiful sunset over the Nile today! Nothing beats Khartoum evenings.',
    contentAr: 'غروب جميل على النيل اليوم! ما في أحلى من ليالي الخرطوم.',
    images: ['/posts/sunset-nile.jpg'],
    reactions: { like: 45, love: 23, kaffu: 12, abshir: 5, haha: 2, sad: 0 },
    userReaction: undefined,
    commentsCount: 8,
    sharesCount: 3,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    location: 'Khartoum, Sudan',
  },
  {
    id: 'post-2',
    authorId: 'user-3',
    authorName: 'Omar Hassan',
    authorNameAr: 'عمر حسن',
    authorAvatar: '/avatars/omar.jpg',
    content: 'Al-Hilal won again! What a match!',
    contentAr: 'الهلال كسب تاني! يا سلام على الماتش!',
    images: ['/posts/hilal-match.jpg', '/posts/hilal-fans.jpg'],
    reactions: { like: 156, love: 89, kaffu: 67, abshir: 34, haha: 12, sad: 5 },
    userReaction: 'kaffu',
    commentsCount: 45,
    sharesCount: 23,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: 'post-3',
    authorId: 'user-4',
    authorName: 'Amira Mohamed',
    authorNameAr: 'أميرة محمد',
    authorAvatar: '/avatars/amira.jpg',
    content: 'Made traditional Kisra today! Family recipe passed down for generations.',
    contentAr: 'عملت كسرة اليوم! وصفة العائلة من زمان.',
    images: ['/posts/kisra.jpg'],
    reactions: { like: 78, love: 45, kaffu: 23, abshir: 0, haha: 0, sad: 0 },
    commentsCount: 12,
    sharesCount: 8,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
]

// Demo reels
const demoReels: Post[] = [
  {
    id: 'reel-1',
    authorId: 'user-5',
    authorName: 'Yousif Ahmed',
    authorNameAr: 'يوسف أحمد',
    authorAvatar: '/avatars/yousif.jpg',
    content: 'Sudanese coffee ritual',
    contentAr: 'طقوس الجبنة السودانية',
    images: [],
    videoUrl: '/reels/coffee-ritual.mp4',
    isReel: true,
    reactions: { like: 234, love: 156, kaffu: 89, abshir: 45, haha: 12, sad: 0 },
    commentsCount: 34,
    sharesCount: 67,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
]

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      posts: demoPosts,
      setPosts: (posts) => set({ posts }),
      addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
      
      reactToPost: (postId, reaction) =>
        set((state) => ({
          posts: state.posts.map(post => {
            if (post.id !== postId) return post
            const reactions = { ...post.reactions }
            // Remove previous reaction if exists
            if (post.userReaction) {
              reactions[post.userReaction] = Math.max(0, reactions[post.userReaction] - 1)
            }
            // Add new reaction
            reactions[reaction] = (reactions[reaction] || 0) + 1
            return { ...post, reactions, userReaction: reaction }
          }),
        })),
      removeReaction: (postId) =>
        set((state) => ({
          posts: state.posts.map(post => {
            if (post.id !== postId || !post.userReaction) return post
            const reactions = { ...post.reactions }
            reactions[post.userReaction] = Math.max(0, reactions[post.userReaction] - 1)
            return { ...post, reactions, userReaction: undefined }
          }),
        })),
      
      comments: {},
      addComment: (postId, comment) =>
        set((state) => ({
          comments: {
            ...state.comments,
            [postId]: [...(state.comments[postId] || []), comment],
          },
          posts: state.posts.map(post =>
            post.id === postId ? { ...post, commentsCount: post.commentsCount + 1 } : post
          ),
        })),
      addVoiceReply: (postId, commentId, voiceUrl, duration) =>
        set((state) => ({
          comments: {
            ...state.comments,
            [postId]: (state.comments[postId] || []).map(comment =>
              comment.id === commentId
                ? {
                    ...comment,
                    replies: [
                      ...comment.replies,
                      {
                        id: `reply-${Date.now()}`,
                        postId,
                        authorId: 'user-1',
                        authorName: 'Ahmed',
                        authorAvatar: '/avatars/ahmed.jpg',
                        content: '',
                        voiceNoteUrl: voiceUrl,
                        voiceDuration: duration,
                        timestamp: new Date(),
                        likes: 0,
                        replies: [],
                      },
                    ],
                  }
                : comment
            ),
          },
        })),
      
      reels: demoReels,
      currentReelIndex: 0,
      setCurrentReelIndex: (currentReelIndex) => set({ currentReelIndex }),
      
      isLoading: false,
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'rakobatna-feed-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        posts: state.posts,
        comments: state.comments,
      }),
    }
  )
)
