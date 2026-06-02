import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TaskCard } from '@/components/tasks/TaskCard'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/types/supabase'

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
    <div className="space-y-lg max-w-container-max mx-auto w-full animate-in fade-in duration-300">
      {/* Шапка контентной области */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md border-b border-outline-variant/10 pb-md">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface">My Workspace</h2>
          <p className="text-on-surface-variant font-body-lg">Review your pending actions, check deadlines, and update status blocks.</p>
        </div>
        <Link 
          href="/tasks/new"
          className="flex items-center justify-center gap-xs px-md py-sm bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:bg-primary-container transition-colors shadow-md active:scale-95 flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Task
        </Link>
      </div>

      {/* Список задач */}
      <div className="space-y-sm">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            // Оборачиваем каждую карточку в нативную форму для отработки Server Actions без JS
            <form key={task.id} action={updateTaskStatusAction}>
              <input type="hidden" name="taskId" value={task.id} />
              <TaskCard 
                task={task} 
                onStatusChange={(id, nextStatus) => {
                  // Создаем искусственное отправление формы при изменении селекта
                  const form = document.querySelector(`form input[value="${id}"]`)?.parentElement as HTMLFormElement
                  if (form) {
                    const formData = new FormData(form)
                    formData.set('status', nextStatus)
                    
                    // Передаем данные на сервер через встроенный fetch механизм Next.js
                    const submitForm = async () => {
                      const response = await fetch(window.location.href, {
                        method: 'POST',
                        body: formData,
                        headers: { 'accept': 'text/x-component' }
                      })
                      if (response.ok) window.location.reload()
                    }
                    submitForm()
                  }
                }}
              />
            </form>
          ))
        ) : (
          <div className="text-center py-xl bg-surface-container-low border border-dashed border-outline-variant rounded-xl p-lg">
            <span className="material-symbols-outlined text-outline text-3xl mb-sm block">task</span>
            <p className="text-on-surface font-label-md font-bold">No tasks found</p>
            <p className="text-on-surface-variant text-xs mt-xs">Get started by creating your very first task above.</p>
          </div>
        )}
      </div>
    </div>
  )
}