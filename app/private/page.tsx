'use client';
import Link from 'next/link';
import { pb } from '@/lib/pb_client';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Post } from '@/types/post';

export default function Private() {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.replace('/login');
      return;
    }

    pb.collection('posts')
      .getFirstListItem('', { $autoCancel: false })
      .then((post) => setPost(post as unknown as Post))
      .catch((err) => console.log(err));
  }, []);

  const handleSignOut = () => {
    pb.authStore.clear();
    router.push('/');
  };

  const handleSubmitChanges = async (ev: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    ev.preventDefault();
    if (!post) return;

    setIsSubmitting(true);

    try {
      const result = await pb.collection('posts').update(post.id, { ...post });
      setPost(result as unknown as Post);
      setIsSubmitting(false);
      alert('Сохранено успешно.');
    } catch (err) {
      setIsSubmitting(false);
      console.log(err);
    }
  };

  if (!post) return <p>Загрузка...</p>;

  return (
    <>
      <header className="fixed flex w-full justify-between bg-white px-2 py-1">
        <Link prefetch={false} className="font-semibold underline" href={'/'}>
          На главную
        </Link>
        <div className="space-x-4">
          <span>Я: {pb.authStore.model?.username}</span>
          <button className="font-semibold underline" onClick={handleSignOut}>
            Выйти
          </button>
        </div>
      </header>
      <main className="grid min-h-screen place-items-center bg-gray-200">
        <form onSubmit={handleSubmitChanges} className="w-full max-w-lg rounded-md bg-white p-6">
          <input
            type="text"
            name="title"
            className="mb-4 w-full rounded-md border-2 p-1 text-xl font-bold"
            value={post.title}
            onChange={(ev) => setPost(() => ({ ...post, title: ev.target.value }))}
          />
          <textarea
            className="w-full resize-none rounded-md border-2 p-1 text-gray-600"
            rows={6}
            value={post.text}
            onChange={(ev) => setPost(() => ({ ...post, text: ev.target.value }))}
          />
          <div className="mt-5 flex items-center gap-4">
            <button disabled={isSubmitting} className="underline disabled:text-gray-400">
              <span>Сохранить изменения</span>
            </button>
            {isSubmitting && (
              <svg
                className="h-4 w-4 animate-spin text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
          </div>
        </form>
      </main>
    </>
  );
}
