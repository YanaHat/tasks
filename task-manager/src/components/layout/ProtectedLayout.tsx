'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Navbar } from './Navbar'
import { useAuth } from '@/hooks/useAuth'
import styles from './ProtectedLayout.module.css'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (searchQuery) {
        params.set('search', searchQuery)
      } else {
        params.delete('search')
      }

      if (pathname === '/tasks') {
        router.push(`${pathname}?${params.toString()}`)
      } else if (searchQuery) {
        router.push(`/tasks?${params.toString()}`)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery, pathname, router, searchParams])

  if (loading) {
    return (
      <div className={styles.loaderScreen}>
        <div className={styles.loaderContent}>
          <span className={`material-symbols-outlined ${styles.spinner}`}>sync</span>
          <p className={styles.loaderText}>Loading workspace...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className={styles.layout}>
      <Navbar />

      <div className={styles.mainWrapper}>
        
        <header className={styles.header}>
          <div className={styles.brand}>
            <span className="material-symbols-outlined text-primary">terminal</span>
            <h1 className={styles.brandTitle}>TaskEngine</h1>
          </div>
          
          <div className={styles.actions}>
            <div className={styles.searchBar}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>
              search
            </span>
            <input
              className={styles.searchInput}
              placeholder="Search tasks..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
            
            <div className={styles.avatar}>
              {user.display_name?.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        <main className={styles.mainCanvas}>
          <div className={styles.contentRow}>
            {children}
          </div>

          <footer className={styles.footer}>
            <p className={styles.copyright}>
              © 2026 TaskEngine Systems
            </p>
            <div className={styles.footerLinks}>
              <a className={styles.footerLink} href="#">Privacy Policy</a>
              <a className={styles.footerLink} href="#">Terms of Service</a>
              <a className={styles.footerLink} href="#">Help Center</a>
            </div>
          </footer>
        </main>

      </div>
    </div>
  )
}