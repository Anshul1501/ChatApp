import React, { useState } from 'react';
import useLogin from '../../hooks/useLogin';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className='flex flex-col items-center justify-center min-w-96 max-auto'>
      <div className='w-full p-6 rounded-lg shadow-md bg-grey-500 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 '>
        <h1 className='text-3xl font-semibold text-center text-black'>
          Login <span className='text-blue-500 ml-4'>ChatApp</span>
        </h1>

        {/* FORM, USER LOGIN */}
        <form onSubmit={handleSubmit}>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text text-white mt-3'> Username </span>
            </label>
            <input
              type="text"
              placeholder='Enter username'
              className='w-full input input-bordered h-10'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className='label p-2'>
              <span className='text-base label-text text-white mt-3'> Password</span>
            </label>
            <input
              type="password"
              placeholder='Enter Password'
              className='w-full input input-bordered h-10'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <a href='/signup' className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block'>
            {"Don't"} have an account?
          </a>

          <button className={`btn btn-block btn-sm mt-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
            {loading ? <span className='loading loading-spinner'></span> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
