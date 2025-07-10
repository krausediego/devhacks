import { useMatches, useNavigate } from "react-router";

import { usePomodoro } from "@/hooks/use-pomodoro";

import { LanguageSelector } from "./language-selector";
import { PomodoroTimerRemind } from "./pomodoro-timer-remind";
import { ToggleTheme } from "./toggle-theme";

const Header = () => {
  const matches = useMatches();
  const navigate = useNavigate();
  const { hasActivePomodoro } = usePomodoro();

  const match = matches.find(
    (m) => m.handle && (m.handle as { title?: string }).title,
  );
  const title = (match?.handle as { title?: string })?.title;

  return (
    <div className="flex h-8 w-full items-center justify-between p-4">
      <span className="text-lg">{title}</span>
      <div className="flex items-center gap-4">
        {hasActivePomodoro && (
          <button
            onClick={() => navigate("/pomodoro")}
            className="flex w-20 cursor-pointer items-center gap-2"
          >
            <span>🕜</span>
            <PomodoroTimerRemind />
          </button>
        )}
        <ToggleTheme />
        <LanguageSelector />
      </div>
    </div>
  );
};

export { Header };
