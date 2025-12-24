import styles from "./App.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);


import { BrowserRouter, Routes, Route } from "react-router-dom"
import CreateArticle from "./examples/CreateArticle.tsx";
import TestEditor from "./examples/TestEditor.tsx";
import EditArticleExample from "./examples/EditArticleExample.tsx";
function App() {

  return (
    <div>
      <BrowserRouter>
        <>
          <Routes>
            <Route path="/article/quill" element={<CreateArticle />} />
            <Route path="/article/test" element={<TestEditor />} />
            <Route path="/article/edit" element={<EditArticleExample />} />
          </Routes>
        </>
      </BrowserRouter>
    </div>
  );
}

export default App;

