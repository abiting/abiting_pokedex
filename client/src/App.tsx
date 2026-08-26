import { Toaster } from "@/components/ui/sonner";
/** Visual intent: preserve the electric-violet Pokédex shell across every route. */
import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import PokemonDetailPageZh from "./pages/PokemonDetailPageZh";
import AboutDeveloper from "./pages/AboutDeveloper";
import BottomAnchorAd from "./components/BottomAnchorAd";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/pokemon/:name/zh"} component={PokemonDetailPageZh} />
      <Route path={"/pokemon/:name"} component={PokemonDetailPage} />
      <Route path={"/about"} component={AboutDeveloper} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isAnchorAdOpen, setIsAnchorAdOpen] = useState(true);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          {isAnchorAdOpen && <div aria-hidden="true" className="h-20 sm:h-24" />}
          {isAnchorAdOpen && <BottomAnchorAd onClose={() => setIsAnchorAdOpen(false)} />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
