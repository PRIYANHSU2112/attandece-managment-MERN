import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation, useRegisterMutation } from '../features/auth/authApi';
import { setCredentials } from '../features/auth/authSlice';
import { requestForToken } from '../config/firebase';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee',
    managerId: '',
  });

  const [login, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading, error: registerError }] = useRegisterMutation();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const fcmToken = await requestForToken().catch(() => null);
      const userData = await login({ ...loginData, fcmToken }).unwrap();
      dispatch(setCredentials(userData));
      if (userData.role === 'Admin') {
        navigate('/admin');
      } else if (userData.role === 'Manager') {
        navigate('/manager');
      } else {
        navigate('/employee');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(registerData).unwrap();
      setIsLogin(true);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-800 dark:from-slate-900 dark:to-slate-950 p-4 transition-colors duration-500">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl md:flex min-h-[600px] transition-colors">
        
        <div className={`w-full p-8 transition-all duration-500 md:w-1/2 ${isLogin ? 'translate-x-0 opacity-100' : 'md:translate-x-full opacity-0 pointer-events-none'}`}>
          <div className="mx-auto max-w-sm">
            <h2 className="mb-6 text-3xl font-bold text-gray-800 dark:text-slate-100">Welcome Back</h2>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Email</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              {loginError && <p className="text-sm text-red-500">{loginError?.data?.message || 'Login failed'}</p>}
              <button
                type="submit"
                disabled={isLoginLoading}
                className="w-full rounded-lg bg-indigo-600 py-3 font-bold text-white transition hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                {isLoginLoading ? 'Logging in...' : 'Sign In'}
              </button>
            </form>
            <div className="mt-6 text-center md:hidden">
                <button onClick={() => setIsLogin(false)} className="text-indigo-600 dark:text-indigo-400 font-semibold underline">Need an account? Register</button>
            </div>
          </div>
        </div>

        <div className={`w-full p-8 transition-all duration-500 md:w-1/2 ${!isLogin ? 'translate-x-0 opacity-100' : 'md:-translate-x-full opacity-0 pointer-events-none'}`}>
          <div className="mx-auto max-w-sm">
            <h2 className="mb-6 text-3xl font-bold text-gray-800 dark:text-slate-100">Join Us</h2>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Password</label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              {registerError && <p className="text-sm text-red-500">{registerError?.data?.message || 'Registration failed'}</p>}
              <button
                type="submit"
                disabled={isRegisterLoading}
                className="w-full rounded-lg bg-indigo-600 py-3 font-bold text-white transition hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                {isRegisterLoading ? 'Creating Account...' : 'Register Now'}
              </button>
            </form>
            <div className="mt-6 text-center md:hidden">
                <button onClick={() => setIsLogin(true)} className="text-indigo-600 dark:text-indigo-400 font-semibold underline">Already have an account? Login</button>
            </div>
          </div>
        </div>

        <div className={`absolute top-0 hidden h-full w-1/2 bg-indigo-600 dark:bg-indigo-700 text-white transition-all duration-500 md:flex flex-col items-center justify-center p-12 text-center ${isLogin ? 'left-1/2 rounded-l-[100px]' : 'left-0 rounded-r-[100px]'}`}>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">{isLogin ? "Hello, Friend!" : "Welcome Back!"}</h2>
            <p className="text-lg opacity-90">
              {isLogin 
                ? "Enter your personal details and start your journey with us." 
                : "To keep connected with us please login with your personal info."}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="rounded-full border-2 border-white px-12 py-3 font-bold transition hover:bg-white hover:text-indigo-600 dark:hover:text-indigo-700"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
