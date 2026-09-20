import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import QRCode from 'qrcode';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Camera,
  Check,
  Clipboard,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  ImagePlus,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  QrCode,
  Rocket,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Wand2,
  Zap,
  CalendarDays,
  CreditCard,
  Database,
  Target,
  Users,
  Calculator,
  MessageSquareText,
  Link as LinkIcon,
  Printer,
} from 'lucide-react';
import './styles.css';

const STORAGE_KEY = 'jobproof_mvp_state_v1';

const demoState = {
  business: {
    name: 'BrightWash Pressure Cleaning',
    slug: 'brightwash-pressure-cleaning',
    ownerEmail: 'owner@example.com',
    phone: '(555) 014-8821',
    website: 'https://example.com',
    reviewUrl: 'https://g.page/r/example/review',
    primaryService: 'Pressure washing',
    serviceArea: 'Plano, TX',
    brandColor: '#155EEF',
    offer: 'Free driveway and patio estimate',
  },
  leads: [],
  completedTasks: [],
  prospects: [
    { id: 'prospect-1', businessName: 'Sparkle Path Power Wash', niche: 'Pressure washing', city: 'Frisco, TX', reviewCount: 18, hasPhotos: true, hasProjectPages: false, ownerOperated: true, jobValue: 250, status: 'sample_needed', contact: 'Facebook', notes: 'Good before/after photos, weak captions, no project pages.' },
    { id: 'prospect-2', businessName: 'North Dallas Lawn Crew', niche: 'Landscaping', city: 'Plano, TX', reviewCount: 42, hasPhotos: true, hasProjectPages: false, ownerOperated: true, jobValue: 180, status: 'not_contacted', contact: 'Website form', notes: 'Posts often but not optimized for Google Business Profile.' },
  ],
  jobs: [
    {
      id: 'demo-job-1',
      createdAt: new Date().toISOString(),
      serviceType: 'Driveway pressure washing',
      city: 'Plano, TX',
      neighborhood: 'Willow Bend',
      customerName: 'M.',
      notes: 'Removed algae, dirt buildup, and tire marks from a concrete driveway and front walkway. The homeowner wanted the entrance to look brighter before listing the home.',
      images: [],
      assets: null,
      views: 18,
      reviewClicks: 4,
      quoteClicks: 2,
    },
  ],
};
demoState.jobs[0].assets = generateAssets(demoState.business, demoState.jobs[0]);

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'job-proof';
}

function safe(value, fallback = '') {
  return String(value || '').trim() || fallback;
}

function sentenceCase(value) {
  const text = safe(value);
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
}

function generateAssets(business, job) {
  const biz = safe(business.name, 'Your Business');
  const service = safe(job.serviceType, business.primaryService || 'local service');
  const city = safe(job.city, business.serviceArea || 'your area');
  const area = job.neighborhood ? `${job.neighborhood}, ${city}` : city;
  const offer = safe(business.offer, 'Request a quote');
  const notes = safe(job.notes, `Completed a ${service.toLowerCase()} job for a local customer.`);
  const customer = job.customerName ? ` for ${job.customerName}` : '';

  const title = `${sentenceCase(service)} in ${city}`;
  const summary = `${biz} completed a ${service.toLowerCase()} project${customer} in ${area}. ${sentenceCase(notes)}`;
  const pageBody = `${summary}\n\nThis job proof page gives future customers a simple way to see recent work, understand the service performed, and contact ${biz} with confidence.`;

  return {
    seoTitle: `${title} | ${biz}`,
    projectHeading: title,
    shortSummary: summary,
    pageBody,
    googlePost: `Recently completed: ${service} in ${area}. ${notes}\n\nIf you need help with ${service.toLowerCase()} around ${safe(business.serviceArea, city)}, contact ${biz}. ${offer}.`,
    socialCaption: `Another finished job in ${area}. ✅\n\n${sentenceCase(notes)}\n\nNeed ${service.toLowerCase()}? Message ${biz} to get started.`,
    reviewSms: `Hi${job.customerName ? ` ${job.customerName}` : ''}, thanks for choosing ${biz}. If you have a minute, we’d appreciate your honest feedback about your experience: ${safe(business.reviewUrl, '[Google review link]')}`,
    reviewEmailSubject: `Thanks for choosing ${biz}`,
    reviewEmail: `Hi${job.customerName ? ` ${job.customerName}` : ''},\n\nThank you for choosing ${biz} for your recent ${service.toLowerCase()} project in ${city}. Honest feedback helps local customers understand what it is like to work with us.\n\nIf you have a minute, you can leave feedback here:\n${safe(business.reviewUrl, '[Google review link]')}\n\nThank you,\n${biz}`,
    testimonialPrompt: `Would you be open to sharing one sentence about your experience with ${biz}? For example: what problem did we solve, and what did you like about the result?`,
    hashtags: [`#${slugify(service).replaceAll('-', '')}`, `#${slugify(city).replaceAll('-', '')}`, '#LocalBusiness', '#BeforeAndAfter', '#HomeServices'],
    altText: [
      `${service} project completed by ${biz} in ${area}`,
      `Before and after photos from a ${service.toLowerCase()} job in ${city}`,
      `${biz} local service work example in ${city}`,
    ],
    quoteMessage: `Hi, I saw your ${service.toLowerCase()} work in ${city}. I’d like to request a quote.`,
  };
}


const NICHE_TEMPLATES = {
  'Pressure washing': [
    ['Driveway pressure washing', 'Removed algae, dirt buildup, and tire marks from a concrete driveway and front walkway.'],
    ['Patio cleaning', 'Cleaned a backyard patio with heavy grime around seating areas and high-traffic spots.'],
    ['Fence wash', 'Washed a weathered vinyl fence to remove surface dirt and green buildup.'],
    ['Sidewalk cleaning', 'Cleaned sidewalk panels near the front entrance to improve curb appeal.'],
    ['House soft wash', 'Soft washed exterior siding where dirt and organic buildup were visible.'],
  ],
  'Cleaning': [
    ['Move-out cleaning', 'Completed a move-out clean focused on kitchen surfaces, bathrooms, floors, and baseboards.'],
    ['Deep kitchen cleaning', 'Cleaned grease-prone surfaces, cabinet fronts, counters, sink area, and appliance exteriors.'],
    ['Bathroom deep clean', 'Detailed shower, sink, mirrors, floors, and high-touch areas for a fresher space.'],
    ['Recurring home cleaning', 'Completed a standard recurring clean covering dusting, vacuuming, mopping, and bathrooms.'],
    ['Office cleaning', 'Cleaned desks, floors, restroom surfaces, breakroom areas, and high-touch points.'],
  ],
  'Landscaping': [
    ['Lawn cleanup', 'Trimmed overgrowth, cleaned edges, removed debris, and refreshed the front yard.'],
    ['Mulch installation', 'Installed fresh mulch around planting beds to improve curb appeal and soil coverage.'],
    ['Hedge trimming', 'Trimmed and shaped hedges around the property for a cleaner look.'],
    ['Seasonal yard cleanup', 'Removed leaves and debris, cleaned beds, and prepared the yard for the season.'],
    ['Flower bed refresh', 'Cleared weeds, defined bed edges, and refreshed the planting area.'],
  ],
  'Painting': [
    ['Interior room painting', 'Prepared walls and applied a fresh coat of paint to brighten the room.'],
    ['Cabinet painting', 'Cleaned, prepped, and painted cabinet surfaces for a refreshed kitchen look.'],
    ['Exterior trim painting', 'Painted exterior trim areas showing wear from weather exposure.'],
    ['Fence staining', 'Prepared and stained wood fencing to improve appearance and protection.'],
    ['Door repainting', 'Repainted an entry door to improve curb appeal.'],
  ],
  'Handyman': [
    ['Drywall repair', 'Patched a damaged drywall area, smoothed the surface, and prepared it for paint.'],
    ['Fixture installation', 'Installed a replacement fixture and checked fit and finish.'],
    ['Door repair', 'Adjusted hardware and repaired sticking issues for smoother operation.'],
    ['Shelving installation', 'Installed wall-mounted shelves and checked alignment and stability.'],
    ['Caulking refresh', 'Removed worn caulk and applied a fresh bead around key areas.'],
  ],
};

