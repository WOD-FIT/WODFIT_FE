import { RouterProvider } from 'react-router';

import { router } from './routes/Router';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { WodProvider } from './context/WodContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <WodProvider>
          <RouterProvider router={router} />
        </WodProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
