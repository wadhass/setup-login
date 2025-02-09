import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ErrorAlert from '../components/ErrorAlert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Check if user is already logged in
  if (localStorage.getItem('token')) {
    return <Navigate to='/notes' replace />;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const data = await fetch(`${apiUrl}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const res = await data.json();

      if (res.ok) {
        localStorage.setItem('token', res.token);
        navigate('/notes');
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='min-h-screen p-6 md:p-10 bg-primary flex items-center justify-center'>
      <div className='w-full max-w-md'>
        <h1 className='text-4xl font-bold mb-8 text-center text-gray-300'>Login</h1>

        <form onSubmit={handleSubmit} className=' bg-secondary p-6 rounded-2xl border border-tertiary transition-all'>
          {error && (
            <ErrorAlert
              className='mb-6 p-4 bg-error/10 text-error rounded-lg border border-error/50 flex items-center gap-3'
              message={error}
            />
          )}

          <input
            type='email'
            placeholder='Email'
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='w-full mb-4  bg-transparent text-gray-300 border border-tertiary py-3 px-4 
            rounded-xl outline-none focus:border-white transition-all duration-700 font-medium'
          />

          <input
            type='password'
            placeholder='Password'
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='w-full mb-4  bg-transparent text-gray-300 border border-tertiary py-3 px-4 rounded-xl outline-none focus:border-white transition-all duration-700 font-medium'
          />

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-gray-950 text-gray-300 py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed'
          >
            {isSubmitting ? <Loader2 className='animate-spin' size={20} /> : null}
            <span>{isSubmitting ? 'Logging in...' : 'Login'}</span>
          </button>

          <div className='mt-6 text-center'>
            <Link
              to='/signup'
              type='button'
              className=' text-white/60 hover:text-white transition-colors inline-flex items-center gap-2'
            >
              Don't have an account? Sign up
              <ArrowRight size={16} />
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
