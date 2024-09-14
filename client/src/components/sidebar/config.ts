import {
  Book,
  BookOpen,
  BookUser,
  Briefcase,
  Calendar,
  CheckCircle,
  CheckSquare,
  Clock,
  Home,
  Layers,
  LayoutDashboard,
  SwatchBook,
  Table,
  UserRound, UsersRound
} from 'lucide-vue-next'
import { h } from 'vue'

export const studentMenu = [
  {
    icon: h(UserRound),
    label: 'Profile',
    route: '/student'
  },
  {
    icon: h(Calendar),
    label: 'Calendar',
    route: '/student/calendar'
  },
  {
    icon: h(CheckCircle),
    label: 'Attendance',
    route: '/student/attendances'
  }
]

export const instructorMenu = [
  {
    icon: h(LayoutDashboard),
    label: 'Dashboard',
    route: '/instructor'
  },
  {
    icon: h(Clock),
    label: 'Schedules',
    route: '/instructor/schedules'
  },
  {
    icon: h(CheckCircle),
    label: 'Attendance',
    route: '/instructor/attendances'
  }
]

export const adminMenu = [
  {
    icon: h(LayoutDashboard),
    label: 'Dashboard',
    route: '/admin'
  },
  {
    icon: h(BookUser),
    label: 'User Management',
    children: [
      {
        icon: h(UsersRound),
        label: 'Instructors',
        route: '/admin/instructors'
      },
      {
        icon: h(UsersRound),
        label: 'Students',
        route: '/admin/students'
      }
    ]
  },
  {
    icon: h(CheckSquare),
    label: 'Attendance Management',
    children: [
      {
        icon: h(CheckCircle),
        label: 'Attendance Statistics',
        route: '/admin/attendances'
      },
      {
        icon: h(Table),
        label: 'Attendance Records',
        route: '/admin/attendance-records'
      }
    ]
  },
  {
    icon: h(Book),
    label: 'Course Management',
    children: [
      {
        icon: h(SwatchBook),
        label: 'Courses',
        route: '/admin/courses'
      },
      {
        icon: h(BookOpen),
        label: 'Classes',
        route: '/admin/classes'
      },
      {
        icon: h(Layers),
        label: 'Batches',
        route: '/admin/batches'
      },
      {
        icon: h(Briefcase),
        label: 'Faculties',
        route: '/admin/faculties'
      }
    ]
  },
  {
    icon: h(Calendar),
    label: 'Timetable Management',
    children: [
      {
        icon: h(Home),
        label: 'Classrooms',
        route: '/admin/classrooms'
      },
      {
        icon: h(Clock),
        label: 'Schedules',
        route: '/admin/schedules'
      }
    ]
  }
]
