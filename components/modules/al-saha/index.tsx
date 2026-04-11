'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FeedTab } from './tabs/feed-tab'
import { TrendsTab } from './tabs/trends-tab'
import { RadarTab } from './tabs/radar-tab'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

type SegmentId = 'feed' | 'trends'

interface Segment {
  id: SegmentId
  label: string
}

const segments: Segment[] = [
  { id: 'feed', label: 'الساحة' },
  { id: 'trends', label: 'نبض الشارع' },
]

export default function AlSaha() {
  const [activeSegment, setActiveSegment] = React.useState<SegmentId>('feed')
  const [showRadar, setShowRadar] = React.useState(false)

  const renderSegmentContent = () => {
    switch (activeSegment) {
      case 'feed':
        return <FeedTab />
      case 'trends':
        return <TrendsTab />
      default:
        return <FeedTab />
    }
  }

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-x-hidden bg-[#F5F5DC] dark:bg-background">
      {/* Sticky Header with Segmented Control */}
      <div className="sticky top-0 z-30 bg-[#2D5A27] shadow-md">
        {/* Title Bar with Radar Button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a3a18]">
          <h1 className="text-xl font-bold text-white font-arabic">
            الساحة
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowRadar(true)}
            className="text-white hover:bg-white/10"
            aria-label="رادار الراكوبة"
          >
            <Radar className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Segmented Control */}
        <div className="px-4 py-2">
          <div className="relative flex bg-[#1a3a18]/50 rounded-xl p-1">
            {/* Sliding Background */}
            <motion.div
              layout
              className="absolute top-1 bottom-1 bg-white rounded-lg"
              style={{
                width: `calc(50% - 4px)`,
                left: activeSegment === 'feed' ? '4px' : 'calc(50%)',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
            
            {/* Segment Buttons */}
            {segments.map((segment) => (
              <button
                key={segment.id}
                onClick={() => setActiveSegment(segment.id)}
                className={cn(
                  'relative z-10 flex-1 py-2 text-sm font-bold font-arabic transition-colors rounded-lg',
                  activeSegment === segment.id
                    ? 'text-[#2D5A27]'
                    : 'text-white/80 hover:text-white'
                )}
              >
                {segment.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Segment Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSegment}
            initial={{ opacity: 0, x: activeSegment === 'feed' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeSegment === 'feed' ? 20 : -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderSegmentContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Radar Sheet */}
      <Sheet open={showRadar} onOpenChange={setShowRadar}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl p-0">
          <SheetHeader className="sticky top-0 z-10 bg-[#2D5A27] px-4 py-3 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Radar className="h-5 w-5 text-white" />
              <SheetTitle className="font-arabic text-white text-lg">
                رادار الراكوبة
              </SheetTitle>
            </div>
          </SheetHeader>
          <div className="h-[calc(100%-60px)] overflow-hidden">
            <RadarTab />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
