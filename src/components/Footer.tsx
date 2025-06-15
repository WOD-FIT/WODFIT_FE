export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          Built with{' '}
          <a href="https://reactjs.org" className="text-blue-400 hover:underline">
            React
          </a>{' '}
          and{' '}
          <a href="https://tailwindcss.com" className="text-blue-400 hover:underline">
            Tailwind CSS
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
