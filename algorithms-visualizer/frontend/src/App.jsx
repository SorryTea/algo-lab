import { Routes, Route } from "react-router";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Algorithms from "./pages/Algorithms";
import Visualizer from "./pages/Visualizer";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="algorithms" element={<Algorithms />} />
        <Route path="algorithms/:slug" element={<Visualizer />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;