import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../../services/api';
import { useAuthStore } from '../../store/useStore';
import { Button, Input } from '../../components/ui';
import { FadeIn } from '../../components/animations/AnimationWrappers';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.token);
      navigate('/dashboard');
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Login failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <FadeIn>
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-2">Welcome Back!</h1>
          <p className="text-gray-600 text-center mb-8">Login to continue learning</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 p-3 rounded-lg mb-4"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button type="submit" className="w-full" size="lg" isLoading={loginMutation.isPending}>
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/register" className="text-blue-600 hover:underline">
              Don't have an account? Sign up
            </Link>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
            <p className="font-semibold mb-2">Test Accounts:</p>
            <p>Student: student@test.com / password123</p>
            <p>Instructor: instructor@test.com / password123</p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default Login;
