import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginForm } from '../schemas/authSchemas';
import { authService } from '../services/authService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginForm) => {
    try {
      await authService.login(values.email, values.password);
      await authService.loadProfile();
      toast.success('Logged in.');
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed.');
    }
  };

  return (
    <div className="mx-auto mt-28 max-w-md rounded bg-slate-900 p-6">
      <h1 className="mb-4 text-2xl font-semibold">Restaurant POS Login</h1>
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <input className="w-full rounded bg-slate-800 p-2" placeholder="Email" {...register('email')} />
        {errors.email && <p className="text-red-400">{errors.email.message}</p>}
        <input type="password" className="w-full rounded bg-slate-800 p-2" placeholder="Password" {...register('password')} />
        {errors.password && <p className="text-red-400">{errors.password.message}</p>}
        <button disabled={isSubmitting} className="w-full rounded bg-blue-600 p-2">{isSubmitting ? 'Loading...' : 'Login'}</button>
      </form>
    </div>
  );
};
