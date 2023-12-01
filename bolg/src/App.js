import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// 라우팅 단위로 코드 분할 방법
// import ListPage from "./pages/ListPage/index";
// import ViewPage from "./pages/ViewPage/index";

//  처음부터 필요한 페이지를 로드하는게 아니라 lazy를 통해서 동적으로 불러오자
const ListPage = lazy(() => import("./pages/ListPage/index"));
const ViewPage = lazy(() => import("./pages/ViewPage/index"));

function App() {
  return (
    <div className="App">
      <Router>
        <Suspense fallback={<div>로딩 중!</div>}>
          <Routes>
            <Route path="/" element={<ListPage />} />
            <Route path="/view/:id" element={<ViewPage />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
