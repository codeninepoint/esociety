'use client';

import { useContext } from 'react';
import { AppContext } from '@/app/ContextProvider';

export default function ContextHeader() {
  const { context, setContext } = useContext(AppContext);

  const customers = ['All Customers', 'Customer A', 'Customer B'];
  const subscriptions = ['All Subscriptions', 'Basic', 'Premium'];
  const profiles = ['All Profiles', 'Admin', 'Manager', 'User'];

  const handleChange = (type, value) => {
    setContext({ ...context, [type]: value });
  };

  return (
    <div className="context-header-container">
      <select
        className="context-select"
        value={context.customer}
        onChange={e => handleChange('customer', e.target.value)}
      >
        {customers.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select
        className="context-select"
        value={context.subscription}
        onChange={e => handleChange('subscription', e.target.value)}
      >
        {subscriptions.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select
        className="context-select"
        value={context.profile}
        onChange={e => handleChange('profile', e.target.value)}
      >
        {profiles.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  );
}