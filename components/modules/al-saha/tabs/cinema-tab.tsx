'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Volume2, 
  VolumeX, 
  Play,
  Pause,
  Music2,
  Send
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useFeedStore, type Post } from '@/lib/stores/feed-store'
import { cn } from '@/lib/utils'

// Demo reels data
const demoReels: Post[] = [
  {
    id: 'reel-1',
    authorId: 'user-5',
    authorName: 'Yousif Ahmed',
    authorNameAr: 'يوسف أحمد',
    authorAvatar: '/avatars/yousif.jpg',
    content: 'Sudanese coffee ritual - the best part of our culture',
    contentAr: 'طقوس الجبنة السودانية - أجمل ما في ثقافتنا',
    images: [],
    videoUrl: '/reels/coffee.mp4',
    isReel: true,
    reactions: { like: 234, love: 156, kaffu: 89, abshir: 45, haha: 12, sad: 0 },
    commentsCount: 34,
    sharesCount: 67,
    timestamp: new Date(),
  },
  {
    id: 'reel-2',
    authorId: 'user-6',
    authorName: 'Mona Ibrahim',
    authorNameAr: 'منى إبراهيم',
    authorAvatar: '/avatars/mona.jpg',
    content: 'Traditional Sudanese dance at my cousin wedding',
    contentAr: 'رقص سوداني تقليدي في عرس ابن عمي',
    images: [],
    videoUrl: '/reels/dance.mp4',
    isReel: true,
    reactions: { like: 567, love: 234, kaffu: 123, abshir: 67, haha: 45, sad: 0 },
    commentsCount: 89,
    sharesCount: 134,
    timestamp: new Date(),
  },
  {
    id: 'reel-3',
    authorId: 'user-7',
    authorName: 'Hassan Osman',
    authorNameAr: 'حسن عثمان',
    authorAvatar: '/avatars/hassan.jpg',
    content: 'Nile River sunset - nothing beats this view',
    contentAr: 'غروب النيل - ما في أجمل من المنظر ده',
    images: [],
    videoUrl: '/reels/nile.mp4',
    isReel: true,
    reactions: { like: 789, love: 456, kaffu: 234, abshir: 123, haha: 67, sad: 0 },
    commentsCount: 123,
    sharesCount: 234,
    timestamp: new Date(),
  },
  {
    id: 'reel-4',
    authorId: 'user-8',
    authorName: 'Amal Khalil',
    authorNameAr: 'أمل خليل',
    authorAvatar: '/avatars/amal.jpg',
    content: 'Making traditional Asida - family recipe',
    contentAr: 'طريقة عمل العصيدة - وصفة العائلة',
    images: [],
    videoUrl: '/reels/asida.mp4',
    isReel: true,
    reactions: { like: 345, love: 234, kaffu: 167, abshir: 89, haha: 23, sad: 0 },
    commentsCount: 56,
    sharesCount: 89,
    timestamp: new Date(),
  },
]

interface ReelCardProps {
  reel: Post
  isActive: boolean
}

function ReelCard({ reel, isActive }: ReelCardProps) {
  const [isLiked, setIsLiked] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(true)
  const [isPlaying, setIsPlaying] = React.useState(isActive)
  const [showHeart, setShowHeart] = React.useState(false)

  React.useEffect(() => {
    setIsPlaying(isActive)
  }, [isActive])

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true)
      setShowHeart(true)
      setTimeout(() => setShowHeart(false), 1000)
    }
  }

  const totalReactions = Object.values(reel.reactions).reduce((sum, count) => sum + count, 0)

  return (
    <div 
      className="relative h-full w-full bg-black flex items-center justify-center snap-start"
      onDoubleClick={handleDoubleTap}
    >
      {/* Video placeholder background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2D5A27]/30 via-black/50 to-black/80">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/50 text-center">
            <Music2 className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="font-arabic text-lg opacity-50">فيديو سينما الراكوبة</p>
          </div>
        </div>
      </div>

      {/* Double tap heart animation */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <Heart className="h-24 w-24 text-red-500 fill-red-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause indicator */}
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute inset-0 z-10 flex items-center justify-center"
      >
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <Play className="h-8 w-8 text-white fill-white ml-1" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Bottom content overlay */}
      <div className="absolute bottom-0 left-0 right-16 p-4 pb-20 z-10">
        {/* Author info */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarFallback className="bg-[#2D5A27] text-white font-arabic">
              {reel.authorNameAr[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-bold font-arabic text-sm">{reel.authorNameAr}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-6 px-3 text-xs bg-transparent border-white/50 text-white hover:bg-white/20 font-arabic"
            >
              متابعة
            </Button>
          </div>
        </div>

        {/* Caption */}
        <p className="text-white text-sm font-arabic leading-relaxed mb-3">
          {reel.contentAr}
        </p>

        {/* Music/Sound indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
            <Music2 className="h-3 w-3 text-white" />
            <span className="text-white text-xs font-arabic">صوت أصلي</span>
          </div>
        </div>
      </div>

      {/* Right side actions */}
      <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5 z-10">
        {/* Like */}
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="flex flex-col items-center gap-1"
        >
          <motion.div
            whileTap={{ scale: 0.8 }}
            animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
          >
            <Heart className={cn(
              'h-8 w-8',
              isLiked ? 'text-red-500 fill-red-500' : 'text-white'
            )} />
          </motion.div>
          <span className="text-white text-xs font-bold">{totalReactions}</span>
        </button>

        {/* Comment */}
        <button className="flex flex-col items-center gap-1">
          <MessageCircle className="h-8 w-8 text-white" />
          <span className="text-white text-xs font-bold">{reel.commentsCount}</span>
        </button>

        {/* Share to Al-Wansa */}
        <button className="flex flex-col items-center gap-1">
          <div className="relative">
            <Send className="h-7 w-7 text-white" />
          </div>
          <span className="text-white text-[10px] font-arabic">الونسة</span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1">
          <Share2 className="h-7 w-7 text-white" />
          <span className="text-white text-xs font-bold">{reel.sharesCount}</span>
        </button>

        {/* Mute/Unmute */}
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-white" />
          ) : (
            <Volume2 className="h-5 w-5 text-white" />
          )}
        </button>

        {/* Author avatar */}
        <Avatar className="h-10 w-10 border-2 border-white">
          <AvatarFallback className="bg-[#2D5A27] text-white font-arabic text-xs">
            {reel.authorNameAr[0]}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

export function CinemaTab() {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleScroll = React.useCallback(() => {
    if (!containerRef.current) return
    const scrollTop = containerRef.current.scrollTop
    const height = containerRef.current.clientHeight
    const newIndex = Math.round(scrollTop / height)
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < demoReels.length) {
      setCurrentIndex(newIndex)
    }
  }, [currentIndex])

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <div 
      ref={containerRef}
      className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      {demoReels.map((reel, index) => (
        <div 
          key={reel.id} 
          className="h-full w-full"
          style={{ scrollSnapAlign: 'start' }}
        >
          <ReelCard reel={reel} isActive={index === currentIndex} />
        </div>
      ))}
    </div>
  )
}
