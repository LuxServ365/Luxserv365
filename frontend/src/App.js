import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { RemoteHostSupport } from "./components/RemoteHostSupport";
import { Services } from "./components/Services";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { Pricing } from "./components/Pricing";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Mission } from "./components/Mission";
import { GuestPortal } from "./components/GuestPortal";
import { OwnerLogin } from "./components/OwnerLogin";
import { OwnerDashboard } from "./components/OwnerDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { GuestServices } from "./components/GuestServices";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <RemoteHostSupport />
        <Services />
        <WhyChooseUs />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

const OwnerPortal = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('ownerData');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('ownerData');
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <OwnerDashboard userData={user} onLogout={handleLogout} />;
  }

  return <OwnerLogin onLogin={handleLogin} />;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/guest-services" element={<GuestServices />} />
          <Route path="/guest-portal" element={<GuestPortal />} />
          <Route path="/owner-portal" element={<OwnerPortal />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;