'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'

type Task = Database['public']['Tables']['tasks']['Row']

export const useTasks = (searchQuery: string = '') => {
  const supabase = createClient()
  
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
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
  }, []) 

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const updateTaskStatus = useCallback(async (taskId: string, nextStatus: Task['status']) => {
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
  }, [loadTasks])

  const filteredTasks = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return tasks

    return tasks.filter(task => 
      task.title.toLowerCase().includes(query) || 
      (task.description && task.description.toLowerCase().includes(query))
    )
  }, [tasks, searchQuery]) 

  return {
    tasks: filteredTasks,
    loading,
    error,
    refreshTasks: loadTasks,
    updateTaskStatus
  }
}