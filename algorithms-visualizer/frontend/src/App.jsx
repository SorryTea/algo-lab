import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";
import Layout from "./components/layout/Layout";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import Algorithms from "./pages/Algorithms";
import Visualizer from "./pages/Visualizer";
import Compare from "./pages/Compare";
import Faq from "./pages/Faq";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forum from "./pages/Forum";
import ForumPost from "./pages/ForumPost";
import ForumCreate from "./pages/ForumCreate";
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
          <Route path="/faq" element={<PageTransition><Faq /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
          <Route path="/forum" element={<PageTransition><Forum /></PageTransition>} />
          <Route path="/forum/new" element={<PageTransition><ForumCreate /></PageTransition>} />
          <Route path="/forum/:id" element={<PageTransition><ForumPost /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;