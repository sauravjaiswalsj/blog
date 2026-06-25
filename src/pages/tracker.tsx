import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import AuthWrapper from '../components/AuthWrapper';
import styles from './tracker.module.css';

type Task = {
  id: string;
  time: string;
  title: string;
  why: string;
};

type DayRecord = {
  completed: string[];
  notes: string;
};

type TrackerStore = Record<string, DayRecord>;

const STORAGE_KEY = 'rise-notes-daily-tracker-v1';

const WEEKDAY_ROTATION: Record<number, string> = {
  1: 'OS fundamentals',
  2: 'SQL and database internals',
  3: 'Networking',
  4: 'Concurrency and Java',
};

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const BASE_TASKS: Task[] = [
  {
    id: 'morning',
    time: '7:45-9:00',
    title: 'Wake up, shower, get ready, walk',
    why: 'Calm start. No rushing.',
  },
  {
    id: 'breakfast',
    time: '9:00-9:30',
    title: 'Breakfast',
    why: 'Fuel before deep work.',
  },
  {
    id: 'dsa',
    time: '9:30-11:30',
    title: 'DSA Deep Work',
    why: 'Highest energy goes to the hardest task.',
  },
  {
    id: 'review',
    time: '11:30-12:00',
    title: 'Review and break',
    why: 'Write patterns learned.',
  },
  {
    id: 'pramp',
    time: '12:00-1:00',
    title: 'Pramp Mock',
    why: 'Retrieval under pressure.',
  },
  {
    id: 'lunch',
    time: '1:00-2:00',
    title: 'Cook, lunch, 15 min Instagram',
    why: 'Built-in reward.',
  },
  {
    id: 'dissertation',
    time: '2:00-3:30',
    title: 'Dissertation',
    why: 'Fresh enough to make progress.',
  },
  {
    id: 'applications',
    time: '3:30-4:30',
    title: 'Applications and referrals',
    why: 'Daily pipeline.',
  },
  {
    id: 'fundamentals',
    time: '4:30-5:30',
    title: 'CS Fundamentals',
    why: 'Rotate OS, SQL, networking, concurrency, and Java.',
  },
  {
    id: 'design',
    time: '5:30-6:30',
    title: 'HLD, LLD, and design patterns',
    why: 'One design. No passive videos.',
  },
  {
    id: 'gym',
    time: '6:30-8:00',
    title: 'Gym',
    why: 'Health and anxiety reduction.',
  },
  {
    id: 'shower',
    time: '8:00-8:30',
    title: 'Shower',
    why: 'Mental reset.',
  },
  {
    id: 'dinner',
    time: '8:30-9:15',
    title: 'Dinner',
    why: 'Relax.',
  },
  {
    id: 'reading',
    time: '9:15-9:45',
    title: 'DDIA or Thinking, Fast and Slow',
    why: 'Build engineering intuition.',
  },
  {
    id: 'recall',
    time: '9:45-10:15',
    title: 'Engineering Recall',
    why: 'Explain one project or topic aloud.',
  },
  {
    id: 'free',
    time: '10:15-11:00',
    title: 'Free Time',
    why: 'Friends, gaming, dating, or a walk.',
  },
  {
    id: 'sleep',
    time: '11:30',
    title: 'Sleep',
    why: 'Consistent routine.',
  },
];

const LIGHT_DAY_TASKS: Task[] = [
  {
    id: 'review',
    time: 'Flexible',
    title: 'Weekly review',
    why: 'Look back at what worked and what slipped.',
  },
  {
    id: 'plan',
    time: 'Flexible',
    title: 'Plan the next focused day',
    why: 'Make Monday easier before it starts.',
  },
  {
    id: 'reset',
    time: 'Flexible',
    title: 'Rest, move, and reset',
    why: 'Recovery keeps the system alive.',
  },
];

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatLongDate(dateKey: string): string {
  return fromDateKey(dateKey).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getTasksForDate(dateKey: string): Task[] {
  const date = fromDateKey(dateKey);
  const day = date.getDay();
  if (day >= 1 && day <= 4) {
    const rotation = WEEKDAY_ROTATION[day];
    return BASE_TASKS.map((task) =>
      task.id === 'fundamentals'
        ? { ...task, title: `CS Fundamentals: ${rotation}` }
        : task,
    );
  }
  return LIGHT_DAY_TASKS;
}

function getCompletion(record: DayRecord | undefined, tasks: Task[]): number {
  if (!record || tasks.length === 0) {
    return 0;
  }
  const completed = record.completed.filter((id) => tasks.some((task) => task.id === id));
  return Math.round((completed.length / tasks.length) * 100);
}

function getMonthDays(monthDate: Date): Array<Date | null> {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Array<Date | null> = [];

  for (let i = 0; i < first.getDay(); i += 1) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(year, month, day));
  }

  return days;
}

