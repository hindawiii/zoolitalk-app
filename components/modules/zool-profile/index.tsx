'use client'

import * as React from 'react'
import Image from 'next/image'
import { 
  Settings, 
  Grid3X3, 
  Heart, 
  Bookmark, 
  Share2,
  Camera,
  MapPin,
  Calendar,
  Link2,
  Edit3,
  UserPlus,
  MessageCircle,
  Award,
  ShieldCheck,
  MoreHorizontal,
  ImagePlus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUserStore } from '@/lib/stores/user-store'
import { useAppStore } from '@/lib/stores/app-store'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

// Types
interface GalleryItem {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail: string
  likes: number
}

// Mock gallery data
const mockGallery: GalleryItem[] = [
  { id: '1', type: 'image', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', likes: 234 },
  { id: '2', type: 'image', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200', likes: 567 },
  { id: '3', type: 'image', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400', thumbnail: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200', likes: 123 },
  { id: '4', type: 'image', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400', thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200', likes: 890 },
  { id: '5', type: 'image', url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400', thumbnail: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=200', likes: 456 },
  { id: '6', type: 'image', url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400', thumbnail: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=200', likes: 678 },
]

export default function ZoolProfile() {
  const { isRTL, t } = useLanguage()
  const { currentUser, followers, following } = useUserStore()
  const { setSettingsOpen, triggerGift } = useAppStore()
  const [activeTab, setActiveTab] = React.useState('posts')
  const [selectedImage, setSelectedImage] = React.useState<GalleryItem | null>(null)

  const stats = [
    { label: isRTL ? 'المنشورات' : 'Posts', value: mockGallery.length },
    { label: isRTL ? 'المتابعين' : 'Followers', value: followers.length || 1234 },
    { label: isRTL ? 'يتابع' : 'Following', value: following.length || 567 },
    { label: isRTL ? 'نقاط زول' : 'Zool Points', value: currentUser?.zoolPoints || 2500 },
  ]

  // Format numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  // Lightbox for images
  if (selectedImage) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        onClick={() => setSelectedImage(null)}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white hover:bg-white/20"
          onClick={() => setSelectedImage(null)}
        >
          <MoreHorizontal className="h-6 w-6 rotate-90" />
        </Button>
        <Image
          src={selectedImage.url}
          alt="Gallery image"
          width={600}
          height={600}
          className="max-w-full max-h-full object-contain"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white">
          <Button variant="ghost" className="text-white hover:bg-white/20 gap-2">
            <Heart className="h-5 w-5" />
            {formatNumber(selectedImage.likes)}
          </Button>
          <Button variant="ghost" className="text-white hover:bg-white/20">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1">
        {/* Cover Photo */}
        <div className="relative h-40 bg-gradient-to-br from-primary via-primary/80 to-accent">
          {currentUser?.coverPhoto && (
            <Image
              src={currentUser.coverPhoto}
              alt="Cover"
              fill
              className="object-cover"
            />
          )}
          
          {/* Settings Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'absolute top-3 bg-background/30 backdrop-blur-sm hover:bg-background/50',
              isRTL ? 'left-3' : 'right-3'
            )}
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="h-5 w-5 text-white" />
          </Button>

          {/* Edit Cover Button */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'absolute bottom-3 bg-background/30 backdrop-blur-sm hover:bg-background/50 text-white gap-1.5',
              isRTL ? 'left-3' : 'right-3'
            )}
          >
            <Camera className="h-4 w-4" />
            <span className="text-xs">{isRTL ? 'تغيير' : 'Edit'}</span>
          </Button>
        </div>

        {/* Profile Header */}
        <div className="relative px-4 pb-4">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4 flex justify-center">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                  {currentUser?.name?.[0] || 'Z'}
                </AvatarFallback>
              </Avatar>
              
              {/* Verified Badge */}
              {currentUser?.isVerified && (
                <div className="absolute bottom-2 right-2 p-1 rounded-full bg-primary">
                  <ShieldCheck className="h-4 w-4 text-primary-foreground" />
                </div>
              )}

              {/* Edit Avatar Button */}
              <Button
                variant="secondary"
                size="icon"
                className="absolute bottom-0 left-0 h-8 w-8 rounded-full shadow-md"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Name & Bio */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h1 className={cn('text-2xl font-bold', isRTL && 'font-arabic')}>
                {isRTL ? currentUser?.nameAr : currentUser?.name || (isRTL ? 'زول' : 'Zooli User')}
              </h1>
              {currentUser?.isVerified && (
                <Badge className="bg-primary/10 text-primary border-0">
                  <ShieldCheck className="h-3 w-3 me-1" />
                  {isRTL ? 'موثق' : 'Verified'}
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground text-sm">@{currentUser?.username || 'zooli_user'}</p>

            {currentUser?.bio && (
              <p className={cn(
                'text-sm max-w-xs mx-auto',
                isRTL && 'font-arabic'
              )}>
                {isRTL ? currentUser.bioAr : currentUser.bio}
              </p>
            )}

            {/* Location & Joined */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              {currentUser?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {isRTL ? 'الخرطوم، السودان' : 'Khartoum, Sudan'}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {isRTL ? 'انضم في 2024' : 'Joined 2024'}
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-2 mt-6 p-3 rounded-xl bg-secondary/50">
            {stats.map((stat, idx) => (
              <button
                key={idx}
                className="flex flex-col items-center gap-0.5 hover:bg-secondary rounded-lg p-2 transition-colors"
              >
                <span className="text-lg font-bold text-primary">
                  {formatNumber(stat.value)}
                </span>
                <span className={cn('text-[10px] text-muted-foreground', isRTL && 'font-arabic')}>
                  {stat.label}
                </span>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <Button 
              className="flex-1 gap-2" 
              variant="outline"
              onClick={() => setSettingsOpen(true)}
            >
              <Edit3 className="h-4 w-4" />
              {isRTL ? 'تعديل الملف' : 'Edit Profile'}
            </Button>
            <Button 
              className="flex-1 gap-2 bg-primary hover:bg-primary/90"
              onClick={() => triggerGift('jabana', currentUser?.name || 'User')}
            >
              <Award className="h-4 w-4" />
              {isRTL ? 'إرسال هدية' : 'Send Gift'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                <DropdownMenuItem className={cn(isRTL && 'font-arabic')}>
                  <Share2 className="h-4 w-4 me-2" />
                  {isRTL ? 'مشاركة الملف' : 'Share Profile'}
                </DropdownMenuItem>
                <DropdownMenuItem className={cn(isRTL && 'font-arabic')}>
                  <Link2 className="h-4 w-4 me-2" />
                  {isRTL ? 'نسخ الرابط' : 'Copy Link'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="w-full justify-around rounded-none border-b bg-transparent h-12">
            <TabsTrigger 
              value="posts" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Grid3X3 className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="likes" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Heart className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="saved" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Bookmark className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            {mockGallery.length > 0 ? (
              <div className="grid grid-cols-3 gap-0.5">
                {mockGallery.map((item) => (
                  <button
                    key={item.id}
                    className="relative aspect-square bg-secondary overflow-hidden hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedImage(item)}
                  >
                    <Image
                      src={item.thumbnail}
                      alt="Gallery item"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="flex items-center gap-1 text-white text-sm font-medium">
                        <Heart className="h-4 w-4 fill-white" />
                        {formatNumber(item.likes)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={ImagePlus}
                title={isRTL ? 'لا توجد منشورات' : 'No Posts Yet'}
                description={isRTL ? 'شارك أول صورة لك!' : 'Share your first photo!'}
              />
            )}
          </TabsContent>

          <TabsContent value="likes" className="mt-0">
            <EmptyState 
              icon={Heart}
              title={isRTL ? 'لا توجد إعجابات' : 'No Likes Yet'}
              description={isRTL ? 'المنشورات التي أعجبتك ستظهر هنا' : 'Posts you like will appear here'}
            />
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            <EmptyState 
              icon={Bookmark}
              title={isRTL ? 'لا توجد محفوظات' : 'No Saved Items'}
              description={isRTL ? 'احفظ المنشورات للرجوع إليها لاحقاً' : 'Save posts to view them later'}
            />
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  )
}

// Empty State Component
function EmptyState({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType
  title: string
  description: string 
}) {
  const { isRTL } = useLanguage()
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-4 rounded-full bg-secondary mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className={cn('font-semibold text-lg', isRTL && 'font-arabic')}>{title}</h3>
      <p className={cn('text-sm text-muted-foreground mt-1', isRTL && 'font-arabic')}>{description}</p>
    </div>
  )
}
