'use client'

import * as React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings } from 'lucide-react'
import { BottomNavigation } from './bottom-navigation'
import { SettingsDrawer } from './settings-drawer'
import { useAppStore, type TabId } from '@/lib/stores/app-store'
import { useLanguage } from '@/components/providers/language-provider'
import { Button } from '@/components/ui/button'
import { RakobaLogo } from '@/components/ui/rakoba-logo'
import { cn } from '@/lib/utils'

// Map URL tab params to TabIds
const tabParamMap: Record<string, TabId> = {
  wansa: 'wansa',
  saha: 'saha',
  souq: 'souq',
  news: 'news',
  profile: 'profile',
}

// Lazy load module components
const AlWansa = React.lazy(() => import('@/components/modules/al-wansa'))
const AlSaha = React.lazy(() => import('@/components/modules/al-saha'))
const SouqAlJumaa = React.lazy(() => import('@/components/modules/souq-al-jumaa'))
const ZooliNews = React.lazy(() => import('@/components/modules/zooli-news'))
const ZoolProfile = React.lazy(() => import('@/components/modules/zool-profile'))

// Map tabs to components
const tabComponents: Record<TabId, React.LazyExoticComponent<React.ComponentType>> = {
  wansa: AlWansa,
  saha: AlSaha,
  souq: SouqAlJumaa,
  news: ZooliNews,
  profile: ZoolProfile,
}

// Loading fallback with Rakoba spinner
function RakobaLoader() {
  const { isRTL } = useLanguage()
  
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="animate-pulse">
        <RakobaLogo size="lg" />
      </div>
      <p className={cn('text-sm text-muted-foreground', isRTL && 'font-arabic')}>
        {isRTL ? 'جاري التحميل...' : 'Loading...'}
      </p>
    </div>
  )
}

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  enter: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export function AppShell() {
  const { activeTab, setActiveTab, setSettingsOpen } = useAppStore()
  const { t, isRTL } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Sync tab from URL on mount
  React.useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && tabParamMap[tabParam] && tabParamMap[tabParam] !== activeTab) {
      setActiveTab(tabParamMap[tabParam])
    }
  }, [searchParams, setActiveTab, activeTab])
  
  // Update URL when tab changes
  React.useEffect(() => {
    const currentTabParam = searchParams.get('tab')
    if (currentTabParam !== activeTab) {
      const newUrl = `?tab=${activeTab}`
      router.replace(newUrl, { scroll: false })
    }
  }, [activeTab, searchParams, router])
  
  const ActiveModule = tabComponents[activeTab]

  return (
    <div className="relative flex flex-col min-h-dvh bg-background w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-card/80 backdrop-blur-md border-b w-full max-w-full">
        <div className="flex items-center gap-2">
          <RakobaLogo size="sm" />
          <h1 className={cn(
            'text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent',
            isRTL && 'font-arabic'
          )}>
            {t('app.name')}
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSettingsOpen(true)}
          aria-label={t('settings.title')}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden content-area w-full max-w-full box-border">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="min-h-full w-full max-w-full overflow-x-hidden box-border"
          >
            <React.Suspense fallback={<RakobaLoader />}>
              <ActiveModule />
            </React.Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Settings Drawer */}
      <SettingsDrawer />
    </div>
  )
}