function getLevel(percent: number): string {
  if (percent >= 90) return styles.level4;
  if (percent >= 60) return styles.level3;
  if (percent >= 30) return styles.level2;
  if (percent > 0) return styles.level1;
  return styles.level0;
}

function TrackerApp(): React.ReactNode {
  const todayKey = toDateKey(new Date());
  const [store, setStore] = useState<TrackerStore>({});
  const [selectedDate, setSelectedDate] = useState<string>(todayKey);
  const [monthDate, setMonthDate] = useState<Date>(() => fromDateKey(todayKey));
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setStore(JSON.parse(raw));
      }
    } catch (error) {
      console.error('Could not load tracker data', error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [hydrated, store]);

  const tasks = useMemo(() => getTasksForDate(selectedDate), [selectedDate]);
  const selectedRecord = store[selectedDate] ?? { completed: [], notes: '' };
  const completion = getCompletion(selectedRecord, tasks);
  const monthDays = useMemo(() => getMonthDays(monthDate), [monthDate]);
  const selectedDateObject = fromDateKey(selectedDate);
  const isCoreDay = selectedDateObject.getDay() >= 1 && selectedDateObject.getDay() <= 4;

  const completedToday = selectedRecord.completed.filter((id) =>
    tasks.some((task) => task.id === id),
  ).length;

  const monthKeys = monthDays
    .filter((day): day is Date => day !== null)
    .map(toDateKey);
  const activeDays = monthKeys.filter((key) => getCompletion(store[key], getTasksForDate(key)) > 0).length;
  const perfectDays = monthKeys.filter((key) => getCompletion(store[key], getTasksForDate(key)) === 100).length;
  const averageMonth = monthKeys.length
    ? Math.round(
        monthKeys.reduce((sum, key) => sum + getCompletion(store[key], getTasksForDate(key)), 0) /
          monthKeys.length,
      )
    : 0;

  function updateRecord(dateKey: string, updater: (record: DayRecord) => DayRecord) {
    setStore((current) => {
      const currentRecord = current[dateKey] ?? { completed: [], notes: '' };
      return {
        ...current,
        [dateKey]: updater(currentRecord),
      };
    });
  }

  function toggleTask(taskId: string) {
    updateRecord(selectedDate, (record) => {
      const completed = record.completed.includes(taskId)
        ? record.completed.filter((id) => id !== taskId)
        : [...record.completed, taskId];
      return { ...record, completed };
    });
  }

  function setAllTasks(done: boolean) {
    updateRecord(selectedDate, (record) => ({
      ...record,
      completed: done ? tasks.map((task) => task.id) : [],
    }));
  }

  function setNotes(notes: string) {
    updateRecord(selectedDate, (record) => ({ ...record, notes }));
  }

  function moveMonth(offset: number) {
    setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  function chooseDate(dateKey: string) {
    setSelectedDate(dateKey);
    setMonthDate(fromDateKey(dateKey));
  }

  return (
    <Layout title="Daily Tracker" description="Daily schedule tracker with calendar progress">
      <main className={styles.page}>
        <div className={styles.shell}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Daily operating system</p>
              <Heading as="h1" className={styles.title}>
                Daily Tracker
              </Heading>
              <p className={styles.subtitle}>
                A focused Monday to Thursday rhythm for interviews, dissertation work, applications,
                health, recall, and deliberate rest.
              </p>
            </div>

            <div className={styles.datePicker}>
              <label htmlFor="tracker-date">Open day</label>
              <input
                id="tracker-date"
                type="date"
                value={selectedDate}
                onChange={(event) => chooseDate(event.target.value)}
              />
            </div>
          </header>

          <section className={styles.statsGrid} aria-label="Tracker stats">
            <div className={styles.stat}>
              <span className={styles.statLabel}>Selected day</span>
              <span className={styles.statValue}>{completion}%</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Tasks done</span>
              <span className={styles.statValue}>
                {completedToday}/{tasks.length}
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Active days</span>
              <span className={styles.statValue}>{activeDays}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Month average</span>
              <span className={styles.statValue}>{averageMonth}%</span>
            </div>
          </section>

          <div className={styles.grid}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <Heading as="h2" className={styles.panelTitle}>
                    {formatLongDate(selectedDate)}
                  </Heading>
                  <p className={styles.panelMeta}>
                    {isCoreDay
                      ? 'Optimized Monday to Thursday schedule'
                      : 'Light review day for recovery and planning'}
                  </p>
                </div>
                <span className={styles.progressPill}>{completion}% complete</span>
              </div>
              <div className={styles.progressTrack} aria-hidden="true">
                <div className={styles.progressFill} style={{ width: `${completion}%` }} />
              </div>

              <div className={styles.taskList}>
                {tasks.map((task) => {
                  const checked = selectedRecord.completed.includes(task.id);
                  return (
                    <label
                      key={task.id}
                      className={`${styles.task} ${checked ? styles.complete : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTask(task.id)}
                      />
                      <span className={styles.taskTime}>{task.time}</span>
                      <span className={styles.taskBody}>
                        <span className={styles.taskName}>{task.title}</span>
                        <span className={styles.taskWhy}>{task.why}</span>
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={`${styles.button} ${styles.primaryButton}`}
                  onClick={() => setAllTasks(true)}
                >
                  Complete day
                </button>
                <button type="button" className={styles.button} onClick={() => setAllTasks(false)}>
                  Clear day
                </button>
                <button type="button" className={styles.button} onClick={() => chooseDate(todayKey)}>
                  Today
                </button>
              </div>
            </section>

            <aside className={styles.sideStack}>
              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <div className={styles.calendarControls}>
                    <button
                      type="button"
                      className={styles.iconButton}
                      aria-label="Previous month"
                      onClick={() => moveMonth(-1)}
                    >
                      {'<'}
                    </button>
                    <Heading as="h2" className={styles.monthTitle}>
                      {monthDate.toLocaleDateString(undefined, {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Heading>
                    <button
                      type="button"
                      className={styles.iconButton}
                      aria-label="Next month"
                      onClick={() => moveMonth(1)}
                    >
                      {'>'}
                    </button>
                  </div>
                </div>
                <div className={styles.calendar}>
                  <div className={styles.weekdays}>
                    {WEEKDAY_LABELS.map((day) => (
                      <span key={day} className={styles.weekday}>
                        {day}
                      </span>
                    ))}
                  </div>
                  <div className={styles.days}>
                    {monthDays.map((day, index) => {
                      if (!day) {
                        return <span key={`empty-${index}`} className={styles.emptyDay} />;
                      }
                      const dateKey = toDateKey(day);
                      const dayTasks = getTasksForDate(dateKey);
                      const dayCompletion = getCompletion(store[dateKey], dayTasks);
                      return (
                        <button
                          key={dateKey}
                          type="button"
                          className={[
                            styles.day,
                            getLevel(dayCompletion),
                            dateKey === todayKey ? styles.today : '',
                            dateKey === selectedDate ? styles.selected : '',
                          ].join(' ')}
                          title={`${dateKey}: ${dayCompletion}% complete`}
                          onClick={() => chooseDate(dateKey)}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <div>
                    <Heading as="h2" className={styles.panelTitle}>
                      Notes and recall
                    </Heading>
                    <p className={styles.panelMeta}>Capture the pattern, not the guilt.</p>
                  </div>
                </div>
                <div className={styles.notes}>
                  <label htmlFor="tracker-notes">What did you learn today?</label>
                  <textarea
                    id="tracker-notes"
                    value={selectedRecord.notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Patterns learned, mock feedback, project explanation, blockers..."
                  />
                </div>
              </section>

              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <div>
                    <Heading as="h2" className={styles.panelTitle}>
                      CS rotation
                    </Heading>
                    <p className={styles.panelMeta}>{perfectDays} perfect days this month</p>
                  </div>
                </div>
                <div className={styles.rotation}>
                  <div className={styles.rotationRow}>
                    <span className={styles.rotationDay}>Monday</span>
                    <span>OS fundamentals</span>
                  </div>
                  <div className={styles.rotationRow}>
                    <span className={styles.rotationDay}>Tuesday</span>
                    <span>SQL and database internals</span>
                  </div>
                  <div className={styles.rotationRow}>
                    <span className={styles.rotationDay}>Wednesday</span>
                    <span>Networking</span>
                  </div>
                  <div className={styles.rotationRow}>
                    <span className={styles.rotationDay}>Thursday</span>
                    <span>Concurrency and Java</span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default function TrackerPage(): React.ReactNode {
  return (
    <AuthWrapper>
      <TrackerApp />
    </AuthWrapper>
  );
}
