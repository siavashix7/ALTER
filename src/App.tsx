import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Chat } from './pages/Chat';
import { MemoryVault } from './pages/MemoryVault';
import { TaskMatrix } from './pages/TaskMatrix';
import { Settings } from './pages/Settings';
import './index.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Chat />} />
          <Route path="memory" element={<MemoryVault />} />
          <Route path="tasks" element={<TaskMatrix />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
