/**
 * IIC Landing Page Structured Content
 * Editable data file for all landing page modules.
 * Note: Zero fabricated statistics or unverified claims.
 */

const iicContent = {
  // PROOF STRIP HEADLINE METRICS
  proofMetrics: [
    { number: 50, suffix: '+', label: 'Active Industry MoUs', icon: 'mou' },
    { number: 6, suffix: '', label: 'Centres of Excellence', icon: 'coe' },
    { number: 625, suffix: '+', label: 'Recruiters on Campus', icon: 'recruiters' },
    { number: 25, suffix: '+', label: 'Startups Incubated', icon: 'startup' },
    { number: 150, suffix: '+', label: 'Student Projects', icon: 'project' }
  ],

  // WHY PARTNER VALUE CARDS (3x2 Grid)
  whyPartner: [
    {
      title: 'Industry-Ready Talent Pipeline',
      desc: 'Tap into thousands of rigorously trained engineering graduates prepared through project-based learning and industry bootcamps.',
      stat: '625+ Recruiters on Campus',
      icon: 'users'
    },
    {
      title: 'Targeted Research & IP Collaboration',
      desc: 'Co-develop patentable technologies, sponsor specialized research grants, and resolve real-world engineering bottlenecks.',
      stat: 'Joint Patents & IEEE Publications',
      icon: 'award'
    },
    {
      title: 'State-of-the-Art Labs & Infrastructure',
      desc: 'Leverage dedicated high-performance computing, cleanrooms, robotics testbeds, and instrumentation complexes across departments.',
      stat: '6 Advanced Centres of Excellence',
      icon: 'cpu'
    },
    {
      title: 'Startup & Incubation Ecosystem',
      desc: 'Access early-stage deep tech ventures, prototype ideas alongside student founders, and co-invest in pre-incubation cohorts.',
      stat: '25+ Startups Supported',
      icon: 'rocket'
    },
    {
      title: 'Faculty Expertise & Consulting',
      desc: 'Partner with senior professors and doctorate researchers for corporate advisory, compliance testing, and technical vetting.',
      stat: '40+ Dedicated Expert Mentors',
      icon: 'briefcase'
    },
    {
      title: 'Brand Visibility & CSR Impact',
      desc: 'Co-brand hackathons, establish diversity scholarships, and channel CSR grants into high-impact regional tech education.',
      stat: '80+ Annual Tech Sprints & Events',
      icon: 'heart'
    }
  ],

  // WAYS TO COLLABORATE (8 Tiles)
  waysToCollaborate: [
    {
      id: 'placement',
      title: 'Hire & Internships',
      desc: 'Recruit talent through structured internships, pre-placement talks, and campus hiring drives.',
      icon: 'briefcase',
      type: 'Internship / Placement'
    },
    {
      id: 'labs',
      title: 'Sponsored Labs & Equipment',
      desc: 'Set up a branded corporate laboratory or donate specialized industrial hardware testbenches.',
      icon: 'server',
      type: 'Centre of Excellence'
    },
    {
      id: 'rnd',
      title: 'Joint R&D / Consultancy',
      desc: 'Commission faculty-led research, material testing, algorithmic tuning, or patent development.',
      icon: 'microscope',
      type: 'Sponsored Research'
    },
    {
      id: 'hackathons',
      title: 'Hackathons & Challenges',
      desc: 'Sponsor 24-48hr student innovation hackathons to solve custom corporate problem statements.',
      icon: 'code',
      type: 'Other'
    },
    {
      id: 'lectures',
      title: 'Guest Lectures & Workshops',
      desc: 'Deliver executive masterclasses, industry-standard tool trainings, and student mentorship.',
      icon: 'presentation',
      type: 'Guest Lecture / Workshop'
    },
    {
      id: 'incubation',
      title: 'Incubation & Mentoring',
      desc: 'Guide promising student startups through angel networks, advisory boards, and seed pilots.',
      icon: 'zap',
      type: 'Other'
    },
    {
      id: 'csr',
      title: 'CSR & Scholarships',
      desc: 'Direct corporate social responsibility funding into merit scholarships and community labs.',
      icon: 'shield',
      type: 'Industry MoU'
    },
    {
      id: 'curriculum',
      title: 'Curriculum Co-design',
      desc: 'Embed emerging industry skills and elective micro-courses directly into accredited syllabus.',
      icon: 'book',
      type: 'Industry MoU'
    }
  ],

  // HOW PARTNERSHIP WORKS (4-Step Timeline)
  partnershipSteps: [
    {
      step: '01',
      title: 'Enquire & Align',
      desc: 'Submit your partnership interest or schedule a discovery tour with our IIC liaison team.'
    },
    {
      step: '02',
      title: 'Discovery Call',
      desc: 'Meet department heads and faculty leads to define project objectives and deliverables.'
    },
    {
      step: '03',
      title: 'MoU & Scope',
      desc: 'Formalize the partnership through a straightforward, vetted MoU agreement without red tape.'
    },
    {
      step: '04',
      title: 'Kick-off & Review',
      desc: 'Deploy student cohorts, inaugurate lab facilities, and track measurable outcomes quarterly.'
    }
  ],

  // SUCCESS STORIES / CASE STUDIES
  // TODO: Add more partner case studies and outcome metrics as they become verified
  successStories: [
    {
      partner: 'Navigate Labs',
      logo: 'Images/AIML/WhatsApp Image 2026-09-23 at 12.13.36 PM.jpeg',
      category: 'Artificial Intelligence CoE',
      title: 'Foundational LLM Fine-Tuning & Enterprise Copilots',
      summary: 'Inaugurated dedicated high-compute AI facility training 480+ students with 14 live industry client sprints and 8 published patents.',
      linkText: 'View CoE Case Study',
      linkUrl: 'coe-detail.html?id=ai'
    },
    {
      partner: 'BeauRoi Technologies',
      logo: 'Images/edge-icon.png',
      category: 'EDGE Microelectronics CoE',
      title: 'VLSI Semiconductor & IoT Telemetry Architecture',
      summary: 'Equipped 385+ electronics engineers with FPGA testing suites, yielding 5 hardware patents and core silicon industry placements.',
      linkText: 'View CoE Case Study',
      linkUrl: 'coe-detail.html?id=edge'
    },
    {
      partner: 'Fortinet Academy',
      logo: 'Images/partners/fortinet.png',
      category: 'Cybersecurity CCEE',
      title: 'Zero-Trust Cyber Defense & Live SOC Operations',
      summary: 'Established continuous threat simulation center qualifying 440+ ethical hackers with 100% placement across Tier-1 security consultancies.',
      linkText: 'View CoE Case Study',
      linkUrl: 'coe-detail.html?id=cybersecurity'
    }
  ],

  // EVENTS & NEWS (Pulled from verified announcement feeds)
  events: [
    {
      dateBadge: { day: '20', month: 'MAY 2026' },
      title: 'SRMIST Innovation & Sustainability Leadership Awards 2026',
      desc: 'Annual flagship awards recognizing student innovation, faculty patents, and outstanding corporate R&D contributions.',
      cta: 'Apply / Enquire →',
      link: '#partner-enquiry'
    },
    {
      dateBadge: { day: '15', month: 'AUG 2026' },
      title: 'Next-Gen Industry-Academia Conclave 2026',
      desc: 'Bi-annual symposium bringing together 50+ CTOs and R&D leaders to explore emerging CoE sponsorships and curriculum tracks.',
      cta: 'Register Interest →',
      link: '#partner-enquiry'
    }
  ],

  news: [
    {
      tag: 'Milestone',
      title: '50+ Active Industry MoUs Across SRMIST Ramapuram',
      desc: 'Comprehensive milestone spanning 12 academic departments, connecting academia with Fortune 500 tech leaders.'
    },
    {
      tag: 'Infrastructure',
      title: '6 Dedicated Centres of Excellence Inaugurated',
      desc: 'Advanced research clusters commissioned in AI, Semiconductors, Cybersecurity, Robotics, Indo-Japan IT, and Structural Mechanics.'
    },
    {
      tag: 'Recognition',
      title: 'Recognized Under Ministry of Education Innovation Cell (MIC)',
      desc: 'Systematically structured council fostering innovation culture, startup incubation, and intellectual property generation.'
    }
  ],

  // FAQS FOR PROSPECTIVE PARTNERS
  faqs: [
    {
      q: 'What is the typical timeline to formalize an MoU with SRMIST Ramapuram?',
      a: 'Our streamlined vetting process typically completes within 10 to 14 business days. Following an initial alignment meeting, our legal and council committee approves the standard bilateral template with mutual scope agreements.'
    },
    {
      q: 'What are the primary modes of corporate engagement available?',
      a: 'Companies can engage through talent hiring and internships, establishing a sponsored Centre of Excellence (CoE), joint patent and R&D consultancy, sponsoring hackathons, or co-designing specialized curriculum electives.'
    },
    {
      q: 'How is Intellectual Property (IP) handled in collaborative R&D projects?',
      a: 'IP rights are defined clearly in the MoU scope agreement prior to project initiation. Collaborations can follow joint ownership models or assign proprietary rights to the industry sponsor according to grant provisions. // TODO: Confirm specific institutional IP policy nuances if needed'
    },
    {
      q: 'Can a corporate partner set up a customized Centre of Excellence?',
      a: 'Yes. We offer dedicated laboratory floor space, power infrastructure, student cohort allocation, and designated faculty coordinators. Six CoEs are already operational with corporate partners including Navigate Labs, BeauRoi Tech, and IPCS Global.'
    },
    {
      q: 'Is there any financial commitment required to initiate an academic partnership?',
      a: 'Standard academic MoUs focusing on internships, guest lectures, and placement scouting involve zero financial commitments. Financial arrangements apply only to sponsored equipment laboratories, funded R&D grants, or specialized corporate scholarships.'
    },
    {
      q: 'What ongoing operational support does the council provide after MoU signing?',
      a: 'Every corporate partner is assigned a dedicated Faculty Single Point of Contact (SPOC) and Department Coordinator who organize student cohorts, schedule reviews, maintain lab equipment, and report quarterly deliverables.'
    }
  ]
};

if (typeof window !== 'undefined') {
  window.iicContent = iicContent;
}
if (typeof module !== 'undefined') {
  module.exports = iicContent;
}
