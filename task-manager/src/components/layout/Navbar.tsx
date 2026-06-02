'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth()
  const pathname = usePathname()

  // Хелпер для определения активной ссылки в меню
  const linkClass = (path: string) => {
    const baseClass =
      'flex items-center gap-md px-md py-sm rounded-lg transition-all duration-200 cursor-pointer active:opacity-80 font-label-md text-label-md'
    const isActive = pathname.startsWith(path)

    return isActive
      ? `${baseClass} bg-secondary-container dark:bg-on-secondary-fixed-variant text-on-secondary-container dark:text-on-primary-container font-semibold`
      : `${baseClass} text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-highest dark:hover:bg-surface-variant`
  }

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant/30 z-40 hidden md:flex flex-col gap-base p-md select-none">
      {/* Логотип и Название Воркспейса */}
      <div className="flex items-center gap-sm mb-xl px-md">
        <span className="material-symbols-outlined text-primary text-3xl">terminal</span>
        <span className="font-headline-lg text-headline-lg text-on-surface font-bold">Workspace</span>
      </div>

      {/* Ссылки Навигации */}
      <nav className="flex flex-col gap-sm flex-grow">
        <Link href="/tasks" className={linkClass('/tasks')}>
          <span className="material-symbols-outlined">task_alt</span>
          <span>Tasks</span>
        </Link>

        {/* Ссылка на админку отображается СТРОГО если роль пользователя — admin */}
        {isAdmin && (
          <Link href="/admin" className={linkClass('/admin')}>
            <span className="material-symbols-outlined">groups</span>
            <span>Team</span>
          </Link>
        )}

        <Link href="/settings" className={linkClass('/settings')}>
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </Link>
      </nav>

      {/* Нижний блок: Текущий пользователь и кнопка Выхода */}
      <div className="mt-auto p-md border-t border-outline-variant/20 flex flex-col gap-md">
        <div className="flex items-center gap-md overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold flex-shrink-0">
            {user?.display_name?.substring(0, 2).toUpperCase() || 'US'}
          </div>
          <div className="overflow-hidden">
            <p className="font-label-md text-label-md font-bold truncate text-on-surface">
              {user?.display_name || 'Loading...'}
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider truncate">
              {user?.role === 'admin' ? 'Super Admin' : 'Member'}
            </p>
          </div>
        </div>

        {/* Кнопка выхода из аккаунта */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-xs px-md py-xs bg-error-container/20 border border-error/30 text-error rounded-lg font-label-sm text-label-sm hover:bg-error-container/40 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          Logout
        </button>
      </div>
    </aside>
  )
}