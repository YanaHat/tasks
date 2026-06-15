'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, LoginFormData } from '@/lib/validations/auth.schema'
import classes from './Login.module.css'

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
      window.location.href = '/tasks'
    } else {
      setServerError(result.error || 'Failed to sign in')
    }
  }

  return (
    <div className={classes.loginCard}>
      <div className={classes.textCenter}>
        <h1 className={classes.fontHeadline}>Sign in to TaskEngine</h1>
        <p className={classes.fontBody}>Enter your credentials to access your workspace.</p>
      </div>

      {serverError && (
        <div className={classes.serverError}>
          {serverError}
        </div>
      )}

      <form 
        className={classes.form} 
        onSubmit={handleSubmit(
          (data) => onSubmit(data),
          (errors) => console.log("Ошибки валидации формы Логина:", errors)
        )}
      >
        <div className={classes.fieldGroup}>
          <label className={`${classes.label} ml-xs`} htmlFor="email">Email</label>
          <div className={classes.inputWrapper}>
            <span className={`material-symbols-outlined ${classes.icon}`}>mail</span>
            <input
              {...register('email')}
              className={classes.input}
              id="email"
              placeholder="name@company.com"
              type="email"
            />
          </div>
          {errors.email && <span className={classes.errorText}>{errors.email.message}</span>}
        </div>

        <div className={classes.fieldGroup}>
          <div className={classes.labelRow}>
            <label className={classes.label} htmlFor="password">Password</label>
            <a className={classes.link} href="#">Forgot password?</a>
          </div>
          <div className={classes.inputWrapper}>
            <span className={`material-symbols-outlined ${classes.icon}`}>lock</span>
            <input
              {...register('password')}
              className={classes.input}
              id="password"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={classes.eyeButton}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.password && <span className={classes.errorText}>{errors.password.message}</span>}
        </div>

        <div className={classes.checkboxRow}>
          <input className={classes.checkbox} id="remember" type="checkbox" />
          <label className={classes.label} htmlFor="remember">Stay signed in for 30 days</label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={classes.submitButton}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
          <span className="material-symbols-outlined text-[18px]">login</span>
        </button>
      </form>

      <div className={classes.footerRow}>
        <p className={classes.registerText}>
          Don't have an account?{' '}
          <Link className={classes.registerLink} href="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}