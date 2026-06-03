'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { registerSchema, RegisterFormData } from '@/lib/validations/auth.schema'
import classes from './Register.module.css'

export default function RegisterPage() {
  const { register: signUp } = useAuth()
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null)
    const result = await signUp(data.email, data.password, data.displayName)

    if (result.success) {
      router.push('/tasks')
    } else {
      setServerError(result.error || 'Failed to register')
    }
  }

  return (
    <div className={classes.registerCard}>
      <div className={classes.textCenter}>
        <h1 className={classes.fontHeadline}>Create an Account</h1>
        <p className={classes.fontBody}>Get started with TaskEngine today.</p>
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
          (errors) => console.log("Ошибки валидации формы Регистрации:", errors)
        )}
      >
        <div className={classes.fieldGroup}>
          <label className={`${classes.label} ml-xs`} htmlFor="displayName">Display Name</label>
          <div className={classes.inputWrapper}>
            <span className={`material-symbols-outlined ${classes.icon}`}>person</span>
            <input
              {...register('displayName')}
              className={classes.input}
              id="displayName"
              placeholder="John Doe"
              type="text"
            />
          </div>
          {errors.displayName && <span className={classes.errorText}>{errors.displayName.message}</span>}
        </div>

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
          <label className={`${classes.label} ml-xs`} htmlFor="password">Password</label>
          <div className={classes.inputWrapper}>
            <span className={`material-symbols-outlined ${classes.icon}`}>lock</span>
            <input
              {...register('password')}
              className={classes.input}
              id="password"
              placeholder="••••••••"
              type="password"
            />
          </div>
          {errors.password && <span className={classes.errorText}>{errors.password.message}</span>}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={classes.submitButton}
        >
          {isSubmitting ? 'Creating Account...' : 'Register'}
          <span className="material-symbols-outlined text-[18px]">person_add</span>
        </button>
      </form>

      <div className={classes.footerRow}>
        <p className={classes.loginText}>
          Already have an account?{" "}
          <Link className={classes.loginLink} href="/login">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}