import React from 'react';
import './QuickActions.scss';

const QuickActions = () => {
  const actions = [
    {
      icon: '📤',
      title: 'Export Data',
      description: 'Download analytics as CSV or PDF'
    },
    {
      icon: '📊',
      title: 'Create Report',
      description: 'Generate a custom performance report'
    },
    {
      icon: '🔔',
      title: 'Set Alerts',
      description: 'Get notified about performance changes'
    },
    {
      icon: '🔗',
      title: 'Share Insights',
      description: 'Send analytics to team members'
    }
  ];

  return (
    <section className="quick-actions">
      <div className="container">
        <h2 className="section-title">Quick Actions</h2>
        
        <div className="actions-container">
          {actions.map((action, index) => (
            <button className="action-button" key={index}>
              <div className="action-icon">{action.icon}</div>
              <div className="action-info">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;