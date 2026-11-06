import type { ScheduleSlot } from "./schedule-data";

export function trialUnavailableReason(
  slot: Pick<ScheduleSlot, "group_id" | "status" | "free_places">,
): string {
  if (!slot.group_id) return "Запись на пробный урок доступна только для занятий учебной группы.";
  if (slot.status !== "scheduled") return "Запись доступна только на запланированное занятие.";
  if (slot.free_places <= 0) return "Свободных мест нет. Выберите другое занятие или обратитесь к администратору.";
  return "";
}
