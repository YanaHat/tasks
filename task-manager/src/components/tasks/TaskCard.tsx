'use client'

import React from 'react'
import Link from 'next/link'
import { StatusBadge } from './StatusBadge'
import type { Database } from '@/types/supabase'

type Task = Database['public']['Tables']['tasks']['Row']

interface TaskCardProps {
  task: Task
  onStatusChange?: (id: string, newStatus: Task['status']) => void
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange }) => {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-md shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-md group">
      <div className="space-y-base overflow-hidden">
        <div className="flex items-center gap-sm flex-wrap">
          <h3 className="font-label-md text-label-md font-semibold text-on-surface truncate max-w-xs sm:max-w-md">
            {task.title}
          </h3>
          <StatusBadge type="priority" value={task.priority as 'low' | 'medium' | 'high'} />
        </div>
        
        {task.description && (
          <p className="text-on-surface-variant text-xs truncate max-w-xl">
            {task.description}
          </p>
        )}

        {task.due_date && (
          <div className={`flex items-center gap-xs text-[11px] ${isOverdue ? 'text-error font-semibold' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-xs">calendar_today</span>
            <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
            {isOverdue && <span className="uppercase text-[9px] tracking-wider font-bold">(Overdue)</span>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-md self-end sm:self-center flex-shrink-0">
        {/* Быстрое переключение статуса inline */}
        <div className="relative inline-block text-left">
          <select
            value={task.status}
            onChange={(e) => onStatusChange?.(task.id, e.target.value as Task['status'])}
            className="bg-surface-container-low border border-outline-variant/30 rounded-lg py-xs pl-sm pr-8 font-label-sm text-label-sm focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer text-on-surface"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Completed</option>
          </select>
          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-on-surface-variant">
            keyboard_arrow_down
          </span>
        </div>

        {/* Кнопка перехода к деталям/редактированию */}
        <Link 
          href={`/tasks/${task.id}`}
          className="p-xs hover:bg-surface-container-high rounded-md text-outline hover:text-primary transition-all active:scale-90"
          title="Edit Task"
        >
          <span className="material-symbols-outlined text-md">edit</span>
        </Link>
      </div>
    </div>
  )
}