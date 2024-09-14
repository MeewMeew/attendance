/* eslint-disable @typescript-eslint/no-unused-vars */
import ExcelJS from 'exceljs'
import { sortBy } from 'lodash-es'

import type { M } from '@/shared/types'
export interface CreateReportByCourseAndSemester {
  month: number
  year: number
  className: string
  students: Student[]
  courseName: string
  batchName: string
  method: 'Lý thuyết' | 'Thực hành'
  instructor: Instructor
  workSheetName: string
}

export interface Instructor {
  instructorId: string
  displayName: string
}

export interface Student {
  studentId: string
  displayName: string
  present: number
  late: number
  absent: number
}

const border: Partial<ExcelJS.Borders> = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' }
}
const pratical: Partial<ExcelJS.Column>[] = [
  { header: '1', key: 'one', width: 5, style: { alignment: { horizontal: 'center' } } },
  { header: '2', key: 'two', width: 5, style: { alignment: { horizontal: 'center' } } },
  { header: '3', key: 'three', width: 5, style: { alignment: { horizontal: 'center' } } },
  { header: '4', key: 'four', width: 5, style: { alignment: { horizontal: 'center' } } },
  { header: '5', key: 'five', width: 5, style: { alignment: { horizontal: 'center' } } },
  { header: '6', key: 'six', width: 5, style: { alignment: { horizontal: 'center' } } }
]
const theoretical: Partial<ExcelJS.Column>[] = [
  ...pratical,
  { header: '7', key: 'seven', width: 5, style: { alignment: { horizontal: 'center' } } },
  { header: '8', key: 'eight', width: 5, style: { alignment: { horizontal: 'center' } } },
  { header: '9', key: 'nine', width: 5, style: { alignment: { horizontal: 'center' } } },
  { header: '10', key: 'ten', width: 5, style: { alignment: { horizontal: 'center' } } }
]
const font: Partial<ExcelJS.Font> = {
  name: 'Times New Roman'
}

function makeEvaluate(present: number, late: number, absent: number, methodColumns: string[]) {
  const total = present + late + absent
  const absentRate = (absent + Math.floor(late / 2)) / total
  let evaluate = ''
  if (total !== methodColumns.length) evaluate = 'Chưa đủ buổi học'
  else if (absentRate >= 0.3 && absentRate < 0.34) {
    evaluate = 'Cấm thi lần 1'
  } else if (absentRate >= 0.34) {
    evaluate = 'Học lại'
  } else {
    evaluate = 'Được phép thi'
  }
  return evaluate
}

