import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Shield, Users } from 'lucide-react';

export function ActiveUsersList({ users }) {
  const developers = users.filter(user => user.role === 'developer');
  const business = users.filter(user => user.role === 'business');

  return (
    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Developers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {developers.map((user) => (
              <div
                key={user.email}
                className="flex items-center gap-3 p-3 rounded-lg border"
              >
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">Developer</p>
                </div>
              </div>
            ))}
            {developers.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No developers added yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Business Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {business.map((user) => (
              <div
                key={user.email}
                className="flex items-center gap-3 p-3 rounded-lg border"
              >
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">Business</p>
                </div>
              </div>
            ))}
            {business.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No business users added yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}