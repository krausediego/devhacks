import { Outlet } from "react-router";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { AuthProvider } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout = () => {
  const isMobile = useIsMobile();

  return (
    <AuthProvider>
      <ResizablePanelGroup
        direction="horizontal"
        className="bg-sidebar flex min-h-screen w-full"
      >
        <ResizablePanel
          defaultSize={isMobile ? 14 : 8}
          minSize={8}
          maxSize={14}
        >
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="flex flex-1">
          <div className="bg-background flex flex-1 flex-col items-center justify-center pt-2">
            <Header />
            <div className="h-full w-full max-w-7xl pt-36">
              <Outlet />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </AuthProvider>
  );
};

export { AppLayout };
