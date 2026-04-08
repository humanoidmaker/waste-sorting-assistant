import { useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { updateSettings } from '../services/api';
import toast from 'react-hot-toast';

interface Props { user: any; }

export default function Settings({ user }: Props) {
  const [form, setForm] = useState({
    name: user.name || '',
    email_notifications: true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await updateSettings(form); toast.success('Settings saved'); }
    catch { toast.error('Failed to save settings'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><SettingsIcon className="w-7 h-7" /> Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Profile</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input value={user.email} disabled className="input-field bg-gray-50 text-gray-500" />
          </div>
        </div>
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Notifications</h2>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={form.email_notifications} onChange={(e) => setForm({ ...form, email_notifications: e.target.checked })} className="rounded w-5 h-5" />
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive milestone achievements and tips</p>
            </div>
          </label>
        </div>
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
