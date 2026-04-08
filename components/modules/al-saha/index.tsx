'use client'

import * as React from 'react'
import { Plus, Camera, Video } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PostCard } from './post-card'
import { CreatePostSheet } from './create-post-sheet'
import { useFeedStore } from '@/lib/stores/feed-store'
import { useUserStore } from '@/lib/stores/user-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

export default function AlSaha() {
  const { posts, isLoading } = useFeedStore()
  const { currentUser } = useUserStore()
  const { t, isRTL } = useLanguage()
  const [showCreatePost, setShowCreatePost] = React.useState(false)

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-card/50">
        <div className="flex items-center justify-between">
          <h2 className={cn('text-2xl font-bold', isRTL && 'font-arabic')}>
            {t('feed.title')}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Camera className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Video className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="pb-4">
          {/* Create Post Prompt */}
          <div className="p-4 border-b">
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {(isRTL ? currentUser?.nameAr : currentUser?.name)?.[0] || 'Z'}
                </AvatarFallback>
              </Avatar>
              <span className={cn(
                'flex-1 text-start text-muted-foreground',
                isRTL && 'font-arabic'
              )}>
                {t('feed.whatsNew')}
              </span>
              <div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <Plus className="h-5 w-5" />
              </div>
            </button>
          </div>

          {/* Stories Row (Simplified) */}
          <div className="px-4 py-3 border-b overflow-x-auto overflow-y-hidden w-full max-w-full">
            <div className="flex gap-3 w-max">
              {/* Add Story */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-2 border-dashed border-primary">
                    <AvatarImage src={currentUser?.avatar} />
                    <AvatarFallback className="bg-secondary">
                      <Plus className="h-6 w-6 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className={cn('text-xs', isRTL && 'font-arabic')}>
                  {isRTL ? 'إضافة' : 'Add'}
                </span>
              </div>
              
              {/* Story placeholders */}
              {['Fatima', 'Omar', 'Amira', 'Khalid'].map((name, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="p-0.5 rounded-full bg-gradient-to-br from-primary to-accent">
                    <Avatar className="h-16 w-16 border-2 border-background">
                      <AvatarFallback className="bg-secondary text-muted-foreground">
                        {name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="text-xs text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Posts Feed */}
          <div className="divide-y">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="jabana-loader w-12 h-12">
                <svg viewBox="0 0 64 64" className="w-full h-full">
                  <ellipse cx="32" cy="48" rx="20" ry="12" fill="currentColor" className="text-primary" />
                  <path d="M12 48 Q8 32 18 26 L46 26 Q56 32 52 48" fill="currentColor" className="text-primary" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Create Post Sheet */}
      <CreatePostSheet open={showCreatePost} onOpenChange={setShowCreatePost} />
    </div>
  )
}
