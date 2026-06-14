'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/tasks/StatusBadge'
import styles from '../tasks/Tasks.module.css' 
import adminStyles from './Admin.module.css' 
import taskStyles from '@/components/tasks/TaskCard.module.css' 

type Profile = {
  id: string
  display_name: string
  role: string
  created_at: string
}

type Task = {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'done'
  priority: string
}

export default function AdminPage() {
  const supabase = createClient()

  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [userTasks, setUserTasks] = useState<Task[]>([])
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) return setIsAdmin(false)

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authUser.id)
          .maybeSingle()

        if (profile?.role !== 'admin') {
          setIsAdmin(false)
          return
        }
        setIsAdmin(true)

        const { data: allProfiles } = await supabase
          .from('profiles')
          .select('id, display_name, role, created_at')
          .order('created_at', { ascending: true })

        setProfiles(allProfiles || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    checkAdminAndLoadData()
  }, [supabase])

  const handleUserClick = async (profile: Profile) => {
    setSelectedUser(profile)
    const { data: tasks } = await supabase
      .from('tasks')
      .select('id, title, status, priority')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
    
    setUserTasks(tasks || [])
  }

  const handleAdminStatusChange = async (taskId: string, nextStatus: Task['status']) => {
    setUserTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus } : t))
    
    await supabase
      .from('tasks')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', taskId)
  }

  const handleAdminTaskDelete = async (taskId: string) => {
    const confirmed = window.confirm('As Admin, are you sure you want to delete this task?')
    if (!confirmed) return

    setUserTasks(prev => prev.filter(t => t.id !== taskId))
    await supabase.from('tasks').delete().eq('id', taskId)
  }

  if (loading) return <div className={styles.container}><p className={styles.subtitle}>Verifying security protocols...</p></div>

  if (isAdmin === false) {
    return (
      <div className={adminStyles.accessDenied}>
        <span className="material-symbols-outlined text-3xl mb-xs">gpp_bad</span>
        <h2 className="font-bold">Access Denied</h2>
        <p className="mt-xs text-sm">You do not have the required administrator privileges to view the team management board.</p>
      </div>
    )
  }

  return (
    <div className={adminStyles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Team Management</h2>
          <p className={styles.subtitle}>
            Review system users, click a member to view/manage their task blocks.
          </p>
        </div>
      </div>

      <div className={adminStyles.tableWrapper}>
        <div className={adminStyles.tableContainer}>
          <table className={adminStyles.table}>
            <thead>
              <tr>
                <th className={adminStyles.th}>User Member</th>
                <th className={adminStyles.th}>System Role</th>
                <th className={adminStyles.th}>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => {
                const isSelected = selectedUser?.id === profile.id
                return (
                  <tr 
                    key={profile.id} 
                    className={`${adminStyles.tr} ${adminStyles.clickableTr} ${isSelected ? adminStyles.activeTr : ''}`}
                    onClick={() => handleUserClick(profile)}
                  >
                    <td className={adminStyles.td}>
                      <div className={adminStyles.userInfo}>
                        <div className={adminStyles.avatar}>
                          {profile.display_name?.substring(0, 2).toUpperCase() || 'US'}
                        </div>
                        <span className={adminStyles.name}>{profile.display_name}</span>
                      </div>
                    </td>
                    <td className={adminStyles.td}>
                      <StatusBadge type="role" value={profile.role as any} />
                    </td>
                    <td className={adminStyles.td}>
                      <span className={styles.subtitle}>
                        {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className={adminStyles.tasksSection}>
          <h3 className={adminStyles.sectionTitle}>
            Tasks for {selectedUser.display_name}
          </h3>
          
          {userTasks.length > 0 ? (
            <div className={adminStyles.adminTaskList}>
              {userTasks.map((task) => (
                <div key={task.id} className={adminStyles.adminTaskRow}>
                  <div className={adminStyles.taskMainInfo}>
                    <span className={adminStyles.taskTitle}>{task.title}</span>
                  </div>

                  <div className={adminStyles.taskControls}>
                    <div className={taskStyles.selectWrapper}>
                      <select
                        value={task.status}
                        onChange={(e) => handleAdminStatusChange(task.id, e.target.value as any)}
                        className={taskStyles.select}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Completed</option>
                      </select>
                    </div>

                    <button 
                      className={adminStyles.deleteIconBtn}
                      onClick={() => handleAdminTaskDelete(task.id)}
                      title="Delete Task as Admin"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={adminStyles.noTasksText}>This member has no task blocks initialized.</p>
          )}
        </div>
      )}
    </div>
  )
}