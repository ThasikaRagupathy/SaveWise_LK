"use client";

import { useMemo, useState } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isValid,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { Check, Plus, Trash2 } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { PlannerItemType } from "@/types";
import { formatLKR } from "@/lib/currency";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type PlannerEventKind = "income" | "expense" | "bill" | "goal" | "reminder";

interface PlannerEvent {
  key: string;
  title: string;
  date: string;
  kind: PlannerEventKind;
  amount?: number;
  plannerItemId?: string;
  completed?: boolean;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const EVENT_LABELS: Record<PlannerEventKind, string> = {
  income: "Income",
  expense: "Expense",
  bill: "Bill",
  goal: "Goal deadline",
  reminder: "Reminder",
};
const EVENT_MARKERS: Record<PlannerEventKind, string> = {
  income: "bg-brand-500",
  expense: "bg-rose-500",
  bill: "bg-amber-500",
  goal: "bg-sky-500",
  reminder: "bg-violet-500",
};

function toDateKey(value: string) {
  const date = parseISO(value);
  return isValid(date) ? format(date, "yyyy-MM-dd") : null;
}

export function MonthlyPlanner() {
  const {
    transactions,
    goals,
    plannerItems,
    selectedMonth,
    setSelectedMonth,
    addPlannerItem,
    togglePlannerItem,
    deletePlannerItem,
  } = useAppStore();

  const [selectedDay, setSelectedDay] = useState(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    return today.startsWith(`${selectedMonth}-`) ? today : `${selectedMonth}-01`;
  });
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState(selectedDay);
  const [newType, setNewType] = useState<PlannerItemType>("reminder");
  const [newAmount, setNewAmount] = useState("");
  const [formError, setFormError] = useState("");

