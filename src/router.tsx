import { createBrowserRouter } from "react-router";

import { AppLayout } from "./pages/_layouts/app";
import { AuthLayout } from "./pages/_layouts/auth";
import { HomePage } from "./pages/app/home/home";
import { InboxPage } from "./pages/app/inbox/inbox";
import { KanbanPage } from "./pages/app/kanban/kanban";
import { NotificationsPage } from "./pages/app/notifications/notifications";
import { PomodoroPage } from "./pages/app/pomodoro/pomodoro";
import { LoginPage } from "./pages/auth/login/login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/inbox",
        element: <InboxPage />,
      },
      {
        path: "/notifications",
        element: <NotificationsPage />,
      },
      {
        path: "/pomodoro",
        element: <PomodoroPage />,
        handle: { title: "🕜 Pomodoro Timer" },
      },
      {
        path: "/kanban",
        element: <KanbanPage />,
        handle: { title: "📝 Kanban" },
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
]);

export { router };
