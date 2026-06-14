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

  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  if (user && (url.pathname.startsWith('/login') || url.pathname.startsWith('/register'))) {
    url.pathname = '/tasks'
    return NextResponse.redirect(url)
  }

  const isProtectedRoute = 
    url.pathname === '/' || 
    url.pathname.startsWith('/tasks') || 
    url.pathname.startsWith('/admin')

  if (!user && isProtectedRoute) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && url.pathname.startsWith('/admin')) {
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

  if (url.pathname === '/') {
    url.pathname = '/tasks'
    return NextResponse.redirect(url)
  }

  return response
}