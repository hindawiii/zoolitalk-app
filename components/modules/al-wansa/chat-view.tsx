'use client'

import * as React from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  MoreVertical,
  Phone,
  Video,
  Send,
  Mic,
  Image as ImageIcon,
  Smile,
  X,
  Reply,
  Forward,
  Edit2,
  Trash2,
  Copy,
  Check,
  CheckCheck,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useChatStore, type Message } from '@/lib/stores/chat-store'
import { useUserStore } from '@/lib/stores/user-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

interface ChatViewProps {
  onBack: () => void
}

export function ChatView({ onBack }: ChatViewProps) {
  const { activeChatId, chats, messages, addMessage, isRecording, setRecording, recordingDuration, setRecordingDuration } = useChatStore()
  const { currentUser } = useUserStore()
  const { t, language, isRTL } = useLanguage()
  
  const [inputValue, setInputValue] = React.useState('')
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null)
  const [replyingTo, setReplyingTo] = React.useState<Message | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const recordingTimerRef = React.useRef<number | null>(null)

  const chat = chats.find((c) => c.id === activeChatId)
  const chatMessages = messages[activeChatId || ''] || []

  const BackIcon = isRTL ? ArrowRight : ArrowLeft

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatMessages])

  // Recording timer
  React.useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingDuration(recordingDuration + 1)
      }, 1000)
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }, [isRecording, recordingDuration, setRecordingDuration])

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSend = () => {
    if (!inputValue.trim() || !currentUser || !activeChatId) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: activeChatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: inputValue.trim(),
      type: 'text',
      timestamp: new Date(),
      status: 'sending',
      replyTo: replyingTo?.id,
    }

    addMessage(activeChatId, newMessage)
    setInputValue('')
    setReplyingTo(null)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Voice recording handlers
  const startRecording = () => {
    setRecording(true)
  }

  const cancelRecording = () => {
    setRecording(false)
  }

  const sendVoiceNote = () => {
    if (!currentUser || !activeChatId) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: activeChatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: '',
      type: 'voice',
      voiceDuration: recordingDuration,
      timestamp: new Date(),
      status: 'sending',
    }

    addMessage(activeChatId, newMessage)
    setRecording(false)
  }

  // Handle swipe to cancel
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isRTL ? info.offset.x > 100 : info.offset.x < -100) {
      cancelRecording()
    }
  }

  if (!chat) return null

  return (
    <div className="flex flex-col h-full bg-background w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 px-2 py-2 bg-card border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <BackIcon className="h-5 w-5" />
        </Button>
        
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={chat.avatar} alt={chat.name} />
            <AvatarFallback>{(isRTL ? chat.nameAr : chat.name)[0]}</AvatarFallback>
          </Avatar>
          {chat.isOnline && chat.type === 'private' && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={cn('font-semibold truncate', isRTL && 'font-arabic')}>
            {isRTL ? chat.nameAr : chat.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {chat.isOnline ? t('chat.online') : t('chat.offline')}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
              {chat.type === 'group' && (
                <>
                  <DropdownMenuItem>{t('chat.mute')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('chat.kick')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('chat.promote')}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem className="text-destructive">
                {t('chat.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {chatMessages.map((message, index) => {
            const isSent = message.senderId === currentUser?.id
            const showAvatar = !isSent && (
              index === 0 || chatMessages[index - 1]?.senderId !== message.senderId
            )

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isSent={isSent}
                showAvatar={showAvatar}
                onLongPress={() => setSelectedMessage(message)}
                onReply={() => setReplyingTo(message)}
              />
            )
          })}
        </div>
      </ScrollArea>

      {/* Reply preview */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t bg-secondary/30"
          >
            <div className="flex items-center gap-2 px-4 py-2">
              <Reply className="h-4 w-4 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-primary">{replyingTo.senderName}</p>
                <p className="text-sm text-muted-foreground truncate">{replyingTo.content}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setReplyingTo(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="p-3 border-t bg-card">
        {isRecording ? (
          <motion.div
            className="flex items-center gap-3"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
          >
            <div className="recording-pulse w-3 h-3 bg-destructive rounded-full" />
            <span className="text-destructive font-mono">
              {formatRecordingTime(recordingDuration)}
            </span>
            <span className={cn('flex-1 text-sm text-muted-foreground', isRTL && 'font-arabic')}>
              {t('chat.slideCancel')}
            </span>
            <Button
              size="icon"
              className="rounded-full bg-primary hover:bg-primary/90"
              onClick={sendVoiceNote}
            >
              <Send className="h-5 w-5" />
            </Button>
          </motion.div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Smile className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <ImageIcon className="h-5 w-5" />
            </Button>
            
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t('chat.typeMessage')}
              className={cn(
                'flex-1 rounded-full bg-secondary/50 border-none',
                isRTL && 'font-arabic text-right'
              )}
            />

            {inputValue.trim() ? (
              <Button
                size="icon"
                className="rounded-full bg-primary hover:bg-primary/90 flex-shrink-0"
                onClick={handleSend}
              >
                <Send className={cn('h-5 w-5', isRTL && 'rotate-180')} />
              </Button>
            ) : (
              <Button
                size="icon"
                variant="ghost"
                className="flex-shrink-0"
                onMouseDown={startRecording}
                onMouseUp={sendVoiceNote}
                onMouseLeave={cancelRecording}
                onTouchStart={startRecording}
                onTouchEnd={sendVoiceNote}
              >
                <Mic className="h-5 w-5" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Message Context Menu */}
      <AnimatePresence>
        {selectedMessage && (
          <MessageContextMenu
            message={selectedMessage}
            onClose={() => setSelectedMessage(null)}
            onReply={() => {
              setReplyingTo(selectedMessage)
              setSelectedMessage(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Message Bubble Component
interface MessageBubbleProps {
  message: Message
  isSent: boolean
  showAvatar: boolean
  onLongPress: () => void
  onReply: () => void
}

function MessageBubble({ message, isSent, showAvatar, onLongPress }: MessageBubbleProps) {
  const { language, isRTL } = useLanguage()
  const longPressTimer = React.useRef<number | null>(null)

  const handleTouchStart = () => {
    longPressTimer.current = window.setTimeout(onLongPress, 500)
  }

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }

  const formatMessageTime = (date: Date) => {
    return format(date, 'p', { locale: language === 'ar' ? ar : enUS })
  }

  const StatusIcon = message.status === 'read' ? CheckCheck : 
                     message.status === 'delivered' ? CheckCheck : Check

  return (
    <div
      className={cn(
        'flex gap-2',
        isSent ? (isRTL ? 'flex-row' : 'flex-row-reverse') : (isRTL ? 'flex-row-reverse' : 'flex-row')
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(e) => {
        e.preventDefault()
        onLongPress()
      }}
    >
      {/* Avatar (for received messages) */}
      {!isSent && (
        <div className="w-8 flex-shrink-0">
          {showAvatar && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={message.senderAvatar} alt={message.senderName} />
              <AvatarFallback>{message.senderName[0]}</AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          'chat-bubble',
          isSent ? 'chat-bubble-sent' : 'chat-bubble-received'
        )}
      >
        {message.type === 'voice' ? (
          <div className="flex items-center gap-2 min-w-[150px]">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M8 5v14l11-7z" />
              </svg>
            </Button>
            <div className="flex-1 h-1 bg-current/30 rounded-full" />
            <span className="text-xs opacity-70">
              {Math.floor((message.voiceDuration || 0) / 60)}:
              {((message.voiceDuration || 0) % 60).toString().padStart(2, '0')}
            </span>
          </div>
        ) : (
          <p className={cn(isRTL && 'font-arabic')}>{message.content}</p>
        )}
        
        {/* Time and status */}
        <div className={cn(
          'flex items-center gap-1 mt-1',
          isSent ? 'justify-end' : 'justify-start'
        )}>
          <span className="text-[10px] opacity-70">
            {formatMessageTime(message.timestamp)}
          </span>
          {isSent && (
            <StatusIcon className={cn(
              'h-3 w-3',
              message.status === 'read' ? 'text-blue-400' : 'opacity-70'
            )} />
          )}
          {message.isEdited && (
            <span className="text-[10px] opacity-50">
              {isRTL ? 'معدل' : 'edited'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// Message Context Menu
interface MessageContextMenuProps {
  message: Message
  onClose: () => void
  onReply: () => void
}

function MessageContextMenu({ message, onClose, onReply }: MessageContextMenuProps) {
  const { t, isRTL } = useLanguage()
  const { deleteMessage } = useChatStore()
  const { currentUser } = useUserStore()

  const isSent = message.senderId === currentUser?.id

  const actions = [
    { icon: Reply, label: t('chat.reply'), onClick: onReply },
    { icon: Forward, label: t('chat.forward'), onClick: () => {} },
    { icon: Copy, label: t('chat.copy'), onClick: () => navigator.clipboard.writeText(message.content) },
    ...(isSent ? [
      { icon: Edit2, label: t('chat.edit'), onClick: () => {} },
      { icon: Trash2, label: t('chat.delete'), onClick: () => deleteMessage(message.chatId, message.id), danger: true },
    ] : []),
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-card rounded-xl p-2 min-w-[200px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              action.onClick()
              onClose()
            }}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              'hover:bg-secondary',
              action.danger && 'text-destructive hover:bg-destructive/10',
              isRTL && 'flex-row-reverse'
            )}
          >
            <action.icon className="h-5 w-5" />
            <span className={cn(isRTL && 'font-arabic')}>{action.label}</span>
          </button>
        ))}
      </motion.div>
    </motion.div>
  )
}
