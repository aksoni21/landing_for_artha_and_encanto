import React, { useState } from 'react';

const ImplementationCalendar = () => {
  const [isPhaseDetailsOpen, setIsPhaseDetailsOpen] = useState(false);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Implementation milestones - only key phase starts
  const milestones: { [key: string]: {
    title: string;
    phase: 'PHASE1' | 'PHASE2' | 'PHASE3' | 'PHASE4';
    type: 'start' | 'end';
    details?: string[];
    tooltipTitle?: string;
  } } = {};

  // Monday markers with task details
  // Week 1-2 Monday on Oct 27
  const week1Monday = new Date(2025, 9, 27);
  milestones[`${week1Monday.getFullYear()}-${week1Monday.getMonth() + 1}-${week1Monday.getDate()}`] = {
    title: 'START: Setup & Config',
    phase: 'PHASE1',
    type: 'start',
    tooltipTitle: 'Week 1-2 Tasks:',
    details: [
      'Create Nissan partner configuration',
      'Custom branding (logo, colors)',
      'Build role-specific prompts (Technical Architect, Financial PM, Customer Service)',
      'Configure scoring thresholds'
    ]
  };

  // Week 3-4 Monday on Nov 10
  const week3Monday = new Date(2025, 10, 10);
  milestones[`${week3Monday.getFullYear()}-${week3Monday.getMonth() + 1}-${week3Monday.getDate()}`] = {
    title: 'START: Testing & Pilot',
    phase: 'PHASE1',
    type: 'start',
    tooltipTitle: 'Week 3-4 Tasks:',
    details: [
      'Test with 5-10 internal team members',
      'Gather feedback on UX',
      'Verify accuracy (video, transcription, scoring)',
      'Adjust prompts based on feedback',
      'Select 1-2 open positions',
      'Run 20-30 candidates through assessment',
      'TA reviews results alongside traditional screening',
      'Collect time savings & candidate experience data'
    ]
  };

  // Week 5-6 Monday on Jan 5, 2026
  const week5Monday = new Date(2026, 0, 5);
  milestones[`${week5Monday.getFullYear()}-${week5Monday.getMonth() + 1}-${week5Monday.getDate()}`] = {
    title: 'START: Broader Rollout',
    phase: 'PHASE2',
    type: 'start',
    tooltipTitle: 'Week 5-6 Tasks:',
    details: [
      'Expand to 40-50 candidates across multiple roles',
      'Train hiring managers on interpreting results',
      'Set up automated email workflows',
      'Weekly check-ins with TA team'
    ]
  };

  // Week 7 Monday on Jan 19, 2026
  const week7Monday = new Date(2026, 0, 19);
  milestones[`${week7Monday.getFullYear()}-${week7Monday.getMonth() + 1}-${week7Monday.getDate()}`] = {
    title: 'START: Scale to More Hires',
    phase: 'PHASE3',
    type: 'start',
    tooltipTitle: 'Week 7 Tasks:',
    details: [
      'Roll out to all Mexico operations hiring',
      'Automated assessment triggers from ATS',
      'Real-time results notifications for hiring managers',
      'Bulk reporting for TA leadership'
    ]
  };

  // Week 8 Monday on Feb 2, 2026
  const week8Monday = new Date(2026, 1, 2);
  milestones[`${week8Monday.getFullYear()}-${week8Monday.getMonth() + 1}-${week8Monday.getDate()}`] = {
    title: 'START: Optimization',
    phase: 'PHASE3',
    type: 'start',
    tooltipTitle: 'Week 8 Tasks:',
    details: [
      'Identify top performers needing language training',
      'Connect assessment data to development programs',
      'Feedback loop: Assessment → Hire → Performance',
      'Establish quarterly review cadence'
    ]
  };

  // Week 9 Monday on Feb 16, 2026
  const week9Monday = new Date(2026, 1, 16);
  milestones[`${week9Monday.getFullYear()}-${week9Monday.getMonth() + 1}-${week9Monday.getDate()}`] = {
    title: 'START: TM Integration',
    phase: 'PHASE4',
    type: 'start',
    tooltipTitle: 'Week 9 Tasks:',
    details: [
      'Enable longitudinal tracking for hired employees',
      'Set up quarterly re-assessments',
      'Build career pathing dashboards'
    ]
  };

  // Week 10 Monday on Mar 2, 2026
  const week10Monday = new Date(2026, 2, 2);
  milestones[`${week10Monday.getFullYear()}-${week10Monday.getMonth() + 1}-${week10Monday.getDate()}`] = {
    title: 'START: Training ROI',
    phase: 'PHASE4',
    type: 'start',
    tooltipTitle: 'Week 10 Tasks:',
    details: [
      'Track employee language improvement over time',
      'Measure promotion readiness',
      'Calculate training program ROI'
    ]
  };

  // Completion on Mar 8, 2026 (Sunday end of Week 10)
  const completionSunday = new Date(2026, 2, 8);
  milestones[`${completionSunday.getFullYear()}-${completionSunday.getMonth() + 1}-${completionSunday.getDate()}`] = {
    title: 'IMPLEMENTATION COMPLETE',
    phase: 'PHASE4',
    type: 'end'
  };

  // US Federal Holidays & Mexico Holidays for 2025-2026
  const holidays: { [key: string]: { name: string; country: 'US' | 'MX' | 'BOTH' } } = {
    // Shared Holidays
    '2025-1-1': { name: 'New Year\'s Day', country: 'BOTH' },
    '2025-12-25': { name: 'Christmas Day', country: 'BOTH' },
    '2026-1-1': { name: 'New Year\'s Day', country: 'BOTH' },

    // US Federal Holidays
    '2025-1-20': { name: 'MLK Jr. Day', country: 'US' },
    '2025-2-17': { name: 'Presidents\' Day', country: 'US' },
    '2025-5-26': { name: 'Memorial Day', country: 'US' },
    '2025-6-19': { name: 'Juneteenth', country: 'US' },
    '2025-7-4': { name: 'Independence Day', country: 'US' },
    '2025-9-1': { name: 'Labor Day', country: 'US' },
    '2025-10-13': { name: 'Columbus Day', country: 'US' },
    '2025-11-11': { name: 'Veterans Day', country: 'US' },
    '2025-11-27': { name: 'Thanksgiving', country: 'US' },
    '2026-1-19': { name: 'MLK Jr. Day', country: 'US' },
    '2026-2-16': { name: 'Presidents\' Day', country: 'US' },

    // Mexico Federal Holidays
    '2025-2-3': { name: 'Constitution Day', country: 'MX' },
    '2025-3-17': { name: 'Benito Juárez Birthday', country: 'MX' },
    '2025-5-1': { name: 'Labor Day', country: 'MX' },
    '2025-9-16': { name: 'Independence Day', country: 'MX' },
    '2025-11-17': { name: 'Revolution Day', country: 'MX' },
    '2026-2-2': { name: 'Constitution Day', country: 'MX' },
    '2026-3-16': { name: 'Benito Juárez Birthday', country: 'MX' },
    '2026-5-1': { name: 'Labor Day', country: 'MX' },
    '2026-9-16': { name: 'Independence Day', country: 'MX' },
    '2026-11-16': { name: 'Revolution Day', country: 'MX' },
  };

  const getHolidayForDate = (year: number, month: number, day: number): { name: string; country: 'US' | 'MX' | 'BOTH' } | null => {
    const key = `${year}-${month + 1}-${day}`;
    return holidays[key] || null;
  };

  const getMilestoneForDate = (year: number, month: number, day: number) => {
    const key = `${year}-${month + 1}-${day}`;
    return milestones[key] || null;
  };

  const getPhaseColor = (phase: 'PHASE1' | 'PHASE2' | 'PHASE3' | 'PHASE4') => {
    switch (phase) {
      case 'PHASE1': return 'bg-indigo-100 border-indigo-500';
      case 'PHASE2': return 'bg-blue-100 border-blue-500';
      case 'PHASE3': return 'bg-green-100 border-green-500';
      case 'PHASE4': return 'bg-purple-100 border-purple-500';
    }
  };

  const getPhaseTextColor = (phase: 'PHASE1' | 'PHASE2' | 'PHASE3' | 'PHASE4') => {
    switch (phase) {
      case 'PHASE1': return 'text-indigo-800';
      case 'PHASE2': return 'text-blue-800';
      case 'PHASE3': return 'text-green-800';
      case 'PHASE4': return 'text-purple-800';
    }
  };

  const getMilestoneIcon = (type: 'start' | 'end') => {
    return type === 'start' ? '🚀' : '🎯';
  };

  const today = new Date();
  const todayDayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  const todayDate = today.getDate();

  // Calculate the start of this week (Sunday)
  const weekStartDate = todayDate - todayDayOfWeek;

  // Function to render a single month
  const renderMonth = (monthOffset: number) => {
    const monthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const firstDayOfThisMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const lastDayOfThisMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
    const totalDaysInMonth = lastDayOfThisMonth.getDate();
    const startingDayOfWeek = firstDayOfThisMonth.getDay();

    const isCurrentMonth = monthOffset === 0;
    const weekStart = weekStartDate;
    const weekEnd = weekStart + 6;

    const days = [];

    // Start from the beginning of this week for current month, otherwise from day 1
    const startDay = isCurrentMonth ? Math.max(1, weekStart) : 1;

    // Add empty cells to align with the week
    if (isCurrentMonth && weekStart >= 1) {
      const startDayOfWeek = new Date(monthDate.getFullYear(), monthDate.getMonth(), startDay).getDay();
      for (let i = 0; i < startDayOfWeek; i++) {
        days.push(<div key={`empty-${monthOffset}-${i}`} className="border-r border-b border-gray-200 h-24"></div>);
      }
    } else {
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(<div key={`empty-${monthOffset}-${i}`} className="border-r border-b border-gray-200 h-24"></div>);
      }
    }

    // Render days
    for (let day = startDay; day <= totalDaysInMonth; day++) {
      const isToday = isCurrentMonth && day === todayDate;
      const isThisWeek = isCurrentMonth && day >= weekStart && day <= weekEnd;
      const holiday = getHolidayForDate(monthDate.getFullYear(), monthDate.getMonth(), day);
      const milestone = getMilestoneForDate(monthDate.getFullYear(), monthDate.getMonth(), day);

      const getHolidayColor = (country: 'US' | 'MX' | 'BOTH') => {
        if (country === 'US') return 'bg-blue-50';
        if (country === 'MX') return 'bg-green-50';
        return 'bg-purple-50'; // BOTH
      };

      const getCountryFlag = (country: 'US' | 'MX' | 'BOTH') => {
        if (country === 'US') return '🇺🇸';
        if (country === 'MX') return '🇲🇽';
        return '🇺🇸🇲🇽'; // BOTH
      };

      // Determine background color priority: milestone > holiday > thisWeek
      let bgColor = '';
      let borderClass = 'border-r border-b border-gray-200';

      if (milestone) {
        bgColor = getPhaseColor(milestone.phase);
        borderClass = `border-r border-b border-2 ${getPhaseColor(milestone.phase).split(' ')[1]}`;
      } else if (holiday) {
        bgColor = getHolidayColor(holiday.country);
      } else if (isThisWeek) {
        bgColor = 'bg-blue-50';
      }

      days.push(
        <div key={`${monthOffset}-${day}`} className={`p-2 ${borderClass} h-32 flex flex-col ${bgColor} relative overflow-visible`}>
          <span className={`font-semibold text-sm ${isToday ? 'bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : 'text-gray-700'}`}>
            {day}
          </span>
          {milestone && (
            <div className="mt-1 flex-1 group cursor-pointer">
              <span className="text-sm mr-1">{getMilestoneIcon(milestone.type)}</span>
              <span className={`text-xs font-bold ${getPhaseTextColor(milestone.phase)} line-clamp-3 leading-tight`}>
                {milestone.title}
              </span>
              {milestone.details && (
                <div className="absolute left-full top-0 ml-2 bg-white border-2 border-indigo-400 rounded-lg shadow-2xl p-4 w-72 z-[100] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <h4 className="font-bold text-sm text-indigo-900 mb-2 border-b border-indigo-200 pb-1">
                    {milestone.tooltipTitle || 'Tasks:'}
                  </h4>
                  <ul className="space-y-2">
                    {milestone.details.map((detail, idx) => (
                      <li key={idx} className="text-xs text-gray-700 flex items-start">
                        <span className="text-green-600 mr-2 mt-0.5 flex-shrink-0">✓</span>
                        <span className="leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {holiday && !milestone && (
            <div className="mt-1">
              <span className="text-xs mr-1">{getCountryFlag(holiday.country)}</span>
              <span className="text-xs text-gray-800 font-semibold line-clamp-2">
                {holiday.name}
              </span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={monthOffset} className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
        </h3>
        <div className="grid grid-cols-7 border-t border-l border-gray-200">
          {daysOfWeek.map(day => (
            <div key={`${monthOffset}-${day}`} className="p-2 text-center text-xs font-bold text-gray-500 border-r border-b bg-gray-50">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 border-2 border-gray-200">
      {/* Phase Legend */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded ${getPhaseColor('PHASE1')} border-2 flex-shrink-0`}></div>
            <div>
              <div className={`text-sm font-bold ${getPhaseTextColor('PHASE1')}`}>Phase 1: Pilot Program</div>
              <div className="text-xs text-gray-600">Weeks 1-4</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded ${getPhaseColor('PHASE2')} border-2 flex-shrink-0`}></div>
            <div>
              <div className={`text-sm font-bold ${getPhaseTextColor('PHASE2')}`}>Phase 2: Expansion</div>
              <div className="text-xs text-gray-600">Weeks 5-6</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded ${getPhaseColor('PHASE3')} border-2 flex-shrink-0`}></div>
            <div>
              <div className={`text-sm font-bold ${getPhaseTextColor('PHASE3')}`}>Phase 3: Full Deployment</div>
              <div className="text-xs text-gray-600">Weeks 7-8</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded ${getPhaseColor('PHASE4')} border-2 flex-shrink-0`}></div>
            <div>
              <div className={`text-sm font-bold ${getPhaseTextColor('PHASE4')}`}>Phase 4: TM Integration</div>
              <div className="text-xs text-gray-600">Weeks 9-10</div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Phase Details */}
      <div className="mb-6">
        <button
          onClick={() => setIsPhaseDetailsOpen(!isPhaseDetailsOpen)}
          className="w-full flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
        >
          <span className="text-sm font-semibold text-indigo-900">
            View Phase Details & Deliverables
          </span>
          <svg
            className={`w-5 h-5 text-indigo-600 transition-transform ${isPhaseDetailsOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isPhaseDetailsOpen && (
          <div className="mt-4 space-y-4">
            {/* Phase 1 */}
            <div className={`p-4 rounded-lg border-2 ${getPhaseColor('PHASE1').split(' ')[0]} ${getPhaseColor('PHASE1').split(' ')[1]}`}>
              <h3 className={`font-bold text-lg mb-3 ${getPhaseTextColor('PHASE1')}`}>Phase 1: Pilot Program (Weeks 1-4)</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Week 1-2: Setup & Configuration</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                    <li>Create Nissan partner configuration</li>
                    <li>Custom branding (logo, colors)</li>
                    <li>Build role-specific prompts (Technical Architect, Financial PM, Customer Service)</li>
                    <li>Configure scoring thresholds</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Week 3-4: Internal Testing & Pilot Launch</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                    <li>Test with 5-10 internal team members</li>
                    <li>Gather feedback on UX</li>
                    <li>Verify accuracy (video, transcription, scoring)</li>
                    <li>Adjust prompts based on feedback</li>
                    <li>Select 1-2 open positions</li>
                    <li>Run 20-30 candidates through assessment</li>
                    <li>TA reviews results alongside traditional screening</li>
                    <li>Collect time savings & candidate experience data</li>
                  </ul>
                </div>

                <div className="bg-white/50 p-3 rounded">
                  <h4 className="font-semibold text-gray-800 mb-1">Success Metrics:</h4>
                  <ul className="text-gray-700 text-xs space-y-1">
                    <li>• Time-to-screen: &lt; 24 hours (vs. 3 weeks TOEIC)</li>
                    <li>• TA satisfaction: 80%+ find results actionable</li>
                    <li>• Candidate completion: 85%+</li>
                    <li>• Manager trust: Higher than current TOEIC</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className={`p-4 rounded-lg border-2 ${getPhaseColor('PHASE2').split(' ')[0]} ${getPhaseColor('PHASE2').split(' ')[1]}`}>
              <h3 className={`font-bold text-lg mb-3 ${getPhaseTextColor('PHASE2')}`}>Phase 2: Expansion (Weeks 5-6)</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Week 5-6: Broader Rollout</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                    <li>Expand to 40-50 candidates across multiple roles</li>
                    <li>Train hiring managers on interpreting results</li>
                    <li>Set up automated email workflows</li>
                    <li>Weekly check-ins with TA team</li>
                  </ul>
                </div>

                <div className="bg-white/50 p-3 rounded">
                  <h4 className="font-semibold text-gray-800 mb-1">Deliverables:</h4>
                  <ul className="text-gray-700 text-xs space-y-1">
                    <li>• Manager training guide (10-min video + PDF)</li>
                    <li>• Candidate communication templates</li>
                    <li>• Results dashboard access</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phase 3 */}
            <div className={`p-4 rounded-lg border-2 ${getPhaseColor('PHASE3').split(' ')[0]} ${getPhaseColor('PHASE3').split(' ')[1]}`}>
              <h3 className={`font-bold text-lg mb-3 ${getPhaseTextColor('PHASE3')}`}>Phase 3: Full Deployment (Weeks 7-8)</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Week 7: Scale to More Hires</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                    <li>Roll out to all Mexico operations hiring</li>
                    <li>Automated assessment triggers from ATS</li>
                    <li>Real-time results notifications for hiring managers</li>
                    <li>Bulk reporting for TA leadership</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Week 8: Optimization & Training Support</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                    <li>Identify top performers needing language training</li>
                    <li>Connect assessment data to development programs</li>
                    <li>Feedback loop: Assessment → Hire → Performance</li>
                    <li>Establish quarterly review cadence</li>
                  </ul>
                </div>

                <div className="bg-white/50 p-3 rounded">
                  <h4 className="font-semibold text-gray-800 mb-1">Success Metrics:</h4>
                  <ul className="text-gray-700 text-xs space-y-1">
                    <li>• Cost savings: 70-80% vs. TOEIC ($15K → $3-5K/year)</li>
                    <li>• Adoption: 95%+ of positions using assessment</li>
                    <li>• Time-to-hire reduction: 5-7 days</li>
                    <li>• Manager NPS: 8+/10</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phase 4 */}
            <div className={`p-4 rounded-lg border-2 ${getPhaseColor('PHASE4').split(' ')[0]} ${getPhaseColor('PHASE4').split(' ')[1]}`}>
              <h3 className={`font-bold text-lg mb-3 ${getPhaseTextColor('PHASE4')}`}>Phase 4: TM Integration (Weeks 9-10)</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Week 9: Connect to Talent Management</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                    <li>Enable longitudinal tracking for hired employees</li>
                    <li>Set up quarterly re-assessments</li>
                    <li>Build career pathing dashboards</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Week 10: Training ROI Measurement</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                    <li>Track employee language improvement over time</li>
                    <li>Measure promotion readiness</li>
                    <li>Calculate training program ROI</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Render current month and next 3 months */}
      {[0, 1, 2, 3].map(offset => renderMonth(offset))}
    </div>
  );
};

export default ImplementationCalendar;
