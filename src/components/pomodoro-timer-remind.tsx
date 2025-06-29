import NumberFlow, { NumberFlowGroup } from "@number-flow/react";

import { usePomodoro } from "@/hooks/use-pomodoro";
import { cn } from "@/lib/utils";

const PomodoroTimerRemind = ({ className }: { className?: string }) => {
  const { minutes, seconds } = usePomodoro();

  return (
    <NumberFlowGroup>
      <div className={cn("flex items-center text-lg font-semibold", className)}>
        <NumberFlow
          trend={-1}
          value={minutes}
          digits={{ 1: { max: 5 } }}
          format={{ minimumIntegerDigits: 2 }}
        />
        <NumberFlow
          prefix=":"
          trend={-1}
          value={seconds}
          digits={{ 1: { max: 5 } }}
          format={{ minimumIntegerDigits: 2 }}
        />
      </div>
    </NumberFlowGroup>
  );
};

export { PomodoroTimerRemind };
