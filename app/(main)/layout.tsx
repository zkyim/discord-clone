import NavigationSidebar from '@/components/navigation/NavigationSidebar'
import React from 'react'

const MainLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className='h-full'>
      <div className='flex h-full w-[72px] z-30 flex-col fixed -left-48 inset-y-0 md:left-0'>
        <NavigationSidebar />
      </div>
      <main className='md:pl-[72px] h-full'>
        {children}
      </main>
    </div>
  )
}

export default MainLayout
