'use client'

import * as React from 'react'
import { Search, Plus, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChatStore, type Chat } from '@/lib/stores/chat-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

export function ChatList() {
  const { chats, setActiveChatId } = useChatStore()
  const { t, language, isRTL } = useLanguage()
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredChats = React.useMemo(() => {
    if (!searchQuery) return chats
    const query = searchQuery.toLowerCase()
    return chats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(query) ||
        chat.nameAr.includes(query) ||
        chat.lastMessage.toLowerCase().includes(query)
    )
  }, [chats, searchQuery])

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: language === 'ar' ? ar : enUS,
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className={cn('text-2xl font-bold', isRTL && 'font-arabic')}>
            {t('chat.title')}
          </h2>
          <Button size="icon" variant="ghost" className="rounded-full">
            <Plus className="h-5 w-5" />
            <span className="sr-only">{t('chat.newChat')}</span>
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className={cn(
            'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
            isRTL ? 'right-3' : 'left-3'
          )} />
          <Input
            placeholder={t('chat.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn('h-10 rounded-full bg-secondary/50', isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4')}
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="px-2 pb-4">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mb-4 opacity-50" />
              <p className={cn(isRTL && 'font-arabic')}>{t('common.noResults')}</p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                onClick={() => setActiveChatId(chat.id)}
                formatTime={formatTime}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

interface ChatListItemProps {
  chat: Chat
  onClick: () => void
  formatTime: (date: Date) => string
}

function ChatListItem({ chat, onClick, formatTime }: ChatListItemProps) {
  const { isRTL } = useLanguage()

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl transition-colors',
        'hover:bg-secondary/50 active:bg-secondary',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarImage src={chat.avatar} alt={chat.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {chat.type === 'group' ? (
              <Users className="h-5 w-5" />
            ) : (
              (isRTL ? chat.nameAr : chat.name)[0]
            )}
          </AvatarFallback>
        </Avatar>
        {/* Online indicator */}
        {chat.isOnline && chat.type === 'private' && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
        )}
        {/* Group indicator */}
        {chat.type === 'group' && (
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-background">
            {chat.participants?.length || 0}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-start">
        <div className="flex items-center justify-between gap-2">
          <span className={cn('font-semibold truncate', isRTL && 'font-arabic')}>
            {isRTL ? chat.nameAr : chat.name}
          </span>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatTime(chat.lastMessageTime)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className={cn(
            'text-sm text-muted-foreground truncate',
            isRTL && 'font-arabic'
          )}>
            {chat.lastMessage}
          </p>
          {chat.unreadCount > 0 && (
            <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 bg-accent text-accent-foreground rounded-full text-xs font-bold flex items-center justify-center">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
