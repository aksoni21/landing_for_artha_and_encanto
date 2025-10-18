// Partner configuration for personalized landing pages
export interface PartnerConfig {
  id: string;
  name: string;
  fullName: string;
  location: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  studentCount: string;
  metrics: {
    timeSaved: string;
    availability: string;
    improvement: string;
  };
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  focusAreas: string[];
  calendarLink: string;
  contactEmail: string;
  customMessage?: string;
  features?: string[];
  isActive: boolean;
}

// Partner configurations database
export const partnersConfig: Record<string, PartnerConfig> = {
  sbl: {
    id: 'sbl',
    name: 'SBL',
    fullName: 'SBL Miami',
    location: 'Miami, FL',
    primaryColor: 'blue',
    secondaryColor: 'purple',
    studentCount: '500+',
    metrics: {
      timeSaved: '10 hrs/week',
      availability: '24/7',
      improvement: '2x Faster'
    },
    focusAreas: ['TOEFL Preparation', 'Academic English', 'Business Communication'],
    calendarLink: 'https://calendly.com/encanto-ai/sbl-demo',
    contactEmail: 'anthony@encanto.ai',
    customMessage: 'Voted the best English school in Miami!',
    features: [
      'TOEFL Speaking Assessment',
      'Instant scoring and feedback',
      'Progress tracking for 500+ students',
      'Custom curriculum integration'
    ],
    isActive: true
  },
  
  mdpl: {
    id: 'mdpl',
    name: 'MDPL',
    fullName: 'Miami-Dade Public Library',
    location: 'Miami-Dade County, FL',
    primaryColor: 'green',
    secondaryColor: 'blue',
    studentCount: '1000+',
    metrics: {
      timeSaved: '20 hrs/week',
      availability: '24/7',
      improvement: '3x Faster'
    },
    focusAreas: ['Adult ESL', 'Citizenship Test Prep', 'Workforce English'],
    calendarLink: 'https://calendly.com/encanto-ai/mdpl-demo',
    contactEmail: 'anthony@encanto.ai',
    customMessage: 'Empowering the Miami-Dade community with accessible ESL education!',
    features: [
      'Multi-level ESL assessment',
      'Citizenship test preparation',
      'Library-integrated learning',
      'Community progress dashboard'
    ],
    isActive: true
  },
  
  fiu: {
    id: 'fiu',
    name: 'FIU',
    fullName: 'Florida International University',
    location: 'Miami, FL',
    primaryColor: 'navy',
    secondaryColor: 'gold',
    studentCount: '2000+',
    metrics: {
      timeSaved: '30 hrs/week',
      availability: '24/7',
      improvement: '2.5x Faster'
    },
    testimonial: {
      quote: "Encanto AI has revolutionized how we assess and support our international students.",
      author: "Dr. Sarah Johnson",
      role: "Director of ESL Programs"
    },
    focusAreas: ['Academic English', 'TOEFL/IELTS Prep', 'Graduate Writing'],
    calendarLink: 'https://calendly.com/encanto-ai/fiu-demo',
    contactEmail: 'anthony@encanto.ai',
    customMessage: 'Supporting FIU\'s diverse international student community!',
    features: [
      'Academic writing assessment',
      'TOEFL/IELTS preparation',
      'Graduate-level English support',
      'Integration with Canvas LMS'
    ],
    isActive: true
  },
  
  'broward-esol': {
    id: 'broward-esol',
    name: 'Broward ESOL',
    fullName: 'Broward County School District ESOL',
    location: 'Fort Lauderdale, FL',
    primaryColor: 'blue',
    secondaryColor: 'green',
    studentCount: '40,000+',
    metrics: {
      timeSaved: '50 hrs/week',
      availability: '24/7',
      improvement: '2x Faster'
    },
    focusAreas: ['WIDA ACCESS Prep', 'K-12 ELL Support', 'Speaking Assessment', 'Progress Monitoring'],
    calendarLink: 'https://calendly.com/encanto-ai/broward-demo',
    contactEmail: 'anthony@encanto.ai',
    customMessage: 'Supporting Florida\'s most diverse school district with scalable ESOL solutions!',
    features: [
      'WIDA-aligned speaking assessment',
      'District-wide progress tracking',
      'Automated score predictions',
      'Teacher workload reduction'
    ],
    isActive: true
  },

  // Template for new partners
  template: {
    id: 'template',
    name: 'Your School',
    fullName: 'Your School Name',
    location: 'Your City, State',
    primaryColor: 'blue',
    secondaryColor: 'purple',
    studentCount: '100+',
    metrics: {
      timeSaved: '5 hrs/week',
      availability: '24/7',
      improvement: '2x Faster'
    },
    focusAreas: ['General ESL', 'Test Preparation'],
    calendarLink: 'https://calendly.com/encanto-ai/demo',
    contactEmail: 'anthony@encanto.ai',
    isActive: false
  }
};

// Helper function to get partner config
export const getPartnerConfig = (partnerId: string): PartnerConfig | null => {
  const partner = partnersConfig[partnerId.toLowerCase()];
  if (!partner || !partner.isActive) {
    return null;
  }
  return partner;
};

// Helper function to check if partner exists and is active
export const isValidPartner = (partnerId: string): boolean => {
  const partner = partnersConfig[partnerId.toLowerCase()];
  return partner ? partner.isActive : false;
};

// Get all active partners (for admin dashboard)
export const getActivePartners = (): PartnerConfig[] => {
  return Object.values(partnersConfig).filter(partner => partner.isActive);
};

// Color mapping with full Tailwind classes
export const colorMap: Record<string, { 
  primaryText: string; 
  secondaryText: string; 
  gradient: string;
  primaryBg: string;
  secondaryBg: string;
  primaryBorder: string;
  lightBg: string;
}> = {
  blue: {
    primaryText: 'text-blue-600',
    secondaryText: 'text-purple-600', 
    gradient: 'bg-gradient-to-r from-blue-600 to-purple-600',
    primaryBg: 'bg-blue-600',
    secondaryBg: 'bg-purple-600',
    primaryBorder: 'border-blue-200',
    lightBg: 'bg-blue-50'
  },
  green: {
    primaryText: 'text-green-600',
    secondaryText: 'text-blue-600',
    gradient: 'bg-gradient-to-r from-green-600 to-blue-600', 
    primaryBg: 'bg-green-600',
    secondaryBg: 'bg-blue-600',
    primaryBorder: 'border-green-200',
    lightBg: 'bg-green-50'
  },
  navy: {
    primaryText: 'text-blue-900',
    secondaryText: 'text-yellow-600',
    gradient: 'bg-gradient-to-r from-blue-900 to-yellow-500',
    primaryBg: 'bg-blue-900', 
    secondaryBg: 'bg-yellow-500',
    primaryBorder: 'border-blue-200',
    lightBg: 'bg-blue-50'
  },
  gold: {
    primaryText: 'text-yellow-600',
    secondaryText: 'text-orange-500',
    gradient: 'bg-gradient-to-r from-yellow-600 to-orange-500',
    primaryBg: 'bg-yellow-600',
    secondaryBg: 'bg-orange-500',
    primaryBorder: 'border-yellow-200',
    lightBg: 'bg-yellow-50'
  },
  red: {
    primaryText: 'text-red-600',
    secondaryText: 'text-orange-500',
    gradient: 'bg-gradient-to-r from-red-600 to-orange-500',
    primaryBg: 'bg-red-600',
    secondaryBg: 'bg-orange-500', 
    primaryBorder: 'border-red-200',
    lightBg: 'bg-red-50'
  }
};