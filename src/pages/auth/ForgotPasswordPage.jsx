// src/pages/auth/ForgotPasswordPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import digitalHubLogo from '../../assets/digitalHubLogo.png';
import userService from '../../services/userService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await userService.forgotPassword({ email });
      setMessage(response.data.message);
      // For simulation purposes, we can log the reset link
      if (response.data.resetLink) {
        console.log('Password Reset Link (for simulation):', response.data.resetLink);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center">
          <img src={digitalHubLogo} alt="Digital Hub Logo" className="w-40" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Forgot Your Password?
        </h2>
        <p className="text-sm text-center text-gray-600">
          Enter your email address and we will send you a link to reset your password.
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0c72a1] focus:border-transparent"
              placeholder="you@company.com"
            />
          </div>

          {message && <p className="text-sm text-center text-green-600">{message}</p>}
          {error && <p className="text-sm text-center text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 font-bold text-white bg-[#0c72a1] rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0c72a1] disabled:bg-opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <Link to="/login" className="font-medium text-[#0c72a1] hover:text-opacity-90">
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
