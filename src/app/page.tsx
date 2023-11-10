import Link from 'next/link';

export default async function Home() {
  return (
    <div>
      E-Commerce Store Home Page (it will be availble after dahsboard page
      development completed) <br></br>
      <Link href='/dashboard' className='text-blue-700 underline'>
        Go to dashboard
      </Link>
    </div>
  );
}
