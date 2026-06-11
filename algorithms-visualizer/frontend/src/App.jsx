import { Routes, Route } from "react-router";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Algorithms from "./pages/Algorithms";
import Visualizer from "./pages/Visualizer";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Compare from "./pages/Compare";
import Faq from "./pages/Faq";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="algorithms" element={<Algorithms />} />
        <Route path="compare" element={<Compare />} />
        <Route path="/algorithms/:id" element={<Visualizer />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
        <Route path="faq" element={<Faq />} />
      </Route>
    </Routes>
  );
}

export default App;