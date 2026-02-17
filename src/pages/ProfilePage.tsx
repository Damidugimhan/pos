import { useAuthStore } from '../store/authStore';

export const ProfilePage = () => {
  const profile = useAuthStore((s) => s.profile);
  if (!profile) return <div className="rounded bg-slate-900 p-4">No profile loaded.</div>;
  return <div className="rounded bg-slate-900 p-4"><h2 className="text-xl">Profile</h2><p>Name: {profile.full_name}</p><p>Role: {profile.role}</p><p>User ID: {profile.id}</p></div>;
};
