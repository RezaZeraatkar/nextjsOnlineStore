import { ClerkProvider } from '@clerk/nextjs';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export const metadata = {
  title: 'Ecommerce Store',
};

export default function DashboardLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      {/* fixed scrollable sidebar component */}
      <div className='flex min-h-screen overflow-hidden bg-white'>
        <header className='fixed top-0 z-50 h-16 w-full bg-gray-100 p-2 shadow-md'>
          <Header />
        </header>
        <div className='flex w-full pb-16 pt-16'>
          <aside className='fixed h-screen w-64 overflow-scroll bg-blue-900 p-2 pb-16 pr-0 text-white'>
            <Sidebar />
          </aside>
          {/* main content */}
          <main className='ml-64 flex w-full flex-grow p-4'>{children}</main>
        </div>
        <div className='absolute'>{modal}</div>
      </div>
    </ClerkProvider>
  );
}
