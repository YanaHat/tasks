'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export type AuthUser =
  | { role: 'user'; id: string; display_name: string }
  | { role: 'admin'; id: string; display_name: string }

export function useAuth() {
  const supabase = createClient()
  const router = useRouter()
  
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchUserProfile(userId: string): Promise<AuthUser | null> {
    const defaultUser: AuthUser = {
      id: userId,
      display_name: 'Workspace Member',
      role: 'user',
    }

    try {

      const profileData = await Promise.race([
        supabase
          .from('profiles')
          .select('id, display_name, role')
          .eq('id', userId)
          .maybeSingle(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 1500)
        )
      ]) as any

      const { data: profile, error: dbError } = profileData

      if (dbError || !profile) {
        return defaultUser
      }

      return {
        id: profile.id,
        display_name: profile.display_name,
        role: profile.role as 'user' | 'admin',
      }
    } catch (err) {
      console.warn('--- [useAuth] Запрос профиля завис или упал, используем дефолтный профиль:', err)
      return defaultUser
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id)
          setUser(profile)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('--- [useAuth] Ошибка инициализации сессии:', err)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('--- [useAuth] Событие:', event)

        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id)
          setUser(profile)
          
          const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register'
          
          if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && isAuthPage) {
            window.location.href = '/tasks'
            return
          }
        } else {
          setUser(null)
        }
        
        setLoading(false)
        router.refresh()
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const register = async (email: string, password: string, displayName: string) => {
    setLoading(true)
    setError(null)
    
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return { success: false, error: authError.message }
    }

    return { success: true, data }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return { success: false, error: authError.message }
    }

    setTimeout(() => {
      if (window.location.pathname === '/login') {
        window.location.href = '/tasks'
      }
    }, 500)

    return { success: true, data }
  }

  const logout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setLoading(false)
    window.location.href = '/login'
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
  }
}