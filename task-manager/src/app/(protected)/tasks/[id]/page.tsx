'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TaskForm } from '@/components/tasks/TaskForm'
import { createClient } from '@/lib/supabase/client'
import { TaskFormData } from '@/lib/validations/task.schema'
import { Button } from '@/components/ui/Button'
import type { Database } from '@/types/supabase'
import styles from '../Tasks.module.css' 
import localStyles from './EditTask.module.css' 

type TaskRow = Database['public']['Tables']['tasks']['Row']

interface EditTaskPageProps {
  params: Promise<{ id: string }>
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const { id: taskId } = React.use(params)

  const [task, setTask] = useState<TaskRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTask = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', taskId)
          .maybeSingle()

        if (dbError) throw dbError
        if (!data) {
          setError('Task not found')
          return
        }

        setTask(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch task details')
      } finally {
        setLoading(false)
      }
    }

    loadTask()
  }, [taskId, supabase])

  const handleUpdateTask = async (data: TaskFormData) => {
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        due_date: data.due_date || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true }
  }

  const handleDeleteTask = async () => {
    const confirmed = window.confirm('Are you sure you want to permanently delete this task?')
    if (!confirmed) return

    try {
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (deleteError) throw deleteError

      router.push('/tasks')
      router.refresh()
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div className={localStyles.editContainer}>
        <p className={localStyles.loadingText}>
          Loading task configuration...
        </p>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className={`${localStyles.editContainer} ${localStyles.errorWrapper}`}>
        <div className={localStyles.errorAlert}>
          {error || 'Task not found'}
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push('/tasks')} 
          className={localStyles.backButton}
        >
          Back to Workspace
        </Button>
      </div>
    )
  }

  return (
    <div className={localStyles.editContainer}>
      <div className={`${styles.header} ${localStyles.headerRow}`}>
        <div>
          <h1 className={styles.title}>Edit Task</h1>
          <p className={styles.subtitle}>
            Modify properties, rewrite requirements, or archive the action item block.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleDeleteTask}
          className={localStyles.deleteButton}
        >
          <span className="material-symbols-outlined text-[16px]">delete</span>
          Delete Task
        </Button>
      </div>

      <TaskForm initialData={task} onSubmit={handleUpdateTask} />
    </div>
  )
}