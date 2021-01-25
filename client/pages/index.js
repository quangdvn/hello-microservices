import Link from 'next/link';

const Index = ({ currentUser, tickets }) => {
  const renderTickets = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
            <a>Go to details</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>All Tickets</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{renderTickets}</tbody>
      </table>
    </div>
  );
};

Index.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets/all');
  return { tickets: data };
};

export default Index;
