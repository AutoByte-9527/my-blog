import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import useSWR from 'swr'
import { getCategories, getTags } from '@/lib/api'
import { useAppStore } from '@/stores/appStore'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'

function AppLayout() {
  const location = useLocation()
  const { data: categories } = useSWR('categories', getCategories)
  const { data: tags } = useSWR('tags', getTags)
  const setCategories = useAppStore((state) => state.setCategories)
  const setTags = useAppStore((state) => state.setTags)

  useEffect(() => {
    if (categories) setCategories(categories)
    if (tags) setTags(tags)
  }, [categories, tags, setCategories, setTags])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <div key={location.pathname} className="page-animate">
          <Outlet />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}

export default AppLayout
