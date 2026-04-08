'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChatList } from './chat-list'
import { ChatView } from './chat-view'
import { useChatStore } from '@/lib/stores/chat-store'

export default function AlWansa() {
  const { activeChatId, setActiveChatId } = useChatStore()

  return (
    <div className="h-full flex flex-col w-full max-w-full overflow-x-hidden">
      <AnimatePresence mode="wait">
        {activeChatId ? (
          <motion.div
            key="chat-view"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="h-full w-full max-w-full"
          >
            <ChatView onBack={() => setActiveChatId(null)} />
          </motion.div>
        ) : (
          <motion.div
            key="chat-list"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="h-full w-full max-w-full"
          >
            <ChatList />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
