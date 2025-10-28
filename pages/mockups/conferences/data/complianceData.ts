// Mock data for ELL Compliance Coordinator Dashboard

export interface Student {
  id: string;
  name: string;
  school: string;
  grade: number;
  program: string;
  yearsInProgram: number;
  lastScore: number;
  hlsStatus: 'Complete' | 'Pending' | 'Overdue';
  ilpStatus: 'Active' | 'Needs Update' | 'Missing';
  parentNotification: 'Sent' | 'Pending' | 'Overdue';
  isLTEL: boolean;
  isRFEP: boolean;
  isNewEL: boolean;
  assessmentStatus: 'Current' | 'Due Soon' | 'Overdue';
  serviceMinutes: number;
  requiredMinutes: number;
}

export interface ComplianceTask {
  id: string;
  task: string;
  mandateLevel: 'Title III' | 'Federal' | 'State';
  status: 'Complete' | 'Pending' | 'Overdue';
  dueDate: string;
  assignedTo: string;
}

export interface BudgetExpenditure {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  complianceStatus: 'Compliant' | 'Needs Review';
}

export interface PDSession {
  id: string;
  name: string;
  date: string;
  attendees: number;
  status: 'Completed' | 'Scheduled' | 'Cancelled';
}

export interface TeacherCredential {
  id: string;
  name: string;
  eslCertified: boolean;
  hoursCompleted: number;
  requiredHours: number;
  renewalDate: string;
  renewalStatus: 'Current' | 'Due Soon' | 'Overdue';
}

export interface ParentCommunication {
  id: string;
  date: string;
  studentName: string;
  template: string;
  method: 'Email' | 'Letter' | 'Phone' | 'Meeting';
  status: 'Sent' | 'Pending' | 'Follow-up Needed';
  language: 'English' | 'Spanish' | 'Mandarin' | 'Other';
}

export const schools = [
  'All Schools',
  'Lincoln Elementary',
  'Washington Middle School',
  'Roosevelt High School',
  'Jefferson Elementary',
  'Madison Middle School'
];

export const grades = [
  'All Grades',
  'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
];

