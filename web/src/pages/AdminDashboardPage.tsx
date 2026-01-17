import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { brand } from '@/config/brand';
import { usersApi } from '@/lib/api';
import { useState } from 'react';

export function AdminDashboardPage() {
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteStatus, setInviteStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteStatus({ type: null, message: '' });
    setIsInviting(true);

    if (invitePhone.length !== 10) {
      setInviteStatus({ type: 'error', message: 'Phone number must be 10 digits' });
      setIsInviting(false);
      return;
    }

    try {
      const response = await usersApi.invite({ phone: invitePhone, name: inviteName });
      if (response.error) {
        setInviteStatus({ type: 'error', message: response.message || response.error });
      } else {
        setInviteStatus({ type: 'success', message: 'User invited successfully!' });
        setInvitePhone('');
        setInviteName('');
      }
    } catch (err) {
      console.error('Invite failed', err);
      setInviteStatus({ type: 'error', message: 'Failed to invite user.' });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-mandi-dark mb-4">Dashboard</h2>
        <p className="text-mandi-muted">Welcome to the {brand.name} admin panel.</p>

        {/* Invite Buyer Section */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-mandi-dark mb-4">Invite New Buyer</h3>

          {inviteStatus.message && (
            <div
              className={`mb-4 p-3 rounded text-sm ${
                inviteStatus.type === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {inviteStatus.message}
            </div>
          )}

          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invitePhone">Phone Number</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-mandi-muted bg-mandi-cream text-mandi-muted text-sm">
                  +91
                </span>
                <Input
                  id="invitePhone"
                  type="tel"
                  placeholder="9876543210"
                  className="rounded-l-none"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inviteName">Name (Optional)</Label>
              <Input
                id="inviteName"
                type="text"
                placeholder="John Doe"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={isInviting} className="w-full">
              {isInviting ? 'Inviting...' : 'Send Invitation'}
            </Button>
          </form>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-mandi-cream rounded-lg p-6">
            <h3 className="font-semibold text-mandi-dark">Batches</h3>
            <p className="text-3xl font-bold text-mandi-green mt-2">5</p>
            <p className="text-sm text-mandi-muted mt-1">Total batches</p>
          </div>
          <div className="bg-mandi-cream rounded-lg p-6">
            <h3 className="font-semibold text-mandi-dark">Orders</h3>
            <p className="text-3xl font-bold text-mandi-green mt-2">2</p>
            <p className="text-sm text-mandi-muted mt-1">Active orders</p>
          </div>
          <div className="bg-mandi-cream rounded-lg p-6">
            <h3 className="font-semibold text-mandi-dark">Farmers</h3>
            <p className="text-3xl font-bold text-mandi-green mt-2">5</p>
            <p className="text-sm text-mandi-muted mt-1">Registered farmers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
