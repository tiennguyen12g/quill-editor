
import App from './App.tsx'
import NotFoundPage from "./Utilitys/NotFoundPage/NotFoundPage.tsx";
import { BrowserRouter, Routes,Route } from "react-router-dom";
import Test from './Test.tsx';
export default function Router() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}/>
          <Route path='*' element={<NotFoundPage />} />
          <Route path='/test' element={<Test />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
