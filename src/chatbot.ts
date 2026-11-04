// ========================================================
// Digirfu AI Assistant — floating chat widget
// Single source of truth: "DIGIRFU BUSINESS SOLUTIONS —
// COMPLETE AI BUSINESS KNOWLEDGE BASE" (supplied document).
// Every reply below is traceable to that document; anything
// outside it falls back to the official contact channels
// instead of guessing.
// ========================================================

interface KnowledgeEntry {
  keywords: string[];
  reply: string;
}

const WELCOME = `Hi — I'm the Digirfu assistant. Ask me about our services, starting prices, delivery timelines or how to get in touch.`;

const THANKS = `Happy to help. For anything project-specific, reach the team at connect@digirfu.com or +91 86084 70520.`;

const IDENTITY = `I'm a scripted assistant on this page. I answer only from Digirfu's published business information and I don't invent details — anything unverified gets pointed back to the team.`;

const FALLBACK = `I don't have verified information on that, so I won't guess.

For anything beyond the published details, contact the team directly:
- Email: connect@digirfu.com
- Phone: +91 86084 70520
- Location: Shengottai, Tamil Nadu, India

I can still help with the six services, their starting prices, delivery estimates and how to get started.`;

const QUICK_PROMPTS = [
  'What services do you offer?',
  'How much does a website cost?',
  'How long does an e-commerce store take?',
  'Are prices fixed?',
  'Contact details',
  'Do you offer refunds?',
];