export const mockStudents: Student[] = [
  { id: 'S001', name: 'Maria Rodriguez', school: 'Lincoln Elementary', grade: 3, program: 'ESL Pullout', yearsInProgram: 2, lastScore: 3.5, hlsStatus: 'Complete', ilpStatus: 'Active', parentNotification: 'Sent', isLTEL: false, isRFEP: false, isNewEL: false, assessmentStatus: 'Current', serviceMinutes: 180, requiredMinutes: 180 },
  { id: 'S002', name: 'Chen Wei', school: 'Lincoln Elementary', grade: 2, program: 'ESL Pullout', yearsInProgram: 1, lastScore: 2.8, hlsStatus: 'Complete', ilpStatus: 'Active', parentNotification: 'Sent', isLTEL: false, isRFEP: false, isNewEL: true, assessmentStatus: 'Current', serviceMinutes: 200, requiredMinutes: 200 },
  { id: 'S003', name: 'Ahmed Hassan', school: 'Washington Middle School', grade: 6, program: 'Sheltered Instruction', yearsInProgram: 5, lastScore: 4.2, hlsStatus: 'Complete', ilpStatus: 'Needs Update', parentNotification: 'Pending', isLTEL: true, isRFEP: false, isNewEL: false, assessmentStatus: 'Due Soon', serviceMinutes: 150, requiredMinutes: 180 },
  { id: 'S004', name: 'Fatima Al-Said', school: 'Roosevelt High School', grade: 10, program: 'ESL Integrated', yearsInProgram: 3, lastScore: 4.8, hlsStatus: 'Complete', ilpStatus: 'Active', parentNotification: 'Sent', isLTEL: false, isRFEP: false, isNewEL: false, assessmentStatus: 'Current', serviceMinutes: 120, requiredMinutes: 120 },
  { id: 'S005', name: 'Juan Hernandez', school: 'Lincoln Elementary', grade: 5, program: 'ESL Pullout', yearsInProgram: 6, lastScore: 3.2, hlsStatus: 'Pending', ilpStatus: 'Missing', parentNotification: 'Overdue', isLTEL: true, isRFEP: false, isNewEL: false, assessmentStatus: 'Overdue', serviceMinutes: 100, requiredMinutes: 180 },
  { id: 'S006', name: 'Svetlana Ivanova', school: 'Jefferson Elementary', grade: 4, program: 'ESL Pullout', yearsInProgram: 2, lastScore: 4.5, hlsStatus: 'Complete', ilpStatus: 'Active', parentNotification: 'Sent', isLTEL: false, isRFEP: true, isNewEL: false, assessmentStatus: 'Current', serviceMinutes: 0, requiredMinutes: 0 },
  { id: 'S007', name: 'Park Min-Jun', school: 'Madison Middle School', grade: 7, program: 'Sheltered Instruction', yearsInProgram: 4, lastScore: 3.8, hlsStatus: 'Complete', ilpStatus: 'Active', parentNotification: 'Sent', isLTEL: false, isRFEP: false, isNewEL: false, assessmentStatus: 'Current', serviceMinutes: 160, requiredMinutes: 180 },
  { id: 'S008', name: 'Noor Ibrahim', school: 'Washington Middle School', grade: 8, program: 'ESL Integrated', yearsInProgram: 1, lastScore: 2.5, hlsStatus: 'Complete', ilpStatus: 'Active', parentNotification: 'Sent', isLTEL: false, isRFEP: false, isNewEL: true, assessmentStatus: 'Current', serviceMinutes: 140, requiredMinutes: 140 },
  { id: 'S009', name: 'Carlos Gomez', school: 'Roosevelt High School', grade: 11, program: 'ESL Integrated', yearsInProgram: 7, lastScore: 3.6, hlsStatus: 'Overdue', ilpStatus: 'Needs Update', parentNotification: 'Pending', isLTEL: true, isRFEP: false, isNewEL: false, assessmentStatus: 'Due Soon', serviceMinutes: 90, requiredMinutes: 120 },
  { id: 'S010', name: 'Yuki Tanaka', school: 'Lincoln Elementary', grade: 1, program: 'ESL Pullout', yearsInProgram: 0.5, lastScore: 1.8, hlsStatus: 'Pending', ilpStatus: 'Missing', parentNotification: 'Pending', isLTEL: false, isRFEP: false, isNewEL: true, assessmentStatus: 'Current', serviceMinutes: 200, requiredMinutes: 200 },
  { id: 'S011', name: 'Amara Okafor', school: 'Jefferson Elementary', grade: 3, program: 'ESL Pullout', yearsInProgram: 2, lastScore: 3.9, hlsStatus: 'Complete', ilpStatus: 'Active', parentNotification: 'Sent', isLTEL: false, isRFEP: false, isNewEL: false, assessmentStatus: 'Current', serviceMinutes: 180, requiredMinutes: 180 },
  { id: 'S012', name: 'Dmitri Volkov', school: 'Madison Middle School', grade: 6, program: 'Sheltered Instruction', yearsInProgram: 3, lastScore: 4.1, hlsStatus: 'Complete', ilpStatus: 'Active', parentNotification: 'Sent', isLTEL: false, isRFEP: false, isNewEL: false, assessmentStatus: 'Current', serviceMinutes: 170, requiredMinutes: 180 },
  { id: 'S013', name: 'Aisha Mohammed', school: 'Washington Middle School', grade: 7, program: 'ESL Integrated', yearsInProgram: 5, lastScore: 3.3, hlsStatus: 'Complete', ilpStatus: 'Needs Update', parentNotification: 'Sent', isLTEL: true, isRFEP: false, isNewEL: false, assessmentStatus: 'Due Soon', serviceMinutes: 130, requiredMinutes: 140 },
  { id: 'S014', name: 'Luis Santos', school: 'Roosevelt High School', grade: 9, program: 'ESL Integrated', yearsInProgram: 2, lastScore: 3.7, hlsStatus: 'Complete', ilpStatus: 'Active', parentNotification: 'Sent', isLTEL: false, isRFEP: false, isNewEL: false, assessmentStatus: 'Current', serviceMinutes: 120, requiredMinutes: 120 },
  { id: 'S015', name: 'Hoa Nguyen', school: 'Lincoln Elementary', grade: 4, program: 'ESL Pullout', yearsInProgram: 3, lastScore: 4.3, hlsStatus: 'Complete', ilpStatus: 'Active', parentNotification: 'Sent', isLTEL: false, isRFEP: true, isNewEL: false, assessmentStatus: 'Current', serviceMinutes: 0, requiredMinutes: 0 },
  { id: 'S016', name: 'Omar Ali', school: 'Jefferson Elementary', grade: 5, program: 'ESL Pullout', yearsInProgram: 1, lastScore: 2.9, hlsStatus: 'Complete', ilpStatus: 'Active', parentNotification: 'Sent', isLTEL: false, isRFEP: false, isNewEL: true, assessmentStatus: 'Current', serviceMinutes: 180, requiredMinutes: 180 },
  { id: 'S017', name: 'Sofia Popov', school: 'Madison Middle School', grade: 8, program: 'Sheltered Instruction', yearsInProgram: 4, lastScore: 3.4, hlsStatus: 'Pending', ilpStatus: 'Active', parentNotification: 'Pending', isLTEL: false, isRFEP: false, isNewEL: false, assessmentStatus: 'Current', serviceMinutes: 140, requiredMinutes: 140 },
  { id: 'S018', name: 'Jin Park', school: 'Washington Middle School', grade: 6, program: 'ESL Integrated', yearsInProgram: 6, lastScore: 3.1, hlsStatus: 'Overdue', ilpStatus: 'Needs Update', parentNotification: 'Overdue', isLTEL: true, isRFEP: false, isNewEL: false, assessmentStatus: 'Overdue', serviceMinutes: 80, requiredMinutes: 140 },
  { id: 'S019', name: 'Leila Karimi', school: 'Roosevelt High School', grade: 12, program: 'ESL Integrated', yearsInProgram: 5, lastScore: 4.6, hlsStatus: 'Complete', ilpStatus: 'Active', parentNotification: 'Sent', isLTEL: false, isRFEP: false, isNewEL: false, assessmentStatus: 'Current', serviceMinutes: 120, requiredMinutes: 120 },
  { id: 'S020', name: 'Diego Rivera', school: 'Lincoln Elementary', grade: 2, program: 'ESL Pullout', yearsInProgram: 1, lastScore: 2.6, hlsStatus: 'Complete', ilpStatus: 'Active', parentNotification: 'Sent', isLTEL: false, isRFEP: false, isNewEL: true, assessmentStatus: 'Current', serviceMinutes: 200, requiredMinutes: 200 },
];