export async function createReportByCourseAndSemester(
  listOptions: CreateReportByCourseAndSemester[]
) {
  const wb = new ExcelJS.Workbook()
  for (const options of listOptions) {
    const { className, batchName, students, courseName, instructor, method, workSheetName } =
      options
    const maxLength = students.reduce((max, obj) => Math.max(max, obj.displayName.length + 3), 0)
    const isPratical = method === 'Thực hành'
    const ws = wb.addWorksheet(workSheetName)
    const columns: Partial<ExcelJS.Column>[] = [
      { header: 'STT', key: 'index', width: 5, style: { alignment: { horizontal: 'center' } } },
      { header: 'Mã học sinh', key: 'studentId', width: 12 },
      { header: 'Họ và tên', key: 'displayName', width: maxLength },
      {
        header: 'Có mặt',
        key: 'present',
        width: 8,
        style: { alignment: { horizontal: 'center' } }
      },
      { header: 'Muộn', key: 'late', width: 7, style: { alignment: { horizontal: 'center' } } },
      { header: 'Vắng', key: 'absent', width: 7, style: { alignment: { horizontal: 'center' } } },
      ...(isPratical ? pratical : theoretical),
      {
        header: 'Đánh giá',
        key: 'evaluate',
        width: 15,
        style: { alignment: { horizontal: 'center' } }
      }
    ]

    ws.columns = columns.map((c) => {
      const { header, ...rest } = c
      return rest
    })
    {
      ws.mergeCells(`A1:${isPratical ? 'M' : 'Q'}2`)
      ws.getCell('A1').value = `Điểm danh môn ${courseName}`
      ws.getCell('A1').font = { size: 14, bold: true, ...font }
      ws.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' }
      ws.mergeCells('A4:B4')
      ws.getCell('A4').value = {
        richText: [
          { text: 'Lớp: ', font: { size: 12, bold: true, ...font } },
          { text: className, font: { size: 12, ...font } }
        ]
      }
      ws.getCell('A4').alignment = { vertical: 'middle', horizontal: 'left' }
      ws.getCell('C4').value = {
        richText: [
          { text: 'Khóa: ', font: { size: 12, bold: true, ...font } },
          { text: batchName, font: { size: 12, ...font } }
        ]
      }
      ws.getCell('C4').alignment = { vertical: 'middle', horizontal: 'left' }
      ws.mergeCells('A5:C5')
      ws.getCell('A5').value = {
        richText: [
          { text: 'Hình thức: ', font: { size: 12, bold: true, ...font } },
          { text: method, font: { size: 12, ...font } }
        ]
      }
      ws.getCell('A5').alignment = { vertical: 'middle', horizontal: 'left' }
      ws.mergeCells('A6:C6')
      ws.getCell('A6').value = {
        richText: [
          { text: 'Giảng viên: ', font: { size: 12, bold: true, ...font } },
          { text: instructor.displayName, font: { size: 12, ...font } }
        ]
      }
      ws.getCell('A6').alignment = { vertical: 'middle', horizontal: 'left' }
    }
    {
      ws.getCell(`${isPratical ? 'L' : 'P'}4`).value = 'O'
      ws.getCell(`${isPratical ? 'L' : 'P'}4`).font = { bold: true, ...font }
      ws.getCell(`${isPratical ? 'L' : 'P'}4`).alignment = {
        horizontal: 'center',
        vertical: 'middle'
      }
      ws.getCell(`${isPratical ? 'L' : 'P'}4`).border = border
      ws.getCell(`${isPratical ? 'M' : 'Q'}4`).value = 'Có mặt'
      ws.getCell(`${isPratical ? 'M' : 'Q'}4`).font = { bold: true, ...font }
      ws.getCell(`${isPratical ? 'M' : 'Q'}4`).alignment = {
        horizontal: 'center',
        vertical: 'middle'
      }
      ws.getCell(`${isPratical ? 'M' : 'Q'}4`).border = border
      ws.getCell(`${isPratical ? 'L' : 'P'}5`).value = 'X'
      ws.getCell(`${isPratical ? 'L' : 'P'}5`).font = { bold: true, ...font }
      ws.getCell(`${isPratical ? 'L' : 'P'}5`).alignment = {
        horizontal: 'center',
        vertical: 'middle'
      }
      ws.getCell(`${isPratical ? 'L' : 'P'}5`).border = border
      ws.getCell(`${isPratical ? 'M' : 'Q'}5`).value = 'Muộn'
      ws.getCell(`${isPratical ? 'M' : 'Q'}5`).font = { bold: true, ...font }
      ws.getCell(`${isPratical ? 'M' : 'Q'}5`).alignment = {
        horizontal: 'center',
        vertical: 'middle'
      }
      ws.getCell(`${isPratical ? 'M' : 'Q'}5`).border = border
      ws.getCell(`${isPratical ? 'L' : 'P'}6`).value = '-'
      ws.getCell(`${isPratical ? 'L' : 'P'}6`).font = { bold: true, ...font }
      ws.getCell(`${isPratical ? 'L' : 'P'}6`).alignment = {
        horizontal: 'center',
        vertical: 'middle'
      }
      ws.getCell(`${isPratical ? 'L' : 'P'}6`).border = border
      ws.getCell(`${isPratical ? 'M' : 'Q'}6`).value = 'Vắng'
      ws.getCell(`${isPratical ? 'M' : 'Q'}6`).font = { bold: true, ...font }
      ws.getCell(`${isPratical ? 'M' : 'Q'}6`).alignment = {
        horizontal: 'center',
        vertical: 'middle'
      }
      ws.getCell(`${isPratical ? 'M' : 'Q'}6`).border = border
    }
    {
      ws.getRow(8).font = { bold: true, ...font }
      ws.getRow(8).alignment = { horizontal: 'center', vertical: 'middle' }
      ws.getRow(8).values = columns.map((column) => column.header) as []
      ws.getRow(8).eachCell((cell, i) => {
        if (i === 2 || i === 3) {
          cell.alignment = { horizontal: 'left', vertical: 'middle' }
        }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } }
        cell.border = border
      })
    }
    {
      students.forEach((student, index) => {
        let evaluate = ''
        const total = student.present + student.late + student.absent
        const absentRate = (student.absent + Math.floor(student.late / 2)) / total
        if (total !== (isPratical ? 6 : 10)) evaluate = 'Chưa đủ buổi học'
        if (absentRate >= 0.3 && absentRate < 0.34) {
          evaluate = 'Cấm thi lần 1'
        } else if (absentRate >= 0.34) {
          evaluate = 'Học lại'
        } else {
          evaluate = 'Được phép thi'
        }
        const methodColumns = (isPratical ? pratical : theoretical).map((c) => c.key)
        const rowData: Record<Exclude<(typeof columns)[number]['key'], undefined>, any> = {
          index: index + 1,
          studentId: student.studentId,
          displayName: student.displayName,
          present: student.present,
          late: student.late,
          absent: student.absent,
          evaluate: evaluate
        }
        for (let i = 0; i < total; i++) {
          if (i < student.present) {
            rowData[methodColumns[i] as keyof typeof rowData] = 'O'
          } else if (i < student.present + student.late) {
            rowData[methodColumns[i] as keyof typeof rowData] = '-'
          } else {
            rowData[methodColumns[i] as keyof typeof rowData] = 'X'
          }
        }
        const row = ws.addRow(rowData)
        row.eachCell((cell) => (cell.border = border))
      })
    }
  }
  return await wb.xlsx.writeBuffer()
}

