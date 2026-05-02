import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../features/auth/authApi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee',
    managerId: '', // Ideally fetched from an API
  });

  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData).unwrap();
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
          {formData.role === 'Employee' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Manager ID (Compulsory for Employees)</label>
              <input
                name="managerId"
                type="text"
                value={formData.managerId}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Manager ID"
                required
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500">{error?.data?.message || 'Registration failed'}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
