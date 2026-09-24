import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buildCalendarGrid, isSameMonth, isSameDay, isToday, toISODate, getMonthLabel } from '../../utils/dateUtils';
import { Button } from '../ui/Button';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarGrid({ monthDate, onPrevMonth, onNextMonth, onToday, selectedDate, onSelectDate, eventsByDate, hasBudgets }) {
  const days = buildCalendarGrid(monthDate);

  return (
    <div className="card">
      <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
        <div className="card-title" style={{ fontSize: 'var(--text-lg)' }}>{getMonthLabel(monthDate)}</div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onToday}>
            Today
          </Button>
          <button type="button" className="icon-btn" aria-label="Previous month" onClick={onPrevMonth}>
            <ChevronLeft />
          </button>
          <button type="button" className="icon-btn" aria-label="Next month" onClick={onNextMonth}>
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {WEEKDAYS.map((day) => (
          <div className="calendar-weekday" key={day}>
            {day}
          </div>
        ))}
        {days.map((day) => {
          const key = toISODate(day);
          const events = eventsByDate.get(key);
          const outside = !isSameMonth(day, monthDate);
          const today = isToday(day);
          const selected = selectedDate && isSameDay(day, selectedDate);

          return (
            <button
              key={key}
              type="button"
              className={`calendar-cell ${outside ? 'outside' : ''} ${today ? 'today' : ''} ${selected ? 'selected' : ''}`}
              onClick={() => onSelectDate(day)}
              aria-label={key}
              aria-pressed={Boolean(selected)}
            >
              <span className="calendar-date">{day.getDate()}</span>
              {events?.bills?.map((b) => (
                <span
                  key={b.id}
                  className="calendar-event-tag"
                  style={{ background: 'var(--color-danger-soft)', color: 'var(--color-danger)' }}
                >
                  {b.name}
                </span>
              ))}
              {events?.goalDeadlines?.map((g) => (
                <span
                  key={g.id}
                  className="calendar-event-tag"
                  style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent)' }}
                >
                  {g.name}
                </span>
              ))}
              {hasBudgets && day.getDate() === 1 && (
                <span
                  className="calendar-event-tag"
                  style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}
                >
                  Budgets reset
                </span>
              )}
              {events?.transactions?.length > 0 && (
                <div className="calendar-dot-row">
                  {events.transactions.slice(0, 4).map((t) => (
                    <span
                      key={t.id}
                      className="calendar-dot"
                      style={{ background: t.type === 'income' ? 'var(--color-success)' : 'var(--color-text-faint)' }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
