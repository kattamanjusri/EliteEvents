import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contextapi/AuthContext";
// Navbars
import MainNavBar from "./main/MainNavBar";
import AdminNavBar from "./admin/AdminNavBar";
import CustomerNavBar from "./Components/Navbar/CustomerNavBar";
import ManagerNavBar from "./manager/ManagerNavBar";

// Customer Pages
import Background from "./Components/Background/Background";
import CustomerHome from "./Components/Hero/CustomerHome";
import Title from "./Components/Title/Title";
import Services from "./Components/Services/Services";
import About from "./Components/About/About";
import Gallery from "./Components/Gallery/Gallery";
import Testimonials from "./Components/Testimonials/Testimonials";
import Contact from "./Components/Contact/Contact";
import Footer from "./Components/Footer/Footer";
import WeddingRegister from "./Components/WeddingRegister";
import Sangeet from "./Components/Sangeet";
import Birthday from "./Components/Birthday";
import Bachelor from "./Components/Bachelor";
import Haldi from "./Components/Haldi";
import Engagement from "./Components/Engagement";
import Moregallery from "./Components/Moregallery/Moregallery";
import Successpage from "./Components/Successpage";

// Admin Pages
import ViewManagers from "./admin/ViewManagers";
import AddManager from "./admin/AddManager";
import AdminHome from "./admin/AdminHome"; // Import the AdminHome component
import MyProfile from "./Components/MyProfile"; // ✅ Updated import path
import CustomerLogin from "./Components/CustomerLogin";
import MyEvents from "./Components/MyEvents";
import ManagerHome from "./manager/ManagerHome"; // ✅ Add this line
import ManagerProfile from "./manager/ManagerProfile";
import ManagerLogin from "./manager/ManagerLogin";
import NotFound from './main/NotFound';
import AdminLogin from "./admin/AdminLogin";

import ViewCustomers from './admin/ViewCustomers';
import CustomerRegistration from './Components/CustomerRegistration';
import Home from './main/Home';
import Notification from './Components/Notification';
import Report from './manager/Report';


function AppContent() {
  const { isAdminLoggedIn, isCustomerLoggedIn, isManagerLoggedIn } = useAuth();
  const [heroCount, setHeroCount] = useState(0);
  const [playStatus, setPlayStatus] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount((prevCount) => (prevCount === 2 ? 0 : prevCount + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const HeroProps = {
    setPlayStatus,
    heroData: { text1: "Welcome", text2: "Your Event" },
    heroCount,
    setHeroCount,
    playStatus,
  };

  return (
    <Router>
      {/* NavBar Selection */}
      {isAdminLoggedIn ? (
        <AdminNavBar />
      ) : isCustomerLoggedIn ? (
        <CustomerNavBar />
      ) : isManagerLoggedIn ? (
        <ManagerNavBar />
      ) : (
        <MainNavBar />
      )}

      <Routes>
        {/* Default Redirect */}
        <Route path="/" element={<Home/>} />
        <Route path="/adminhome" element={<AdminHome />} />
        {/* ✅ Admin Routes */}
        <Route path="/viewmanagers" element={<ViewManagers />} />
        <Route path="/admin/addmanager" element={<AddManager />} />

        {/* ✅ Customer Routes */}
        <Route
          path="/customerhome"
          element={
            <div>
              <Background playStatus={playStatus} heroCount={heroCount} />
              <CustomerHome {...HeroProps} />
              <div className="container2">
                <div id="services">
                  <Title subTitle="Our Events" title="Bringing Your Events to Life" />
                  <div className="container">
                    <Services />
                  </div>
                </div>

                <div id="about">
                  <Title subTitle="About Us" title="Learn More About Us" />
                  <About />
                </div>

                <div id="gallery">
                  <Title subTitle="Gallery" title="Event Photos" />
                  <Gallery />
                </div>

                <div id="testimonials">
                  <Title subTitle="Testimonials" title="What Our Clients Say" />
                  <Testimonials />
                </div>

                <div id="contact">
                  <Title subTitle="Contact Us" title="Get in Touch" />
                  <Contact />
                  <Footer />
                </div>
              </div>
            </div>
          }
        />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/customerlogin" element={<CustomerLogin />} />

        {/* ✅ Event Routes */}
        <Route path="/sangeet" element={<Sangeet />} />
        <Route path="/birthday" element={<Birthday />} />
        <Route path="/bachelor" element={<Bachelor />} />
        <Route path="/wedding" element={<WeddingRegister />} />
        <Route path="/haldi" element={<Haldi />} />
        <Route path="/engagement" element={<Engagement />} />
        <Route path="/more-gallery" element={<Moregallery />} />
        <Route path="/success" element={<Successpage />} />
        <Route path="/myevents" element={<MyEvents />} />
        <Route path="/manager/managerhome" element={<ManagerHome />} />  // ✅ Add this
        <Route path="/managerprofile" element={<ManagerProfile />} />
        <Route path="/managerlogin" element={<ManagerLogin />} />
        <Route path="*" element={<NotFound />} />
       <Route path="/adminlogin" element={<AdminLogin />} />
       <Route path="/viewallcustomers" element={<ViewCustomers />} exact />
       <Route path="/customerregistration" element={<CustomerRegistration />} />
         <Route path="/contact" element={<Contact />} />
         <Route path="/about" element={<About />} />
         <Route path="/home" element={<Home />} />
         <Route path="/notifications" element={<Notification />} />
         <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
