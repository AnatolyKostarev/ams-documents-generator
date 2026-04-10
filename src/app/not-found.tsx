import Link from 'next/link'

export default function NotFound() {
  return (
    <main className='mx-auto min-h-screen w-full max-w-4xl px-4 py-8'>
      <h1 className='text-3xl font-bold'>404 - Страница не найдена</h1>
      <p className='mt-3 text-sm text-black/70'>
        Проверьте адрес или перейдите в каталог документов.
      </p>
      <div className='mt-6 flex gap-3'>
        <Link href='/' className='rounded bg-black px-4 py-2 text-white'>
          На главную
        </Link>
        <Link href='/zayavleniya/' className='rounded border px-4 py-2'>
          Категория заявлений
        </Link>
      </div>
    </main>
  )
}
