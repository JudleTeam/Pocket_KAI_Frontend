import { useSchedule } from '@/entities';
import { Loader } from '@/shared/ui/loader/Loader';
import { ScheduleLayout } from '@/widgets';
export function Schedule() {
  const { weekScheduleStatus } = useSchedule();
  return (
    <Loader status={weekScheduleStatus} idleMessage="Выберите группу">
      <ScheduleLayout />
    </Loader>
  );
}
