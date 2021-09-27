import React, { useState } from 'react';
import { Inputfield } from '../../mydmdi-components/styles'
import { CButton } from '@coreui/react'

const UpdateUser = ({ userInfo,setUpdateuserpage,UpdateUsers }) => {
    const [usersInfo, setUsersInfo] = useState(userInfo)
    const InputHandler = (e) => {
        setUsersInfo({
            ...usersInfo,
            [e.target.name]: e.target.value
        })
    }
    return (
        <div style={{ width: '50%', margin: 'auto' }}>
            {userInfo && (
                <>
                    <p style={{ marginBottom: '5px' }}>First Name</p>
                    <Inputfield type="text" value={usersInfo.firstname} name="firstname" onChange={(e) => InputHandler(e)} />
                    <br />
                    <p style={{ marginBottom: '5px' }}>Last Name</p>
                    <Inputfield type="text" value={usersInfo.lastname} name="lastname" onChange={(e) => InputHandler(e)} />
                    <br />
                    <p style={{ marginBottom: '5px' }}>Username</p>
                    <Inputfield type="text" value={usersInfo.username} name="username" onChange={(e) => InputHandler(e)} />
                    <br />
                    <p style={{ marginBottom: '5px' }}>Email</p>
                    <Inputfield type="text" value={usersInfo.email} name="email" onChange={(e) => InputHandler(e)} />
                    <br />
                    <p style={{ marginBottom: '5px' }}>Metamsk Wallet Address</p>
                    <Inputfield type="text" value={usersInfo.wallet} name="wallet" onChange={(e) => InputHandler(e)} />
                    <br />
                    <p style={{ marginBottom: '5px' }}>Phone #</p>
                    <Inputfield type="text" value={usersInfo.phone} name="phone" onChange={(e) => InputHandler(e)}  />
                    <CButton style={{ width: '47%',marginRight:'32px'}} component="input" type="button" color="secondary" className="px-4" onClick={() => setUpdateuserpage(true)}>Cencel</CButton>
                    <CButton style={{ width: '47%'}} component="input" type="button" color="primary" className="px-4" onClick={() => {
                        UpdateUsers(usersInfo)
                        setUpdateuserpage(true)
                    }}>Update User</CButton>
                </>
            )}
        </div>
    )
}
export default UpdateUser