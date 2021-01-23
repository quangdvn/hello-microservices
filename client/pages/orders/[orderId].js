import { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { dispatchRequest, errors } = useRequest({
    url: '/api/payments/',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => {
      console.log(payment);
      Router.push('/orders');
    },
  });

  //* Time down
  useEffect(() => {
    const findTimeLeft = () => {
      const timeLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(timeLeft / 1000));
    };

    findTimeLeft(); //* call the first time
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return timeLeft < 0 ? (
    <div>Order expired</div>
  ) : (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => dispatchRequest({ token: id })}
        stripeKey='pk_test_iVCmQKQrYmAcrtAlu9p7hbAt00VTlqwy2J'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