export const mockComplianceTasks: ComplianceTask[] = [
  { id: 'T001', task: 'Complete Annual WIDA Assessments', mandateLevel: 'Federal', status: 'Pending', dueDate: '2025-03-15', assignedTo: 'Assessment Team' },
  { id: 'T002', task: 'Submit Title III Consolidated Application', mandateLevel: 'Title III', status: 'Complete', dueDate: '2025-02-01', assignedTo: 'Compliance Coordinator' },
  { id: 'T003', task: 'Update All Student ILPs', mandateLevel: 'State', status: 'Pending', dueDate: '2025-11-30', assignedTo: 'ESL Teachers' },
  { id: 'T004', task: 'Parent Notification Letters (New ELs)', mandateLevel: 'Federal', status: 'Overdue', dueDate: '2025-10-15', assignedTo: 'School Office' },
  { id: 'T005', task: 'LTEL Student Review Meeting', mandateLevel: 'State', status: 'Pending', dueDate: '2025-11-15', assignedTo: 'ELL Committee' },
  { id: 'T006', task: 'Budget Reconciliation Report', mandateLevel: 'Title III', status: 'Pending', dueDate: '2025-12-01', assignedTo: 'Finance Office' },
  { id: 'T007', task: 'ESL Teacher PD Compliance Check', mandateLevel: 'State', status: 'Complete', dueDate: '2025-09-30', assignedTo: 'HR Department' },
  { id: 'T008', task: 'Home Language Survey Follow-ups', mandateLevel: 'Federal', status: 'Pending', dueDate: '2025-11-01', assignedTo: 'Registrar' },
  { id: 'T009', task: 'Program Evaluation Annual Report', mandateLevel: 'Title III', status: 'Pending', dueDate: '2025-12-15', assignedTo: 'Compliance Coordinator' },
  { id: 'T010', task: 'Service Minutes Verification', mandateLevel: 'State', status: 'Complete', dueDate: '2025-10-20', assignedTo: 'ESL Teachers' },
  { id: 'T011', task: 'Parent Advisory Committee Meeting', mandateLevel: 'Federal', status: 'Pending', dueDate: '2025-11-10', assignedTo: 'Parent Liaison' },
  { id: 'T012', task: 'RFEP Monitoring (First Year)', mandateLevel: 'State', status: 'Pending', dueDate: '2025-11-25', assignedTo: 'Counselors' },
];

export const mockBudgetData = {
  allocated: 100000,
  spent: 62500,
  expenditures: [
    { id: 'E001', date: '2025-09-15', amount: 15000, category: 'Instructional Materials', description: 'ESL Curriculum & Resources', complianceStatus: 'Compliant' as const },
    { id: 'E002', date: '2025-09-20', amount: 12500, category: 'Professional Development', description: 'WIDA Training Sessions', complianceStatus: 'Compliant' as const },
    { id: 'E003', date: '2025-10-01', amount: 8000, category: 'Technology', description: 'Language Learning Software', complianceStatus: 'Compliant' as const },
    { id: 'E004', date: '2025-10-05', amount: 6500, category: 'Parent Engagement', description: 'Translation Services & Events', complianceStatus: 'Compliant' as const },
    { id: 'E005', date: '2025-10-10', amount: 10000, category: 'Staffing', description: 'ESL Paraprofessional Salaries', complianceStatus: 'Compliant' as const },
    { id: 'E006', date: '2025-10-15', amount: 7500, category: 'Assessment', description: 'WIDA ACCESS Testing Materials', complianceStatus: 'Compliant' as const },
    { id: 'E007', date: '2025-10-20', amount: 2000, category: 'Administrative', description: 'Office Supplies & Printing', complianceStatus: 'Needs Review' as const },
    { id: 'E008', date: '2025-10-22', amount: 1000, category: 'Communication', description: 'Parent Notification Mailings', complianceStatus: 'Compliant' as const },
  ]
};

