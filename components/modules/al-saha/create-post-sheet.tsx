'use client'

import * as React from 'react'
import { Image as ImageIcon, Video, MapPin, X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useFeedStore, type Post } from '@/lib/stores/feed-store'
import { useUserStore } from '@/lib/stores/user-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

interface CreatePostSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePostSheet({ open, onOpenChange }: CreatePostSheetProps) {
  const { addPost } = useFeedStore()
  const { currentUser, addZoolPoints } = useUserStore()
  const { t, language, isRTL } = useLanguage()
  
  const [content, setContent] = React.useState('')
  const [images, setImages] = React.useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async () => {
    if (!content.trim() || !currentUser) return

    setIsSubmitting(true)

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorNameAr: currentUser.nameAr,
      authorAvatar: currentUser.avatar,
      content: content,
      contentAr: content, // In production, would have translation
      images: images,
      reactions: { like: 0, love: 0, kaffu: 0, abshir: 0, haha: 0, sad: 0 },
      commentsCount: 0,
      sharesCount: 0,
      timestamp: new Date(),
    }

    addPost(newPost)
    addZoolPoints(10) // Award points for posting
    
    setContent('')
    setImages([])
    setIsSubmitting(false)
    onOpenChange(false)
  }

  const addDemoImage = () => {
    if (images.length < 10) {
      setImages([...images, `/posts/demo-${images.length + 1}.jpg`])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
        <SheetHeader className="flex flex-row items-center justify-between border-b pb-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <SheetTitle className={cn(isRTL && 'font-arabic')}>
            {t('feed.newPost')}
          </SheetTitle>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              t('common.send')
            )}
          </Button>
        </SheetHeader>

        <div className="py-4 space-y-4">
          {/* Author info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={currentUser?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {(isRTL ? currentUser?.nameAr : currentUser?.name)?.[0] || 'Z'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className={cn('font-semibold', isRTL && 'font-arabic')}>
                {isRTL ? currentUser?.nameAr : currentUser?.name}
              </p>
              <button className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {isRTL ? 'إضافة موقع' : 'Add location'}
              </button>
            </div>
          </div>

          {/* Text input */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('feed.whatsNew')}
            className={cn(
              'min-h-[150px] resize-none border-none text-lg focus-visible:ring-0',
              isRTL && 'font-arabic text-right'
            )}
          />

          {/* Image previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square bg-secondary rounded-lg">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    {isRTL ? 'صورة' : 'Image'} {index + 1}
                  </div>
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Media buttons */}
          <div className="flex items-center gap-2 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={addDemoImage}
              disabled={images.length >= 10}
            >
              <ImageIcon className="h-5 w-5 text-green-600" />
              <span className={cn(isRTL && 'font-arabic')}>{t('feed.photo')}</span>
              {images.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({images.length}/10)
                </span>
              )}
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <Video className="h-5 w-5 text-red-600" />
              <span className={cn(isRTL && 'font-arabic')}>{t('feed.video')}</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
