<script setup lang="ts">
import { ArrowTopRightIcon } from '@radix-icons/vue'
import { CurveType } from '@unovis/ts'
import { onMounted, ref } from 'vue'

import { Card, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { AreaChart } from '@/components/ui/chart-area'
import { Batch, Class, Course, Faculty, Instructor, Student } from '@/database'

const classCount = ref(0)
const facultyCount = ref(0)
const batchCount = ref(0)
const courseCount = ref(0)
const studentCount = ref(0)
const instructorCount = ref(0)

const data = ref([
  {
    name: 'Instructors',
    data: instructorCount
  },
  {
    name: 'Students',
    data: studentCount
  },
  {
    name: 'Classes',
    data: classCount
  },
  {
    name: 'Faculties',
    data: facultyCount
  },
  {
    name: 'Batches',
    data: batchCount
  },
  {
    name: 'Courses',
    data: courseCount
  }
])

onMounted(() => {
  Student.getCount().then((count) => {
    studentCount.value = count
  })
  Instructor.getCount().then((count) => {
    instructorCount.value = count
  })
  Class.getCount().then((count) => {
    classCount.value = count
  })
  Faculty.getCount().then((count) => {
    facultyCount.value = count
  })
  Batch.getCount().then((count) => {
    batchCount.value = count
  })
  Course.getCount().then((count) => {
    courseCount.value = count
  })
})
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center gap-4 md:gap-10">
    <div
      class="grid w-full grid-cols-1 gap-4 sm:col-span-1 md:grid-cols-2 lg:m-0 lg:grid-cols-4 xl:grid-cols-6"
    >
      <router-link to="/admin/instructors" class="group">
        <Card>
          <CardHeader>
            <CardDescription>
              <div class="flex flex-row items-center justify-between">
                <p class="text-xl group-hover:text-primary group-hover:underline">Instructors</p>
                <ArrowTopRightIcon
                  stroke-width="3px"
                  class="h-4 w-4 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                />
              </div>
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <p class="text-start text-6xl opacity-80">{{ instructorCount }}</p>
          </CardFooter>
        </Card>
      </router-link>
      <router-link to="/admin/students" class="group">
        <Card>
          <CardHeader>
            <CardDescription>
              <div class="flex flex-row items-center justify-between">
                <p class="text-xl group-hover:text-primary group-hover:underline">Students</p>
                <ArrowTopRightIcon
                  stroke-width="3px"
                  class="h-4 w-4 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                />
              </div>
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <p class="text-start text-6xl opacity-80">{{ studentCount }}</p>
          </CardFooter>
        </Card>
      </router-link>
      <router-link to="/admin/faculties" class="group">
        <Card>
          <CardHeader>
            <CardDescription>
              <div class="flex flex-row items-center justify-between">
                <p class="text-xl group-hover:text-primary group-hover:underline">Faculties</p>
                <ArrowTopRightIcon
                  stroke-width="3px"
                  class="h-4 w-4 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                />
              </div>
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <p class="text-start text-6xl opacity-80">{{ facultyCount }}</p>
          </CardFooter>
        </Card>
      </router-link>
      <router-link to="/admin/batches" class="group">
        <Card>
          <CardHeader>
            <CardDescription>
              <div class="flex flex-row items-center justify-between">
                <p class="text-xl group-hover:text-primary group-hover:underline">Batches</p>
                <ArrowTopRightIcon
                  stroke-width="3px"
                  class="h-4 w-4 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                />
              </div>
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <p class="text-start text-6xl opacity-80">{{ batchCount }}</p>
          </CardFooter>
        </Card>
      </router-link>
      <router-link to="/admin/classes" class="group">
        <Card>
          <CardHeader>
            <CardDescription>
              <div class="flex flex-row items-center justify-between">
                <p class="text-xl group-hover:text-primary group-hover:underline">Classes</p>
                <ArrowTopRightIcon
                  stroke-width="3px"
                  class="h-4 w-4 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                />
              </div>
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <p class="text-start text-6xl opacity-80">{{ classCount }}</p>
          </CardFooter>
        </Card>
      </router-link>
      <router-link to="/admin/courses" class="group">
        <Card>
          <CardHeader>
            <CardDescription>
              <div class="flex flex-row items-center justify-between">
                <p class="text-xl group-hover:text-primary group-hover:underline">Courses</p>
                <ArrowTopRightIcon
                  stroke-width="3px"
                  class="h-4 w-4 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                />
              </div>
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <p class="text-start text-6xl opacity-80">{{ courseCount }}</p>
          </CardFooter>
        </Card>
      </router-link>
    </div>
    <div class="flex w-full flex-col justify-center space-y-5 xl:space-y-10">
      <div>
        <p class="text-center text-2xl font-semibold">Overview</p>
      </div>
      <AreaChart
        :data="data"
        index="name"
        :categories="['data']"
        :show-grid-line="false"
        :show-legend="false"
        :show-x-axis="false"
        :show-y-axis="false"
        :curve-type="CurveType.Linear"
      />
    </div>
  </div>
</template>

<style scoped lang="css"></style>
