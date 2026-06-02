'use client'

import React from 'react'

interface StatusBadgeProps {
  type: 'status' | 'priority'
  value: 'todo' | 'in_progress' | 'done' | 'low' | 'medium' | 'high'
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value }) => {
  const styles: Record<string, string> = {
    // Статусы
    todo: 'bg-surface-variant text-on-surface-variant',
    in_progress: 'bg-secondary-container text-on-secondary-container font-semibold',
    done: 'bg-green-100 text-green-700',
    // Приоритеты
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-red-100 text-red-700 font-semibold',
  }

  const labels: Record<string, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Completed',
    low: 'Low',
    medium: 'Medium',
    high: 'Critical',
  }

  return (
    <span className={`px-sm py-xs rounded-full font-label-sm text-label-sm tracking-wide inline-block ${styles[value] || ''}`}>
      {labels[value] || value}
    </span>
  )
}