const ENTRIES: KnowledgeEntry[] = [
  {
    keywords: [
      'contact', 'email', 'phone', 'call', 'number', 'address', 'office',
      'location', 'located', 'where', 'reach', 'talk', 'sales', 'enquiry',
      'inquiry', 'whatsapp', 'whatsapp number', 'mobile number',
    ],
    reply: `You can reach Digirfu here:

- Email: connect@digirfu.com
- Phone: +91 86084 70520
- Location: Shengottai, Tamil Nadu, India
- Website: https://www.digirfu.com/

For final quotations or project-specific questions, confirm directly with the team.`,
  },
  {
    keywords: [
      'services', 'service', 'offerings', 'categories', 'list',
      'what do you do', 'types', 'packages',
    ],
    reply: `Digirfu offers six principal service categories:

- Brand Identity & Strategy — from ₹20,000, 3–4 weeks
- Website Development — from ₹25,000, 3–5 weeks
- Digital Marketing — from ₹15,000, setup 2–3 weeks
- E-commerce Solutions — from ₹60,000, 6–8 weeks
- Mobile App Development — from ₹80,000, 8–12 weeks
- Business Consulting — from ₹5,000 per session

All figures are published starting prices, not final quotations. Ask about any service for detail.`,
  },
  {
    keywords: [
      'about', 'digirfu', 'business solutions', 'overview', 'what is',
      'introduce', 'background', 'who is digirfu', 'who are you',
      'official site', 'official website', 'website url',
    ],
    reply: `Digirfu Business Solutions is a digital solutions company that helps businesses establish, develop and grow their digital presence.

Work spans branding, website development, digital marketing, e-commerce solutions, mobile app development and business consulting — combining creative design, technology and business strategy.

Official website: https://www.digirfu.com/`,
  },
  {
    keywords: [
      'brand', 'branding', 'identity', 'logo', 'visual', 'guidelines',
      'brand guidelines', 'brand strategy', 'brand audit',
    ],
    reply: `Brand Identity & Strategy starts at ₹20,000, with an estimated delivery of 3–4 weeks.

Includes logo creation, visual identity, brand guidelines, marketing materials and digital assets — a complete brand identity rather than just a logo. The process runs research, strategy, visual identity creation, guideline preparation, then delivery. Discovery may cover market research, competitor analysis, brand audits, stakeholder interviews and audience personas.

Exact deliverables and final price depend on your requirements.`,
  },
  {
    keywords: [
      'website', 'web', 'site', 'webpage', 'landing page', 'landing', 'cms',
      'responsive', 'business website', 'portfolio website', 'web development',
      'website development',
    ],
    reply: `Website Development starts at ₹25,000, with an estimated delivery of 3–5 weeks.

Covers custom responsive websites tuned for desktop, tablet and mobile, including responsive design, SEO optimization, performance tuning and CMS integration. The process runs planning, development and testing.

Scope, functionality, design, integrations and content requirements all influence the final quotation — the starting price is not a guaranteed final project price.`,
  },
  {
    keywords: [
      'marketing', 'digital marketing', 'social media', 'social', 'ppc', 'ads',
      'advertising', 'campaign', 'content creation', 'analytics', 'seo services',
      'instagram', 'google ads', 'facebook ads',
    ],
    reply: `Digital Marketing starts at ₹15,000, with a published setup timeline of 2–3 weeks.

Includes social media management, content creation, PPC advertising and performance analytics. The process audits your current digital presence, develops a strategy, then executes campaigns.

The starting price is not a universal campaign price and not a confirmed monthly subscription — strategy and execution depend on your business, audience, objectives and chosen channels.`,
  },
  {
    keywords: [
      'e-commerce', 'ecommerce', 'commerce', 'store', 'online store', 'shop',
      'shopping', 'sell online', 'inventory', 'payment integration', 'orders',
      'online shop',
    ],
    reply: `E-commerce Solutions start at ₹60,000, with an estimated delivery of 6–8 weeks.

Includes custom store design, payment integration, inventory management and order processing, delivered through store setup, integration and launch.

Final price and timeline depend on product count, store functionality, payment integrations, inventory needs and design — the starting price is not a guaranteed final quotation.`,
  },
  {
    keywords: [
      'mobile', 'app', 'mobile app', 'application', 'android', 'ios', 'iphone',
      'flutter', 'react native', 'push notification', 'android app', 'ios app',
    ],
    reply: `Mobile App Development starts at ₹80,000, with an estimated delivery of 8–12 weeks.

Covers native and cross-platform apps for iOS and Android, with UI/UX design, backend integration and push notifications, delivered through design, development and deployment.

Final cost and schedule depend on functionality, platform requirements, integrations, user experience, backend systems and project scope.`,
  },
  {
    keywords: [
      'consulting', 'consultation', 'consultant', 'strategy advice', 'advisory',
      'business consulting', 'process optimization', 'digital transformation',
      'growth strategy',
    ],
    reply: `Business Consulting starts at ₹5,000 per session.

Focus areas are digital transformation, business process optimization and growth strategy. The process assesses the current business situation, develops a plan, then implements suitable solutions.

Consulting is described as an ongoing service without a universal fixed duration — the engagement depends on your objectives and the specific challenge.`,
  },
  {
    keywords: [
      'seo', 'search engine', 'search engine optimization', 'ranking', 'rankings',
      'google ranking', 'seo optimization',
    ],
    reply: `SEO optimization is included in Website Development services.

The published information doesn't establish a separate SEO pricing package or a guaranteed ranking outcome.`,
  },
  {
    keywords: [
      'pricing', 'price', 'prices', 'cost', 'budget', 'rates', 'fees', 'charges',
      'starting price', 'rate card',
    ],
    reply: `Published starting prices:

- Brand Identity & Strategy: from ₹20,000 (3–4 weeks)
- Website Development: from ₹25,000 (3–5 weeks)
- Digital Marketing: from ₹15,000 (setup 2–3 weeks)
- E-commerce Solutions: from ₹60,000 (6–8 weeks)
- Mobile App Development: from ₹80,000 (8–12 weeks)
- Business Consulting: from ₹5,000 per session

These are starting prices only. They are not final quotations, fixed packages or confirmed recurring amounts, and actual timelines depend on scope and approvals.`,
  },
  {
    keywords: [
      'timeline', 'timelines', 'how long', 'duration', 'delivery time',
      'deadline', 'weeks', 'turnaround', 'when will', 'schedule',
    ],
    reply: `Published delivery estimates:

- Brand Identity & Strategy: 3–4 weeks
- Website Development: 3–5 weeks
- Digital Marketing: setup in 2–3 weeks
- E-commerce Solutions: 6–8 weeks
- Mobile App Development: 8–12 weeks
- Business Consulting: ongoing, no fixed duration published

All timelines are estimates. Actual delivery depends on scope, requirements, integrations and approvals.`,
  },
  {
    keywords: [
      'tools', 'tool', 'software', 'figma', 'miro', 'semrush',
      'google analytics', 'design tools',
    ],
    reply: `For branding work, the published process mentions Figma, Miro, Google Analytics and SEMrush.`,
  },
  {
    keywords: [
      'quotation', 'quote', 'estimate', 'fixed price', 'final price',
      'customized quotation', 'negotiate', 'price fixed', 'are prices fixed',
      'guaranteed price',
    ],
    reply: `Published prices are starting prices — not final quotations, fixed packages or guaranteed amounts.

A project-specific quotation depends on your requirements, scope, functionality and integrations. To get one, contact the official team:
- connect@digirfu.com
- +91 86084 70520`,
  },
  {
    keywords: ['refund', 'refunds', 'cancellation', 'money back', 'refund policy'],
    reply: `The published information doesn't establish a verified refund policy, so I can't state one.

Please confirm directly with the team: connect@digirfu.com or +91 86084 70520.`,
  },
  {
    keywords: [
      'payment', 'payments', 'payment terms', 'invoice', 'advance', 'installment',
      'instalment', 'emi', 'upi', 'bank transfer', 'how do i pay',
    ],
    reply: `The published information doesn't establish specific payment terms.

Please confirm with the official team: connect@digirfu.com or +91 86084 70520.`,
  },
  {
    keywords: [
      'free consultation', 'free', 'consultation free', 'trial', 'no cost',
      'free call', 'free quote',
    ],
    reply: `The published information doesn't establish whether free consultations are available, so I can't confirm that.

Ask the team directly: connect@digirfu.com or +91 86084 70520.`,
  },
  {
    keywords: ['discount', 'discounts', 'offer price', 'deal', 'promo', 'coupon', 'cheaper'],
    reply: `The published information doesn't establish a discount policy.

For current pricing, contact the team: connect@digirfu.com or +91 86084 70520.`,
  },
  {
    keywords: [
      'portfolio', 'clients', 'client', 'testimonials', 'testimonial',
      'case study', 'case studies', 'examples', 'previous work', 'awards',
      'certifications', 'certified', 'reviews',
    ],
    reply: `The published information doesn't establish a complete portfolio, client list, testimonials or certifications, so I can't share verified examples or claims.

Ask the team directly for relevant work: connect@digirfu.com or +91 86084 70520.`,
  },
  {
    keywords: ['founder', 'owner', 'ceo', 'director', 'who owns', 'who runs', 'who is the founder'],
    reply: `The published information doesn't establish the founder's identity, so I can't confirm it.`,
  },
  {
    keywords: [
      'registered', 'registration', 'company registration', 'registered company',
      'is digirfu registered', 'gst', 'legal', 'incorporated', 'incorporation',
      'licence', 'license', 'cin',
    ],
    reply: `The published information doesn't establish the company's legal registration details, and I won't claim a registration status without verified evidence.

For official details, contact connect@digirfu.com.`,
  },
  {
    keywords: [
      'start', 'started', 'get started', 'begin', 'next step', 'next steps',
      'process', 'how do we work', 'engagement', 'enquiry handling', 'procedure',
    ],
    reply: `To get started, share your objective and the team will identify the right service:

- Branding: logo, full brand identity, guidelines, or broader strategy?
- Website: business site, portfolio, landing page, or a more complex build?
- Digital marketing: objectives, target audience and desired channels?
- E-commerce: a new online store, or improvements to an existing one?
- Mobile app: intended use, functionality and required platforms?
- Consulting: the business challenge and the desired outcome?

Then reach the team for a quotation: connect@digirfu.com or +91 86084 70520.`,
  },
];

