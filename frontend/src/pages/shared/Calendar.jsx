import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Loading, Button, Badge } from '../../components/ui.jsx';
import { assignmentsAPI, coursesAPI } from '../../api/client.js';
import { useAuthStore } from '../../store/index.js';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from 'date-fns';

export default function Calendar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        if (user?.role === 'student') {
          const res = await assignmentsAPI.getTranscript();
          const transcript = res.data?.transcript || [];
          const byAssignmentId = new Map();

          for (const row of transcript) {
            if (!row?.assignment_id || !row?.due_date) continue;
            if (!byAssignmentId.has(row.assignment_id)) {
              byAssignmentId.set(row.assignment_id, {
                id: row.assignment_id,
                title: row.assignment_title,
                courseTitle: row.course_title,
                date: new Date(row.due_date),
                type: 'assignment'
              });
            }
          }
          setEvents(Array.from(byAssignmentId.values()));
        } else if (user?.role === 'teacher') {
          const coursesRes = await coursesAPI.list();
          const courses = coursesRes.data || [];
          const all = [];

          for (const course of courses) {
            try {
              const aRes = await assignmentsAPI.list(course.id);
              const assignments = aRes.data || [];
              for (const a of assignments) {
                if (!a?.due_date) continue;
                all.push({
                  id: a.id,
                  title: a.title,
                  courseTitle: course.title,
                  date: new Date(a.due_date),
                  type: 'assignment'
                });
              }
            } catch (err) {
              console.error('Failed to fetch assignments for course', course.id);
            }
          }
          setEvents(all);
        }
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [user?.role]);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const selectedDateEvents = useMemo(() => {
    return events.filter(event => isSameDay(event.date, selectedDate))
      .sort((a, b) => a.date - b.date);
  }, [events, selectedDate]);

  const getDayEvents = (day) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter(e => e.date >= now)
      .sort((a, b) => a.date - b.date)
      .slice(0, 6);
  }, [events]);

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4B2676]/10 text-[#4B2676] text-[10px] font-black uppercase tracking-wider mb-4">
            <Sparkles className="w-3 h-3" /> Academic Schedule
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1E1B4B] tracking-tight">
            Institutional <span className="text-[#4B2676]">Calendar</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-xl shadow-indigo-100 border border-gray-100">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={prevMonth}
            className="w-10 h-10 rounded-xl p-0 hover:bg-gray-50 text-[#4B2676]"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="min-w-[140px] text-center font-black text-[#1E1B4B] uppercase tracking-widest">
            {format(currentMonth, 'MMMM yyyy')}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={nextMonth}
            className="w-10 h-10 rounded-xl p-0 hover:bg-gray-50 text-[#4B2676]"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Calendar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Grid */}
        <div className="lg:col-span-8">
          <Card glass className="p-8 rounded-[3rem] border-gray-100 shadow-2xl shadow-indigo-50 overflow-hidden">
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest pb-4">
                  {day}
                </div>
              ))}
              
              {calendarDays.map((day, idx) => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = isSameDay(day, selectedDate);
                const currentDayEvents = getDayEvents(day);
                const hasEvents = currentDayEvents.length > 0;

                return (
                  <motion.button
                    key={day.toString()}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.005 }}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative group h-24 md:h-32 p-3 rounded-2xl transition-all duration-300 flex flex-col items-start
                      ${!isCurrentMonth ? 'opacity-20 pointer-events-none' : 'opacity-100'}
                      ${isSelected ? 'bg-[#4B2676] text-white shadow-2xl scale-105 z-10 shadow-indigo-200' : 'hover:bg-indigo-50/50'}
                    `}
                  >
                    <span className={`text-lg font-black ${isSelected ? 'text-white' : 'text-[#1E1B4B] opacity-40 group-hover:opacity-100'}`}>
                      {format(day, 'd')}
                    </span>
                    
                    {isToday(day) && !isSelected && (
                      <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#4B2676]" />
                    )}

                    <div className="mt-auto w-full space-y-1">
                      {hasEvents && (
                        <>
                          <div className={`text-[10px] font-black uppercase tracking-tighter truncate ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>
                            {currentDayEvents.length} {currentDayEvents.length === 1 ? 'Event' : 'Events'}
                          </div>
                          <div className="flex gap-1">
                            {currentDayEvents.slice(0, 3).map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#4B2676]'}`} 
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Selected Day Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-black text-[#1E1B4B] tracking-tight">
              Day <span className="text-[#4B2676]">Manifest</span>
            </h2>
            <Badge variant="secondary" className="bg-white text-gray-400 font-black uppercase tracking-widest text-[10px] border-gray-100">
              {format(selectedDate, 'MMM d, yyyy')}
            </Badge>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDate.toString()}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {selectedDateEvents.length === 0 ? (
                <Card glass className="p-12 text-center rounded-[2.5rem] border-gray-100 border-dashed">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CalendarIcon className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Empty Schedule</p>
                  <p className="text-gray-300 text-xs mt-2">No deadlines recorded for this date.</p>
                </Card>
              ) : (
                selectedDateEvents.map((event, idx) => (
                  <motion.button
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => {
                      if (user?.role === 'student') navigate(`/student/assignment/${event.id}`);
                      if (user?.role === 'teacher') navigate(`/teacher/grading/${event.id}`);
                    }}
                    className="w-full text-left group"
                  >
                    <Card glass className="p-6 rounded-[2rem] border-gray-100 group-hover:border-[#4B2676]/30 group-hover:shadow-xl group-hover:shadow-indigo-50 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4B2676]" />
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-[#4B2676]" />
                            <span className="text-[10px] font-black text-[#4B2676] uppercase tracking-[0.2em]">
                              {format(event.date, 'h:mm a')}
                            </span>
                          </div>
                          <Badge className="bg-indigo-50 text-[#4B2676] border-none text-[8px] font-black uppercase tracking-widest">
                            {event.type}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-[#1E1B4B] group-hover:text-[#4B2676] transition-colors leading-tight mb-1">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-2 text-gray-400">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold truncate">{event.courseTitle}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-indigo-100" />
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-[#4B2676] font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                            Details <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.button>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Upcoming Timeline Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-[#1E1B4B] tracking-tight px-4 flex items-center gap-3">
          <Clock className="w-6 h-6 text-[#4B2676]" />
          Upcoming <span className="text-[#4B2676]">Milestones</span>
        </h2>
        
        {upcomingEvents.length === 0 ? (
          <p className="text-gray-400 font-medium px-4">No upcoming deadlines recorded.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, idx) => (
              <motion.div
                key={`${event.id}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card glass className="p-6 rounded-[2.5rem] border-gray-100 hover:border-[#4B2676]/20 hover:shadow-xl transition-all group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#4B2676] flex flex-col items-center justify-center font-black leading-tight border border-indigo-100">
                      <span className="text-sm">{format(event.date, 'd')}</span>
                      <span className="text-[8px] uppercase tracking-tighter">{format(event.date, 'MMM')}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#1E1B4B] line-clamp-1 group-hover:text-[#4B2676] transition-colors">{event.title}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate mt-1">{event.courseTitle}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      if (user?.role === 'student') navigate(`/student/assignment/${event.id}`);
                      if (user?.role === 'teacher') navigate(`/teacher/grading/${event.id}`);
                    }}
                    className="w-full justify-between text-[#4B2676] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 rounded-xl px-4 py-2 border border-transparent hover:border-indigo-100"
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info Card */}
      <div className="pt-8">
        <Card className="p-8 rounded-[3rem] bg-indigo-50 border-indigo-100 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <AlertCircle className="w-8 h-8 text-[#4B2676]" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-[#1E1B4B] mb-1">Stay Organized</h4>
            <p className="text-sm text-gray-600 leading-relaxed">This view provides a comprehensive look at your academic schedule. We recommend checking both the monthly grid and the upcoming milestones daily to ensure nothing slips through the cracks.</p>
          </div>
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-[#4B2676] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-200 hover:scale-105 transition-all"
          >
            Back to Dashboard
          </Button>
        </Card>
      </div>
    </div>
  );
}
