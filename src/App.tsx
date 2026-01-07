import { AuthProvider } from './AuthContext';
import AppContent from './components/AppContent';

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