export const mockPDSessions: PDSession[] = [
  { id: 'PD001', name: 'WIDA Standards Training', date: '2025-09-15', attendees: 12, status: 'Completed' },
  { id: 'PD002', name: 'Sheltered Instruction Strategies', date: '2025-10-10', attendees: 15, status: 'Completed' },
  { id: 'PD003', name: 'Cultural Competency Workshop', date: '2025-11-05', attendees: 0, status: 'Scheduled' },
  { id: 'PD004', name: 'Assessment Data Analysis', date: '2025-12-01', attendees: 0, status: 'Scheduled' },
];

export const mockTeacherCredentials: TeacherCredential[] = [
  { id: 'TC001', name: 'Jennifer Martinez', eslCertified: true, hoursCompleted: 45, requiredHours: 40, renewalDate: '2026-06-30', renewalStatus: 'Current' },
  { id: 'TC002', name: 'Robert Chen', eslCertified: true, hoursCompleted: 38, requiredHours: 40, renewalDate: '2025-12-31', renewalStatus: 'Due Soon' },
  { id: 'TC003', name: 'Sarah Thompson', eslCertified: false, hoursCompleted: 15, requiredHours: 40, renewalDate: '2026-03-15', renewalStatus: 'Overdue' },
  { id: 'TC004', name: 'Michael Brown', eslCertified: true, hoursCompleted: 42, requiredHours: 40, renewalDate: '2026-08-30', renewalStatus: 'Current' },
  { id: 'TC005', name: 'Lisa Patel', eslCertified: true, hoursCompleted: 50, requiredHours: 40, renewalDate: '2026-05-15', renewalStatus: 'Current' },
  { id: 'TC006', name: 'David Kim', eslCertified: true, hoursCompleted: 35, requiredHours: 40, renewalDate: '2025-11-20', renewalStatus: 'Due Soon' },
];

export const mockParentCommunications: ParentCommunication[] = [
  { id: 'PC001', date: '2025-10-01', studentName: 'Maria Rodriguez', template: 'Welcome Letter - New EL', method: 'Letter', status: 'Sent', language: 'Spanish' },
  { id: 'PC002', date: '2025-10-03', studentName: 'Chen Wei', template: 'Program Placement Notification', method: 'Email', status: 'Sent', language: 'Mandarin' },
  { id: 'PC003', date: '2025-10-05', studentName: 'Ahmed Hassan', template: 'LTEL Status Update', method: 'Meeting', status: 'Sent', language: 'English' },
  { id: 'PC004', date: '2025-10-08', studentName: 'Juan Hernandez', template: 'ILP Review Request', method: 'Letter', status: 'Follow-up Needed', language: 'Spanish' },
  { id: 'PC005', date: '2025-10-10', studentName: 'Yuki Tanaka', template: 'Assessment Results', method: 'Phone', status: 'Pending', language: 'English' },
  { id: 'PC006', date: '2025-10-12', studentName: 'Fatima Al-Said', template: 'Progress Report', method: 'Email', status: 'Sent', language: 'English' },
  { id: 'PC007', date: '2025-10-15', studentName: 'Svetlana Ivanova', template: 'RFEP Eligibility', method: 'Meeting', status: 'Sent', language: 'English' },
  { id: 'PC008', date: '2025-10-18', studentName: 'Carlos Gomez', template: 'Service Minutes Update', method: 'Letter', status: 'Pending', language: 'Spanish' },
  { id: 'PC009', date: '2025-10-20', studentName: 'Jin Park', template: 'Compliance Alert', method: 'Phone', status: 'Follow-up Needed', language: 'English' },
  { id: 'PC010', date: '2025-10-22', studentName: 'Noor Ibrahim', template: 'Literacy Night Invitation', method: 'Email', status: 'Sent', language: 'English' },
];

export const mockStaffingData = {
  totalStaff: 6,
  certifiedStaff: 5,
  requiredStaff: 6,
  certificationRate: 83
};

export const mockGrowthData = {
  meetingGrowth: 72,
  notMeetingGrowth: 28
};
