import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'
import env from '@/env'

export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Метод setAll может быть вызван внутри Server Component.
            // В Next.js нельзя менять куки во время рендеринга компонента,
            // поэтому мы просто игнорируем эту ошибку. Middleware перехватит обновление.
          }
        },
      },
    }
  )
}