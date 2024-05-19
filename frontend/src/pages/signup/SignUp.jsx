import {React, useState} from 'react'
import GenderCheckBox from './GenderCheckBox';
import useSignup from '../../hooks/useSignup';


const SignUp = () => {
  const [inputs, setInputs] = useState({
    fullName: '', 
    username: '',
    password: '',
    confirmPassword: '',
    gender: '', 
  });
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  }

  const handleOnCheckBoxChange = (gender) => {
    setInputs({ ...inputs, gender });
  }

  const { loading, signup } = useSignup();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs)
  }

  return (
    <div className='flex flex-col items-center justify-center min-w-96 max-auto'>
      <div className='w-full p-6 rounded-lg shadow-md bg-grey-500 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 '>
        <h1 className='text-3xl font-semibold text-center text-black'> Sign Up
          <span className='text-blue-500 ml-4'>ChatApp</span>
        </h1>

        {/* FORM, USER Sign Up */}
        <form onSubmit={handleOnSubmit}>
          {/* Full Name */}
          <div>
            <label className='label p-2'>
              <span className='text-base label-text text-white mt-3'> Full Name</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder='Enter Your Full Name'
              className='w-full input input-bordered h-10'
              value={inputs.fullName}
              onChange={handleOnChange}
            />
          </div>

          {/* username */}
          <div>
            <label className='label p-2'>
              <span className='text-base label-text text-white mt-3'> username </span>
            </label>
            <input
              type="text"
              name="username"
              placeholder='Enter username'
              className='w-full input input-bordered h-10'
              value={inputs.username}
              onChange={handleOnChange}
            />
          </div>

          {/* Password */}
          <div>
            <label className='label p-2'>
              <span className='text-base label-text text-white mt-3'> Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder='Enter Password'
              className='w-full input input-bordered h-10'
              value={inputs.password}
              onChange={handleOnChange}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className='label p-2'>
              <span className='text-base label-text text-white mt-3'> Confirm Password</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder='Confirm Password'
              className='w-full input input-bordered h-10'
              value={inputs.confirmPassword}
              onChange={handleOnChange}
            />
          </div>

          {/* Gender Selection */}
          <GenderCheckBox onCheckBoxChange={handleOnCheckBoxChange} selectedGender={inputs.gender} />

          {/* Link to Login */}
          <a href='/login' className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block cursor-pointer'>
            Already have an account?
          </a>

          {/* Submit Button */}
          <button type='submit' className='btn btn-block btn-sm mt-2' disabled={loading}>
            {loading ? <span className='loading loading-spinner'></span> : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}


export default SignUp;

//STATER CODE SNIPPET

// import React from 'react'
//import GenderCheckBox from './GenderCheckBox';
//
//const SingUp = () => {
//  return (
//    <div className='flex flex-col items-center justify-center min-w-96 max-auto'>
//    <div className='w-full p-6 rounded-lg shadow-md bg-grey-500 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 '>
//      <h1 className='text-3xl font-semibold text-center text-black'> Singup 
//     <span className='text-blue-500 ml-4'>ChatApp</span>
//      </h1>
//
//      {/* FORM, USER SingUp */}
//
//      <form>
//      <div>
//          <label className='label p-2'> <span className='text-base label-text text-white mt-3'> Full Name</span> </label>
//          <input type="text" placeholder='Enter Your Full Name' className='w-full input input-bordered h-10' />
//        </div>
//
//        <div>
//          <label className='label p-2'> <span className='text-base label-text text-white mt-3'> username </span> </label>
//          <input type="text" placeholder='Enter username' className='w-full input input-bordered h-10' />
//        </div>
//
//        <div>
//          <label className='label p-2'> <span className='text-base label-text text-white mt-3'> Password</span> </label>
//          <input type="password" placeholder='Enter Password' className='w-full input input-bordered h-10' />
//        </div>
//
//        <GenderCheckBox/>
//
//        <a href='#' className='text-sm hover:underline mt-2 hover:text-blue-600 mt-2 inline-block'>
//          Already have an account?
//        </a>
//
//        <div className='btn btn-block btn-sm mt-2'>Sing Up</div>
//
//      </form>
//
//    </div>
//</div>
//  )
//}
//
// export default SingUp;