'use client'

import React from 'react'
import { TaskForm } from '@/components/tasks/TaskForm'
import { createClient } from '@/lib/supabase/client'
import { TaskFormData } from '@/lib/validations/task.schema'
import styles from '../Tasks.module.css' 

export default function NewTaskPage() {
  const supabase = createClient()

  const handleCreateTask = async (data: TaskFormData) => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User session not found' }
    }

    const { error } = await supabase.from('tasks').insert({
      user_id: user.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      due_date: data.due_date,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>New Task</h1>
          <p className={styles.subtitle}>
            Fill in the details below to create a new actionable item in your workspace.
          </p>
        </div>
      </div>

      <TaskForm onSubmit={handleCreateTask} />
    </div>
  )
}