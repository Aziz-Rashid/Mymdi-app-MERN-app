import React, { useState, useEffect } from 'react'
import { Inputfield } from '../../mydmdi-components/styles'
import { CButton } from '@coreui/react'
import axios from 'axios';
import UpdateUser from './updateUser';
const UserProfile = () => {
    const { endpoint } = process.env
    const logindata = localStorage.getItem('user')
    const logindatameta = localStorage.getItem('usermeta')
    const data = JSON.parse(logindata)
    const [useExist, setUserExist] = useState()
    const [Updateuserpage, setUpdateuserpage] = useState(true)
    const [userInfo, setUserInfo] = useState({
        firstname: "",
        lastname: "",
        phone: "" || data?.data?.to,
        wallet: "" || logindatameta,
        username: "",
        email: ""
    })
    const InputHandler = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        })
    }
    const getbyphone = async () => {
        if (logindata !== null) {
            try {
                const response = await axios.post(`${endpoint}/getUserbyphone`, {
                    phone: data.data.to
                });
                if (response) {
                    setUserExist(response.data)
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                const response = await axios.post(`${endpoint}/getUserbywallet`, {
                    wallet: logindatameta
                });
                if (response) {
                    setUserExist(response.data)
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
    useEffect(() => {
        getbyphone()
    }, [])
    const saveUserInfo = async () => {
        if (userInfo.firstname !== "" && userInfo.lastname !== "" && userInfo.phone !== "" && userInfo.email !== "" && userInfo.wallet !== "" && userInfo.username !== "") {
            try {
                const response = await axios.post(`${endpoint}/userProfile`, {
                    userInfo
                });
                if (response) {
                    getbyphone()
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            alert("fill all fields")
        }
    }

    const UpdateUsers = async (data) => {
        console.log(data)
        try {
            const response = await axios.put(`${endpoint}/updateUser`, {
                data,
                id: data._id
            });
            if (response) {
                getbyphone()
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            {Updateuserpage ? (
                <>
                    <h3>User Profile Information</h3>
                    {!useExist ? (
                        <div style={{ width: '50%', margin: 'auto' }}>
                            <p style={{ marginBottom: '5px' }}>First Name</p>
                            <Inputfield type="text" value={userInfo.firstname} name="firstname" onChange={(e) => InputHandler(e)} />
                            <br />
                            <p style={{ marginBottom: '5px' }}>Last Name</p>
                            <Inputfield type="text" value={userInfo.lastname} name="lastname" onChange={(e) => InputHandler(e)} />
                            <br />
                            <p style={{ marginBottom: '5px' }}>Username</p>
                            <Inputfield type="text" value={userInfo.username} name="username" onChange={(e) => InputHandler(e)} />
                            <br />
                            <p style={{ marginBottom: '5px' }}>Email</p>
                            <Inputfield type="text" value={userInfo.email} name="email" onChange={(e) => InputHandler(e)} />
                            <br />
                            <p style={{ marginBottom: '5px' }}>Metamsk Wallet Address</p>
                            <Inputfield type="text" value={userInfo.wallet} name="wallet" onChange={(e) => InputHandler(e)} />
                            <br />
                            <p style={{ marginBottom: '5px' }}>Phone #</p>
                            <Inputfield type="text" value={userInfo.phone} name="phone" onChange={(e) => InputHandler(e)} />
                            <CButton style={{ width: '100%' }} component="input" type="button" onClick={() => saveUserInfo()} color="primary" className="px-4">Save</CButton>
                        </div>
                    ) : (
                            <div style={{ width: '70%', margin: 'auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <p>FirstName: {useExist?.firstname}</p>
                                        <p>LastName: {useExist?.lastname}</p>
                                        <p>Email: {useExist?.email}</p>
                                    </div>
                                    <div>
                                        <p>Metamask Wallet: {useExist?.wallet}</p>
                                        <p>Username: {useExist?.username}</p>
                                        <p>Phone: {useExist?.phone}</p>
                                    </div>
                                </div>
                                <CButton style={{ width: '100%' }} component="input" type="button" color="primary" className="px-4" onClick={() => setUpdateuserpage(false)}>Update User</CButton>
                            </div>
                        )}
                </>
            ) : <UpdateUser UpdateUsers={UpdateUsers} setUpdateuserpage={setUpdateuserpage} userInfo={useExist} />}
        </>
    )
}
export default UserProfile