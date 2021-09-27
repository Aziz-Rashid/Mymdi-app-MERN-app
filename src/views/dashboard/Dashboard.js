import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CButton,
  CModalBody,
  CModalTitle,
} from '@coreui/react'

import Upload from 'src/mydmdi-components/Upload.js'

const Dashboard = () => {
  const [modal, setModal] = useState(false);

  const closeModal = () => setModal(false);

  return (
    <>
      <CCard>
        <CCardBody>
          <CRow>

            <CCol xs="12">
              <CModal  
                show={modal}
                onClose={() => setModal(!modal)}
                size="lg"
              >
                <CModalHeader closeButton>
                  <CModalTitle>Upload Widget</CModalTitle>
                </CModalHeader>

                <CModalBody>
                  <Upload isModalOpen={modal} closeModal={closeModal} />
                </CModalBody>

              </CModal>
            </CCol>

            <CCol xs={12}>              
              <CButton onClick={() => setModal(!modal)} variant="outline" color="primary">Upload</CButton>
            </CCol>
            
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
