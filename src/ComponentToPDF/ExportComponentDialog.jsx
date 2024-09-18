import React from 'react'
import ExportToPDFHOC from './ExportHOC'
import AdminSchedulesPage from '../pages/UsersPages/admin/admin_pages/admin_schedules/admin_schedules'

const ExportComponentDialog = ({fileName }) => {
  return (
    <ExportToPDFHOC fileName={fileName}>
        <AdminSchedulesPage />
      </ExportToPDFHOC>
  )
}

export default ExportComponentDialog