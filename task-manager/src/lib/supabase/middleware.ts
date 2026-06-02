import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'
import env from '@/env'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Получаем текущего пользователя из Supabase Auth
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // 1. Защита публичных маршрутов: если пользователь авторизован и идет на /login или /register
  if (user && (url.pathname.startsWith('/login') || url.pathname.startsWith('/register'))) {
    url.pathname = '/tasks'
    return NextResponse.redirect(url)
  }

  // 2. Защита приватных маршрутов: если пользователь НЕ авторизован и пытается зайти на закрытые страницы
  const isProtectedRoute = 
    url.pathname === '/' || 
    url.pathname.startsWith('/tasks') || 
    url.pathname.startsWith('/admin')

  if (!user && isProtectedRoute) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 3. Защита админ-панели: если пользователь авторизован, но лезет в /admin
  if (user && url.pathname.startsWith('/admin')) {
    // Делаем запрос к таблице profiles, чтобы узнать роль текущего uid
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      url.pathname = '/tasks'
      return NextResponse.redirect(url)
    }
  }

  // Корневой редирект с "/" на "/tasks" для авторизованных
  if (url.pathname === '/') {
    url.pathname = '/tasks'
    return NextResponse.redirect(url)
  }

  return response
}