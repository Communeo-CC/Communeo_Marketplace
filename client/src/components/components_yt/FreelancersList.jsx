import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Check, Edit2, Star, UserCheck, X } from 'lucide-react';

export function FreelancersList({ userRole }) {
  const [freelancers, setFreelancers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFreelancer, setEditingFreelancer] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const savedFreelancers = localStorage.getItem('freelancers');
    if (savedFreelancers) {
      setFreelancers(JSON.parse(savedFreelancers));
    }
  }, []);

  const saveFreelancers = (updatedFreelancers) => {
    localStorage.setItem('freelancers', JSON.stringify(updatedFreelancers));
    setFreelancers(updatedFreelancers);
  };

  const handleSubmit = () => {
    if (editingFreelancer) {
      const updated = freelancers.map(f => 
        f.id === editingFreelancer.id ? { ...editingFreelancer, ...formData } : f
      );
      saveFreelancers(updated);
    } else {
      const newFreelancer = {
        id: Date.now().toString(),
        verified: false,
        rating: 0,
        completedProjects: 0,
        ...formData
      };
      saveFreelancers([...freelancers, newFreelancer]);
    }
    setIsDialogOpen(false);
    setEditingFreelancer(null);
    setFormData({});
  };

  const toggleVerification = (id) => {
    const updated = freelancers.map(f =>
      f.id === id ? { ...f, verified: !f.verified } : f
    );
    saveFreelancers(updated);
  };

  const canEdit = userRole === 'admin' || userRole === 'developer';
  const canCreate = userRole === 'freelancer' || canEdit;

  return (
    <div className="space-y-6">
      {canCreate && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Freelancers</CardTitle>
              <Button onClick={() => setIsDialogOpen(true)}>
                Create Profile
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4">
        {freelancers.map((freelancer) => (
          <Card key={freelancer.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {freelancer.profileImage ? (
                    <img
                      src={freelancer.profileImage}
                      alt={freelancer.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UserCheck className="w-8 h-8 text-primary" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{freelancer.name}</h3>
                    {freelancer.verified && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-1">
                    {freelancer.skills.join(', ')}
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {freelancer.rating.toFixed(1)}
                    </span>
                    <span>${freelancer.hourlyRate}/hr</span>
                    <span>{freelancer.completedProjects} projects</span>
                  </div>

                  <p className="mt-2 text-sm">{freelancer.bio}</p>
                </div>

                {canEdit && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingFreelancer(freelancer);
                        setFormData(freelancer);
                        setIsDialogOpen(true);
                       }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={freelancer.verified ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleVerification(freelancer.id)}
                    >
                      {freelancer.verified ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingFreelancer ? 'Edit Profile' : 'Create Profile'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={formData.skills?.join(', ') || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  skills: e.target.value.split(',').map(s => s.trim())
                })}
              />
            </div>

            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                value={formData.experience || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  experience: parseInt(e.target.value)
                })}
              />
            </div>

            <div>
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={formData.hourlyRate || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  hourlyRate: parseInt(e.target.value)
                })}
              />
            </div>

            <div>
              <Label htmlFor="availability">Availability</Label>
              <Select
                value={formData.availability}
                onValueChange={(value) =>
                  setFormData({ ...formData, availability: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="portfolio">Portfolio URL</Label>
              <Input
                id="portfolio"
                type="url"
                value={formData.portfolio || ''}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              setEditingFreelancer(null);
              setFormData({});
            }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingFreelancer ? 'Save Changes' : 'Create Profile'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}