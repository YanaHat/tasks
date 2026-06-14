'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { taskSchema, TaskFormData } from '@/lib/validations/task.schema'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Database } from '@/types/supabase'
import styles from './TaskForm.module.css'

type TaskRow = Database['public']['Tables']['tasks']['Row']

interface TaskFormProps {
  initialData?: TaskRow
  onSubmit: (data: TaskFormData) => Promise<{ success: boolean; error?: string }>
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit }) => {
  const router = useRouter()
  const [serverError, setServerError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description ?? undefined,
          status: initialData.status as TaskFormData['status'],
          priority: initialData.priority as TaskFormData['priority'],
          due_date: initialData.due_date ?? undefined,
        }
      : {
          status: 'todo',
          priority: 'medium',
        },
  })

  const handleFormSubmit = async (data: TaskFormData) => {
    setServerError(null)
    const result = await onSubmit(data)
    if (result.success) {
      router.push('/tasks')
      router.refresh()
    } else {
      setServerError(result.error || 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.formGrid}>
      {serverError && (
        <div className={styles.serverError}>
          {serverError}
        </div>
      )}

      <div className={styles.mainColumn}>
        <Input
          id="task-title"
          label="Task Title"
          placeholder="e.g., Update System Architecture"
          error={errors.title?.message}
          {...register('title')}
          className={styles.titleInput}
        />

        <div className={styles.textareaGroup}>
          <label className={styles.textareaLabel} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            rows={8}
            placeholder="Outline the requirements, dependencies, and outcomes..."
            className={`${styles.textarea} ${errors.description ? styles.textareaError : ''}`}
            {...register('description')}
          />
          {errors.description && (
            <span className={styles.errorText}>{errors.description.message}</span>
          )}
        </div>
      </div>

      <div className={styles.sideColumn}>
        <div className={styles.metaBlock}>
          <div className={styles.selectGroup}>
            <label className={styles.selectLabel} htmlFor="status">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              Status
            </label>
            <select id="status" className={styles.select} {...register('status')}>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className={styles.selectGroup}>
            <label className={styles.selectLabel} htmlFor="priority">
              <span className="material-symbols-outlined text-[14px]">flag</span>
              Priority
            </label>
            <select id="priority" className={styles.select} {...register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className={styles.metaBlock}>
          <Input
            id="due-date"
            type="date"
            label="Due Date"
            error={errors.due_date?.message}
            {...register('due_date')}
            className={styles.dateInput}
          />
        </div>
      </div>

      <div className={styles.actionsBar}>
        <Button variant="outline" onClick={() => router.push('/tasks')}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          <span className="material-symbols-outlined text-[16px]">save</span>
          Save Task
        </Button>
      </div>
    </form>
  )
}