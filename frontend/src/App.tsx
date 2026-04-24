import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { CreateOrder } from './pages/CreateOrder';
import { Orders } from './pages/Orders';
import { Calculator } from './pages/Calculator';
import { Support } from './pages/Support';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminOrderDetail } from './pages/admin/AdminOrderDetail';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminCurrency } from './pages/admin/AdminCurrency';
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
          
          {/* Admin Routes */}
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/settings" element={<AdminSettings />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/orders/:id" element={<AdminOrderDetail />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/rates" element={<AdminCurrency />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
