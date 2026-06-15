'use client'

import React from 'react'
import Link from 'next/link'
import { TaskCard } from '@/components/tasks/TaskCard'
import { useTasks } from '@/hooks/useTasks' 
import { useSearchParams } from 'next/navigation'
import styles from './Tasks.module.css'

export default function TasksPage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search')?.toLowerCase() || ''

  const { tasks: filteredTasks, loading, error, updateTaskStatus } = useTasks(searchQuery)

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
              onStatusChange={updateTaskStatus} 
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