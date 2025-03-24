import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import DragAndDropNested from "./App.tsx";
import { GlobalStateProvider } from "./GlobalStateContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStateProvider>
      <DragAndDropNested />
    </GlobalStateProvider>
    ,
  </StrictMode>
);
