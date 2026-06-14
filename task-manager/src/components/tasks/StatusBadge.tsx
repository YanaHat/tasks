'use client'

import React from 'react'
import styles from './StatusBadge.module.css'

interface StatusBadgeProps {
  type: 'status' | 'priority'
  value: 'todo' | 'in_progress' | 'done' | 'low' | 'medium' | 'high'
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ value }) => {
  const classMap: Record<string, string> = {
    todo: styles.todo,
    in_progress: styles.inInProgress,
    done: styles.done,
    low: styles.low,
    medium: styles.medium,
    high: styles.high,
  }

  const labels: Record<string, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Completed',
    low: 'Low',
    medium: 'Medium',
    high: 'Critical', 
  }

  const badgeClass = `${styles.badge} ${classMap[value] || ''}`

  return (
    <span className={badgeClass}>
      {labels[value] || value}
    </span>
  )
}