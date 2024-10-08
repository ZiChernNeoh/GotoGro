import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Nav from '../NavBar/Nav'

const OrderDetails = () => {
  const { orderId } = useParams();  // Get orderId from URL
  const [orderItems, setOrderItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const orderDetails = response.data;  // Access directly from response data

      if (orderDetails.length > 0) {
        setOrderItems(orderDetails);

        // Calculate subtotal, tax, and total
        const calculatedSubtotal = orderDetails.reduce(
          (acc, item) => acc + item.ProductPrice * item.quantity,
          0
        );
        const calculatedTax = calculatedSubtotal * 0.08;  // Assuming 8% GST
        const calculatedTotal = calculatedSubtotal + calculatedTax;

        setSubtotal(calculatedSubtotal);
        setTax(calculatedTax);
        setTotal(calculatedTotal);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
        <Nav/>
    <div className="cart-container">
      <div className='title'><h2>Order History (Order ID: {orderId})</h2></div>
      
      {/* Cart Header */}
      <div className="cart-header">
        <div className="header-item">Item</div>
        <div className="header-price">Price</div>
        <div className="header-quantity">Quantity</div>
        <div className="header-total">Total</div>
      </div>

      {/* Order Items */}
      <div className="cart-items">
        {orderItems.map((item) => (
          <div key={item.ProductID} className="cart-item">
            <div className="item-info">
              <img src={item.ProductImg ? item.ProductImg[0] : '/default-img.jpg'} alt={item.ProductName} className="cart-img" />
              <div className="item-details">
                <h4>{item.ProductName}</h4>
              </div>
            </div>
            <div className="item-price">
              <p>RM{item.ProductPrice.toFixed(2)}</p>
            </div>
            <div className="item-quantity">
              <p>{item.quantity}</p>
            </div>
            <div className="item-total">
              <p>RM{(item.ProductPrice * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className='summary-container'>
        <div className="cart-summary">
          <div className="total-item">
            <span>Subtotal :</span>
            <span className="amount">RM{subtotal.toFixed(2)}</span>
          </div>
          <div className="total-item">
            <span>GST (8%) :</span>
            <span className="amount">RM{tax.toFixed(2)}</span>
          </div>
          <div className="total-item">
            <span><strong>Total Payment:</strong></span>
            <span className="amount"><strong>RM{total.toFixed(2)}</strong></span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default OrderDetails;
