'use client';

import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/app/ContextProvider';
import { Building2, FolderKanban, LayoutGrid, Sparkles, MapPin } from 'lucide-react';

export default function ContextHeader() {
  const { context, setContext } = useContext(AppContext);

  const fallbackOrganizations = [
    { id: '1', name: 'Acme Corp' },
    { id: '2', name: 'Globex Inc' },
    { id: '3', name: 'Umbrella LLC' },
  ];

  const [organizations, setOrganizations] = useState(fallbackOrganizations);
  const projects = ['Default', 'eSociety', 'SmartCity', 'GreenField'];
  const modules = ['Dashboard', 'Societies', 'Accounts', 'Reports', 'Settings'];
  const subscriptions = ['Basic', 'Premium', 'Enterprise'];
  const locationsBySubscription = {
    Basic: ['New York', 'San Francisco'],
    Premium: ['London', 'Berlin', 'Paris'],
    Enterprise: [],
  };

  const handleChange = (type, value) => {
    if (type === 'organization') {
      const selected = organizations.find(o => o.id === value);
      const name = selected ? selected.name : value;
      setContext(prev => ({ ...prev, organizationId: value, organizationName: name }));
      return;
    }
    setContext({ ...context, [type]: value });
  };

  useEffect(() => {
    let mounted = true;

    const loadOrgs = async () => {
      try {
        const res = await fetch('/api/organizations', { headers: { accept: '*/*' } });
        if (!res.ok) return;

        const data = await res.json();
        if (!mounted) return;

        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map(d =>
            typeof d === 'string' ? { id: d, name: d } : { id: d.id || d.name, name: d.name || d.id }
          );
          setOrganizations(normalized);
          if (!context.organizationId || !normalized.find(o => o.id === context.organizationId)) {
            const first = normalized[0];
            setContext(prev => ({
              ...prev,
              organizationId: first?.id || prev.organizationId,
              organizationName: first?.name || prev.organizationName,
            }));
          }
        }
      } catch (err) {
        console.warn('Failed to load organizations', err);
      }
    };

    loadOrgs();
    return () => { mounted = false; };
  }, []);

  const subscriptionColors = {
    Basic: 'ctx-badge--basic',
    Premium: 'ctx-badge--premium',
    Enterprise: 'ctx-badge--enterprise',
  };

  return (
    <div className="ctx-header">
      {/* Primary Context Group */}
      <div className="ctx-group ctx-group--primary">
        <div className="ctx-field">
          <div className="ctx-field__icon">
            <Building2 size={14} />
          </div>
          <select
            className="ctx-select"
            id="organization"
            value={context.organizationId}
            onChange={e => handleChange('organization', e.target.value)}
          >
            {organizations.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>

        <div className="ctx-divider" />

        <div className="ctx-field">
          <div className="ctx-field__icon">
            <FolderKanban size={14} />
          </div>
          <select
            className="ctx-select"
            id="project"
            value={context.project}
            onChange={e => handleChange('project', e.target.value)}
          >
            {projects.map(proj => (
              <option key={proj} value={proj}>{proj}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Module Selection */}
      <div className="ctx-group ctx-group--modules">
        <div className="ctx-field__icon ctx-field__icon--muted">
          <LayoutGrid size={14} />
        </div>
        <div className="ctx-tabs">
          {modules.map(mod => (
            <button
              key={mod}
              className={`ctx-tab ${context.module === mod ? 'ctx-tab--active' : ''}`}
              onClick={() => handleChange('module', mod)}
            >
              {mod}
            </button>
          ))}
        </div>
      </div>

      {/* Subscription & Location */}
      <div className="ctx-group ctx-group--meta">
        <div className="ctx-field ctx-field--subscription">
          <Sparkles size={12} className="ctx-sparkle" />
          <select
            className={`ctx-badge ${subscriptionColors[context.subscription] || ''}`}
            id="subscription"
            value={context.subscription}
            onChange={e => handleChange('subscription', e.target.value)}
          >
            {subscriptions.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <div className="ctx-field">
          <div className="ctx-field__icon ctx-field__icon--muted">
            <MapPin size={14} />
          </div>
          {locationsBySubscription[context.subscription]?.length > 0 ? (
            <select
              className="ctx-select ctx-select--compact"
              id="location"
              value={context.location}
              onChange={e => handleChange('location', e.target.value)}
            >
              <option value="">Select</option>
              {locationsBySubscription[context.subscription].map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          ) : (
            <input
              className="ctx-input"
              id="location"
              type="text"
              placeholder="Location"
              value={context.location}
              onChange={e => handleChange('location', e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  );
}