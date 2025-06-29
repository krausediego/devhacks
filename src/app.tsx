import { RouterProvider } from "react-router";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { PomodoroProvider } from "@/hooks/use-pomodoro";

import { router } from "./router";

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <PomodoroProvider>
        <RouterProvider router={router} />
        <Toaster />
      </PomodoroProvider>
    </ThemeProvider>
  );
};

export { App };
