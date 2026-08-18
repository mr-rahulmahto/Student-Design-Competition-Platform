require('dotenv').config();
const mongoose = require('mongoose');
const Competition = require('./models/Competition');
const User = require('./models/User');

const competitions = [
  {
    title: 'NID Design Excellence Student Awards 2026',
    organizer: 'National Institute of Design (NID)',
    organizerLogo: 'NID',
    organizerColor: 'from-blue-600 to-indigo-700',
    category: 'UI/UX Design',
    deadline: new Date('2026-08-15T23:59:59'),
    startDate: new Date('2026-07-01'),
    prizePool: '₹2,50,000 Prize Pool',
    prizes: [
      { rank: '1st Winner', reward: '₹1,20,000 + NID Excellence Trophy' },
      { rank: '2nd Runner-up', reward: '₹70,000 + Mentorship Session' },
      { rank: '3rd Runner-up', reward: '₹40,000' },
      { rank: 'Special Merit (x2)', reward: '₹10,000 each' }
    ],
    eligibility: 'Undergraduate & Postgraduate Design Students across India',
    description: 'The premier design competition hosted by NID challenging young innovators to re-imagine healthcare accessibility, civic engagement, or smart mobility through human-centered interface design.',
    deliverables: [
      'Figma / Adobe XD Interactive Prototype link',
      'Executive Case Study Presentation (PDF, max 10 slides)',
      '2-minute video walkthrough of the user journey',
      'User research findings and persona maps'
    ],
    judgingCriteria: [
      { name: 'User Research & Problem Definition', weight: '30%' },
      { name: 'Visual Hierarchy & Interaction Design', weight: '30%' },
      { name: 'Innovation & Originality', weight: '25%' },
      { name: 'Accessibility & Inclusivity', weight: '15%' }
    ],
    bannerImage: 'https://images.unsplash.com/photo-1542744094-3a3121699563?auto=format&fit=crop&w=1200&q=80',
    tags: ['UI/UX', 'NID', 'Mobile App', 'Accessibility'],
    featured: true
  },
  {
    title: 'WDO Global Sustainable Cities Challenge',
    organizer: 'World Design Organization (WDO)',
    organizerLogo: 'WDO',
    organizerColor: 'from-emerald-600 to-teal-700',
    category: 'Product/Industrial',
    deadline: new Date('2026-09-30T23:59:59'),
    startDate: new Date('2026-07-10'),
    prizePool: '$12,000 USD',
    prizes: [
      { rank: 'Gold Award', reward: '$6,000 + WDO World Assembly Invite' },
      { rank: 'Silver Award', reward: '$3,500 + Publication' },
      { rank: 'Bronze Award', reward: '$2,500' }
    ],
    eligibility: 'International Design Students & Recent Graduates (within 1 year)',
    description: 'An international call to design physical or digital solutions that tackle urban waste, renewable energy consumption, or climate resilience in metropolitan environments.',
    deliverables: [
      'Detailed 3D CAD renders / Mockups',
      'Material selection & sustainability impact assessment',
      'Comprehensive design brief document (PDF)',
      'Concept demonstration video'
    ],
    judgingCriteria: [
      { name: 'Environmental & Circularity Impact', weight: '35%' },
      { name: 'Engineering Feasibility', weight: '25%' },
      { name: 'Aesthetics & Ergonomics', weight: '25%' },
      { name: 'Market Viability', weight: '15%' }
    ],
    bannerImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Sustainability', 'Product Design', 'WDO', 'CleanTech'],
    featured: true
  },
  {
    title: 'Unified Mentor National UI/UX & Web Hackathon',
    organizer: 'Unified Mentor',
    organizerLogo: 'UM',
    organizerColor: 'from-purple-600 to-pink-600',
    category: 'UI/UX Design',
    deadline: new Date('2026-08-20T23:59:59'),
    startDate: new Date('2026-07-15'),
    prizePool: '₹1,50,000 + Internship Offers',
    prizes: [
      { rank: 'Grand Champion', reward: '₹75,000 + Direct Industry Placement' },
      { rank: '1st Runner-Up', reward: '₹45,000 + Premium Mentorship' },
      { rank: '2nd Runner-Up', reward: '₹30,000 + Certificate of Distinction' }
    ],
    eligibility: 'Open to all enrolled university students & tech bootcamp participants',
    description: 'Build a responsive web application concept or mobile app that addresses real-world student challenges in education, skill development, or portfolio discovery.',
    deliverables: [
      'Live Deployed App URL or Figma Prototype',
      'Project GitHub / Source Code Repository link',
      'Project Design Document & Architecture rationale',
      'Slide deck presentation'
    ],
    judgingCriteria: [
      { name: 'User Experience & Flow', weight: '35%' },
      { name: 'Code Quality / Prototype Interactivity', weight: '30%' },
      { name: 'Problem Utility & Impact', weight: '20%' },
      { name: 'Design System Consistency', weight: '15%' }
    ],
    bannerImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    tags: ['Unified Mentor', 'Web App', 'UI/UX', 'Hackathon'],
    featured: true
  },
  {
    title: 'Red Dot Junior Concept Award 2026',
    organizer: 'Red Dot Design Award',
    organizerLogo: 'RED',
    organizerColor: 'from-red-600 to-rose-700',
    category: 'Graphic & Brand',
    deadline: new Date('2026-08-10T23:59:59'),
    startDate: new Date('2026-06-01'),
    prizePool: 'Red Dot Trophy & Global Exhibition',
    prizes: [
      { rank: 'Best of the Best', reward: 'Red Dot Trophy + Singapore Museum Exhibition' },
      { rank: 'Red Dot Winner', reward: 'Official Red Dot Quality Seal + Yearbook Feature' },
      { rank: 'Honorable Mention', reward: 'Official Certificate & Digital Badge' }
    ],
    eligibility: 'Students & young designers under 30 years old',
    description: 'Showcase groundbreaking visual identity, typography, packaging, or brand storytelling concepts that define the future of visual communications.',
    deliverables: [
      'High-resolution 300DPI poster series (JPG/PNG)',
      'Brand identity guideline manual (PDF)',
      'Packaging mockups / application samples'
    ],
    judgingCriteria: [
      { name: 'Visual Aesthetics & Innovation', weight: '40%' },
      { name: 'Concept Storytelling', weight: '30%' },
      { name: 'Execution Quality', weight: '30%' }
    ],
    bannerImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    tags: ['Graphic Design', 'Branding', 'Red Dot', 'Typography'],
    featured: false
  },
  {
    title: 'James Dyson Award - NextGen Innovation',
    organizer: 'James Dyson Foundation',
    organizerLogo: 'JDF',
    organizerColor: 'from-amber-500 to-orange-600',
    category: 'Product/Industrial',
    deadline: new Date('2026-10-15T23:59:59'),
    startDate: new Date('2026-08-15'),
    prizePool: '£30,000 Global Grand Prize',
    prizes: [
      { rank: 'International Winner', reward: '£30,000 for student + £5,000 for university' },
      { rank: 'International Runners-Up (x2)', reward: '£5,000 each' },
      { rank: 'National Winners', reward: '£5,000 each' }
    ],
    eligibility: 'University engineering, product design, and industrial design students',
    description: 'Design something that solves a problem. From medical devices to agricultural technology, create tangible hardware or product solutions that improve human lives.',
    deliverables: [
      'Physical / Working Prototype Demonstration Video',
      'Engineering blueprints and iterative build log',
      'Project write-up answering key problem & solution prompts'
    ],
    judgingCriteria: [
      { name: 'Ingenious Problem Solving', weight: '40%' },
      { name: 'Prototyping & Iteration Rigor', weight: '30%' },
      { name: 'Commercial & Social Value', weight: '30%' }
    ],
    bannerImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    tags: ['Engineering', 'Hardware', 'Dyson', 'Innovation'],
    featured: false
  },
  {
    title: 'Adobe Creative Jam: Generative AI Experience',
    organizer: 'Adobe Creative Cloud',
    organizerLogo: 'ADB',
    organizerColor: 'from-red-500 to-orange-500',
    category: 'UI/UX Design',
    deadline: new Date('2026-09-05T23:59:59'),
    startDate: new Date('2026-07-20'),
    prizePool: '$8,000 + Adobe All Apps Licenses',
    prizes: [
      { rank: '1st Place Team', reward: '$5,000 + 1-Year Adobe Creative Cloud + iPad Pro' },
      { rank: '2nd Place Team', reward: '$2,000 + 1-Year Creative Cloud' },
      { rank: '3rd Place Team', reward: '$1,000 + Creative Cloud' }
    ],
    eligibility: 'Higher Education Students enrolled globally',
    description: 'Fast-paced design challenge using Adobe Firefly and Adobe XD/Figma to create a revolutionary AI-assisted creative tool for modern content creators.',
    deliverables: [
      'Interactive Prototype link',
      'UX Research & AI prompt workflow breakdown',
      '3-minute pitch presentation'
    ],
    judgingCriteria: [
      { name: 'AI Integration & Delight', weight: '35%' },
      { name: 'Interface Craft & Micro-interactions', weight: '35%' },
      { name: 'User Problem Fit', weight: '30%' }
    ],
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tags: ['Adobe', 'AI Tools', 'UI/UX', 'Creative Jam'],
    featured: false
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Competition.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing competitions and users');

    // Seed competitions
    const seededComps = await Competition.insertMany(competitions);
    console.log(`🌱 Seeded ${seededComps.length} competitions`);

    // Create default admin user
    const admin = await User.create({
      name: 'Contest Administrator',
      email: 'admin@designpulse.org',
      password: 'admin123',
      role: 'admin',
      institution: 'Unified Mentor Competition Board',
      degree: 'Design Jury Executive',
      bio: 'Managing national student competitions and evaluating submissions.',
      skills: ['Competition Management', 'Jury Evaluation', 'Design Direction']
    });
    console.log(`👤 Created admin user: ${admin.email}`);

    // Create default student user
    const student = await User.create({
      name: 'Rahul Mahto',
      email: 'rahul.student@designpulse.edu',
      password: 'student123',
      role: 'student',
      institution: 'National Institute of Design',
      degree: 'Bachelor of Design (B.Des in Product & Interaction Design)',
      bio: 'Passionate about human-centered design, UI/UX prototyping, and building impactful digital products.',
      skills: ['UI/UX Design', 'Figma', 'User Research', 'Prototyping', 'Design Systems', 'HTML/CSS', 'React'],
      portfolioUrl: 'https://rahulmahto.design',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    });
    console.log(`👤 Created student user: ${student.email}`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('─────────────────────────────────────');
    console.log('Demo Credentials:');
    console.log(`  Student → rahul.student@designpulse.edu / student123`);
    console.log(`  Admin   → admin@designpulse.org / admin123`);
    console.log('─────────────────────────────────────');

    process.exit(0);
  } catch (err) {
    console.error(' Seed error:', err.message);
    process.exit(1);
  }
};

seedDB();
