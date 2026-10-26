import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation, Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import BottomAnchorAd from "./components/BottomAnchorAd";

/** Visual intent: preserve the electric-violet Pokédex shell across every route. */
const Home = lazy(() => import("./pages/Home"));
const PokemonDetailPage = lazy(() => import("./pages/PokemonDetailPage"));
const PokemonDetailPageZh = lazy(() => import("./pages/PokemonDetailPageZh"));
const AboutDeveloper = lazy(() => import("./pages/AboutDeveloper"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteLoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" aria-label="Loading page" />
    </div>
  );
}

function LegacyFormRedirect({ target }: { target: string }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation(target, { replace: true });
  }, [setLocation, target]);

  return <RouteLoadingState />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/pokemon/pumpkaboo" component={() => <LegacyFormRedirect target="/pokemon/pumpkaboo-average/" />} />
      <Route path="/pokemon/toxtricity" component={() => <LegacyFormRedirect target="/pokemon/toxtricity-amped/" />} />
      <Route path="/pokemon/wormadam" component={() => <LegacyFormRedirect target="/pokemon/wormadam-plant/" />} />
      <Route path="/pokemon/:name/zh" component={PokemonDetailPageZh} />
      <Route path="/pokemon/:name" component={PokemonDetailPage} />
      <Route path="/about" component={AboutDeveloper} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const [isAnchorAdOpen, setIsAnchorAdOpen] = useState(true);
  const isPokemonDetailPage = location.startsWith("/pokemon/");
  const shouldShowAnchorAd = isPokemonDetailPage && isAnchorAdOpen;

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Suspense fallback={<RouteLoadingState />}>
            <Router />
          </Suspense>
          {shouldShowAnchorAd && <BottomAnchorAd onClose={() => setIsAnchorAdOpen(false)} />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
