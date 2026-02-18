import { AuthProvider } from './auth/AuthProvider';
import AppContent from './components/AppContent';

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
