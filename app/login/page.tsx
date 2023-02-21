'use client';
import { pb } from '@/lib/pb_client';
import { useRouter } from 'next/navigation';
import { useState, SyntheticEvent, useEffect } from 'react';

function signUp(username: string, password: string) {
  const data = {
    username,
    password,
    passwordConfirm: password,
  };

  return pb.collection('users').create(data);
}

function signIn(username: string, password: string) {
  return pb.collection('users').authWithPassword(username, password);
}

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (ev: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    ev.preventDefault();
    const submitType = ev.nativeEvent.submitter?.id;
    setError('');
    setIsSubmitting(true);

    try {
      if (submitType === 'signup') {
        await signUp(username, password);
        await signIn(username, password);
      } else {
        await signIn(username, password);
      }

      setUsername('');
      setPassword('');
      setIsSubmitting(false);

      router.replace('/private');
    } catch (err) {
      console.log(err);
      setError('Что то пошло не так, проверьте правильность введенных данных.');
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (pb.authStore.isValid) {
      router.replace('/private');
    }
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-gray-200">
      <form onSubmit={handleSubmit} className="grid w-full max-w-sm gap-6 rounded-md bg-white p-6">
        <div className="grid gap-1">
          <input
            placeholder="Имя пользователя"
            type="text"
            required
            minLength={4}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-sm border-2 p-1"
          />
          <input
            placeholder="Пароль"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-sm border-2 p-1"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {isSubmitting && <span>Авторизация...</span>}
        <div className="grid gap-2">
          <button
            disabled={isSubmitting}
            id="signin"
            className="rounded-md bg-blue-400 p-1 text-white disabled:bg-gray-400"
          >
            Войти
          </button>
          <button
            disabled={isSubmitting}
            id="signup"
            className="rounded-md bg-blue-400 p-1 text-white disabled:bg-gray-400"
          >
            Зарегистрироваться
          </button>
        </div>
      </form>
    </main>
  );
}
