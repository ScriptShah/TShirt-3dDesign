import Canvas from "./canvas/Canvas";
import Customizer from "./pages/Customizer";
import Home from "./pages/Home";


function App() {

  return (
    <main className="app transition-all ease-in disable-text-selection scroll-disable">
      <Home/>
      <Canvas/>
      <Customizer/>
    </main>
  )
}

export default App
