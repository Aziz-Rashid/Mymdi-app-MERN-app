import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PhoneInput from 'react-phone-number-input'
import axios from 'axios';
import Web3 from 'web3'


import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInputGroup,
  CRow
} from '@coreui/react'
import { useHistory } from "react-router-dom";

const Login = () => {
  const { endpoint } = process.env
  const history = useHistory();
  const [value, setValue] = useState('')
  const [otp, setOtp] = useState('')
  const [togle, setTogle] = useState(false)
  const [verify, setverify] = useState(false)

  const [togleMetamask, setTogleMetamask] = useState(false)

  const verifyOtp = async () => {
    if (otp !== '') {
      try {
        const response = await axios.post(`${endpoint}/verify`, {
          code: otp,
          num: value
        });
        if (response) {
          const data = await JSON.stringify(response)
          if (response.data.valid === true) {
            localStorage.setItem('user', data)
            window.location.reload()
          } else {
            alert("wrong otp")
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  const submitOptNumber = async () => {
    if (value !== "") {
      try {
        const response = await axios.post(`${endpoint}/`, {
          value
        });
        if (response) {
          setverify(true)
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("put your number")
    }
  }
  const connectMetamask = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      localStorage.setItem('usermeta', account)
      history.push('/dashboard')
      window.location.reload()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

  }
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    {verify === false && (
                      <>
                        <CInputGroup className="mb-3">
                          {togle === false && togleMetamask === false && (
                            <CButton component="input" type="button" onClick={() => setTogle(true)} color="primary" className="px-4">Login with Phone</CButton>
                          )}
                          {togleMetamask === false && togle === false && (
                            <CButton style={{ marginLeft: '10px' }} variant="outline" component="input" type="button" onClick={() => {
                              setTogle(false)
                              setTogleMetamask(true)
                            }
                            } color="primary" className="px-4">Login with Metamask</CButton>
                          )}

                          {togle && (
                            <>
                              <PhoneInput
                                value={value}
                                defaultCountry="PK"
                                autoFocus
                                placeholder="Enter your Phone no #"
                                onChange={setValue} />
                              <br />
                              <CButton style={{ marginLeft: '10px' }} component="input" type="button" onClick={submitOptNumber} color="primary" className="px-4">Send Otp</CButton>
                            </>
                          )}
                        </CInputGroup>
                        <CInputGroup className="mb-3">

                          {togleMetamask && (
                            <CButton component="input" type="button" onClick={() => connectMetamask()} color="primary" className="px-4">Connect Metamask</CButton>
                          )}
                        </CInputGroup>

                      </>
                    )}
                    {verify && (
                      <>
                        <input type="text" placeholder="type Otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
                        <CButton style={{ marginLeft: '10px' }} component="input" type="button" onClick={() => verifyOtp()} color="primary" className="px-4">Login</CButton>
                      </>
                    )}
                    <CRow>
                      <CCol xs="6">
                        {/* <CButton component="input" type="button" onClick={e => logIn()} color="primary" className="px-4">Login</CButton> */}
                      </CCol>
                      {/* <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">Forgot password?</CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>Register Now!</CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
