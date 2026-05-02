import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  MapPin, 
  Navigation, 
  Maximize2, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  Locate
} from 'lucide-react';
import { 
  useGetCompanySettingsQuery, 
  useUpdateCompanySettingsMutation 
} from '../../features/company/companyApi';
import { useNavigate } from 'react-router-dom';

const AdminSettings = () => {
  const navigate = useNavigate();
  const { data: settings, isLoading: isFetching } = useGetCompanySettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateCompanySettingsMutation();

  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    radius: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name,
        latitude: settings.latitude,
        longitude: settings.longitude,
        radius: settings.radius
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings({
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        radius: Number(formData.radius)
      }).unwrap();
      setMessage({ type: 'success', text: 'Geofencing settings updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (err) {
      setMessage({ type: 'error', text: err?.data?.message || 'Failed to update settings.' });
    }
  };

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      setMessage({ type: 'success', text: 'Fetching current location...' });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          setMessage({ type: 'success', text: 'Location coordinates retrieved!' });
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        },
        (err) => {
          setMessage({ type: 'error', text: 'Please enable location access to get coordinates.' });
        }
      );
    } else {
      setMessage({ type: 'error', text: 'Geolocation is not supported by your browser.' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-4 lg:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors">Company Settings</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">Configure company geofencing and office location</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          
          {/* Settings Form */}
          <div className="glass-card rounded-[2rem] p-8 space-y-8 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-2xl text-brand-primary">
                <Settings className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Geofencing Configuration</h2>
                <p className="text-slate-400 dark:text-slate-500 text-xs">Define office boundaries and coordinates</p>
              </div>
              <button 
                type="button"
                onClick={handleGetLocation}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors border border-indigo-100 dark:border-indigo-500/20"
              >
                <Locate className="w-4 h-4" />
                Get My Location
              </button>
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2 transition-colors ${
                message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 transition-colors">Company/Office Name</label>
                  <div className="relative">
                    <Maximize2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm font-medium dark:text-slate-200"
                      placeholder="e.g. Main HQ"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 transition-colors">Radius (Meters)</label>
                  <div className="relative">
                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <input 
                      type="number" 
                      value={formData.radius}
                      onChange={(e) => setFormData({...formData, radius: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm font-medium dark:text-slate-200"
                      placeholder="e.g. 500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 transition-colors">Office Latitude</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <input 
                      type="number" 
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm font-medium dark:text-slate-200"
                      placeholder="18.5204"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 transition-colors">Office Longitude</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <input 
                      type="number" 
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm font-medium dark:text-slate-200"
                      placeholder="73.8567"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isUpdating || isFetching}
                  className="w-full btn-primary flex items-center justify-center gap-3 py-4 shadow-xl shadow-brand-primary/20 dark:shadow-brand-primary/5 transition-all"
                >
                  {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Configuration</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 text-amber-800 dark:text-amber-200 text-xs leading-relaxed space-y-2 transition-colors">
              <p className="font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Important Note:
              </p>
              <p>Updating these coordinates will immediately affect the punch-in/out range for all employees. Ensure the coordinates are accurate (Google Maps format) and the radius is sufficient for GPS variance.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
