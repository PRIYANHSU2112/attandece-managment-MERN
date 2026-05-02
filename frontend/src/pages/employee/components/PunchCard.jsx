import React from 'react';
import Webcam from 'react-webcam';
import { Camera, MapPin, Clock, CheckCircle2, LogOut, Loader2 } from 'lucide-react';
import moment from 'moment';

const PunchCard = ({ 
  isPunchedIn, 
  isPunchedOut, 
  isCameraOpen, 
  setIsCameraOpen, 
  webcamRef, 
  videoConstraints, 
  location, 
  todayAttendance, 
  handlePunchIn, 
  handlePunchOut, 
  isPunchingIn, 
  isPunchingOut 
}) => {
  return (
    <div className="glass-card rounded-[2rem] overflow-hidden border-t-4 border-brand-primary">
      <div className="p-1 px-1">
        <div className="bg-white/60 dark:bg-slate-900/40 rounded-[1.8rem] p-6 lg:p-8 transition-colors duration-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Visual Preview */}
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-inner relative group transition-colors duration-700">
                {!isPunchedIn ? (
                  isCameraOpen ? (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/png"
                      videoConstraints={videoConstraints}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/40">
                      <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                        <Camera className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                      </div>
                      <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Camera Inactive</p>
                    </div>
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5">
                    <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Clock className="w-10 h-10 text-brand-primary" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Punch-in Active</p>
                  </div>
                )}
                
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {location ? `${location.latitude}, ${location.longitude}` : 'Locating...'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 px-2">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Selfie Verification
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Geofencing Active
                </div>
              </div>
            </div>

            {/* Actions & Info */}
            <div className="flex flex-col justify-between py-2">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">
                    {!isPunchedIn ? 'Start Your Shift' : isPunchedOut ? 'Shift Ended' : 'Ongoing Shift'}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors duration-300">
                    {!isPunchedIn 
                      ? 'Capture a selfie within office premises to begin your work day.' 
                      : isPunchedOut 
                        ? 'Your attendance for today has been recorded successfully.'
                        : 'Ensure you punch out before leaving the office.'}
                  </p>
                </div>

                {isPunchedIn && todayAttendance?.[0] && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-brand-primary transition-colors duration-300">
                          <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Punch In Time</span>
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">
                        {moment(todayAttendance[0].punchIn).format('hh:mm A')}
                      </span>
                    </div>

                    {isPunchedOut && (
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-brand-accent transition-colors duration-300">
                            <LogOut className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Punch Out Time</span>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">
                          {moment(todayAttendance[0].punchOut).format('hh:mm A')}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-4">
                {!isPunchedIn ? (
                  !isCameraOpen ? (
                    <button
                      onClick={() => setIsCameraOpen(true)}
                      className="w-full btn-primary flex items-center justify-center gap-3 group"
                    >
                      <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      <span>Open Camera</span>
                    </button>
                  ) : (
                    <button
                      onClick={handlePunchIn}
                      disabled={isPunchingIn || !location}
                      className="w-full btn-primary flex items-center justify-center gap-3 group"
                    >
                      {isPunchingIn ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span>Punch In Now</span>
                        </>
                      )}
                    </button>
                  )
                ) : !isPunchedOut ? (
                  <button
                    onClick={handlePunchOut}
                    disabled={isPunchingOut || !location}
                    className="w-full px-6 py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-lg shadow-rose-200 dark:shadow-rose-900/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    {isPunchingOut ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <LogOut className="w-5 h-5" />
                        <span>Punch Out</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-center font-bold border border-emerald-100 dark:border-emerald-500/20 transition-colors duration-300">
                    Today's Work Logged
                  </div>
                )}
                <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">
                  Secured by Biometric & GPS
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PunchCard;
