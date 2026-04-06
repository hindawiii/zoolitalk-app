'use client'

import * as React from 'react'
import Image from 'next/image'
import { 
  TrendingUp, 
  Cloud, 
  Globe, 
  Dribbble,
  DollarSign,
  ExternalLink,
  RefreshCw,
  ChevronLeft,
  Share2,
  Bookmark,
  Sun,
  CloudRain,
  Wind,
  Banknote,
  Calculator,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

interface CurrencyRate {
  code: string
  nameEn: string
  nameAr: string
  buyRate: number
  sellRate: number
  change24h: number
}

interface WeatherData {
  city: string
  cityAr: string
  temp: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'windy'
  humidity: number
}

// News Articles Array - Ready for RSS feed integration
// To connect to a real RSS feed, replace this array with fetched data
// Suggested RSS sources: Sudan Tribune, SUNA News, Al Rakoba
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

// Sudanese Currency Rates (against SDG - Sudanese Pound)
// These rates can be connected to a real API like Bankak or parallel market sources
const mockCurrencyRates: CurrencyRate[] = [
  { code: 'USD', nameEn: 'US Dollar', nameAr: 'دولار أمريكي', buyRate: 601.50, sellRate: 605.00, change24h: 0.85 },
  { code: 'SAR', nameEn: 'Saudi Riyal', nameAr: 'ريال سعودي', buyRate: 160.25, sellRate: 161.50, change24h: -0.32 },
  { code: 'AED', nameEn: 'UAE Dirham', nameAr: 'درهم إماراتي', buyRate: 163.75, sellRate: 165.00, change24h: 0.45 },
]

// Weather data - can be connected to OpenWeatherMap API or similar
// Default to Port Sudan for coastal Sudan weather
const mockWeather: WeatherData = {
  city: 'Port Sudan',
  cityAr: 'بورتسودان',
  temp: 34,
  condition: 'sunny',
  humidity: 65,
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
  
  // Currency Calculator state
  const [calcAmount, setCalcAmount] = React.useState<string>('100')
  const [calcCurrency, setCalcCurrency] = React.useState<string>('USD')
  
  // Get selected currency rate
  const selectedRate = mockCurrencyRates.find(r => r.code === calcCurrency)
  const amount = parseFloat(calcAmount) || 0
  
  // Calculate SDG amounts (buyRate = Bankak official, sellRate = Parallel market approximation)
  const bankakResult = amount * (selectedRate?.buyRate || 0)
  const parallelResult = amount * (selectedRate?.sellRate || 0)

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
    <div className="flex flex-col min-h-full bg-background overflow-y-auto">
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
          {/* Quick Currency Calculator */}
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <CardHeader className="pb-3">
              <CardTitle className={cn('text-base flex items-center gap-2', isRTL && 'font-arabic')}>
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Calculator className="h-4 w-4 text-primary" />
                </div>
                {isRTL ? 'حاسبة العملات السريعة' : 'Quick Currency Calculator'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Input Row */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder={isRTL ? 'المبلغ' : 'Amount'}
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(e.target.value)}
                    className="text-lg font-semibold h-12 bg-secondary/50 border-border/50"
                  />
                </div>
                <Select value={calcCurrency} onValueChange={setCalcCurrency}>
                  <SelectTrigger className="w-[100px] h-12 bg-secondary/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCurrencyRates.map((rate) => (
                      <SelectItem key={rate.code} value={rate.code}>
                        <span className="font-medium">{rate.code}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Arrow indicator */}
              <div className="flex justify-center">
                <div className="p-2 rounded-full bg-accent/20">
                  <ArrowRight className={cn('h-4 w-4 text-accent', isRTL && 'rotate-180')} />
                </div>
              </div>
              
              {/* Results */}
              <div className="grid grid-cols-2 gap-3">
                {/* Bankak Rate */}
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <p className={cn('text-xs text-muted-foreground mb-1', isRTL && 'font-arabic')}>
                    {isRTL ? 'سعر بنكك' : 'Bankak Rate'}
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {bankakResult.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </p>
                  <p className={cn('text-xs text-muted-foreground', isRTL && 'font-arabic')}>
                    {isRTL ? 'جنيه سوداني' : 'SDG'}
                  </p>
                </div>
                
                {/* Parallel Market Rate */}
                <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                  <p className={cn('text-xs text-muted-foreground mb-1', isRTL && 'font-arabic')}>
                    {isRTL ? 'السوق الموازي' : 'Parallel Market'}
                  </p>
                  <p className="text-xl font-bold text-accent">
                    {parallelResult.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </p>
                  <p className={cn('text-xs text-muted-foreground', isRTL && 'font-arabic')}>
                    {isRTL ? 'جنيه سوداني' : 'SDG'}
                  </p>
                </div>
              </div>
              
              {/* Rate info */}
              <p className={cn('text-xs text-center text-muted-foreground', isRTL && 'font-arabic')}>
                {isRTL 
                  ? `1 ${calcCurrency} = ${selectedRate?.buyRate.toFixed(2)} (بنكك) / ${selectedRate?.sellRate.toFixed(2)} (موازي) SDG`
                  : `1 ${calcCurrency} = ${selectedRate?.buyRate.toFixed(2)} (Bankak) / ${selectedRate?.sellRate.toFixed(2)} (Parallel) SDG`
                }
              </p>
            </CardContent>
          </Card>

          {/* Sudanese Currency Rates */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className={cn('text-sm flex items-center gap-2', isRTL && 'font-arabic')}>
                  <Banknote className="h-4 w-4 text-accent" />
                  {isRTL ? 'أسعار العملات مقابل الجنيه' : 'Currency Rates (SDG)'}
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  {isRTL ? 'المصدر: بنكك / السوق الموازي' : 'Source: Bankak / Parallel Market'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {mockCurrencyRates.map((currency) => (
                  <div 
                    key={currency.code}
                    className="flex-shrink-0 p-3 rounded-lg bg-secondary/50 min-w-[140px]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{currency.code}</span>
                      <span className={cn(
                        'text-xs font-medium',
                        currency.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                      )}>
                        {currency.change24h >= 0 ? '+' : ''}{currency.change24h.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>{isRTL ? 'شراء:' : 'Buy:'}</span>
                        <span className="font-medium text-foreground">{currency.buyRate.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isRTL ? 'بيع:' : 'Sell:'}</span>
                        <span className="font-medium text-foreground">{currency.sellRate.toFixed(2)}</span>
                      </div>
                    </div>
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
