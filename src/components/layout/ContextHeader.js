'use client';

import { useContext } from 'react';
import { AppContext } from '@/app/ContextProvider';

export default function ContextHeader() {
  const { context, setContext } = useContext(AppContext);

  // Example data
  const organizations = ['Acme Corp', 'Globex Inc', 'Umbrella LLC'];
  const projects = ['Default','eSociety', 'SmartCity', 'GreenField'];
  const modules = ['Dashboard', 'Societies', 'Accounts', 'Reports', 'Settings'];
  const subscriptions = ['Basic', 'Premium', 'Enterprise'];
  const locationsBySubscription = {
    Basic: ['New York', 'San Francisco'],
    Premium: ['London', 'Berlin', 'Paris'],
    Enterprise: [], // Text input for Enterprise
  };

  const handleChange = (type, value) => {
    setContext({ ...context, [type]: value });
    if (type === 'module') {
      console.log('Module changed to:', value);
    }
  };

  return (
    <div className="context-header-container" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Organization Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 180 }}>
        <label htmlFor="organization" style={{ fontSize: '0.95rem', fontWeight: 500, color: '#334155', minWidth: 90 }}>Organization</label>
        <select
          className="context-select"
          id="organization"
          name="organization"
          autoComplete="organization"
          value={context.organization}
          onChange={e => handleChange('organization', e.target.value)}
          style={{ fontSize: '1rem', padding: '0.3rem 0.7rem', borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', color: '#1e293b' }}
        >
          {organizations.map(org => (
            <option key={org} value={org}>{org}</option>
          ))}
        </select>
      </div>
      {/* Project Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 160 }}>
        <label htmlFor="project" style={{ fontSize: '0.95rem', fontWeight: 500, color: '#334155', minWidth: 70 }}>Project</label>
        <select
          className="context-select"
          id="project"
          name="project"
          autoComplete="project"
          value={context.project}
          onChange={e => handleChange('project', e.target.value)}
          style={{ fontSize: '1rem', padding: '0.3rem 0.7rem', borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', color: '#1e293b' }}
        >
          {projects.map(proj => (
            <option key={proj} value={proj}>{proj}</option>
          ))}
        </select>
      </div>
      {/* Application Module Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 170 }}>
        <label htmlFor="module" style={{ fontSize: '0.95rem', fontWeight: 500, color: '#334155', minWidth: 70 }}>Module</label>
        <select
          className="context-select"
          id="module"
          name="module"
          autoComplete="module"
          value={context.module}
          onChange={e => handleChange('module', e.target.value)}
          style={{ fontSize: '1rem', padding: '0.3rem 0.7rem', borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', color: '#1e293b' }}
        >
          {modules.map(mod => (
            <option key={mod} value={mod}>{mod}</option>
          ))}
        </select>
      </div>
      {/* Subscription Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 180 }}>
        <label htmlFor="subscription" style={{ fontSize: '0.95rem', fontWeight: 500, color: '#334155', minWidth: 90 }}>Subscription</label>
        <select
          className="context-select"
          id="subscription"
          name="subscription"
          autoComplete="subscription"
          value={context.subscription}
          onChange={e => handleChange('subscription', e.target.value)}
          style={{ fontSize: '1rem', padding: '0.3rem 0.7rem', borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', color: '#1e293b' }}
        >
          {subscriptions.map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>
      {/* Location: dropdown or text based on subscription */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 170 }}>
        <label htmlFor="location" style={{ fontSize: '0.95rem', fontWeight: 500, color: '#334155', minWidth: 70 }}>Location</label>
        {locationsBySubscription[context.subscription] && locationsBySubscription[context.subscription].length > 0 ? (
          <select
            className="context-select"
            id="location"
            name="location"
            autoComplete="location"
            value={context.location}
            onChange={e => handleChange('location', e.target.value)}
            style={{ fontSize: '1rem', padding: '0.3rem 0.7rem', borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', color: '#1e293b' }}
          >
            <option value="">Select Location</option>
            {locationsBySubscription[context.subscription].map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        ) : (
          <input
            className="context-input"
            id="location"
            name="location"
            autoComplete="location"
            type="text"
            placeholder="Enter Location"
            value={context.location}
            onChange={e => handleChange('location', e.target.value)}
            style={{ fontSize: '1rem', padding: '0.3rem 0.7rem', borderRadius: 4, border: '1px solid #cbd5e1', background: '#f8fafc', color: '#1e293b', minWidth: 120 }}
          />
        )}
      </div>
    </div>
  );
}