import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import PlanTrip from './pages/PlanTrip';
import Dashboard from './pages/Dashboard';
import Safety from './pages/Safety';
import Explore from './pages/Explore';
import SignIn from './pages/SignIn';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="plan" element={<PlanTrip />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="safety" element={<Safety />} />
            <Route path="signin" element={<SignIn />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
