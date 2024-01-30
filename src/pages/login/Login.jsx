import React,{useEffect, useRef} from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import { AuthProvider } from '../../context/auth/AuthContext'



const LoginPage = () => {
    const auth = useAuth()
    const emailRef = useRef()
    const passwordRef = useRef()
    const navigate = useNavigate()

    const handleSignIn = () => {
        auth.SignIn(emailRef.current.value, passwordRef.current.value, )
    }

    const handleSignInWithGoogle = (e) => {
        auth.SignInWithGoogle()
    }
    
    useEffect(()=>{
        if(auth.currentUser){
            navigate('/dashboard')
        }
    },[auth.currentUser, navigate])

  return (
    <>
    <AuthProvider> 
       
        <div className='login-container' style={{backgroundColor:"#545763"}}>
            <div className='login'>
                <div className='content-login left'>
                    <div className='spacer'></div>
                    <div className='login-form-container'>
                        <div className='loing-form-container-heading'>
                            <div className='loing-form-container-heading-wrapper'>
                                <p>{'start_your_journey'}</p>
                                <h1>{'login_to_your_account'}</h1>
                                <p>{'dont_have_account'} <Link to={'/SignupPage'} style={{textDecoration: 'none'}}><span>{('signup')}</span></Link></p>
                            </div>
                        </div>
                        <div className="login-form">
                            <i className="fa fa-envelope" aria-hidden="true"></i>
                            <input ref={emailRef} type='email' name="email" placeholder={('email')}/>
                            <i className="fa fa-lock" aria-hidden="true"></i>
                            <input ref={passwordRef} type='password' name="password" placeholder={('password')}/>
                            <div className='login-buttons'>
                                    
                                    <button type='submit' onClick={()=> handleSignIn()} className='login-button'>{('login')}</button>
                                    
                                <div className='login-with-google' onClick={()=> handleSignInWithGoogle()}>
                                <p><img src='https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' alt="Google Icon"  height="20px" /> <span>{('sign-in-with-google')}</span></p>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className='content right'>
                </div>
            </div>
        </div>
    </AuthProvider>
    </>
  )
}

export default LoginPage