interface CreateReportByStudentOptions {
  student: M.User.Info<'student'>
  className: string
  attendances: M.Attendance.WithClass[]
  schedules: M.Schedule.Info[]
  faculties: M.Faculty.Info[]
  batches: M.Batch.Info[]
  courses: M.Course.Info[]
}

export async function createReportByStudent({
  student,
  className,
  attendances,
  schedules,
  courses,
  faculties,
  batches
}: CreateReportByStudentOptions) {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet(student.studentId)

  const batchName = batches.find((batch) => batch.batchId === student.batchId)!.name
  const facultyName = faculties.find((faculty) => faculty.facultyId === student.facultyId)!.name

  let maxLengthCourse = 0
  for (const schedule of schedules) {
    if (courses.some((course) => course.courseId === schedule.courseId)) {
      const course = courses.find((course) => course.courseId === schedule.courseId)!
      maxLengthCourse = Math.max(maxLengthCourse, course.name.length)
    }
  }

  const localCourses = sortBy(
    courses.filter((course) => schedules.some((schedule) => schedule.courseId === course.courseId)),
    'name'
  )
  const schedulesTheoretical = sortBy(
    schedules.filter((schedule) => schedule.method === 'theory'),
    'date'
  )
  const schedulesPratical = sortBy(
    schedules.filter((schedule) => schedule.method === 'practice'),
    'date'
  )

  const columns: Partial<ExcelJS.Column>[] = [
    { header: 'STT', key: 'index', width: 5, style: { alignment: { horizontal: 'center' } } },
    { header: 'Mã môn', key: 'courseId', width: 10 },
    { header: 'Tên môn', key: 'courseName', width: maxLengthCourse },
    { header: 'Có mặt', key: 'present', width: 8, style: { alignment: { horizontal: 'center' } } },
    { header: 'Muộn', key: 'late', width: 7, style: { alignment: { horizontal: 'center' } } },
    { header: 'Vắng', key: 'absent', width: 7, style: { alignment: { horizontal: 'center' } } },
    ...theoretical,
    {
      header: 'Đánh giá',
      key: 'evaluate',
      width: 15,
      style: { alignment: { horizontal: 'center' } }
    }
  ]

  ws.columns = columns.map((c) => {
    const { header, ...rest } = c
    return rest
  })

  ws.mergeCells('A1:Q2')
  ws.getCell('A1').value = `Điểm danh sinh viên ${student.displayName}`
  ws.getCell('A1').font = { size: 14, bold: true, ...font }
  ws.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' }
  ws.mergeCells('A4:C4')
  ws.getCell('A4').value = {
    richText: [
      { text: 'Lớp: ', font: { size: 12, bold: true, ...font } },
      { text: className, font: { size: 12, ...font } }
    ]
  }
  ws.getCell('A4').alignment = { vertical: 'middle', horizontal: 'left' }
  ws.getCell('A5').value = {
    richText: [
      { text: 'Khóa: ', font: { size: 12, bold: true, ...font } },
      { text: batchName, font: { size: 12, ...font } }
    ]
  }
  ws.getCell('A5').alignment = { vertical: 'middle', horizontal: 'left' }
  ws.mergeCells('A6:C6')
  ws.getCell('A6').value = {
    richText: [
      { text: 'Khoa: ', font: { size: 12, bold: true, ...font } },
      { text: facultyName, font: { size: 12, ...font } }
    ]
  }
  ws.getCell('A6').alignment = { vertical: 'middle', horizontal: 'left' }

  {
    ws.mergeCells('P4:Q4')
    ws.mergeCells('P5:Q5')
    ws.mergeCells('P6:Q6')

    ws.getCell('O4').value = 'O'
    ws.getCell('O4').font = { bold: true, ...font }
    ws.getCell('O4').alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getCell('O4').border = border
    ws.getCell('Q4').value = 'Có mặt'
    ws.getCell('Q4').font = { bold: true, ...font }
    ws.getCell('Q4').alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getCell('Q4').border = border
    ws.getCell('O5').value = 'X'
    ws.getCell('O5').font = { bold: true, ...font }
    ws.getCell('O5').alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getCell('O5').border = border
    ws.getCell('Q5').value = 'Muộn'
    ws.getCell('Q5').font = { bold: true, ...font }
    ws.getCell('Q5').alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getCell('Q5').border = border
    ws.getCell('O6').value = '-'
    ws.getCell('O6').font = { bold: true, ...font }
    ws.getCell('O6').alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getCell('O6').border = border
    ws.getCell('Q6').value = 'Vắng'
    ws.getCell('Q6').font = { bold: true, ...font }
    ws.getCell('Q6').alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getCell('Q6').border = border
  }

  ws.mergeCells('A7:Q7')
  ws.getCell('A7').font = { bold: true, ...font }
  ws.getCell('A7').alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getCell('A7').value = 'Lý Thuyết'

  ws.getRow(8).font = { bold: true, ...font }
  ws.getRow(8).alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getRow(8).values = columns.map((column) => column.header) as []
  ws.getRow(8).eachCell((cell, i) => {
    if (i === 2 || i === 3) {
      cell.alignment = { horizontal: 'left', vertical: 'middle' }
    }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } }
    cell.border = border
  })
  let index = 9
  for (const course of localCourses) {
    const map: number[] = []
    const theories = schedulesTheoretical.filter(
      (schedule) => schedule.courseId === course.courseId
    )
    for (const theory of schedulesTheoretical.filter(
      (schedule) => schedule.courseId === course.courseId
    )) {
      const s = attendances.find((attendance) => attendance.scheduleId === theory.scheduleId)!
      const sa = s.attendances.find((s) => s.studentId === student.docId)
      if (!sa) map.push(0)
      else {
        if (sa.status === 'present') map.push(1)
        else if (sa.status === 'late') map.push(2)
      }
    }
    if (!theories.some((theory) => course.courseId === theory.courseId)) continue
    const methodColumns = theoretical.map((c) => c.key as string)
    const present = map.filter((m) => m === 1).length
    const late = map.filter((m) => m === 2).length
    const absent = map.filter((m) => m === 0).length

    const rowData: Record<Exclude<(typeof columns)[number]['key'], undefined>, any> = {
      index: ++index - 9,
      courseId: course.code,
      courseName: course.name,
      present: present,
      late: late,
      absent: absent,
      evaluate: makeEvaluate(present, late, absent, methodColumns)
    }
    for (let i = 0; i < methodColumns.length; i++) {
      rowData[methodColumns[i] as keyof typeof rowData] =
        map[i] === 1 ? 'O' : map[i] === 2 ? 'X' : map[i] === 0 ? '-' : ''
    }
    const row = ws.addRow(rowData)
    row.eachCell((cell) => (cell.border = border))
  }
  index++
  ws.mergeCells(`A${index}:Q${index}`)
  ws.getCell(`A${index}`).font = { bold: true, ...font }
  ws.getCell(`A${index}`).alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getCell(`A${index}`).value = 'Thực Hành'

  index++
  ws.getRow(index).font = { bold: true, ...font }
  ws.getRow(index).alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getRow(index).values = columns.map((column) => column.header) as []
  ws.getRow(index).eachCell((cell, i) => {
    if (i === 2 || i === 3) {
      cell.alignment = { horizontal: 'left', vertical: 'middle' }
    }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } }
    cell.border = border
  })

  let index2 = 0
  for (const course of localCourses) {
    const map: number[] = []
    const pratices = schedulesPratical.filter((schedule) => schedule.courseId === course.courseId)
    for (const theory of pratices) {
      const s = attendances.find((attendance) => attendance.scheduleId === theory.scheduleId)!
      const sa = s.attendances.find((s) => s.studentId === student.docId)
      if (!sa) map.push(0)
      else {
        if (sa.status === 'present') map.push(1)
        else if (sa.status === 'late') map.push(2)
      }
    }
    if (!pratices.some((pratical) => course.courseId === pratical.courseId)) continue
    const methodColumns = theoretical.map((c) => c.key as string)
    const present = map.filter((m) => m === 1).length
    const late = map.filter((m) => m === 2).length
    const absent = map.filter((m) => m === 0).length
    const rowData: Record<Exclude<(typeof columns)[number]['key'], undefined>, any> = {
      index: ++index2,
      courseId: course.code,
      courseName: course.name,
      present: present,
      late: late,
      absent: absent,
      evaluate: makeEvaluate(present, late, absent, methodColumns)
    }
    for (let i = 0; i < methodColumns.length; i++) {
      rowData[methodColumns[i] as keyof typeof rowData] =
        map[i] === 1 ? 'O' : map[i] === 2 ? 'X' : map[i] === 0 ? '-' : ''
    }
    const row = ws.addRow(rowData)
    row.eachCell((cell) => (cell.border = border))
  }
  return await wb.xlsx.writeBuffer()
}

