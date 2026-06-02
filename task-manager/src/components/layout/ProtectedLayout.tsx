'use client'

import React from 'react'
import { Navbar } from './Navbar'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth()

  // Если состояние сессии еще загружается, показываем аккуратный скелетон/лоадер
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-md">
          <span className="material-symbols-outlined animate-spin text-primary text-3xl">sync</span>
          <p className="text-on-surface-variant font-label-md">Loading workspace...</p>
        </div>
      </div>
    )
  }

  // Если пользователя нет, middleware перенаправит на /login, 
  // но на всякий случай страхуемся пустой разметкой
  if (!user) return null

  return (
    <div className="flex h-screen overflow-hidden bg-surface font-body-md text-on-surface antialiased">
      {/* Левая панель: Сайдбар-навигация */}
      <Navbar />

      {/* Правая часть: Верхняя шапка + Область контента */}
      <div className="flex-grow md:ml-64 flex flex-col min-w-0 bg-surface overflow-hidden">
        
        {/* TopAppBar Component (Верхняя шапка из твоих HTML-шаблонов) */}
        <header className="w-full h-16 sticky top-0 backdrop-blur-xl bg-surface/80 dark:bg-surface-dim/80 shadow-sm flex items-center justify-between px-lg py-sm z-30 flex-shrink-0">
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-primary">terminal</span>
            <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">
              TaskEngine
            </h1>
          </div>
          
          <div className="flex items-center gap-lg">
            {/* Глобальный поиск */}
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-body-md">
                search
              </span>
              <input
                className="pl-10 pr-md py-xs bg-surface-container-low border border-outline-variant/30 rounded-full text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all w-64 text-on-surface"
                placeholder="Global search..."
                type="text"
              />
            </div>
            
            {/* Круглый аватар текущего пользователя */}
            <div className="w-10 h-10 rounded-full border-2 border-primary-container bg-primary-container flex items-center justify-center text-on-primary-container font-bold cursor-pointer hover:opacity-90 active:scale-95 transition-all">
              {user.display_name?.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Центральный Canvas для контента страниц */}
        <main className="flex-grow overflow-y-auto bg-surface flex flex-col">
          <div className="flex-grow p-lg">
            {children}
          </div>

          {/* Общий подвал (Footer) */}
          <footer className="w-full py-lg mt-auto border-t border-outline-variant/20 flex flex-col md:flex-row items-center justify-between px-xl max-w-container-max mx-auto flex-shrink-0 bg-surface">
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              © 2026 TaskEngine Systems
            </p>
            <div className="flex gap-lg mt-md md:mt-0">
              <a className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant hover:text-on-surface transition-opacity hover:underline" href="#">Privacy Policy</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant hover:text-on-surface transition-opacity hover:underline" href="#">Terms of Service</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant hover:text-on-surface transition-opacity hover:underline" href="#">Help Center</a>
            </div>
          </footer>
        </main>

      </div>
    </div>
  )
}