import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Home from "./pages/Home";
import FreelancerProfile from "./pages/FreelancerProfile";
import AddService from "./pages/AddService";
import ServiceList from "./pages/ServiceList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/freelancer/profile" element={<FreelancerProfile userId="dummy-user-id" />} />
        <Route path="/freelancer/add-service" element={<AddService freelancerId="dummy-freelancer-id" />} />
        <Route path="/services" element={<ServiceList />} />

        <Route path="*" element={<div className="text-center mt-10">Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
