import { useState } from 'react';
import axios from 'axios';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const dispatchRequest = async (props = {}) => {
    try {
      setErrors(null);
      const res = await axios[method](url, { ...body, ...props });
      if (onSuccess) {
        onSuccess(res.data);
      }
      return res.data;
    } catch (err) {
      console.log(err.message);
      setErrors(
        <div className='alert alert-danger'>
          <h4>Errors ...</h4>
          <ul className='my-0'>
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { dispatchRequest, errors };
};

export default useRequest;
