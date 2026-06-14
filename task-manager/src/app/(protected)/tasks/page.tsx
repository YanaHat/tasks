'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client' 
import { TaskCard } from '@/components/tasks/TaskCard'
import type { Database } from '@/types/supabase'
import { useSearchParams } from 'next/navigation'
import styles from './Tasks.module.css'

type Task = Database['public']['Tables']['tasks']['Row']

export default function TasksPage() {
  const supabase = createClient()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search')?.toLowerCase() || ''

  const loadTasks = async () => {
    try {
      setLoading(true)
      
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) throw new Error('User not authorized')

      const { data, error: dbError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id) 
        .order('created_at', { ascending: false })

      if (dbError) throw dbError
      setTasks(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleStatusChange = async (taskId: string, nextStatus: Task['status']) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
      )

      const { error: updateError } = await supabase
        .from('tasks')
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', taskId)

      if (updateError) throw updateError
    } catch (err: any) {
      console.error('Error updating task status:', err)
      loadTasks()
    }
  }

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery) || 
    (task.description && task.description.toLowerCase().includes(searchQuery))
  )

  if (error) {
    return (
      <div className="p-md bg-error-container text-on-error-container rounded-xl border border-error/20">
        Error loading tasks: {error}
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
        {loading ? (
          <p className={styles.subtitle}>
            Loading tasks...
          </p>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard 
              key={task.id}
              task={task} 
              onStatusChange={handleStatusChange} 
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <span className={`material-symbols-outlined ${styles.emptyIcon}`}>
              {searchQuery ? 'search_off' : 'task'}
            </span>
            <p className={styles.emptyTitle}>
              {searchQuery ? 'No results found' : 'No tasks found'}
            </p>
            <p className={styles.emptySubtitle}>
              {searchQuery 
                ? `We couldn't find any tasks matching "${searchQuery}"`
                : 'Get started by creating your very first task above.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}