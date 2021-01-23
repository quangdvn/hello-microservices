import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const signUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { dispatchRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await dispatchRequest();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <div className='form-group'>
        <label>Email</label>
        <input
          className='form-control'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className='form-group'>
        <label>Password</label>
        <input
          className='form-control'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {errors}
      <button className='btn btn-primary'>Sign Up</button>
    </form>
  );
};

export default signUp;
