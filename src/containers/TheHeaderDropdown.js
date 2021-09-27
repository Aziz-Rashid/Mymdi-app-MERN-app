import React from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import { useHistory } from "react-router-dom";

const TheHeaderDropdown = () => {
  const history = useHistory();
  const userdata = localStorage.getItem('user')
  const data = JSON.parse(userdata)
  const userdatas = localStorage.getItem('usermeta')

  const logOut = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('usermeta')
    history.push('/login')
    window.location.reload()
  };

  return (
    <>
      {userdata !== null && (
        <p style={{ margin: '0px' }}>{data.data?.to}</p>
      )}
      {userdatas !== null && (
        <p style={{ margin: '0px' }}>{userdatas}</p>
      )}
      <CDropdown
        inNav
        className="c-header-nav-items mx-2"
        direction="down"
      >
        <CDropdownToggle className="c-header-nav-link" caret={false}>
          <div className="c-avatar">
            <CImg
              src={'avatars/6.jpg'}
              className="c-avatar-img"
              alt="admin@bootstrapmaster.com"
            />
          </div>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownItem onClick={logOut} >
            Logout
        </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </>
  )
}

export default TheHeaderDropdown
