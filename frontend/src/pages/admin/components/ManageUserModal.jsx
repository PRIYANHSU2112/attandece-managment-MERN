import React, { useState, useEffect } from 'react';
import { XCircle, Save, Shield, Briefcase } from 'lucide-react';
import { useGetUserByIdQuery, useGetManagersQuery, useUpdateUserRoleMutation } from '../../../features/users/userApi';

const ManageUserModal = ({ userId, onClose }) => {
  const { data: user, isLoading: isUserLoading } = useGetUserByIdQuery(userId, { skip: !userId });
  const { data: managers, isLoading: isManagersLoading } = useGetManagersQuery();
  const [updateRole, { isLoading: isUpdating }] = useUpdateUserRoleMutation();

  const [role, setRole] = useState('');
  const [managerId, setManagerId] = useState('');

  useEffect(() => {
    if (user) {
      setRole(user.role);
      setManagerId(user.managerId || '');
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateRole({ id: userId, role, managerId: managerId || undefined }).unwrap();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 transition-colors">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 transition-colors">
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Manage Member</h2>
          <button onClick={onClose} className="text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
            <XCircle size={24} />
          </button>
        </div>
        
        {isUserLoading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 font-bold transition-colors">Loading user profile...</div>
        ) : (
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4 bg-indigo-50/50 dark:bg-indigo-500/10 p-4 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/20 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-lg font-black transition-colors">
                {user?.name?.[0]}
              </div>
              <div>
                <p className="font-black text-slate-800 dark:text-slate-200 transition-colors">{user?.name}</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-500 transition-colors">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 transition-colors">
                  <Shield size={14} /> Role
                </label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {role === 'Employee' && (
                <div>
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 transition-colors">
                    <Briefcase size={14} /> Assign Manager
                  </label>
                  <select 
                    value={managerId} 
                    onChange={(e) => setManagerId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="">Select a Manager</option>
                    {managers?.map(m => (
                      <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="pt-6">
              <button 
                onClick={handleSave}
                disabled={isUpdating || (role === 'Employee' && !managerId)}
                className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20"
              >
                <Save size={16} /> {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUserModal;
