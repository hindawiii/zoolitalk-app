import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Message {
  id: string
  chatId: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  type: 'text' | 'voice' | 'image' | 'sticker'
  voiceDuration?: number
  imageUrl?: string
  stickerUrl?: string
  timestamp: Date
  status: 'sending' | 'sent' | 'delivered' | 'read'
  replyTo?: string
  isEdited?: boolean
}

export interface Chat {
  id: string
  type: 'private' | 'group'
  name: string
  nameAr: string
  avatar: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  isOnline?: boolean
  participants?: ChatParticipant[]
  // For groups (Janba)
  admins?: string[]
  mutedUsers?: string[]
}

export interface ChatParticipant {
  id: string
  name: string
  avatar: string
  role: 'admin' | 'moderator' | 'member'
  isOnline: boolean
}

interface ChatState {
  // Chats list
  chats: Chat[]
  setChats: (chats: Chat[]) => void
  
  // Active chat
  activeChatId: string | null
  setActiveChatId: (id: string | null) => void
  
  // Messages (keyed by chatId)
  messages: Record<string, Message[]>
  addMessage: (chatId: string, message: Message) => void
  editMessage: (chatId: string, messageId: string, newContent: string) => void
  deleteMessage: (chatId: string, messageId: string) => void
  
  // Typing indicators
  typingUsers: Record<string, string[]>
  setTyping: (chatId: string, userId: string, isTyping: boolean) => void
  
  // Admin actions (for Janba/groups)
  muteUser: (chatId: string, userId: string) => void
  unmuteUser: (chatId: string, userId: string) => void
  kickUser: (chatId: string, userId: string) => void
  promoteUser: (chatId: string, userId: string, role: 'admin' | 'moderator') => void
  
  // Voice note recording
  isRecording: boolean
  recordingDuration: number
  setRecording: (isRecording: boolean) => void
  setRecordingDuration: (duration: number) => void
}

// Demo chats data
const demoChats: Chat[] = [
  {
    id: 'chat-1',
    type: 'private',
    name: 'Fatima Ali',
    nameAr: 'فاطمة علي',
    avatar: '/avatars/fatima.jpg',
    lastMessage: 'أهلاً! كيفك اليوم؟',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: 'chat-2',
    type: 'group',
    name: 'Khartoum Friends',
    nameAr: 'شلة الخرطوم',
    avatar: '/avatars/group1.jpg',
    lastMessage: 'الجبنة جاهزة يا جماعة!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 5,
    admins: ['user-1'],
    participants: [
      { id: 'user-1', name: 'Ahmed', avatar: '/avatars/ahmed.jpg', role: 'admin', isOnline: true },
      { id: 'user-2', name: 'Fatima', avatar: '/avatars/fatima.jpg', role: 'member', isOnline: true },
      { id: 'user-3', name: 'Omar', avatar: '/avatars/omar.jpg', role: 'moderator', isOnline: false },
    ],
  },
  {
    id: 'chat-3',
    type: 'private',
    name: 'Omar Hassan',
    nameAr: 'عمر حسن',
    avatar: '/avatars/omar.jpg',
    lastMessage: 'شفت الماتش؟',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
    isOnline: false,
  },
]

// Demo messages
const demoMessages: Record<string, Message[]> = {
  'chat-1': [
    {
      id: 'msg-1',
      chatId: 'chat-1',
      senderId: 'user-2',
      senderName: 'Fatima Ali',
      senderAvatar: '/avatars/fatima.jpg',
      content: 'السلام عليكم يا زول!',
      type: 'text',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      status: 'read',
    },
    {
      id: 'msg-2',
      chatId: 'chat-1',
      senderId: 'user-1',
      senderName: 'Ahmed',
      senderAvatar: '/avatars/ahmed.jpg',
      content: 'وعليكم السلام! الحمد لله تمام',
      type: 'text',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      status: 'read',
    },
    {
      id: 'msg-3',
      chatId: 'chat-1',
      senderId: 'user-2',
      senderName: 'Fatima Ali',
      senderAvatar: '/avatars/fatima.jpg',
      content: 'أهلاً! كيفك اليوم؟',
      type: 'text',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: 'delivered',
    },
  ],
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: demoChats,
      setChats: (chats) => set({ chats }),
      
      activeChatId: null,
      setActiveChatId: (activeChatId) => set({ activeChatId }),
      
      messages: demoMessages,
      addMessage: (chatId, message) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: [...(state.messages[chatId] || []), message],
          },
          chats: state.chats.map(chat =>
            chat.id === chatId
              ? { ...chat, lastMessage: message.content, lastMessageTime: message.timestamp, unreadCount: 0 }
              : chat
          ),
        })),
      editMessage: (chatId, messageId, newContent) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: (state.messages[chatId] || []).map(msg =>
              msg.id === messageId ? { ...msg, content: newContent, isEdited: true } : msg
            ),
          },
        })),
      deleteMessage: (chatId, messageId) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: (state.messages[chatId] || []).filter(msg => msg.id !== messageId),
          },
        })),
      
      typingUsers: {},
      setTyping: (chatId, userId, isTyping) =>
        set((state) => {
          const current = state.typingUsers[chatId] || []
          const updated = isTyping
            ? [...new Set([...current, userId])]
            : current.filter(id => id !== userId)
          return {
            typingUsers: { ...state.typingUsers, [chatId]: updated },
          }
        }),
      
      muteUser: (chatId, userId) =>
        set((state) => ({
          chats: state.chats.map(chat =>
            chat.id === chatId
              ? { ...chat, mutedUsers: [...(chat.mutedUsers || []), userId] }
              : chat
          ),
        })),
      unmuteUser: (chatId, userId) =>
        set((state) => ({
          chats: state.chats.map(chat =>
            chat.id === chatId
              ? { ...chat, mutedUsers: (chat.mutedUsers || []).filter(id => id !== userId) }
              : chat
          ),
        })),
      kickUser: (chatId, userId) =>
        set((state) => ({
          chats: state.chats.map(chat =>
            chat.id === chatId
              ? { ...chat, participants: chat.participants?.filter(p => p.id !== userId) }
              : chat
          ),
        })),
      promoteUser: (chatId, userId, role) =>
        set((state) => ({
          chats: state.chats.map(chat =>
            chat.id === chatId
              ? {
                  ...chat,
                  participants: chat.participants?.map(p =>
                    p.id === userId ? { ...p, role } : p
                  ),
                  admins: role === 'admin'
                    ? [...(chat.admins || []), userId]
                    : chat.admins,
                }
              : chat
          ),
        })),
      
      isRecording: false,
      recordingDuration: 0,
      setRecording: (isRecording) => set({ isRecording, recordingDuration: 0 }),
      setRecordingDuration: (recordingDuration) => set({ recordingDuration }),
    }),
    {
      name: 'rakobatna-chat-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        chats: state.chats,
        messages: state.messages,
      }),
    }
  )
)
