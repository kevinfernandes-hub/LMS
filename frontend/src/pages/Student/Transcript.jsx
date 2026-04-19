import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Card, Loading, Badge } from '../../components/ui.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen, TrendingUp, AlertCircle, Award, GraduationCap, FileText, CheckCircle } from 'lucide-react';
import { assignmentsAPI } from '../../api/client.js';
import { motion } from 'framer-motion';

export default function StudentTranscript() {
  const [transcript, setTranscript] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchTranscript();
  }, []);

  const fetchTranscript = async () => {
    setIsLoading(true);
    try {
      const res = await assignmentsAPI.getTranscript();
      setTranscript(res.data);
    } catch (error) {
      toast.error('Failed to load transcript');
    } finally {
      setIsLoading(false);
    }
  };

  const stats = useMemo(() => {
    if (!transcript) return null;
    const { transcript: transcriptData } = transcript;
    const gradesData = transcriptData.filter((t) => t.grade !== null);
    const averageGrade = gradesData.length > 0 
      ? gradesData.reduce((sum, t) => sum + parseFloat(t.grade), 0) / gradesData.length 
      : 0;
    const gpa = (averageGrade / (transcriptData[0]?.points || 100)) * 4.0 || 0;
    
    return {
      averageGrade,
      gpa,
      totalAssignments: transcriptData.length,
      gradedCount: gradesData.length
    };
  }, [transcript]);

  if (isLoading) return <Loading />;

  if (!transcript) {
    return (
      <div className="p-6">
        <Card glass className="text-center py-20 rounded-[2rem]">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#1E1B4B]">No transcript data found</h2>
          <p className="text-gray-500 max-w-sm mx-auto mt-2">Your grades will appear here once you start completing assignments and your teachers provide feedback.</p>
        </Card>
      </div>
    );
  }

  const { courses, transcript: transcriptData } = transcript;

  const courseGroups = courses.map((course) => ({
    ...course,
    assignments: transcriptData.filter((t) => t.course_id === course.id),
  }));

  const chartData = courseGroups.map((course) => {
    const courseGrades = course.assignments.filter((a) => a.grade !== null);
    const courseAverage = courseGrades.length > 0 
      ? courseGrades.reduce((sum, a) => sum + parseFloat(a.grade), 0) / courseGrades.length 
      : 0;
    return {
      name: course.title.length > 12 ? course.title.substring(0, 10) + '...' : course.title,
      fullName: course.title,
      average: parseFloat(courseAverage.toFixed(1)),
    };
  });

  const getGradeColor = (grade, maxPoints) => {
    const percentage = (grade / (maxPoints || 100)) * 100;
    if (percentage >= 90) return 'bg-emerald-100 text-emerald-700';
    if (percentage >= 80) return 'bg-indigo-100 text-indigo-700';
    if (percentage >= 70) return 'bg-amber-100 text-amber-700';
    return 'bg-rose-100 text-rose-700';
  };

  const getGradeLetter = (grade, maxPoints) => {
    const percentage = (grade / (maxPoints || 100)) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    return 'F';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-100">
          <p className="text-xs font-black text-[#4B2676] uppercase tracking-widest mb-1">{payload[0].payload.fullName}</p>
          <p className="text-lg font-bold text-[#1E1B4B]">{payload[0].value}% Average Score</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1E1B4B] tracking-tight mb-2">Academic Transcript</h1>
          <p className="text-gray-500 font-medium">Your complete academic journey and performance analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#4B2676] text-white px-4 py-2 rounded-xl font-bold text-sm">
            AY 2024-25
          </Badge>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Cumulative GPA', value: stats.gpa.toFixed(2), icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Courses Enrolled', value: courses.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Avg Performance', value: `${stats.averageGrade.toFixed(1)}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Graded Tasks', value: stats.gradedCount, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card glass className="p-6 rounded-[1.5rem] border-gray-100">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-[#1E1B4B]">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-1">
          <Card glass className="p-8 rounded-[2rem] h-full">
            <h3 className="text-xl font-bold text-[#1E1B4B] mb-8 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#4B2676]" /> Course Comparison
            </h3>
            <div className="h-[300px] w-full min-h-[300px] relative">
              {isMounted && transcript && (
                <ResponsiveContainer width="99%" height="100%" debounce={100}>
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                    <Bar dataKey="average" radius={[6, 6, 0, 0]} barSize={32}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4B2676' : '#6366F1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-6 text-center font-medium">Average score based on graded assignments per course.</p>
          </Card>
        </div>

        {/* Detailed Course Grades */}
        <div className="lg:col-span-2 space-y-6">
          {courseGroups.map((course, cIdx) => {
            const courseGrades = course.assignments.filter((a) => a.grade !== null);
            const courseAverage = courseGrades.length > 0
              ? courseGrades.reduce((sum, a) => sum + parseFloat(a.grade), 0) / courseGrades.length
              : null;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (cIdx * 0.1) }}
              >
                <Card glass className="p-8 rounded-[2rem] border-gray-100 overflow-hidden relative">
                  {/* Grade Accent */}
                  {courseAverage !== null && (
                    <div className="absolute top-0 right-0 p-8">
                      <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-indigo-100 border border-white ${getGradeColor(courseAverage, 100)}`}>
                        <span className="text-2xl font-black">{getGradeLetter(courseAverage, 100)}</span>
                        <span className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">Grade</span>
                      </div>
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-[#1E1B4B] mb-2">{course.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                      <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {course.subject}</span>
                      <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" /> Prof. {course.first_name} {course.last_name}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {course.assignments.length === 0 ? (
                      <div className="py-8 text-center bg-gray-50 rounded-[1.5rem] border border-dashed border-gray-200">
                        <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 font-medium">No recorded assignments</p>
                      </div>
                    ) : (
                      course.assignments.map((assignment) => (
                        <div
                          key={assignment.assignment_id}
                          className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-[1.5rem] bg-white/50 border border-gray-50 hover:border-[#4B2676]/20 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 gap-4"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-bold text-[#1E1B4B] group-hover:text-[#4B2676] transition-colors truncate">
                              {assignment.assignment_title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-xs font-bold text-gray-400 uppercase tracking-widest">
                              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> {assignment.points} Points</span>
                              <span>•</span>
                              <span>Due {new Date(assignment.due_date).toLocaleDateString()}</span>
                            </div>
                            
                            {assignment.feedback && (
                              <div className="mt-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                                <p className="text-xs text-[#4B2676] leading-relaxed line-clamp-2 italic font-medium">
                                  "{assignment.feedback}"
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-end">
                            {assignment.grade !== null ? (
                              <div className="text-right">
                                <Badge className={`px-4 py-2 rounded-xl font-black text-sm ${getGradeColor(assignment.grade, assignment.points)}`}>
                                  {parseFloat(assignment.grade).toFixed(1)} / {assignment.points}
                                </Badge>
                                <div className="mt-1.5 flex items-center justify-end gap-1.5">
                                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-[#4B2676] rounded-full" 
                                      style={{ width: `${(assignment.grade / assignment.points) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] font-black text-[#1E1B4B]">{((assignment.grade / assignment.points) * 100).toFixed(0)}%</span>
                                </div>
                              </div>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-500 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest">
                                Pending
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
