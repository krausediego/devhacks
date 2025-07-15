import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { PomodoroProvider } from "@/hooks/use-pomodoro";

import { router } from "./router";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <PomodoroProvider>
          <RouterProvider router={router} />
          <Toaster />
        </PomodoroProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export { App };
