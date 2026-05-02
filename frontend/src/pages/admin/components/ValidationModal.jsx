import React from 'react';
import moment from 'moment';
import { XCircle, MapPin, CheckCircle } from 'lucide-react';

const ValidationModal = ({ selectedRecord, onClose, onValidate }) => {
  if (!selectedRecord) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden border border-white/20 dark:border-white/5 animate-in zoom-in duration-300 transition-colors">
        <div className="h-96 bg-slate-100 dark:bg-slate-800 relative group overflow-hidden transition-colors">
          <img
            src={selectedRecord.selfie}
            alt="Selfie"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-8 right-8 w-12 h-12 bg-white hover:bg-slate-100 shadow-lg rounded-3xl flex items-center justify-center text-slate-900 transition-all hover:rotate-90 active:scale-90"
          >
            <XCircle size={24} />
          </button>
          <div className="absolute bottom-10 left-10 text-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-indigo-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ring-4 ring-indigo-500/30">
                Biometric Check
              </span>
              <span className="bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {moment(selectedRecord.punchIn).format('hh:mm A')}
              </span>
            </div>
            <h4 className="text-4xl font-black">{selectedRecord.user?.name}</h4>
            <p className="text-sm font-medium opacity-80 mt-1 flex items-center gap-2">
              <MapPin size={14} /> Location Verified within Radius
            </p>
          </div>
        </div>
        <div className="p-12">
          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => onValidate('Valid')}
              className="group relative overflow-hidden bg-emerald-500 text-white font-black py-6 rounded-[32px] shadow-2xl shadow-emerald-200 dark:shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em]"
            >
              <CheckCircle size={24} className="transition-transform group-hover:rotate-12" /> Confirm Match
            </button>
            <button
              onClick={() => onValidate('Invalid')}
              className="group relative overflow-hidden bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black py-6 rounded-[32px] shadow-2xl shadow-slate-200 dark:shadow-slate-900/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em]"
            >
              <XCircle size={24} className="transition-transform group-hover:-rotate-12" /> Flag Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;
