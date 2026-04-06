'use client'

import * as React from 'react'
import Image from 'next/image'
import { 
  TrendingUp, 
  Cloud, 
  Bitcoin, 
  Globe, 
  Dribbble,
  DollarSign,
  ExternalLink,
  RefreshCw,
  ChevronLeft,
  X,
  Share2,
  Bookmark,
  Sun,
  CloudRain,
  Wind
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/components/providers/language-provider'
import { cn } from '@/lib/utils'

// Types
interface NewsArticle {
  id: string
  title: string
  titleAr: string
  summary: string
  summaryAr: string
  content: string
  contentAr: string
  image: string
  source: string
  sourceAr: string
  category: NewsCategory
  publishedAt: Date
  url: string
}

type NewsCategory = 'sudan' | 'sports' | 'economy' | 'world'

interface CryptoPrice {
  symbol: string
  name: string
  price: number
  change24h: number
}

interface WeatherData {
  city: string
  cityAr: string
  temp: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'windy'
  humidity: number
}

// Mock Data
const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Sudan Peace Talks Progress in Jeddah',
    titleAr: 'تقدم مباحثات السلام السودانية في جدة',
    summary: 'International mediators report significant progress in the latest round of peace negotiations.',
    summaryAr: 'أفاد الوسطاء الدوليون بتحقيق تقدم كبير في الجولة الأخيرة من مفاوضات السلام.',
    content: 'Full article content here...',
    contentAr: 'محتوى المقال الكامل هنا...',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800',
    source: 'Sudan Tribune',
    sourceAr: 'سودان تريبيون',
    category: 'sudan',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    url: 'https://example.com/article1',
  },
  {
    id: '2',
    title: 'Al Hilal Wins Championship Title',
    titleAr: 'الهلال يفوز بلقب البطولة',
    summary: 'Al Hilal FC secures another league championship with dominant performance.',
    summaryAr: 'نادي الهلال يحرز لقب الدوري مجدداً بأداء مميز.',
    content: 'Full article content here...',
    contentAr: 'محتوى المقال الكامل هنا...',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    source: 'Sudan Sports',
    sourceAr: 'سودان سبورت',
    category: 'sports',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    url: 'https://example.com/article2',
  },
  {
    id: '3',
    title: 'Central Bank Announces New Economic Measures',
    titleAr: 'البنك المركزي يعلن عن إجراءات اقتصادية جديدة',
    summary: 'New policies aim to stabilize the Sudanese Pound and boost foreign investment.',
    summaryAr: 'السياسات الجديدة تهدف لتحقيق استقرار الجنيه السوداني وجذب الاستثمار الأجنبي.',
    content: 'Full article content here...',
    contentAr: 'محتوى المقال الكامل هنا...',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    source: 'Sudan Economy',
    sourceAr: 'اقتصاد السودان',
    category: 'economy',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    url: 'https://example.com/article3',
  },
  {
    id: '4',
    title: 'UN General Assembly Discusses Regional Stability',
    titleAr: 'الجمعية العامة للأمم المتحدة تناقش الاستقرار الإقليمي',
    summary: 'World leaders gather to address humanitarian and security challenges.',
    summaryAr: 'قادة العالم يجتمعون لمعالجة التحديات الإنسانية والأمنية.',
    content: 'Full article content here...',
    contentAr: 'محتوى المقال الكامل هنا...',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    source: 'World News',
    sourceAr: 'أخبار العالم',
    category: 'world',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    url: 'https://example.com/article4',
  },
]

const mockCrypto: CryptoPrice[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67234.50, change24h: 2.34 },
  { symbol: 'ETH', name: 'Ethereum', price: 3456.78, change24h: -1.23 },
  { symbol: 'BNB', name: 'BNB', price: 567.89, change24h: 0.89 },
  { symbol: 'SOL', name: 'Solana', price: 145.67, change24h: 5.67 },
]

const mockWeather: WeatherData = {
  city: 'Khartoum',
  cityAr: 'الخرطوم',
  temp: 38,
  condition: 'sunny',
  humidity: 25,
}

// Category config
const categoryConfig: Record<NewsCategory, { icon: React.ElementType; labelEn: string; labelAr: string }> = {
  sudan: { icon: Globe, labelEn: 'Sudan', labelAr: 'السودان' },
  sports: { icon: Dribbble, labelEn: 'Sports', labelAr: 'رياضة' },
  economy: { icon: TrendingUp, labelEn: 'Economy', labelAr: 'اقتصاد' },
  world: { icon: Globe, labelEn: 'World', labelAr: 'العالم' },
}

