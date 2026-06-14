'use client'

import React from 'react'
import Link from 'next/link'
import { StatusBadge } from './StatusBadge'
import type { Database } from '@/types/supabase'
import styles from './TaskCard.module.css'

type Task = Database['public']['Tables']['tasks']['Row']

interface TaskCardProps {
  task: Task
  onStatusChange?: (id: string, newStatus: Task['status']) => void
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange }) => {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'

  return (
    <div className={styles.card}>
      <div className={styles.infoSection}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>
            {task.title}
          </h3>
          <StatusBadge type="priority" value={task.priority as 'low' | 'medium' | 'high'} />
        </div>
        
        {task.description && (
          <p className={styles.description}>
            {task.description}
          </p>
        )}

        {task.due_date && (
          <div className={`${styles.dateContainer} ${isOverdue ? styles.dateOverdue : styles.dateNormal}`}>
            <span className="material-symbols-outlined text-xs">calendar_today</span>
            <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
            {isOverdue && <span className={styles.overdueBadge}>(Overdue)</span>}
          </div>
        )}
      </div>

      <div className={styles.actionsSection}>
        <div className={styles.selectWrapper}>
          <select
            value={task.status}
            onChange={(e) => onStatusChange?.(task.id, e.target.value as Task['status'])}
            className={styles.select}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Completed</option>
          </select>
          <span className={`material-symbols-outlined ${styles.selectIcon}`}>
            keyboard_arrow_down
          </span>
        </div>

        <Link 
          href={`/tasks/${task.id}`}
          className={styles.editButton}
          title="Edit Task"
        >
          <span className="material-symbols-outlined text-md">edit</span>
        </Link>
      </div>
    </div>
  )
}