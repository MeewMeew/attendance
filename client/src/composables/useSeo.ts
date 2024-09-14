import { useHead, useSeoMeta } from '@vueuse/head'

const useSeo = () => {
  useHead({
    title: 'Smart Attendance System',
    titleTemplate: (title) => `${title} | Smart Attendance System`,
    meta: [
      {
        name: 'author',
        content: '@mewthedev'
      },
      {
        name: 'description',
        content: "The world's leading online attendance application using QR codes."
      }
    ]
  })
  useSeoMeta({
    title: 'Smart Attendance System',
    description: "The world's leading online attendance application using QR codes.",
    ogDescription: "The world's leading online attendance application using QR codes.",
    ogTitle: 'Smart Attendance System',
    ogImage: '/images/banner.png',
    // ogImageHeight: '882',
    // ogImageWidth: '1686',
    twitterCard: 'summary_large_image',
    twitterImage: '/images/banner.png',
    twitterTitle: 'Smart Attendance System',
    twitterDescription: "The world's leading online attendance application using QR codes."
  })
}
export { useSeo }