const GREETING_RE = /^(hi|hey|hello|yo|sup|good\s+(morning|afternoon|evening))\b/i;
const THANKS_RE = /^(thanks|thank you|thx|cheers|bye|goodbye|ok|okay)\b/i;
const IDENTITY_RE = /\b(are you|is this|this is|you're|you are)\b[\s\S]*\b(ai|bot|robot|human|chatbot|person|language model|scripted)\b/i;

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreEntry(entry: KnowledgeEntry, haystack: string, tokens: Set<string>): number {
  let score = 0;
  for (const keyword of entry.keywords) {
    if (keyword.includes(' ')) {
      if (haystack.includes(keyword)) score += 3;
    } else if (tokens.has(keyword)) {
      score += 2;
    }
  }
  return score;
}

export function findAnswer(question: string): string {
  const haystack = normalize(question);
  if (!haystack) return WELCOME;

  const wordCount = haystack.split(' ').length;
  if (GREETING_RE.test(question.trim()) && wordCount <= 4) return WELCOME;
  if (THANKS_RE.test(question.trim()) && wordCount <= 3) return THANKS;
  if (IDENTITY_RE.test(question)) return IDENTITY;

  const tokens = new Set(haystack.split(' ').filter((token) => token.length > 1));

  let best: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of ENTRIES) {
    const score = scoreEntry(entry, haystack, tokens);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return best && bestScore >= 2 ? best.reply : FALLBACK;
}

// ========================================================
// Widget wiring
// ========================================================

export function initChatbot(): void {
  const root = document.getElementById('dgi-chat');
  const panel = document.getElementById('dgi-chat-panel');
  const fab = document.getElementById('dgi-chat-fab');
  const closeBtn = document.getElementById('dgi-chat-min');
  const log = document.getElementById('dgi-chat-log');
  const chips = document.getElementById('dgi-chat-chips');
  const form = document.getElementById('dgi-chat-form') as HTMLFormElement | null;
  const input = document.getElementById('dgi-chat-input') as HTMLInputElement | null;

  if (!root || !panel || !fab || !closeBtn || !log || !chips || !form || !input) return;

  // ---- Mobile viewport tracking ------------------------------------------
  // An on-screen keyboard shrinks visualViewport only: window.innerHeight and
  // 100vh/100dvh keep their full height, which is why the old layout overflowed.
  // The mobile stylesheet sizes the panel from --dgi-vh (what is actually
  // visible) offset by --dgi-vt (how far the visual viewport has been panned),
  // so header, thread and composer stay inside the usable area on both Android
  // Chrome and iOS.
  let syncFrame = 0;

  const syncViewport = (): void => {
    const vv = window.visualViewport;
    const visible = vv ? vv.height : window.innerHeight;
    const panned = vv ? vv.offsetTop : 0;
    root.style.setProperty('--dgi-vh', `${Math.round(visible)}px`);
    root.style.setProperty('--dgi-vt', `${Math.round(panned)}px`);
    // Treat a keyboard as open once it covers a meaningful slice of the screen.
    root.dataset.kb = window.innerHeight - visible - panned > 80 ? 'true' : 'false';
  };

  // A keyboard animation emits a burst of resize/scroll events; collapse them
  // into a single write per frame.
  const queueSync = (): void => {
    if (syncFrame) return;
    syncFrame = window.requestAnimationFrame(() => {
      syncFrame = 0;
      syncViewport();
    });
  };

  syncViewport();

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', queueSync);
    window.visualViewport.addEventListener('scroll', queueSync, { passive: true });
  }
  window.addEventListener('orientationchange', queueSync);

  // Some Android keyboards only settle a few hundred milliseconds after focus,
  // so re-measure while the keyboard animates in or out.
  const trackKeyboard = (): void => {
    syncViewport();
    [80, 200, 380].forEach((delay) => window.setTimeout(syncViewport, delay));
  };

  input.addEventListener('focus', trackKeyboard);
  input.addEventListener('blur', trackKeyboard);

  let greeted = false;
  let typingTimer = 0;

  const scrollToLatest = () => {
    log.scrollTop = log.scrollHeight;
  };

  const appendMessage = (role: 'bot' | 'user', text: string): HTMLElement => {
    const row = document.createElement('div');
    row.className = `dgi-msg ${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'dgi-bubble';
    bubble.textContent = text;

    row.appendChild(bubble);
    log.appendChild(row);
    scrollToLatest();
    return row;
  };

  const appendTyping = (): HTMLElement => {
    const row = document.createElement('div');
    row.className = 'dgi-msg bot';

    const bubble = document.createElement('div');
    bubble.className = 'dgi-bubble dgi-typing';
    bubble.innerHTML = '<span></span><span></span><span></span>';

    row.appendChild(bubble);
    log.appendChild(row);
    scrollToLatest();
    return row;
  };

  const answer = (question: string): void => {
    const typing = appendTyping();
    const reply = findAnswer(question);

    window.clearTimeout(typingTimer);
    typingTimer = window.setTimeout(() => {
      typing.remove();
      appendMessage('bot', reply);
    }, 420 + Math.min(reply.length * 2, 480));
  };

  const ask = (question: string): void => {
    const text = question.trim();
    if (!text) return;
    appendMessage('user', text);
    input.value = '';
    answer(text);
  };

  QUICK_PROMPTS.forEach((prompt) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'dgi-chip';
    chip.textContent = prompt;
    chip.addEventListener('click', () => ask(prompt));
    chips.appendChild(chip);
  });

  const open = (): void => {
    panel.hidden = false;
    root.dataset.open = 'true';
    fab.setAttribute('aria-expanded', 'true');
    fab.setAttribute('aria-label', 'Close Digirfu AI assistant');
    // Re-measure on open: browser toolbars may have changed the visible area
    // since the panel was last shown.
    syncViewport();
    if (!greeted) {
      greeted = true;
      appendMessage('bot', WELCOME);
    }
    // Only pull up the keyboard on pointer devices; on phones it would
    // cover the conversation the moment the panel opens.
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      window.setTimeout(() => input.focus(), 80);
    }
  };

  const close = (): void => {
    panel.hidden = true;
    root.dataset.open = 'false';
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-label', 'Open Digirfu AI assistant');
  };

  fab.addEventListener('click', () => {
    if (panel.hidden) {
      open();
    } else {
      close();
    }
  });

  closeBtn.addEventListener('click', close);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    ask(input.value);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
      close();
      fab.focus();
    }
  });
}