interface CreateReportByClassOptions {
  classData: M.Class.Info
  batches: M.Batch.Info[]
  faculties: M.Faculty.Info[]
  instructor: M.User.Info<'instructor'>
  schedules: M.Schedule.Info[]
  students: M.User.Info<'student'>[]
  attendances: M.Attendance.WithClass[]
  wb?: ExcelJS.Workbook
  ws?: ExcelJS.Worksheet
  write?: boolean
}

export async function createReportByClass({
  batches,
  classData,
  faculties,
  instructor,
  schedules,
  students,
  attendances,
  wb = new ExcelJS.Workbook(),
  ws = wb.addWorksheet(classData.shortName),
  write = true
}: CreateReportByClassOptions) {
  const batchName = batches.find((batch) => batch.batchId === classData.batchId)!.name
  const facultyName = faculties.find((faculty) => faculty.facultyId === classData.facultyId)!.name

  const maxLength = students.reduce((max, obj) => Math.max(max, obj.displayName.length + 3), 0)
  const columns: Partial<ExcelJS.Column>[] = [
    { header: 'STT', key: 'index', width: 5, style: { alignment: { horizontal: 'center' } } },
    { header: 'Mã học sinh', key: 'studentId', width: 12 },
    { header: 'Họ và tên', key: 'displayName', width: maxLength },
    { header: 'Có mặt', key: 'present', width: 10, style: { alignment: { horizontal: 'center' } } },
    { header: 'Muộn', key: 'late', width: 10, style: { alignment: { horizontal: 'center' } } },
    { header: 'Vắng', key: 'absent', width: 10, style: { alignment: { horizontal: 'center' } } },
    {
      header: 'Đánh giá',
      key: 'evaluate',
      width: 15,
      style: { alignment: { horizontal: 'center' } }
    }
  ]

  ws.columns = columns.map((c) => {
    const { header, ...rest } = c
    return rest
  })
  {
    ws.mergeCells('A1:G2')
    ws.getCell('A1').value = `Điểm danh lớp ${classData.shortName}`
    ws.getCell('A1').font = { size: 14, bold: true, ...font }
    ws.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' }
    ws.mergeCells('A4:C4')
    ws.getCell('A4').value = {
      richText: [
        { text: 'Khoá: ', font: { size: 12, bold: true, ...font } },
        { text: batchName, font: { size: 12, ...font } }
      ]
    }
    ws.getCell('A4').alignment = { vertical: 'middle', horizontal: 'left' }
    ws.getCell('A5').value = {
      richText: [
        { text: 'Khoa: ', font: { size: 12, bold: true, ...font } },
        { text: facultyName, font: { size: 12, ...font } }
      ]
    }
    ws.getCell('A5').alignment = { vertical: 'middle', horizontal: 'left' }
    ws.mergeCells('A6:C6')
    ws.getCell('A6').value = {
      richText: [
        { text: 'Giảng viên: ', font: { size: 12, bold: true, ...font } },
        { text: instructor.displayName, font: { size: 12, ...font } }
      ]
    }
    ws.getCell('A6').alignment = { vertical: 'middle', horizontal: 'left' }
  }
  {
    ws.getRow(8).font = { bold: true, ...font }
    ws.getRow(8).alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getRow(8).values = columns.map((column) => column.header) as []
    ws.getRow(8).eachCell((cell, i) => {
      if (i === 2 || i === 3) {
        cell.alignment = { horizontal: 'left', vertical: 'middle' }
      }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } }
      cell.border = border
    })
  }

  let index = 1

  for (const student of sortBy(students, 'displayName')) {
    const rowData: Record<Exclude<(typeof columns)[number]['key'], undefined>, any> = {
      index: index++,
      studentId: student.studentId,
      displayName: student.displayName,
      present: 0,
      late: 0,
      absent: 0,
      evaluate: ''
    }
    for (const schedule of schedules) {
      const s = attendances.find((attendance) => attendance.scheduleId === schedule.scheduleId)!
      const sa = s.attendances.find((s) => s.studentId === student.docId)
      if (!sa) rowData.absent++
      else {
        if (sa.status === 'present') rowData.present++
        else if (sa.status === 'late') rowData.late++
      }
    }
    const row = ws.addRow(rowData)
    row.eachCell((cell) => (cell.border = border))
  }
  if (write) return await wb.xlsx.writeBuffer()
  return ws
}

