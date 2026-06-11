import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";
import Layout from "./components/layout/Layout";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import Algorithms from "./pages/Algorithms";
import Visualizer from "./pages/Visualizer";
import Compare from "./pages/Compare";
import About from "./pages/About";
import Faq from "./pages/Faq";
import NotFound from "./pages/NotFound";

function App() {
  const location = useLocation();
  return (
    <Layout>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route index element={<PageTransition><Home /></PageTransition>} />
          <Route path="/algorithms" element={<PageTransition><Algorithms /></PageTransition>} />
          <Route path="/algorithms/:id" element={<PageTransition><Visualizer /></PageTransition>} />
          <Route path="/compare" element={<PageTransition><Compare /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/faq" element={<PageTransition><Faq /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;