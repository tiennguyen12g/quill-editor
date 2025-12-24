import ReactDOM from "react-dom/client";
import "./index.css";
import GlobalStyles from "./GlobalStyles/GlobalStyles.tsx";

import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GlobalStyles>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </GlobalStyles>
);
