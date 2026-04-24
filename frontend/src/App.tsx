import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { CreateOrder } from './pages/CreateOrder';
import { Orders } from './pages/Orders';
import { Calculator } from './pages/Calculator';
import { Support } from './pages/Support';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminSettings } from './pages/admin/AdminSettings';
import { Layout } from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="create" element={<CreateOrder />} />
          <Route path="orders" element={<Orders />} />
          <Route path="calc" element={<Calculator />} />
          <Route path="support" element={<Support />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
