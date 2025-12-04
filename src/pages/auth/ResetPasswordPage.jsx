// src/pages/auth/ResetPasswordPage.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import digitalHubLogo from '../../assets/digitalHubLogo.png';
import userService from '../../services/userService';

// A custom hook to get query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPasswordPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const resetToken = query.get('token');
    if (resetToken) {
      setToken(resetToken);
    } else {
      setError('No reset token found. Please request a new link.');
    }
  }, [query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await userService.resetPassword({ token, password, confirmPassword });
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
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
          Reset Your Password
        </h2>
        
        {token ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0c72a1]"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" cclassName="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0c72a1]"
                placeholder="••••••••"
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
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-center text-red-600">{error || 'Loading...'}</p>
        )}
      </div>
    </div>
  );
}