interface CreateReportByScheduleOptions {
  schedule: M.Schedule.Info
  batches: M.Batch.Info[]
  faculties: M.Faculty.Info[]
  attendances: M.Attendance.WithClass
  students: M.User.Info<'student'>[]
  instructor: M.User.Info<'instructor'>
  classes: M.Class.Info[]
}

export async function createReportBySchedule({
  schedule,
  students,
  attendances,
  instructor,
  batches,
  faculties,
  classes
}: CreateReportByScheduleOptions) {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet()
  const classData = classes.find((c) => c.classId === schedule.classId)!
  const batchName = batches.find((batch) => batch.batchId === classData.batchId)!.name
  const facultyName = faculties.find((faculty) => faculty.facultyId === classData.facultyId)!.name

  const maxLength = students.reduce((max, obj) => Math.max(max, obj.displayName.length + 3), 0)
  const columns: Partial<ExcelJS.Column>[] = [
    { header: 'STT', key: 'index', width: 5, style: { alignment: { horizontal: 'center' } } },
    { header: 'Mã học sinh', key: 'studentId', width: 12 },
    { header: 'Họ và tên', key: 'displayName', width: maxLength },
    { header: 'Có mặt', key: 'present', width: 10, style: { alignment: { horizontal: 'center' } } },
    { header: 'Muộn', key: 'late', width: 10, style: { alignment: { horizontal: 'center' } } },
    { header: 'Vắng', key: 'absent', width: 10, style: { alignment: { horizontal: 'center' } } },
    {
      header: 'Đánh giá',
      key: 'evaluate',
      width: 15,
      style: { alignment: { horizontal: 'center' } }
    }
  ]

  ws.columns = columns.map((c) => {
    const { header, ...rest } = c
    return rest
  })
  {
    ws.mergeCells('A1:G2')
    ws.getCell('A1').value = `Điểm danh lớp ${classData.shortName}`
    ws.getCell('A1').font = { size: 14, bold: true, ...font }
    ws.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' }
    ws.mergeCells('A4:C4')
    ws.getCell('A4').value = {
      richText: [
        { text: 'Khoá: ', font: { size: 12, bold: true, ...font } },
        { text: batchName, font: { size: 12, ...font } }
      ]
    }
    ws.getCell('A4').alignment = { vertical: 'middle', horizontal: 'left' }
    ws.getCell('A5').value = {
      richText: [
        { text: 'Khoa: ', font: { size: 12, bold: true, ...font } },
        { text: facultyName, font: { size: 12, ...font } }
      ]
    }
    ws.getCell('A5').alignment = { vertical: 'middle', horizontal: 'left' }
    ws.mergeCells('A6:C6')
    ws.getCell('A6').value = {
      richText: [
        { text: 'Giảng viên: ', font: { size: 12, bold: true, ...font } },
        { text: instructor.displayName, font: { size: 12, ...font } }
      ]
    }
    ws.getCell('A6').alignment = { vertical: 'middle', horizontal: 'left' }
  }

  {
    ws.getCell('F4').value = 'O'
    ws.getCell('F4').font = { bold: true, ...font }
    ws.getCell('F4').alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getCell('F4').border = border
    ws.getCell('G4').value = 'Có mặt'
    ws.getCell('G4').font = { bold: true, ...font }
    ws.getCell('G4').alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getCell('G4').border = border
    ws.getCell('F5').value = 'X'
    ws.getCell('F5').font = { bold: true, ...font }
    ws.getCell('F5').alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getCell('F5').border = border
    ws.getCell('G5').value = 'Muộn'
    ws.getCell('G5').font = { bold: true, ...font }
    ws.getCell('G5').alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getCell('G5').border = border
    ws.getCell('F6').value = '-'
    ws.getCell('F6').font = { bold: true, ...font }
    ws.getCell('F6').alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getCell('F6').border = border
    ws.getCell('G6').value = 'Vắng'
    ws.getCell('G6').font = { bold: true, ...font }
    ws.getCell('G6').alignment = { horizontal: 'center', vertical: 'middle' }
    ws.getCell('G6').border = border
  }

  ws.getRow(8).font = { bold: true, ...font }
  ws.getRow(8).alignment = { horizontal: 'center', vertical: 'middle' }
  ws.getRow(8).values = columns.map((column) => column.header) as []
  ws.getRow(8).eachCell((cell, i) => {
    if (i === 2 || i === 3) {
      cell.alignment = { horizontal: 'left', vertical: 'middle' }
    }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } }
    cell.border = border
  })

  let index = 1
  for (const student of students) {
    const rowData: Record<Exclude<(typeof columns)[number]['key'], undefined>, any> = {
      index: index++,
      studentId: student.studentId,
      displayName: student.displayName,
      present: '',
      late: '',
      absent: '',
      evaluate: ''
    }
    const s = attendances.attendances.find((s) => s.studentId === student.docId)
    if (!s) rowData.absent = '-'
    else if (s.status === 'present') rowData.present = 'O'
    else if (s.status === 'late') rowData.late = 'X'

    const row = ws.addRow(rowData)
    row.eachCell((cell) => (cell.border = border))
  }

  return await wb.xlsx.writeBuffer()
}
