'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, LoginFormData } from '@/lib/validations/auth.schema'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null)
    const result = await login(data.email, data.password)

    if (result.success) {
      router.push('/tasks')
    } else {
      setServerError(result.error || 'Failed to sign in')
    }
  }

  return (
    <div className="w-full max-w-[440px] bg-surface-container-lowest p-xl rounded-xl border border-outline-variant/30 shadow-sm">
      <div className="text-center mb-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Sign in to TaskEngine</h1>
        <p className="font-body-md text-on-surface-variant">Enter your credentials to access your workspace.</p>
      </div>

      {serverError && (
        <div className="mb-md p-sm bg-error-container text-on-error-container text-body-md rounded-lg border border-error/20">
          {serverError}
        </div>
      )}

      <form className="space-y-md" onSubmit={handleSubmit(
                (data) => onSubmit(data),
                (errors) => console.log("Ошибки валидации формы Логина:", errors) // 👈 Выведет проблему в консоль F12
            )}
        >
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-on-surface-variant ml-xs" htmlFor="email">Email</label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-md text-outline">mail</span>
            <input
              {...register('email')}
              className="w-full pl-[44px] pr-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none placeholder:text-outline/60 text-on-surface"
              id="email"
              placeholder="name@company.com"
              type="email"
            />
          </div>
          {errors.email && <span className="text-error text-label-sm ml-xs">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-xs">
          <div className="flex justify-between items-center px-xs">
            <label className="font-label-md text-on-surface-variant" htmlFor="password">Password</label>
            <a className="font-label-sm text-primary hover:underline" href="#">Forgot password?</a>
          </div>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-md text-outline">lock</span>
            <input
              {...register('password')}
              className="w-full pl-[44px] pr-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-on-surface"
              id="password"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-md text-outline hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.password && <span className="text-error text-label-sm ml-xs">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-md bg-primary text-on-primary font-headline-md rounded-lg shadow-sm hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all flex items-center justify-center gap-sm mt-lg disabled:opacity-50"
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
          <span className="material-symbols-outlined text-[18px]">login</span>
        </button>
      </form>

      <div className="mt-xl pt-lg border-t border-outline-variant/20 text-center">
        <p className="font-body-md text-on-surface-variant">
          Don't have an account?{' '}
          <Link className="text-primary font-semibold hover:underline decoration-2 underline-offset-4" href="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}