  const monthDate = parseISO(`${selectedMonth}-01`);
  const validMonthDate = isValid(monthDate) ? monthDate : new Date();
  const monthStart = startOfMonth(validMonthDate);
  const activeDay = selectedDay.startsWith(`${selectedMonth}-`)
    ? selectedDay
    : `${selectedMonth}-01`;
  const selectedDate = parseISO(activeDay);

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 }),
  });

  const eventsByDate = useMemo(() => {
    const events: PlannerEvent[] = [];

    transactions.forEach((transaction) => {
      const date = toDateKey(transaction.date);
      if (!date) return;

      const kind =
        transaction.type === "income"
          ? "income"
          : transaction.category.toLowerCase() === "bills & subscriptions"
            ? "bill"
            : "expense";

      events.push({
        key: `transaction-${transaction.id}`,
        title: transaction.title,
        date,
        kind,
        amount: transaction.amount,
      });
    });

    goals.forEach((goal) => {
      const date = goal.deadline ? toDateKey(goal.deadline) : null;
      if (!date || goal.status !== "active") return;

      events.push({
        key: `goal-${goal.id}`,
        title: goal.title,
        date,
        kind: "goal",
      });
    });

    plannerItems.forEach((item) => {
      const date = toDateKey(item.date);
      if (!date) return;

      events.push({
        key: `planner-${item.id}`,
        title: item.title,
        date,
        kind: item.type,
        amount: item.amount,
        plannerItemId: item.id,
        completed: item.completed,
      });
    });

    return events.reduce((byDate, event) => {
      const dayEvents = byDate.get(event.date) || [];
      dayEvents.push(event);
      byDate.set(event.date, dayEvents);
      return byDate;
    }, new Map<string, PlannerEvent[]>());
  }, [transactions, goals, plannerItems]);

  const selectedEvents = eventsByDate.get(activeDay) || [];

  const selectDay = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    setSelectedDay(dateKey);
    setSelectedMonth(dateKey.slice(0, 7));
  };

  const openAddForm = () => {
    setNewTitle("");
    setNewDate(activeDay);
    setNewType("reminder");
    setNewAmount("");
    setFormError("");
    setIsAddingItem(true);
  };

  const handleAddItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = newTitle.trim();
    const amount = newAmount ? Number(newAmount) : undefined;

    if (!title || !newDate) {
      setFormError("Add a title and date.");
      return;
    }

    if (newType === "bill" && (!amount || !Number.isFinite(amount) || amount <= 0)) {
      setFormError("Enter a bill amount greater than zero.");
      return;
    }

    addPlannerItem({
      title,
      date: newDate,
      type: newType,
      ...(newType === "bill" ? { amount } : {}),
    });
    setSelectedMonth(newDate.slice(0, 7));
    setSelectedDay(newDate);
    setIsAddingItem(false);
  };

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(19rem,0.85fr)]">
      <Card className="min-w-0">
        <CardHeader
          title="Calendar"
          subtitle="Select a date to view or add items"
        />

        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-[10px] font-semibold text-charcoal-muted dark:text-charcoal-darkMuted sm:text-xs"
            >
              <span className="sm:hidden">{day[0]}</span>
              <span className="hidden sm:inline">{day}</span>
            </div>
          ))}

          {calendarDays.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDate.get(dateKey) || [];
            const isSelected = dateKey === activeDay;
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());

            return (
              <button
                key={dateKey}
                type="button"
                aria-pressed={isSelected}
                aria-label={`${format(day, "EEEE, MMMM d")}, ${dayEvents.length} ${dayEvents.length === 1 ? "item" : "items"}`}
                onClick={() => selectDay(day)}
                className={`flex min-h-12 flex-col items-center justify-between rounded-xl p-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:min-h-20 sm:items-start sm:p-2 ${
                  isSelected
                    ? "bg-brand-600 text-white"
                    : isCurrentMonth
                      ? "text-charcoal hover:bg-surface-light dark:text-charcoal-dark dark:hover:bg-surface-darkElevated"
                      : "text-charcoal-light hover:bg-surface-light/70 dark:text-charcoal-darkMuted/60 dark:hover:bg-surface-darkElevated"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    isToday && !isSelected ? "bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300" : ""
                  }`}
                >
                  {format(day, "d")}
                </span>
                {dayEvents.length > 0 && (
                  <span
                    className={`min-w-5 rounded-full px-1 text-center text-[9px] leading-4 ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300"
                    }`}
                  >
                    {dayEvents.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="min-w-0">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-base text-charcoal dark:text-charcoal-dark">
              {format(selectedDate, "EEEE, MMMM d")}
            </h2>
            <p className="mt-0.5 text-xs text-charcoal-muted dark:text-charcoal-darkMuted">
              {selectedEvents.length} {selectedEvents.length === 1 ? "item" : "items"}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={openAddForm}>
            <Plus className="h-4 w-4" />
            <span>Add item</span>
          </Button>
        </div>

        {isAddingItem && (
          <form
            onSubmit={handleAddItem}
            className="mb-4 space-y-3 rounded-xl border border-surface-border bg-surface-light/70 p-3 dark:border-surface-darkBorder dark:bg-surface-darkElevated/70"
          >
            <Input
              label="Title"
              placeholder="What do you need to remember?"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              autoFocus
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date"
                type="date"
                value={newDate}
                onChange={(event) => setNewDate(event.target.value)}
                required
              />
              <Select
                label="Type"
                value={newType}
                onChange={(event) => setNewType(event.target.value as PlannerItemType)}
              >
                <option value="reminder">Reminder</option>
                <option value="bill">Bill</option>
              </Select>
            </div>
            {newType === "bill" && (
              <Input
                label="Amount"
                type="number"
                min="0.01"
                step="0.01"
                prefixElement={<span className="text-xs font-bold font-mono">Rs.</span>}
                value={newAmount}
                onChange={(event) => setNewAmount(event.target.value)}
                required
              />
            )}
            {formError && (
              <p role="alert" className="text-xs font-medium text-danger">
                {formError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsAddingItem(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" variant="primary">
                Add to planner
              </Button>
            </div>
          </form>
        )}

        {selectedEvents.length === 0 ? (
          <div className="rounded-xl bg-surface-light px-4 py-8 text-center dark:bg-surface-darkElevated">
            <p className="text-sm font-medium text-charcoal dark:text-charcoal-dark">
              Nothing planned for this day
            </p>
            <p className="mt-1 text-xs text-charcoal-muted dark:text-charcoal-darkMuted">
              Add a reminder or bill to keep track.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-border dark:divide-surface-darkBorder">
            {selectedEvents.map((event) => {
              const isCompleted = Boolean(event.plannerItemId && event.completed);
              const plannerItemId = event.plannerItemId;
              const label =
                event.kind === "bill" && !plannerItemId
                  ? "Bill payment"
                  : EVENT_LABELS[event.kind];

              return (
                <div key={event.key} className="flex items-start gap-3 py-3">
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${EVENT_MARKERS[event.kind]}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-medium ${
                        isCompleted
                          ? "text-charcoal-muted line-through dark:text-charcoal-darkMuted"
                          : "text-charcoal dark:text-charcoal-dark"
                      }`}
                    >
                      {event.title}
                    </p>
                    <p className="mt-0.5 text-xs text-charcoal-muted dark:text-charcoal-darkMuted">
                      {label}
                      {event.amount !== undefined && (
                        <span className="ml-2 font-mono">
                          {event.kind === "income" ? "+" : event.kind === "expense" || (event.kind === "bill" && !plannerItemId) ? "-" : ""}
                          {formatLKR(event.amount)}
                        </span>
                      )}
                    </p>
                  </div>
                  {plannerItemId && (
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        aria-label={
                          event.kind === "bill"
                            ? `Mark ${event.title} ${isCompleted ? "unpaid" : "paid"}`
                            : `Mark ${event.title} ${isCompleted ? "incomplete" : "complete"}`
                        }
                        onClick={() => togglePlannerItem(plannerItemId)}
                        className="rounded-lg p-1.5 text-charcoal-muted hover:bg-surface-light hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-charcoal-darkMuted dark:hover:bg-surface-darkElevated"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${event.title}`}
                        onClick={() => deletePlannerItem(plannerItemId)}
                        className="rounded-lg p-1.5 text-charcoal-muted hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-charcoal-darkMuted dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