function createDemoJobsForNiche(business, niche, city) {
  const templates = NICHE_TEMPLATES[niche] || NICHE_TEMPLATES['Pressure washing'];
  return templates.map(([serviceType, notes], index) => {
    const job = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${index}`,
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
      serviceType,
      city: safe(city, business.serviceArea),
      neighborhood: ['Northside', 'Downtown', 'West End', 'Oak Park', 'Riverside'][index] || '',
      customerName: '',
      notes,
      images: [],
      views: Math.floor(5 + Math.random() * 30),
      reviewClicks: Math.floor(Math.random() * 7),
      quoteClicks: Math.floor(Math.random() * 4),
    };
    job.assets = generateAssets({ ...business, primaryService: niche, serviceArea: safe(city, business.serviceArea) }, job);
    return job;
  });
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return demoState;
    const parsed = JSON.parse(raw);
    return {
      business: { ...demoState.business, ...(parsed.business || {}) },
      jobs: Array.isArray(parsed.jobs) && parsed.jobs.length ? parsed.jobs : demoState.jobs,
      leads: Array.isArray(parsed.leads) ? parsed.leads : [],
      prospects: Array.isArray(parsed.prospects) ? parsed.prospects : demoState.prospects,
      completedTasks: Array.isArray(parsed.completedTasks) ? parsed.completedTasks : [],
    };
  } catch {
    return demoState;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function filesToDataUrls(files) {
  const list = Array.from(files || []).slice(0, 6);
  return Promise.all(
    list.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ name: file.name, dataUrl: reader.result });
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        })
    )
  ).then((items) => items.filter(Boolean));
}

function buildPublicUrl(jobId) {
  const base = window.location.origin + window.location.pathname;
  return `${base}#proof/${jobId}`;
}

function App() {
  const [state, setState] = useState(loadState);
  const [route, setRoute] = useState(window.location.hash || '#home');

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#home');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => saveState(state), [state]);

  const publicMatch = route.match(/^#proof\/(.+)$/);
  if (publicMatch) {
    const job = state.jobs.find((item) => item.id === publicMatch[1]);
    return (
      <PublicProofPage
        business={state.business}
        job={job}
        onHome={() => (window.location.hash = '#home')}
        onLead={(lead) => {
          setState((prev) => ({
            ...prev,
            leads: [{ ...lead, id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), jobId: job.id, createdAt: new Date().toISOString() }, ...(prev.leads || [])],
          }));
        }}
        onEvent={(eventType) => {
          if (!job) return;
          setState((prev) => ({
            ...prev,
            jobs: prev.jobs.map((item) =>
              item.id === job.id
                ? {
                    ...item,
                    views: eventType === 'view' ? (item.views || 0) + 1 : item.views || 0,
                    reviewClicks: eventType === 'review' ? (item.reviewClicks || 0) + 1 : item.reviewClicks || 0,
                    quoteClicks: eventType === 'quote' ? (item.quoteClicks || 0) + 1 : item.quoteClicks || 0,
                  }
                : item
            ),
          }));
        }}
      />
    );
  }

  if (route === '#portfolio') {
    return <PortfolioPage state={state} onHome={() => (window.location.hash = '#home')} />;
  }

  return (
    <div className="app-shell">
      <Nav />
      <Hero />
      <ProofStrip />
      <Builder state={state} setState={setState} />
      <DemoFactory state={state} setState={setState} />
      <Dashboard state={state} setState={setState} />
      <FreeTools business={state.business} />
      <Pricing />
      <AcquisitionKit business={state.business} />
      <ProspectCRM state={state} setState={setState} />
      <CampaignCenter state={state} />
      <LaunchChecklist state={state} setState={setState} />
      <Roadmap />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="nav">
      <a className="brand" href="#home" aria-label="JobProof home">
        <span className="brand-mark"><BadgeCheck size={19} /></span>
        <span>JobProof</span>
      </a>
      <nav className="nav-links">
        <a href="#builder">Build MVP</a>
        <a href="#dashboard">Dashboard</a>
        <a href="#tools">Free Tools</a>
        <a href="#pricing">Pricing</a>
        <a href="#growth">Growth Kit</a>
        <a href="#prospects">Prospects</a>
        <a href="#portfolio">Portfolio</a>
      </nav>
      <a className="nav-cta" href="#builder">Create free proof</a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={16} /> AI-powered trust engine for local service businesses</div>
        <h1>Turn completed jobs into reviews, referrals, and local SEO content.</h1>
        <p>
          Upload job photos, add a few notes, and JobProof creates a polished proof page, Google review request, QR code,
          Google Business Profile post, and social caption in under 60 seconds.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#builder">Build a job proof <ArrowRight size={18} /></a>
          <a className="button secondary" href="#dashboard">View demo dashboard</a>
        </div>
        <div className="trust-row">
          <span><Check size={16} /> No ad budget required</span>
          <span><Check size={16} /> Built for solo operators</span>
          <span><Check size={16} /> Review-policy aware</span>
        </div>
      </div>
      <div className="hero-card" aria-label="Generated asset preview">
        <div className="card-topline">
          <span className="pulse"></span>
          Live generated package
        </div>
        <div className="asset-stack">
          <AssetMini icon={<Globe2 />} title="Public job page" text="Driveway pressure washing in Plano, TX" />
          <AssetMini icon={<Star />} title="Review request" text="We’d appreciate your honest feedback…" />
          <AssetMini icon={<Megaphone />} title="GBP post" text="Recently completed: driveway cleaning…" />
          <AssetMini icon={<Share2 />} title="Social caption" text="Another finished job in Willow Bend ✅" />
        </div>
      </div>
    </section>
  );
}

function AssetMini({ icon, title, text }) {
  return (
    <div className="asset-mini">
      <div className="asset-icon">{React.cloneElement(icon, { size: 18 })}</div>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

function ProofStrip() {
  const items = [
    ['2.7x', 'More likely to be seen as reputable with a complete Google Business Profile'],
    ['$75+', 'Typical monthly starting price for many reputation tools'],
    ['60 sec', 'Time target from finished job to reusable marketing assets'],
    ['$19/mo', 'Affordable starter pricing for tiny local businesses'],
  ];
  return (
    <section className="proof-strip">
      {items.map(([big, text]) => (
        <div className="proof-stat" key={big}>
          <strong>{big}</strong>
          <span>{text}</span>
        </div>
      ))}
    </section>
  );
}

function Builder({ state, setState }) {
  const [business, setBusiness] = useState(state.business);
  const [job, setJob] = useState({ serviceType: '', city: '', neighborhood: '', customerName: '', notes: '' });
  const [images, setImages] = useState([]);
  const [generated, setGenerated] = useState(null);

  useEffect(() => setBusiness(state.business), [state.business]);

  const handleBusinessChange = (field, value) => setBusiness((prev) => ({ ...prev, [field]: value }));
  const handleJobChange = (field, value) => setJob((prev) => ({ ...prev, [field]: value }));

  async function handleFiles(event) {
    const dataUrls = await filesToDataUrls(event.target.files);
    setImages(dataUrls);
  }

  function generate() {
    const newBusiness = { ...business, slug: slugify(business.name) };
    const newJob = {
      ...job,
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      createdAt: new Date().toISOString(),
      images,
      serviceType: safe(job.serviceType, newBusiness.primaryService),
      city: safe(job.city, newBusiness.serviceArea),
      views: 0,
      reviewClicks: 0,
      quoteClicks: 0,
    };
    newJob.assets = generateAssets(newBusiness, newJob);
    setState((prev) => ({ business: newBusiness, jobs: [newJob, ...prev.jobs] }));
    setGenerated(newJob);
    setJob({ serviceType: '', city: '', neighborhood: '', customerName: '', notes: '' });
    setImages([]);
    setTimeout(() => document.getElementById('generated-assets')?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  return (
    <section className="section builder" id="builder">
      <div className="section-heading">
        <div className="eyebrow"><Wand2 size={16} /> Product MVP</div>
        <h2>Create a complete JobProof package</h2>
        <p>This is the working MVP: configure a business, add a completed job, generate reusable marketing assets, and publish a shareable proof page.</p>
      </div>

      <div className="builder-grid">
        <div className="panel">
          <h3><BadgeCheck size={20} /> Business setup</h3>
          <div className="form-grid two">
            <Field label="Business name" value={business.name} onChange={(v) => handleBusinessChange('name', v)} />
            <Field label="Primary service" value={business.primaryService} onChange={(v) => handleBusinessChange('primaryService', v)} />
            <Field label="Service area" value={business.serviceArea} onChange={(v) => handleBusinessChange('serviceArea', v)} />
            <Field label="Phone" value={business.phone} onChange={(v) => handleBusinessChange('phone', v)} />
            <Field label="Website" value={business.website} onChange={(v) => handleBusinessChange('website', v)} />
            <Field label="Google review link" value={business.reviewUrl} onChange={(v) => handleBusinessChange('reviewUrl', v)} />
            <Field label="Offer / CTA" value={business.offer} onChange={(v) => handleBusinessChange('offer', v)} />
            <label className="field"><span>Brand color</span><input type="color" value={business.brandColor} onChange={(e) => handleBusinessChange('brandColor', e.target.value)} /></label>
          </div>
        </div>

        <div className="panel highlight-panel">
          <h3><Camera size={20} /> Completed job</h3>
          <div className="form-grid two">
            <Field label="Service type" placeholder="Driveway pressure washing" value={job.serviceType} onChange={(v) => handleJobChange('serviceType', v)} />
            <Field label="City" placeholder="Plano, TX" value={job.city} onChange={(v) => handleJobChange('city', v)} />
            <Field label="Neighborhood optional" placeholder="Willow Bend" value={job.neighborhood} onChange={(v) => handleJobChange('neighborhood', v)} />
            <Field label="Customer first name/initial optional" placeholder="M." value={job.customerName} onChange={(v) => handleJobChange('customerName', v)} />
          </div>
          <label className="field"><span>Job notes</span><textarea rows="5" placeholder="What was the problem, what did you do, what changed?" value={job.notes} onChange={(e) => handleJobChange('notes', e.target.value)} /></label>
          <label className="upload-box">
            <ImagePlus size={22} />
            <span>{images.length ? `${images.length} photo(s) selected` : 'Upload before/after photos'}</span>
            <input type="file" accept="image/*" multiple onChange={handleFiles} />
          </label>
          <button className="button primary full" onClick={generate}>Generate JobProof package <Sparkles size={18} /></button>
        </div>
      </div>

      {generated && <GeneratedAssets business={business} job={generated} />}
    </section>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value || ''} placeholder={placeholder || ''} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function GeneratedAssets({ business, job }) {
  const [copied, setCopied] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [lead, setLead] = useState({ name: '', phone: '', email: '', message: '' });
  const [leadSent, setLeadSent] = useState(false);
  const publicUrl = buildPublicUrl(job.id);

  useEffect(() => {
    QRCode.toDataURL(publicUrl, { margin: 1, width: 220 }).then(setQrUrl).catch(() => setQrUrl(''));
  }, [publicUrl]);

  async function copy(label, text) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 1400);
  }

  function downloadJson() {
    const payload = JSON.stringify({ business, job, publicUrl }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${slugify(job.assets.projectHeading)}-jobproof.json`;
    a.click();
  }

  const cards = [
    ['Google Business Profile post', job.assets.googlePost, <Megaphone />],
    ['Review request SMS', job.assets.reviewSms, <Star />],
    ['Review request email', `${job.assets.reviewEmailSubject}\n\n${job.assets.reviewEmail}`, <Mail />],
    ['Facebook / Instagram caption', `${job.assets.socialCaption}\n\n${job.assets.hashtags.join(' ')}`, <Share2 />],
    ['Testimonial prompt', job.assets.testimonialPrompt, <FileText />],
    ['Image alt text ideas', job.assets.altText.join('\n'), <Search />],
  ];

  return (
    <div className="generated" id="generated-assets">
      <div className="generated-top">
        <div>
          <div className="eyebrow"><Rocket size={16} /> Generated package</div>
          <h3>{job.assets.projectHeading}</h3>
          <p>{job.assets.shortSummary}</p>
        </div>
        <div className="generated-actions">
          <a className="button secondary" href={publicUrl} target="_blank" rel="noreferrer">Open proof page <ExternalLink size={17} /></a>
          <button className="button ghost" onClick={downloadJson}>Export JSON <Download size={17} /></button>
          {qrUrl && <button className="button ghost" onClick={() => downloadDataUrl(qrUrl, `${slugify(job.assets.projectHeading)}-qr.png`)}>Download QR <QrCode size={17} /></button>}
          <button className="button ghost" onClick={() => printProofSheet(business, job, qrUrl)}>Print sales sheet <Printer size={17} /></button>
        </div>
      </div>
      <div className="asset-grid">
        <div className="asset-card qr-card">
          <h4><QrCode size={18} /> Share QR code</h4>
          {qrUrl && <img src={qrUrl} alt="QR code for job proof page" />}
          <p>Print this, text it, or add it to invoices. It links to the public proof page.</p>
        </div>
        {cards.map(([title, text, icon]) => (
          <div className="asset-card" key={title}>
            <h4>{React.cloneElement(icon, { size: 18 })} {title}</h4>
            <pre>{text}</pre>
            <button className="copy-button" onClick={() => copy(title, text)}><Clipboard size={15} /> {copied === title ? 'Copied' : 'Copy'}</button>
          </div>
        ))}
      </div>
    </div>
  );
}



function DemoFactory({ state, setState }) {
  const [niche, setNiche] = useState(state.business.primaryService || 'Pressure washing');
  const [city, setCity] = useState(state.business.serviceArea || 'Plano, TX');
  const [made, setMade] = useState(false);

  function generateDemoSet() {
    const jobs = createDemoJobsForNiche(state.business, niche, city);
    setState((prev) => ({
      ...prev,
      business: { ...prev.business, primaryService: niche, serviceArea: city },
      jobs: [...jobs, ...prev.jobs],
    }));
    setMade(true);
    setTimeout(() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' }), 150);
  }

  return (
    <section className="section demo-factory" id="demo-factory">
      <div className="demo-factory-card">
        <div>
          <div className="eyebrow"><Sparkles size={16} /> Demo accelerator</div>
          <h2>Create a 5-page niche demo in one click</h2>
          <p>Use this to make sales samples before you have customer photos. Then replace demo pages with real customer jobs as soon as a prospect replies.</p>
        </div>
        <div className="demo-controls">
          <label className="field"><span>Niche</span><select value={niche} onChange={(e) => setNiche(e.target.value)}>{Object.keys(NICHE_TEMPLATES).map((item) => <option key={item}>{item}</option>)}</select></label>
          <Field label="City / service area" value={city} onChange={setCity} />
          <button className="button primary" onClick={generateDemoSet}>Generate demo portfolio <ArrowRight size={17} /></button>
          {made && <span className="success-pill"><Check size={15} /> Demo pages added</span>}
        </div>
      </div>
    </section>
  );
}

function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

function printProofSheet(business, job, qrUrl) {
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(`<!doctype html><html><head><title>${job.assets.projectHeading}</title><style>
    body{font-family:Arial,sans-serif;margin:40px;color:#102033} h1{font-size:38px;line-height:1;margin:0 0 10px} p{font-size:16px;line-height:1.5}.box{border:1px solid #dbe5f2;border-radius:18px;padding:22px;margin-top:20px}.cta{font-size:22px;font-weight:800}.qr{width:180px;height:180px} .brand{color:${business.brandColor};font-weight:900} @media print{button{display:none}}
  </style></head><body>
    <div class="brand">${business.name}</div>
    <h1>${job.assets.projectHeading}</h1>
    <p>${job.assets.shortSummary}</p>
    <div class="box"><p class="cta">Need ${safe(job.serviceType, business.primaryService).toLowerCase()}?</p><p>Call ${business.phone} or scan the QR code to see this recent work example and request a quote.</p>${qrUrl ? `<img class="qr" src="${qrUrl}" />` : ''}</div>
    <button onclick="window.print()">Print</button>
  </body></html>`);
  win.document.close();
}

function FreeTools({ business }) {
  const [reviewLink, setReviewLink] = useState(business.reviewUrl || '');
  const [qrUrl, setQrUrl] = useState('');
  const [review, setReview] = useState('The team was fast, professional, and the driveway looks much better.');
  const [reply, setReply] = useState('');
  const [roi, setRoi] = useState({ monthlyPrice: 19, averageJob: 250, extraJobs: 1 });
  const [toolJob, setToolJob] = useState({ service: business.primaryService || 'Pressure washing', city: business.serviceArea || 'Plano, TX', notes: 'Removed algae and stains from a driveway and front walkway.' });
  const post = useMemo(() => {
    const fakeJob = { serviceType: toolJob.service, city: toolJob.city, neighborhood: '', notes: toolJob.notes, customerName: '' };
    return generateAssets(business, fakeJob).googlePost;
  }, [business, toolJob]);

  useEffect(() => {
    if (!reviewLink) return setQrUrl('');
    QRCode.toDataURL(reviewLink, { margin: 1, width: 220 }).then(setQrUrl).catch(() => setQrUrl(''));
  }, [reviewLink]);

  function makeReply() {
    const biz = safe(business.name, 'our team');
    const hasBad = /bad|terrible|late|awful|poor|dirty|damage|rude|unhappy|disappointed/i.test(review);
    setReply(hasBad
      ? `Thank you for the feedback. We’re sorry your experience did not meet expectations. Please contact ${biz} directly so we can understand what happened and work toward a fair resolution.`
      : `Thank you for sharing your honest feedback. We appreciate you choosing ${biz}, and we’re glad to hear the work made a difference. It was a pleasure helping with your project.`);
  }

  const monthlyRevenue = (Number(roi.averageJob) || 0) * (Number(roi.extraJobs) || 0);
  const net = monthlyRevenue - (Number(roi.monthlyPrice) || 0);
  const multiple = (Number(roi.monthlyPrice) || 0) > 0 ? monthlyRevenue / Number(roi.monthlyPrice) : 0;

  return (
    <section className="section tools" id="tools">
      <div className="section-heading">
        <div className="eyebrow"><Zap size={16} /> Viral/free acquisition layer</div>
        <h2>Free tools that attract the exact buyer</h2>
        <p>These utilities can be used as SEO pages and lead magnets: review QR generator, GBP post generator, review reply helper, and ROI calculator.</p>
      </div>
      <div className="tools-grid">
        <div className="tool-card">
          <h3><QrCode size={20} /> Google review QR generator</h3>
          <label className="field"><span>Review link</span><input value={reviewLink} onChange={(e) => setReviewLink(e.target.value)} placeholder="Paste Google review link" /></label>
          {qrUrl ? <img className="tool-qr" src={qrUrl} alt="Review QR" /> : <div className="empty-qr">Paste a link</div>}
          <div className="mini-actions">
            <button className="button small secondary" onClick={() => navigator.clipboard.writeText(reviewLink)}><Clipboard size={15} /> Copy link</button>
            {qrUrl && <button className="button small ghost" onClick={() => downloadDataUrl(qrUrl, 'google-review-qr.png')}><Download size={15} /> Download QR</button>}
          </div>
        </div>
        <div className="tool-card">
          <h3><MessageSquareText size={20} /> Review reply helper</h3>
          <label className="field"><span>Customer review</span><textarea rows="4" value={review} onChange={(e) => setReview(e.target.value)} /></label>
          <button className="button secondary full" onClick={makeReply}>Generate compliant reply</button>
          {reply && <pre className="tool-output">{reply}</pre>}
        </div>
        <div className="tool-card">
          <h3><LinkIcon size={20} /> GBP post generator</h3>
          <div className="form-grid two">
            <Field label="Service" value={toolJob.service} onChange={(v) => setToolJob({ ...toolJob, service: v })} />
            <Field label="City" value={toolJob.city} onChange={(v) => setToolJob({ ...toolJob, city: v })} />
          </div>
          <label className="field"><span>Job notes</span><textarea rows="3" value={toolJob.notes} onChange={(e) => setToolJob({ ...toolJob, notes: e.target.value })} /></label>
          <pre className="tool-output">{post}</pre>
          <button className="button small secondary" onClick={() => navigator.clipboard.writeText(post)}><Clipboard size={15} /> Copy post</button>
        </div>
        <div className="tool-card">
          <h3><Calculator size={20} /> ROI calculator</h3>
          <div className="form-grid two">
            <Field label="Monthly price" value={roi.monthlyPrice} onChange={(v) => setRoi({ ...roi, monthlyPrice: v })} />
            <Field label="Average job value" value={roi.averageJob} onChange={(v) => setRoi({ ...roi, averageJob: v })} />
            <Field label="Extra jobs/month" value={roi.extraJobs} onChange={(v) => setRoi({ ...roi, extraJobs: v })} />
          </div>
          <div className="roi-result"><strong>${net.toFixed(0)}</strong><span>estimated monthly net after subscription</span><small>{multiple.toFixed(1)}x gross return before labor/materials if JobProof helps win those jobs.</small></div>
        </div>
      </div>
    </section>
  );
}

function Dashboard({ state, setState }) {
  function deleteJob(id) {
    setState((prev) => ({ ...prev, jobs: prev.jobs.filter((job) => job.id !== id) }));
  }

  const totals = state.jobs.reduce(
    (acc, job) => ({ views: acc.views + (job.views || 0), reviewClicks: acc.reviewClicks + (job.reviewClicks || 0), quoteClicks: acc.quoteClicks + (job.quoteClicks || 0) }),
    { views: 0, reviewClicks: 0, quoteClicks: 0 }
  );

  return (
    <section className="section dashboard" id="dashboard">
      <div className="section-heading left">
        <div className="eyebrow"><BarChart3 size={16} /> Founder dashboard</div>
        <h2>Your job-proof library</h2>
        <p>Every job becomes a reusable trust asset. In production, these metrics come from server-side analytics; the MVP simulates/records local activity.</p>
      </div>
      <div className="metrics">
        <Metric label="Proof pages" value={state.jobs.length} />
        <Metric label="Leads captured" value={(state.leads || []).length} />
        <Metric label="Page views" value={totals.views} />
        <Metric label="Review clicks" value={totals.reviewClicks} />
        <Metric label="Quote clicks" value={totals.quoteClicks} />
      </div>
      <div className="dashboard-actions">
        <a className="button secondary" href="#portfolio">Open public portfolio <ExternalLink size={17} /></a>
        <button className="button ghost" onClick={() => downloadJobsCsv(state)}>Download jobs CSV <Download size={17} /></button>
        <button className="button ghost" onClick={() => downloadLeadsCsv(state)}>Download leads CSV <Download size={17} /></button>
      </div>
      {(state.leads || []).length > 0 && (
        <div className="leads-panel">
          <h3><Users size={20} /> Recent leads</h3>
          {(state.leads || []).slice(0, 5).map((lead) => (
            <div className="lead-row" key={lead.id}>
              <strong>{lead.name || 'Unnamed lead'}</strong>
              <span>{lead.phone || lead.email || 'No contact'} — {lead.message}</span>
            </div>
          ))}
        </div>
      )}
      <div className="job-list">
        {state.jobs.map((job) => (
          <article className="job-row" key={job.id}>
            <div className="job-thumb">
              {job.images?.[0]?.dataUrl ? <img src={job.images[0].dataUrl} alt="Job upload" /> : <Camera size={24} />}
            </div>
            <div className="job-main">
              <h3>{job.assets?.projectHeading || job.serviceType}</h3>
              <p>{job.assets?.shortSummary}</p>
              <div className="job-meta"><MapPin size={15} /> {safe(job.neighborhood ? `${job.neighborhood}, ${job.city}` : job.city, 'Local area')}</div>
            </div>
            <div className="job-actions">
              <a className="button small secondary" href={buildPublicUrl(job.id)} target="_blank" rel="noreferrer">View <ExternalLink size={15} /></a>
              <button className="button small secondary" onClick={() => navigator.clipboard.writeText(buildPublicUrl(job.id))}><Clipboard size={15} /> Copy link</button>
              <button className="button small ghost" onClick={() => deleteJob(job.id)}><Trash2 size={15} /> Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}


function downloadJobsCsv(state) {
  const rows = [
    ['title', 'service_type', 'city', 'neighborhood', 'created_at', 'proof_url', 'views', 'review_clicks', 'quote_clicks'],
    ...state.jobs.map((job) => [
      job.assets?.projectHeading || '',
      job.serviceType || '',
      job.city || '',
      job.neighborhood || '',
      job.createdAt || '',
      buildPublicUrl(job.id),
      job.views || 0,
      job.reviewClicks || 0,
      job.quoteClicks || 0,
    ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${slugify(state.business.name)}-jobproof-pages.csv`;
  a.click();
}


function downloadLeadsCsv(state) {
  const rows = [
    ['name', 'phone', 'email', 'message', 'job_id', 'created_at'],
    ...(state.leads || []).map((lead) => [lead.name || '', lead.phone || '', lead.email || '', lead.message || '', lead.jobId || '', lead.createdAt || '']),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${slugify(state.business.name)}-jobproof-leads.csv`;
  a.click();
}


function scoreProspect(prospect) {
  let score = 0;
  if ((Number(prospect.reviewCount) || 0) < 50) score += 2;
  if (prospect.hasPhotos) score += 2;
  if (!prospect.hasProjectPages) score += 2;
  if (prospect.ownerOperated) score += 1;
  if ((Number(prospect.jobValue) || 0) >= 150) score += 1;
  if (safe(prospect.contact)) score += 1;
  if (safe(prospect.notes).toLowerCase().includes('competitor')) score += 1;
  return Math.min(score, 10);
}

function ProspectCRM({ state, setState }) {
  const [prospect, setProspect] = useState({ businessName: '', niche: state.business.primaryService || '', city: state.business.serviceArea || '', reviewCount: '', hasPhotos: true, hasProjectPages: false, ownerOperated: true, jobValue: '', status: 'not_contacted', contact: '', notes: '' });
  const [copied, setCopied] = useState('');
  const prospects = state.prospects || [];
  const sorted = [...prospects].sort((a, b) => scoreProspect(b) - scoreProspect(a));

  function addProspect(event) {
    event.preventDefault();
    if (!safe(prospect.businessName)) return;
    const item = { ...prospect, id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), reviewCount: Number(prospect.reviewCount) || 0, jobValue: Number(prospect.jobValue) || 0 };
    setState((prev) => ({ ...prev, prospects: [item, ...(prev.prospects || [])] }));
    setProspect({ businessName: '', niche: state.business.primaryService || '', city: state.business.serviceArea || '', reviewCount: '', hasPhotos: true, hasProjectPages: false, ownerOperated: true, jobValue: '', status: 'not_contacted', contact: '', notes: '' });
  }

  function updateStatus(id, status) {
    setState((prev) => ({ ...prev, prospects: (prev.prospects || []).map((item) => item.id === id ? { ...item, status } : item) }));
  }

  function deleteProspect(id) {
    setState((prev) => ({ ...prev, prospects: (prev.prospects || []).filter((item) => item.id !== id) }));
  }

  async function copyScript(item) {
    const script = `Hey ${item.ownerName || '[Name]'} — I found ${item.businessName} while looking at ${safe(item.niche, 'local service')} businesses in ${safe(item.city, 'your area')}. Your job photos are exactly the kind of proof customers want before they call.\n\nI built JobProof to turn completed jobs into a proof page, Google review request, QR code, Google Business Profile post, and social caption.\n\nI can make a free sample from one recent job. If you like it, I’ll set up 5 job pages for $49. Want me to make the sample?`;
    await navigator.clipboard.writeText(script);
    setCopied(item.id);
    setTimeout(() => setCopied(''), 1300);
  }

  function downloadProspectsCsv() {
    const rows = [['business_name','niche','city','review_count','score','status','contact','job_value','notes'], ...prospects.map((item) => [item.businessName, item.niche, item.city, item.reviewCount, scoreProspect(item), item.status, item.contact, item.jobValue, item.notes])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'jobproof-prospects.csv';
    a.click();
  }

  return (
    <section className="section prospects" id="prospects">
      <div className="section-heading left">
        <div className="eyebrow"><Target size={16} /> Sales pipeline</div>
        <h2>Prospect CRM for getting the first customers</h2>
        <p>Add local businesses, score who is most likely to buy, copy a personalized outreach script, and track each prospect from not contacted to paid.</p>
      </div>
      <div className="prospect-layout">
        <form className="panel prospect-form" onSubmit={addProspect}>
          <h3><Search size={20} /> Add prospect</h3>
          <div className="form-grid two">
            <Field label="Business name" value={prospect.businessName} onChange={(v) => setProspect({ ...prospect, businessName: v })} />
            <Field label="Niche" value={prospect.niche} onChange={(v) => setProspect({ ...prospect, niche: v })} />
            <Field label="City" value={prospect.city} onChange={(v) => setProspect({ ...prospect, city: v })} />
            <Field label="Review count" value={prospect.reviewCount} onChange={(v) => setProspect({ ...prospect, reviewCount: v })} />
            <Field label="Contact method" value={prospect.contact} onChange={(v) => setProspect({ ...prospect, contact: v })} />
            <Field label="Typical job value" value={prospect.jobValue} onChange={(v) => setProspect({ ...prospect, jobValue: v })} />
          </div>
          <div className="toggle-row">
            <label><input type="checkbox" checked={prospect.hasPhotos} onChange={(e) => setProspect({ ...prospect, hasPhotos: e.target.checked })} /> Has job photos</label>
            <label><input type="checkbox" checked={prospect.hasProjectPages} onChange={(e) => setProspect({ ...prospect, hasProjectPages: e.target.checked })} /> Has project pages</label>
            <label><input type="checkbox" checked={prospect.ownerOperated} onChange={(e) => setProspect({ ...prospect, ownerOperated: e.target.checked })} /> Owner-operated</label>
          </div>
          <label className="field"><span>Notes</span><textarea rows="3" value={prospect.notes} onChange={(e) => setProspect({ ...prospect, notes: e.target.value })} placeholder="What is weak? Reviews, captions, portfolio, GBP posts?" /></label>
          <button className="button primary full" type="submit">Add prospect</button>
        </form>
        <div className="panel prospect-board">
          <div className="board-top"><h3><Users size={20} /> Ranked prospects</h3><button className="button small ghost" onClick={downloadProspectsCsv}>Export CSV <Download size={15} /></button></div>
          <div className="prospect-list">
            {sorted.map((item) => (
              <article className="prospect-card" key={item.id}>
                <div className="score-badge">{scoreProspect(item)}/10</div>
                <div>
                  <h4>{item.businessName}</h4>
                  <p>{item.niche} · {item.city} · {item.reviewCount} reviews · ${item.jobValue || 0}+ job value</p>
                  {item.notes && <small>{item.notes}</small>}
                </div>
                <select value={item.status} onChange={(e) => updateStatus(item.id, e.target.value)}>
                  <option value="not_contacted">Not contacted</option>
                  <option value="sample_needed">Sample needed</option>
                  <option value="sample_sent">Sample sent</option>
                  <option value="follow_up">Follow up</option>
                  <option value="paid">Paid</option>
                  <option value="lost">Lost</option>
                </select>
                <button className="button small secondary" onClick={() => copyScript(item)}><Clipboard size={15} /> {copied === item.id ? 'Copied' : 'Script'}</button>
                <button className="button small ghost" onClick={() => deleteProspect(item.id)}><Trash2 size={15} /></button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CampaignCenter({ state }) {
  const [copied, setCopied] = useState('');
  const niche = state.business.primaryService || 'pressure washing';
  const city = state.business.serviceArea || 'your city';
  const coldDm = `Hey [Name] — I found your ${niche.toLowerCase()} business while looking at local providers in ${city}. Your job photos are exactly the kind of proof customers want before they call.\n\nI built JobProof to turn completed jobs into a proof page, Google review request, QR code, Google Business Profile post, and Facebook/Instagram caption.\n\nI can make a free sample from one recent job. If you like it, I’ll set up 5 job pages for $49. Want me to make the sample?`;
  const followUp = `Quick follow-up, [Name]. The reason I reached out is that every completed job can become a trust asset: review request, proof page, Google post, and social proof.\n\nNo pressure — if you send one job photo and a sentence about the work, I’ll show you the finished sample.`;
  const close = `I can set this up as a beta package: 5 recent jobs turned into proof pages, QR codes, Google posts, social captions, and honest review requests for $49.\n\nIf it saves you time and you want to keep using it, the ongoing plan is $19/month. Should I send the payment link?`;
  const stripeProducts = `Stripe products to create:\n\n1. JobProof Beta Setup — $49 one-time\nDescription: 5 job proof pages, QR codes, Google posts, social captions, and review request copy.\n\n2. JobProof Starter — $19/month\nDescription: 20 job proof pages/month, QR codes, GBP posts, social captions, portfolio page.\n\n3. JobProof Pro — $39/month\nDescription: Unlimited job proof pages, custom branding, review replies, lead capture, analytics export.`;

  async function copy(label, text) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 1400);
  }

  const blocks = [
    ['Cold DM', coldDm, <Users />],
    ['Follow-up', followUp, <Mail />],
    ['Close for payment', close, <CreditCard />],
    ['Stripe setup', stripeProducts, <Database />],
  ];

  return (
    <section className="section campaign" id="campaign">
      <div className="section-heading">
        <div className="eyebrow"><Target size={16} /> Revenue engine</div>
        <h2>First 30 days execution center</h2>
        <p>Use these scripts and tasks to go from product to first customer without paid ads.</p>
      </div>
      <div className="timeline">
        <TimelineCard period="Days 1-3" tasks={['Pick one niche and city', 'Find 50 businesses on Google Maps/Facebook', 'Create 3 sample proof pages', 'Set up $49 Stripe payment link']} />
        <TimelineCard period="Days 4-7" tasks={['Send 25 personalized DMs/day', 'Follow up after 48 hours', 'Offer free sample', 'Close first $49 beta package']} />
        <TimelineCard period="Days 8-14" tasks={['Fulfill first customers manually', 'Ask for testimonial', 'Improve templates', 'Convert to $19/month plan']} />
        <TimelineCard period="Days 15-30" tasks={['Contact 300 total prospects', 'Publish 3 SEO pages/free tools', 'Ask users for referrals', 'Target 5-15 paying users']} />
      </div>
      <div className="asset-grid launch-assets">
        {blocks.map(([title, text, icon]) => (
          <div className="asset-card" key={title}>
            <h4>{React.cloneElement(icon, { size: 18 })} {title}</h4>
            <pre>{text}</pre>
            <button className="copy-button" onClick={() => copy(title, text)}><Clipboard size={15} /> {copied === title ? 'Copied' : 'Copy'}</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function TimelineCard({ period, tasks }) {
  return (
    <div className="timeline-card">
      <h3><CalendarDays size={19} /> {period}</h3>
      <ul>{tasks.map((task) => <li key={task}><Check size={15} /> {task}</li>)}</ul>
    </div>
  );
}

function PortfolioPage({ state, onHome }) {
  const { business, jobs } = state;
  return (
    <main className="portfolio-page">
      <header className="portfolio-hero" style={{ '--brand': business.brandColor }}>
        <button className="back-link" onClick={onHome}>← Back to JobProof builder</button>
        <div className="public-badge"><BadgeCheck size={18} /> Proof portfolio</div>
        <h1>{business.name}</h1>
        <p>Recent completed {business.primaryService?.toLowerCase()} work around {business.serviceArea}. Browse real job proof pages, then call or request a quote.</p>
        <div className="public-actions">
          <a className="button primary" href={`tel:${safe(business.phone).replace(/[^+0-9]/g, '')}`}><Phone size={18} /> Call now</a>
          {business.website && <a className="button secondary" href={business.website} target="_blank" rel="noreferrer"><Globe2 size={18} /> Website</a>}
        </div>
      </header>
      <section className="portfolio-grid">
        {jobs.map((job) => (
          <a className="portfolio-card" href={buildPublicUrl(job.id)} key={job.id}>
            <div className="portfolio-image">{job.images?.[0]?.dataUrl ? <img src={job.images[0].dataUrl} alt={job.assets?.projectHeading} /> : <Camera size={34} />}</div>
            <div className="portfolio-body">
              <h2>{job.assets?.projectHeading}</h2>
              <p>{job.assets?.shortSummary}</p>
              <span>View proof page <ArrowRight size={15} /></span>
            </div>
          </a>
        ))}
      </section>
    </main>
  );
}

function Pricing() {
  const plans = [
    { name: 'Free', price: '$0', desc: 'Validate with two job proofs.', features: ['2 job stories', 'Watermarked pages', 'Review request copy', 'Social caption'] },
    { name: 'Starter', price: '$19/mo', desc: 'For solo operators building review momentum.', features: ['20 job stories/month', 'QR codes', 'GBP posts', 'Portfolio page', 'No watermark'], featured: true },
    { name: 'Pro', price: '$39/mo', desc: 'For crews that want repeatable local marketing.', features: ['Unlimited job stories', 'Custom branding', 'Review replies', 'Lead capture', 'Analytics exports'] },
  ];
  return (
    <section className="section pricing" id="pricing">
      <div className="section-heading">
        <div className="eyebrow"><Zap size={16} /> Monetization</div>
        <h2>Pricing built for tiny local businesses</h2>
        <p>Undercut expensive reputation platforms while keeping ROI obvious: one extra local job can cover months of subscription.</p>
      </div>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <div className={`price-card ${plan.featured ? 'featured' : ''}`} key={plan.name}>
            <h3>{plan.name}</h3>
            <strong>{plan.price}</strong>
            <p>{plan.desc}</p>
            <ul>{plan.features.map((f) => <li key={f}><Check size={16} /> {f}</li>)}</ul>
            <a className={plan.featured ? 'button primary full' : 'button secondary full'} href="#builder">Start now</a>
          </div>
        ))}
      </div>
    </section>
  );
}

function AcquisitionKit({ business }) {
  const sampleMessage = `Hey [Name] — I saw your recent [service] photos. I’m testing JobProof, a simple tool that turns completed jobs into a mini project page, Google review request, QR code, and ready-to-post Google/Facebook caption.\n\nI made a quick example for your business. If useful, I can set up 5 of these for your recent jobs for $49 while I validate the product. Want me to send the sample?`;

  return (
    <section className="section growth" id="growth">
      <div className="section-heading left">
        <div className="eyebrow"><Megaphone size={16} /> First-customer system</div>
        <h2>Built-in launch plan</h2>
        <p>This product is designed to be sold manually before scaling. Start with pressure washing, cleaning, landscaping, painting, or handyman businesses.</p>
      </div>
      <div className="growth-grid">
        <div className="panel">
          <h3>Validation checklist</h3>
          <ol className="checklist">
            <li>Pick one niche and one city.</li>
            <li>Find 50 businesses with weak review/content systems.</li>
            <li>Create 5 personalized sample proof pages.</li>
            <li>Send 50 personal messages with a useful sample.</li>
            <li>Offer 5 job pages for $49, then $19/month.</li>
            <li>Proceed if at least one business pays or asks to buy.</li>
          </ol>
        </div>
        <div className="panel">
          <h3>Outreach script</h3>
          <pre className="script-box">{sampleMessage}</pre>
        </div>
        <div className="panel">
          <h3>Prospect scoring</h3>
          <ul className="feature-list">
            <li><Star size={16} /> Under 50 Google reviews</li>
            <li><Camera size={16} /> Has recent job photos</li>
            <li><Globe2 size={16} /> Weak or missing project pages</li>
            <li><MapPin size={16} /> Serves a clear local area</li>
            <li><Phone size={16} /> One new customer is worth $100+</li>
          </ul>
        </div>
        <div className="panel">
          <h3>Current demo business</h3>
          <p><strong>{business.name}</strong></p>
          <p>{business.primaryService} in {business.serviceArea}</p>
          <p className="muted">Use this demo as your first sales sample, then replace it with each prospect’s niche and city.</p>
        </div>
      </div>
    </section>
  );
}


const LAUNCH_TASKS = [
  ['niche', 'Pick one niche and one city'],
  ['stripe', 'Create $49 beta setup and $19/month Stripe payment links'],
  ['samples', 'Create 5 sample JobProof pages'],
  ['prospects50', 'Add 50 prospects to the CRM'],
  ['dm25', 'Send 25 personalized messages'],
  ['followups', 'Send 48-hour follow-ups'],
  ['interviews', 'Book 3 customer discovery calls'],
  ['firstsale', 'Close first $49 setup sale'],
  ['testimonial', 'Collect first testimonial or objection'],
  ['iterate', 'Improve the offer based on real replies'],
];

function LaunchChecklist({ state, setState }) {
  const done = state.completedTasks || [];
  const pct = Math.round((done.length / LAUNCH_TASKS.length) * 100);
  function toggle(id) {
    setState((prev) => {
      const current = prev.completedTasks || [];
      return { ...prev, completedTasks: current.includes(id) ? current.filter((item) => item !== id) : [...current, id] };
    });
  }
  return (
    <section className="section launch-checklist" id="launch-checklist">
      <div className="section-heading left">
        <div className="eyebrow"><Rocket size={16} /> Do not stop at strategy</div>
        <h2>Launch checklist tracker</h2>
        <p>Use this as the daily operating system. The product only matters if it reaches business owners and asks for payment.</p>
      </div>
      <div className="checklist-shell">
        <div className="progress-card">
          <strong>{pct}%</strong>
          <span>launch progress</span>
          <div className="progress-bar"><i style={{ width: `${pct}%` }} /></div>
        </div>
        <div className="task-grid">
          {LAUNCH_TASKS.map(([id, label]) => (
            <button className={`task-item ${done.includes(id) ? 'done' : ''}`} key={id} onClick={() => toggle(id)}>
              <span>{done.includes(id) ? <Check size={16} /> : ''}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Roadmap() {
  return (
    <section className="section roadmap">
      <div className="section-heading">
        <div className="eyebrow"><ShieldCheck size={16} /> Build responsibly</div>
        <h2>What ships now vs. later</h2>
        <p>Important: JobProof asks real customers for honest feedback. It should never filter unhappy customers or ask only happy customers for public reviews.</p>
      </div>
      <div className="roadmap-grid">
        <RoadmapCard title="Now" items={['Business setup', 'Job upload', 'AI-like asset generation', 'Public proof pages', 'QR codes', 'Dashboard', 'Launch scripts']} />
        <RoadmapCard title="Next" items={['Stripe Checkout', 'Supabase auth/database', 'Server-side analytics', 'Email reminders', 'Lead forms', 'OpenAI/Anthropic API']} />
        <RoadmapCard title="Later" items={['Google Business Profile API workflow', 'SMS review requests', 'White-label agency plan', 'Competitor review tracker', 'AI local visibility audit']} />
      </div>
    </section>
  );
}

function RoadmapCard({ title, items }) {
  return (
    <div className="roadmap-card">
      <h3>{title}</h3>
      <ul>{items.map((item) => <li key={item}><Check size={15} /> {item}</li>)}</ul>
    </div>
  );
}

function PublicProofPage({ business, job, onHome, onEvent, onLead }) {
  const [qrUrl, setQrUrl] = useState('');
  const [lead, setLead] = useState({ name: '', phone: '', email: '', message: '' });
  const [leadSent, setLeadSent] = useState(false);
  const pageUrl = job ? buildPublicUrl(job.id) : window.location.href;

  useEffect(() => {
    if (job) {
      QRCode.toDataURL(pageUrl, { margin: 1, width: 160 }).then(setQrUrl).catch(() => {});
      onEvent?.('view');
    }
  }, [job?.id, pageUrl]);

  if (!job) {
    return (
      <main className="public-page missing">
        <h1>Job proof not found</h1>
        <p>This proof may have been deleted in this browser.</p>
        <button className="button primary" onClick={onHome}>Back to JobProof</button>
      </main>
    );
  }

  const tel = `tel:${safe(business.phone).replace(/[^+0-9]/g, '')}`;
  const sms = `sms:${safe(business.phone).replace(/[^+0-9]/g, '')}?&body=${encodeURIComponent(job.assets.quoteMessage)}`;
  function submitLead(event) {
    event.preventDefault();
    onLead?.({ ...lead, message: lead.message || job.assets.quoteMessage });
    setLeadSent(true);
    setLead({ name: '', phone: '', email: '', message: '' });
    onEvent?.('quote');
  }

  return (
    <main className="public-page" style={{ '--brand': business.brandColor }}>
      <header className="public-hero">
        <button className="back-link" onClick={onHome}>← Built with JobProof</button>
        <div className="public-badge"><BadgeCheck size={18} /> Recent completed work</div>
        <h1>{job.assets.projectHeading}</h1>
        <p>{job.assets.shortSummary}</p>
        <div className="public-actions">
          <a className="button primary" href={tel} onClick={() => onEvent?.('quote')}><Phone size={18} /> Call {business.name}</a>
          <a className="button secondary" href={sms} onClick={() => onEvent?.('quote')}><Mail size={18} /> Request quote</a>
          {business.reviewUrl && <a className="button ghost" href={business.reviewUrl} target="_blank" rel="noreferrer" onClick={() => onEvent?.('review')}><Star size={18} /> Leave honest review</a>}
        </div>
      </header>

      <section className="public-content">
        <div className="photo-gallery">
          {job.images?.length ? job.images.map((img, idx) => <img src={img.dataUrl} alt={`${job.assets.projectHeading} photo ${idx + 1}`} key={img.dataUrl} />) : <div className="photo-placeholder"><Camera size={48} /><span>Upload photos in the builder to show before/after proof here.</span></div>}
        </div>
        <aside className="public-sidebar">
          <div className="business-card">
            <h2>{business.name}</h2>
            <p>{business.primaryService}</p>
            <p><MapPin size={16} /> {business.serviceArea}</p>
            <p><Phone size={16} /> {business.phone}</p>
            {business.website && <a href={business.website} target="_blank" rel="noreferrer"><Globe2 size={16} /> Website</a>}
          </div>
          <div className="qr-public">
            {qrUrl && <img src={qrUrl} alt="QR code" />}
            <span>Share this job proof</span>
          </div>
          <form className="lead-form" onSubmit={submitLead}>
            <h2>Request a quote</h2>
            {leadSent && <p className="success-note">Lead captured in the MVP dashboard. In production this emails/texts the business.</p>}
            <input placeholder="Your name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
            <input placeholder="Phone" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} />
            <input placeholder="Email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} />
            <textarea rows="3" placeholder="What do you need help with?" value={lead.message} onChange={(e) => setLead({ ...lead, message: e.target.value })} />
            <button className="button primary full" type="submit">Send request</button>
          </form>
        </aside>
        <article className="story-card">
          <h2>Project story</h2>
          {job.assets.pageBody.split('\n').map((line) => <p key={line}>{line}</p>)}
        </article>
      </section>
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="brand"><span className="brand-mark"><BadgeCheck size={18} /></span><span>JobProof</span></div>
      <p>Final MVP: strategy, product, generator, dashboard, proof pages, pricing, and first-customer system.</p>
    </footer>
  );
}

createRoot(document.getElementById('root')).render(<App />);
