import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { queryClient } from "./provider/queryClient.ts";
// import { AppInitProvider } from "./provider/AppInitProvider.tsx";

createRoot(document.getElementById("root")!).render(
  // <Provider store={store}>
  // <BrowserRouter>
  <React.StrictMode>
    {/* <QueryClientProvider client={queryClient}>
      <AppInitProvider> */}
        <App />
      {/* </AppInitProvider>
    </QueryClientProvider> */}
  </React.StrictMode>,
  // </BrowserRouter>
  // </Provider>
);
