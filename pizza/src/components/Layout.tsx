import { Outlet } from 'react-router-dom';
import { FloatingNav } from './navbar/MenuBar';

export default function Layout() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="max-w-screen-xl min-h-screen w-full">
        <header className="w-full max-w-screen-xl fixed top-4 z-50">
          <FloatingNav />
        </header>
        <main className="container flex flex-grow flex-row flex-wrap justify-center mx-auto px-4 pt-32 pb-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
