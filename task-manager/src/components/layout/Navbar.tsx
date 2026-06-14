'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import styles from './Navbar.module.css'

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth()
  const pathname = usePathname()

  const getLinkClass = (path: string) => {
    const isActive = pathname.startsWith(path)
    return `${styles.link} ${isActive ? styles.linkActive : ''}`
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <span className="material-symbols-outlined text-primary text-3xl">terminal</span>
        <span className={styles.logoText}>Workspace</span>
      </div>

      <nav className={styles.navigation}>
        <Link href="/tasks" className={getLinkClass('/tasks')}>
          <span className="material-symbols-outlined">task_alt</span>
          <span>Tasks</span>
        </Link>

        {isAdmin && (
          <Link href="/admin" className={getLinkClass('/admin')}>
            <span className="material-symbols-outlined">groups</span>
            <span>Team</span>
          </Link>
        )}

        <Link href="/settings" className={getLinkClass('/settings')}>
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </Link>
      </nav>

      <div className={styles.footer}>
        <div className={styles.profileCard}>
          <div className={styles.avatar}>
            {user?.display_name?.substring(0, 2).toUpperCase() || 'US'}
          </div>
          <div className={styles.profileInfo}>
            <p className={styles.name}>
              {user?.display_name || 'Loading...'}
            </p>
            <p className={styles.role}>
              {user?.role === 'admin' ? 'Super Admin' : 'Member'}
            </p>
          </div>
        </div>

        <button onClick={logout} className={styles.logoutBtn}>
          <span className="material-symbols-outlined text-[16px]">logout</span>
          Logout
        </button>
      </div>
    </aside>
  )
}