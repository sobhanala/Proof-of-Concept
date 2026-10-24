import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RoadMap from './pages/road-map/RoadMap';
import LearningStyles from './pages/learning-styles/LearningStyles';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/road-map" element={<RoadMap />} />
        <Route path="/learning-styles" element={<LearningStyles />} />      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
