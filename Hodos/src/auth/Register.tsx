import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../components/utils';
import '../styles/Register.css'


const Register: React.FC = () => {

    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        company: '',
        employee_id: '',
        position: '',
        department: ''
    })
    const navigate = useNavigate();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignupInfo((prev) => ({ ...prev, [name]: value }));
    }

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, email, password, company, employee_id, position, department } = signupInfo;
        if (!name || !email || !password || !company || !employee_id || !position ||!department) {
            return handleError('Please fill all fields!!')
        }
        try {
            const url = `${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login')
                }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            if (err instanceof Error) {
                handleError(err.message);
            } else {
                handleError(String(err));
            }
        }
    }


    return (
        <div className='registerPage'>
            <h1>Register</h1>

            <form onSubmit={handleSignup} className='registerForm'>
                <input type="text" onChange={handleChange} name="name" value={signupInfo.name} placeholder="Enter Name" required />
                <input type="email" onChange={handleChange} name="email" value={signupInfo.email} placeholder="Enter Your Work Email" required />
                <input type="text" onChange={handleChange} name="company" value={signupInfo.company} placeholder="Enter Company" required />
                <input type="text" onChange={handleChange} name="employee_id" value={signupInfo.employee_id} placeholder="Enter Your Id" required />
                <input type="text" onChange={handleChange} name="position" value={signupInfo.position} placeholder="Enter Your Position" required />
                <input type="text" onChange={handleChange} name="department" value={signupInfo.department} placeholder="Enter Your Department" required />
                <input type="password" onChange={handleChange} name="password" value={signupInfo.password} placeholder="Enter Password" required />
                <button type='submit'>Register</button>
                <span className='registerFooter'>Already have an account ?
                    <Link to="/login">Login</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Register
