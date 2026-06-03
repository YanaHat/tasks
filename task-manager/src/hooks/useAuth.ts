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

  // Функция для получения профиля пользователя по его ID
  async function fetchUserProfile(userId: string): Promise<AuthUser | null> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, display_name, role')
        .eq('id', userId)
        .maybeSingle() // Ипользуем maybeSingle вместо single, чтобы не падать в эксепшен, если профиля нет

      if (error || !profile) {
        console.error('Profile fetch error or empty:', error)
        // Если профиля временно нет в таблице public.profiles, возвращаем дефолтного юзера, чтобы не вешать приложение
        return {
          id: userId,
          display_name: 'Workspace Member',
          role: 'user',
        }
      }

      return {
        id: profile.id,
        display_name: profile.display_name,
        role: profile.role as 'user' | 'admin',
      }
    } catch (err) {
      console.error('Catch error in fetchUserProfile:', err)
      return null
    }
  }

  // Следим за состоянием сессии при инициализации приложения
  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id)
        setUser(profile)
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    initializeAuth()

    // Подписываемся на изменения состояния (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id)
          setUser(profile)
        } else {
          setUser(null)
        }
        setLoading(false)
        
        // Освежаем роуты при изменении состояния авторизации
        router.refresh()
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  // Регистрация (Email + Password + Display Name)
  const register = async (email: string, password: string, displayName: string) => {
    setLoading(true)
    setError(null)
    
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return { success: false, error: authError.message }
    }

    setLoading(false)
    return { success: true, data }
  }

  // Вход (Email + Password)
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

    setLoading(false)
    return { success: true, data }
  }

  // Выход из системы
  const logout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setLoading(false)
    router.push('/login')
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