// import AdminPage from '@/components/dashboard-contents/AdminPage'
'use client'
import React from 'react'

import dynamic from 'next/dynamic'
 
const DynamicAdminPageWithNoSSR = dynamic(
  () => import('../../../components/dashboard-contents/AdminPage'),
  { ssr: false }
)

function AdminView() {
  return (
    <DynamicAdminPageWithNoSSR />
  )
}

export default AdminView