export default function ZooliNews() {
  const { isRTL, t } = useLanguage()
  const [activeCategory, setActiveCategory] = React.useState<NewsCategory | 'all'>('all')
  const [selectedArticle, setSelectedArticle] = React.useState<NewsArticle | null>(null)
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const filteredNews = activeCategory === 'all' 
    ? mockNews 
    : mockNews.filter(n => n.category === activeCategory)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60))
    if (hours < 1) return isRTL ? 'الآن' : 'Just now'
    if (hours < 24) return isRTL ? `منذ ${hours} ساعة` : `${hours}h ago`
    return isRTL ? `منذ ${Math.floor(hours / 24)} يوم` : `${Math.floor(hours / 24)}d ago`
  }

  const getWeatherIcon = (condition: WeatherData['condition']) => {
    switch (condition) {
      case 'sunny': return Sun
      case 'rainy': return CloudRain
      case 'windy': return Wind
      default: return Cloud
    }
  }

  const WeatherIcon = getWeatherIcon(mockWeather.condition)

  // Article Detail View
  if (selectedArticle) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setSelectedArticle(null)}>
            {isRTL ? <ChevronLeft className="h-5 w-5 rotate-180" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1">
          {/* Article Image */}
          <div className="relative aspect-video bg-secondary">
            <Image
              src={selectedArticle.image}
              alt={isRTL ? selectedArticle.titleAr : selectedArticle.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-4 space-y-4">
            {/* Source & Time */}
            <div className="flex items-center justify-between">
              <Badge variant="secondary">
                {isRTL ? selectedArticle.sourceAr : selectedArticle.source}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatTimeAgo(selectedArticle.publishedAt)}
              </span>
            </div>

            {/* Title */}
            <h1 className={cn(
              'text-2xl font-bold leading-tight',
              isRTL && 'font-arabic'
            )}>
              {isRTL ? selectedArticle.titleAr : selectedArticle.title}
            </h1>

            {/* Content */}
            <p className={cn(
              'text-muted-foreground leading-relaxed',
              isRTL && 'font-arabic'
            )}>
              {isRTL ? selectedArticle.summaryAr : selectedArticle.summary}
            </p>

            <Separator />

            <p className={cn(
              'leading-relaxed',
              isRTL && 'font-arabic'
            )}>
              {isRTL ? selectedArticle.contentAr : selectedArticle.content}
            </p>

            {/* Read More */}
            <Button variant="outline" className="w-full gap-2" asChild>
              <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                {isRTL ? 'اقرأ المقال كاملاً' : 'Read Full Article'}
              </a>
            </Button>
          </div>
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h1 className={cn('text-2xl font-bold', isRTL && 'font-arabic')}>
            {isRTL ? 'زولي نيوز' : 'Zooli News'}
          </h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn('h-5 w-5', isRefreshing && 'animate-spin')} />
          </Button>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as NewsCategory | 'all')}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all" className={cn(isRTL && 'font-arabic')}>
              {isRTL ? 'الكل' : 'All'}
            </TabsTrigger>
            {(Object.keys(categoryConfig) as NewsCategory[]).map((cat) => {
              const config = categoryConfig[cat]
              return (
                <TabsTrigger key={cat} value={cat} className={cn(isRTL && 'font-arabic')}>
                  {isRTL ? config.labelAr : config.labelEn}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Weather Widget */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-accent/20">
                    <WeatherIcon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className={cn('font-semibold', isRTL && 'font-arabic')}>
                      {isRTL ? mockWeather.cityAr : mockWeather.city}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'الرطوبة' : 'Humidity'}: {mockWeather.humidity}%
                    </p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary">
                  {mockWeather.temp}°C
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crypto Ticker */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className={cn('text-sm flex items-center gap-2', isRTL && 'font-arabic')}>
                <Bitcoin className="h-4 w-4 text-accent" />
                {isRTL ? 'أسعار العملات الرقمية' : 'Crypto Prices'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex gap-4 overflow-x-auto pb-2">
                {mockCrypto.map((crypto) => (
                  <div 
                    key={crypto.symbol}
                    className="flex-shrink-0 flex items-center gap-2 p-2 rounded-lg bg-secondary/50"
                  >
                    <span className="font-semibold text-sm">{crypto.symbol}</span>
                    <span className="text-sm">${crypto.price.toLocaleString()}</span>
                    <span className={cn(
                      'text-xs font-medium',
                      crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* News Feed */}
          <div className="space-y-4">
            <h2 className={cn('font-semibold', isRTL && 'font-arabic')}>
              {isRTL ? 'آخر الأخبار' : 'Latest News'}
            </h2>
            
            {filteredNews.map((article, idx) => (
              <Card 
                key={article.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedArticle(article)}
              >
                {idx === 0 ? (
                  // Featured article (first one)
                  <div>
                    <div className="relative aspect-video bg-secondary">
                      <Image
                        src={article.image}
                        alt={isRTL ? article.titleAr : article.title}
                        fill
                        className="object-cover"
                      />
                      <Badge 
                        className="absolute top-3 left-3 bg-primary"
                      >
                        {isRTL ? categoryConfig[article.category].labelAr : categoryConfig[article.category].labelEn}
                      </Badge>
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <h3 className={cn(
                        'font-semibold text-lg line-clamp-2',
                        isRTL && 'font-arabic'
                      )}>
                        {isRTL ? article.titleAr : article.title}
                      </h3>
                      <p className={cn(
                        'text-sm text-muted-foreground line-clamp-2',
                        isRTL && 'font-arabic'
                      )}>
                        {isRTL ? article.summaryAr : article.summary}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{isRTL ? article.sourceAr : article.source}</span>
                        <span>{formatTimeAgo(article.publishedAt)}</span>
                      </div>
                    </CardContent>
                  </div>
                ) : (
                  // Regular article
                  <CardContent className="p-3 flex gap-3">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-secondary shrink-0">
                      <Image
                        src={article.image}
                        alt={isRTL ? article.titleAr : article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Badge variant="secondary" className="text-xs mb-1">
                          {isRTL ? categoryConfig[article.category].labelAr : categoryConfig[article.category].labelEn}
                        </Badge>
                        <h3 className={cn(
                          'font-medium text-sm line-clamp-2',
                          isRTL && 'font-arabic'
                        )}>
                          {isRTL ? article.titleAr : article.title}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{isRTL ? article.sourceAr : article.source}</span>
                        <span>{formatTimeAgo(article.publishedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
