'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChatList } from './chat-list'
import { ChatView } from './chat-view'
import { ChatThemeProvider } from './chat-theme-provider'
import { GamesMenu } from './games-menu'
import { OccasionsHub } from './occasions-hub'
import { ReligiousAssistant } from './religious-assistant'
import { ContactManager } from './contact-manager'
import { DocumentScanner } from './document-scanner'
import { useChatStore } from '@/lib/stores/chat-store'

export default function AlWansa() {
  const { activeChatId, setActiveChatId } = useChatStore()
  const [showGames, setShowGames] = React.useState(false)
  const [showOccasions, setShowOccasions] = React.useState(false)
  const [showReligious, setShowReligious] = React.useState(false)
  const [showContacts, setShowContacts] = React.useState(false)
  const [showScanner, setShowScanner] = React.useState(false)

  const handleStartChat = (contactId: string) => {
    // Find or create chat with contact
    setActiveChatId(`chat-${contactId}`)
    setShowContacts(false)
  }

  const handleScanCapture = (imageData: string) => {
    // Handle scanned document
    console.log('Document scanned:', imageData.slice(0, 100))
    setShowScanner(false)
  }

  return (
    <ChatThemeProvider>
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
              <ChatView 
                onBack={() => setActiveChatId(null)} 
                onOpenGames={() => setShowGames(true)}
              />
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
              <ChatList 
                onOpenSettings={() => {
                  // Could open a settings panel with access to:
                  // - Chat themes
                  // - Occasions
                  // - Religious assistant
                  // - Contacts
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Games Menu Overlay */}
        <GamesMenu 
          isOpen={showGames} 
          onClose={() => setShowGames(false)} 
        />

        {/* Occasions Hub */}
        <OccasionsHub 
          isOpen={showOccasions} 
          onClose={() => setShowOccasions(false)} 
        />

        {/* Religious Assistant */}
        <ReligiousAssistant 
          isOpen={showReligious} 
          onClose={() => setShowReligious(false)} 
        />

        {/* Contact Manager */}
        <ContactManager 
          isOpen={showContacts} 
          onClose={() => setShowContacts(false)}
          onStartChat={handleStartChat}
        />

        {/* Document Scanner */}
        <DocumentScanner
          isOpen={showScanner}
          onClose={() => setShowScanner(false)}
          onCapture={handleScanCapture}
        />
      </div>
    </ChatThemeProvider>
  )
}
