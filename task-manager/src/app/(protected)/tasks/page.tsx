import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TaskCard } from '@/components/tasks/TaskCard'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/types/supabase'
import styles from './Tasksp.module.css'

type Task = Database['public']['Tables']['tasks']['Row']

// Server Action для быстрого изменения статуса inline без перезагрузки страницы
async function updateTaskStatusAction(formData: FormData) {
  'use server'
  const taskId = formData.get('taskId') as string
  const newStatus = formData.get('status') as Task['status']

  if (!taskId || !newStatus) return

  const supabase = createClient()
  await supabase
    .from('tasks')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', taskId)

  revalidatePath('/tasks')
}

export default async function TasksPage() {
  const supabase = createClient()
  
  // Получаем текущую сессию пользователя
  const { data: { user } } = await supabase.auth.getUser()
  
  // Запрашиваем задачи из базы данных с автоматической сортировкой по убыванию даты
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-md bg-error-container text-on-error-container rounded-xl border border-error/20">
        Error loading tasks: {error.message}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>My Workspace</h2>
          <p className={styles.subtitle}>Review your pending actions, check deadlines, and update status blocks.</p>
        </div>
        <Link href="/tasks/new" className={styles.addButton}>
          <span className="material-symbols-outlined">add</span>
          Add Task
        </Link>
      </div>

      <div className={styles.list}>
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <form key={task.id} action={updateTaskStatusAction}>
              <input type="hidden" name="taskId" value={task.id} />
              <input type="hidden" id={`status-input-${task.id}`} name="status" defaultValue={task.status} />
              
              <button type="submit" id={`submit-btn-${task.id}`} className={styles.hiddenSubmit} />

              <TaskCard 
                task={task} 
                onStatusChange={(id, nextStatus) => {
                  // 1. Находим скрытый инпут статуса именно этой формы и меняем значение
                  const statusInput = document.getElementById(`status-input-${id}`) as HTMLInputElement
                  const submitBtn = document.getElementById(`submit-btn-${id}`) as HTMLButtonElement
                  
                  if (statusInput && submitBtn) {
                    statusInput.value = nextStatus
                    submitBtn.click()
                  }
                }}
              />
            </form>
          ))
        ) : (
          <div className={styles.emptyState}>
            <span className={`material-symbols-outlined ${styles.emptyIcon}`}>task</span>
            <p className={styles.emptyTitle}>No tasks found</p>
            <p className={styles.emptySubtitle}>Get started by creating your very first task above.</p>
          </div>
        )}
      </div>
    </div>
  )
}