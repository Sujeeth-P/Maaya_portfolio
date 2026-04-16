export const TICKER_ROW1 = [
  { icon: '🌐', label: 'Technology', title: 'Custom Website Design', desc: 'Pixel-perfect, fast-loading websites built to convert', bars: null },
  { icon: '📱', label: 'Technology', title: 'Mobile App Development', desc: 'iOS & Android apps built for scale', bars: null },
  { icon: '⚙️', label: 'Technology', title: 'Process Automation', desc: null, bars: [85, 62, 91] },
  { icon: '🖥️', label: 'Technology', title: 'Web Applications', desc: 'Complex dashboards and SaaS tools', bars: null },
  { icon: '🔧', label: 'Technology', title: 'Internal Tools', desc: 'Custom systems that replace manual workflows', bars: null },
]

export const TICKER_ROW2 = [
  { icon: '📣', label: 'Marketing', title: 'Brand Marketing', desc: 'Build a brand people remember and trust', bars: null },
  { icon: '📊', label: 'Marketing', title: 'Digital Growth Strategy', desc: null, bars: [78, 95, 60] },
  { icon: '📅', label: 'Marketing', title: 'Campaign Planning', desc: 'End-to-end campaign design and execution', bars: null },
  { icon: '📲', label: 'Marketing', title: 'Social Media Strategy', desc: 'Consistent presence that drives engagement', bars: null },
  { icon: '🎯', label: 'Marketing', title: 'Targeted Campaigns', desc: 'Reach the right audience at the right time', bars: null },
]

export const TICKER_ROW3 = [
  { icon: '✦', label: 'Design', title: 'Brand Visual Identity', desc: 'Logos, palettes, and design language', bars: null },
  { icon: '🎨', label: 'Design', title: 'Marketing Assets', desc: 'Banners, ads, and promo materials that pop', bars: null },
  { icon: '🖼️', label: 'Design', title: 'Digital Design Systems', desc: 'Scalable component libraries and style guides', bars: null },
  { icon: '✏️', label: 'Design', title: 'Custom Illustrations', desc: 'Bespoke artwork for brand storytelling', bars: null },
  { icon: '💡', label: 'Design', title: 'UI/UX Design', desc: 'Interfaces that feel intuitive and look stunning', bars: null },
]

export const SERVICES = [
  {
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="#0D9E75" strokeWidth={1.5}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    cat: 'Technology',
    items: ['Websites', 'Web Applications', 'Mobile Apps', 'Internal Tools', 'Business Systems & Process Automation'],
    delay: '0s',
  },
  {
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="#0D9E75" strokeWidth={1.5}>
        <path d="M9 19V13M12 19V8M15 19V11" />
        <path d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
    ),
    cat: 'Marketing',
    items: ['Social Media Strategy', 'Brand Marketing', 'Campaign Planning & Execution', 'Digital Growth Strategy'],
    delay: '0.12s',
  },
  {
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="#0D9E75" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
    cat: 'Design',
    items: ['Illustrations', 'Marketing & Promotional Assets', 'Brand Visuals', 'Digital Design Systems'],
    delay: '0.24s',
  },
]

export const STEPS = [
  { num: '01', title: 'Discovery', desc: 'Understanding the business, goals, and current challenges.', delay: '0s' },
  { num: '02', title: 'Strategy', desc: 'Planning the right technology, marketing, and design approach.', delay: '0.1s' },
  { num: '03', title: 'Design & Build', desc: 'Creating the product, visuals, and systems.', delay: '0.2s' },
  { num: '04', title: 'Launch', desc: 'Deployment and campaign execution.', delay: '0.3s' },
  { num: '05', title: 'Growth Support', desc: 'Iteration, optimization, and ongoing support.', delay: '0.4s' },
]

export const PILLARS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    title: 'Modern Technology', desc: 'Built on proven, scalable tech stacks that grow with your business.', delay: '0s'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    ),
    title: 'Strategic Thinking', desc: 'Every decision is tied to your business goals, not just aesthetics.', delay: '0.1s'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
      </svg>
    ),
    title: 'Design-Driven', desc: 'Interfaces and visuals that build trust and communicate clearly.', delay: '0.2s'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Reliable Execution', desc: 'We deliver on time, with clear communication throughout.', delay: '0.3s'
  },
]

export const WHY_STATS = [
  { num: '50+', label: 'Projects delivered across technology, marketing & design' },
  { num: '3x', label: 'Average growth seen by clients within 6 months' },
  { num: '100%', label: 'Client satisfaction on completed projects' },
  { num: '24h', label: 'Response time for all ongoing client support' },
]

export const TESTIMONIALS = [
  {
    quote: '"Maayay completely transformed how our business presents online. The website they built converted 3x more leads within the first month."',
    initials: 'RK', name: 'Rajan Kumar', meta: 'NovaTech Solutions · SaaS', delay: '0s',
  },
  {
    quote: '"Their marketing strategy and brand visuals gave our retail brand a whole new identity. Sales increased significantly after the campaign launch."',
    initials: 'PS', name: 'Priya Subramanian', meta: 'Bloom Retail · E-Commerce', delay: '0.12s',
  },
  {
    quote: '"The internal tool they built saved our operations team hours every week. Clear communication, fast delivery, and brilliant design thinking."',
    initials: 'AM', name: 'Arjun Mehta', meta: 'Meridian Logistics · Operations', delay: '0.24s',
  },
]

export const FAQS = [
  {
    q: 'How long does a typical project take?',
    a: 'Project timelines vary by scope. A standard website typically takes 3–5 weeks, while web applications or full brand campaigns may take 6–12 weeks. We provide a clear timeline during discovery so you always know what to expect.',
  },
  {
    q: 'Do you work with startups or established companies?',
    a: 'Both. We work with early-stage startups that need to establish their digital presence, and established businesses that need to modernize systems, improve marketing performance, or scale their operations.',
  },
  {
    q: 'Do you provide ongoing support?',
    a: 'Yes. After launch, we offer growth support packages that include iteration, optimization, maintenance, and ongoing marketing execution. We aim to be a long-term partner, not just a one-time vendor.',
  },
  {
    q: 'How do we start a project?',
    a: "Simply book a consultation using the form on this page. We'll set up a discovery call to understand your goals, challenges, and requirements — and then propose the right approach and timeline for your project.",
  },
]

export const FORM_SERVICES = [
  'Websites', 'Web Applications', 'Mobile Apps', 'Internal Tools',
  'Business Systems & Automation', 'Social Media Strategy',
  'Brand Marketing', 'Campaign Planning & Execution',
  'Digital Growth Strategy', 'Illustrations',
  'Marketing & Promotional Assets', 'Brand Visuals', 'Digital Design Systems',
]