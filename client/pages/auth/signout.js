import Router from 'next/router';
import { useEffect } from 'react';
import useRequest from '../../hooks/useRequest';

const signOut = () => {
  const { dispatchRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    dispatchRequest();
  }, []);

  return <div>..Signing you out</div>;
};

export default signOut;
