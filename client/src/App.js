import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Guilds from './pages/Guilds';
import QuestBoard from './pages/QuestBoard';
import Leaderboard from './pages/Leaderboard';
import PrivateMessages from './pages/PrivateMessages';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/guilds" element={<Guilds />} />
              <Route path="/quests" element={<QuestBoard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/messages" element={<PrivateMessages />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;