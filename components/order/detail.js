import Table from '../table';

export default function CartDetail({ cart, removeProduct }) {
  const headers = ['Product', 'Price', ''];
  const footers = ['Total', cart.total, ''];

  return (
    <Table headers={headers} footers={footers}>
      {cart.lineitems?.map((item) => {
        return (
          <tr key={item.id}>
            <td>{item.product.name}</td>
            <td>{item.product.price}</td>
            <td>
              <span
                className="icon is-clickable"
                onClick={() => removeProduct(item.id)}
              >
                <i className="fas fa-trash"></i>
              </span>
            </td>
          </tr>
        );
      })}
    </Table>
  );
}
