import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Запуск middleware на всех маршрутах, кроме:
     * - _next/static (статические файлы стилей и скриптов)
     * - _next/image (оптимизированные изображения)
     * - все файлы с расширениями (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}