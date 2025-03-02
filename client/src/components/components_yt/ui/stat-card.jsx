import { Card, CardContent } from './card';
import { clsx } from 'clsx';

export function StatCard({ title, value, icon }) {
  return (
    <Card className="stat-card">
      <CardContent className="stat-content">
        <div className="stat-icon">
          {icon}
        </div>
        <div className="stat-info">
          <p className="stat-label">{title}</p>
          <p className="stat-value">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}