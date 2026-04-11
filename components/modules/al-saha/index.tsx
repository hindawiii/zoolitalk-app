'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { FeedTab } from './tabs/feed-tab'
import { TrendsTab } from './tabs/trends-tab'
import { CinemaTab } from './tabs/cinema-tab'
import { RadarTab } from './tabs/radar-tab'

type TabId = 'feed' | 'trends' | 'cinema' | 'radar'

interface Tab {
  id: TabId
  label: string
}

const tabs: Tab[] = [
  { id: 'feed', label: 'الخلاصة' },
  { id: 'trends', label: 'نبض الشارع' },
  { id: 'cinema', label: 'سينما الراكوبة' },
  { id: 'radar', label: 'رادار الراكوبة' },
]

export default function AlSaha() {
  const [activeTab, setActiveTab] = React.useState<TabId>('feed')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feed':
        return <FeedTab />
      case 'trends':
        return <TrendsTab />
      case 'cinema':
        return <CinemaTab />
      case 'radar':
        return <RadarTab />
      default:
        return <FeedTab />
    }
  }

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-x-hidden bg-[#F5F5DC] dark:bg-background">
      {/* Sticky Header with Tabs */}
      <div className="sticky top-0 z-30 bg-[#2D5A27] shadow-md">
        {/* App Title */}
        <div className="px-4 py-3 border-b border-[#1a3a18]">
          <h1 className="text-xl font-bold text-white font-arabic text-center">
            الساحة
          </h1>
        </div>
        
        {/* Tab Navigation */}
        <div className="relative">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative flex-1 min-w-[90px] px-4 py-3 text-sm font-medium font-arabic transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-white/70 hover:text-white/90'
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-white rounded-t-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
