

import React, { useState, useEffect } from 'react';
import './App.css';

const BillingCounter = ({ counterNumber, customers, onServeCustomer }) => {
  return (
    <div className="counter">
      <div className="counter-circle">{counterNumber}</div>
      {customers.map((customer) => (
        <div key={customer.id} className="customer-triangle">
          {Array.from(Array(customer.items)).map((_, index) => (
            <div key={index} className="item-number">
              {customer.items - index}
            </div>
          ))}
        </div>
      ))}
    
    </div>
  );
};

const App = () => {
  const [counters, setCounters] = useState([
    { id: 'C1', customers: [{ id: 1, items: 15 }] },
    { id: 'C2', customers: [{ id: 2, items: 10 }] },
    { id: 'C3', customers: [{ id: 3, items: 5 }] },
    { id: 'C4', customers: [{ id: 4, items: 13 }] },
    { id: 'C5', customers: [{ id: 5, items: 7 }] },
  ]);

  const [queues, setQueues] = useState({
    C1: [],
    C2: [],
    C3: [],
    C4: [],
    C5: [],
  });

  const [customerId, setCustomerId] = useState(6);

  const serveCustomer = (counterNumber) => {
    setCounters((prevCounters) =>
      prevCounters.map((counter) => {
        if (counter.id === counterNumber) {
          const updatedCustomers = counter.customers.map((customer) => {
            if (customer.items > 0) {
              return { ...customer, items: customer.items - 1 };
            }
            return customer;
          });

          return { ...counter, customers: updatedCustomers };
        }
        return counter;
      })
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCounters((prevCounters) =>
        prevCounters.map((counter) => {
          const updatedCustomers = counter.customers.map((customer) => {
            if (customer.items > 0) {
              return { ...customer, items: customer.items - 1 };
            }
            return customer;
          });

          return { ...counter, customers: updatedCustomers };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    counters.forEach((counter) => {
      if (counter.customers.length > 0 && counter.customers[0].items === 0) {
        const [dequeuedCustomer, ...remainingCustomers] = counter.customers;
        setQueues((prevQueues) => ({
          ...prevQueues,
          [counter.id]: [...prevQueues[counter.id], dequeuedCustomer],
        }));
        setCounters((prevCounters) =>
          prevCounters.map((c) =>
            c.id === counter.id ? { ...c, customers: remainingCustomers } : c
          )
        );
      }
    });
  }, [counters]);

  const addNewCustomer = (counterNumber) => {
    setCustomerId((prevId) => prevId + 1);
    const newCustomer = { id: customerId, items: Math.floor(Math.random() * 5) + 1 };
    setQueues((prevQueues) => ({
      ...prevQueues,
      [counterNumber]: [...prevQueues[counterNumber], newCustomer],
    }));
  };

  const serveNextCustomer = (counterNumber) => {
    if (queues[counterNumber].length > 0) {
      const [nextCustomer, ...remainingCustomers] = queues[counterNumber];
      setQueues((prevQueues) => ({
        ...prevQueues,
        [counterNumber]: remainingCustomers,
      }));
      setCounters((prevCounters) =>
        prevCounters.map((c) =>
          c.id === counterNumber ? { ...c, customers: [nextCustomer, ...c.customers] } : c
        )
      );
    }
  };

  return (
    <div className="app">
      <div className="counters">
        {counters.map((counter) => (
          <div key={counter.id}>
            <BillingCounter
              counterNumber={counter.id}
              customers={counter.customers}
              onServeCustomer={serveCustomer}
            />
            <Queue queue={queues[counter.id]} />
            <button onClick={() => addNewCustomer(counter.id)}>Add New Customer</button>
            <button onClick={() => serveNextCustomer(counter.id)}>Serve Next Customer</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Queue = ({ queue }) => {
  return (
    <div className="queue">
      <h2>Queue</h2>
      {queue.map((customer) => (
        <div key={customer.id} className="customer-triangle">
          {Array.from(Array(customer.items)).map((_, index) => (
            <div key={index} className="item-number">
              {customer.items - index}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;

