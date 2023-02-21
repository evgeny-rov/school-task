'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { pb } from '@/lib/pb_client';
import type { Post } from '@/types/post';

export default function Home() {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    pb.collection('posts')
      .getFirstListItem('', { $autoCancel: false })
      .then((post) => setPost(post as unknown as Post))
      .catch((err) => console.log(err));
  }, []);

  if (!post) return <p>Загрузка...</p>;

  return (
    <>
      <header className="fixed flex w-full justify-between bg-white px-2 py-1">
        <span>Главная</span>
        <Link prefetch={false} className="font-semibold underline" href={'/private'}>
          В закрытый раздел
        </Link>
      </header>
      <main className="grid min-h-screen place-items-center bg-gray-200">
        <div className="w-full max-w-lg rounded-md bg-white p-6">
          <h1 className="mb-4 text-xl font-bold">{post.title}</h1>
          <p className="text-gray-600">{post.text}</p>
          <div className="mt-5 text-xs italic text-gray-500">
            <span>Этот пост можно изменить в - </span>
            <Link className="underline" href="/private">
              закрытом разделе
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
