import { createRouter, createWebHistory } from 'vue-router'

import {
  generateErrorRoute,
  generateMainRoute,
  generateManagementRoutes,
  generateNormalRoute,
  generateRootRoute
} from './generate'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    generateRootRoute({ path: 'client' }),
    generateRootRoute({ path: 'landing' }),
    generateRootRoute({ path: 'sign-in' }),
    generateRootRoute({
      path: 'admin',
      meta: {
        requiresAuth: true,
        requiresRole: 'admin'
      },
      children: [
        generateMainRoute('admin'),
        ...generateManagementRoutes('attendances', 'admin'),
        ...generateManagementRoutes('attendance-records', 'admin'),
        ...generateManagementRoutes('batches', 'admin'),
        ...generateManagementRoutes('classes', 'admin'),
        ...generateManagementRoutes('schedules', 'admin'),
        ...generateManagementRoutes('courses', 'admin'),
        ...generateManagementRoutes('faculties', 'admin'),
        ...generateManagementRoutes('instructors', 'admin'),
        ...generateManagementRoutes('students', 'admin'),
        ...generateManagementRoutes('classrooms', 'admin')
      ]
    }),
    generateRootRoute({
      path: 'student',
      meta: {
        requiresAuth: true,
        requiresRole: 'student'
      },
      children: [
        generateMainRoute('student'),
        generateMainRoute('student', ':id'),
        generateNormalRoute('calendar', 'student'),
        ...generateManagementRoutes('attendances', 'student')
      ]
    }),
    generateRootRoute({
      path: 'instructor',
      meta: {
        requiresAuth: true,
        requiresRole: 'instructor'
      },
      children: [
        generateMainRoute('instructor'),
        ...generateManagementRoutes('attendances', 'instructor'),
        ...generateManagementRoutes('schedules', 'instructor')
      ]
    }),
    generateRootRoute({
      path: 's',
      meta: {
        requiresAuth: true
      },
      children: [generateMainRoute('shorten', ':id')]
    }),
    generateRootRoute({
      path: 'settings',
      meta: {
        requiresAuth: true
      },
      children: [generateMainRoute('settings')]
    }),
    generateRootRoute({ path: 'client' }),
    generateRootRoute({ path: 'test' }),
    generateErrorRoute()
  ]
})

export default router
