import BottomNav from "./components/BottomNav";
import CursorGlow from "./components/CursorGlow";
import Rail from "./components/Rail";
import Hero from "./components/Hero";
import Story from "./components/Story";
import Work from "./components/Work";
import Services from "./components/Services";
import Process from "./components/Process";
import Connect from "./components/Connect";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <CursorGlow />
      <Rail />
      <main>
        <Hero />
        <Story />
        <Work />
        <Services />
        <Process />
        <Connect />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default App;
