import Contours from '@/components/Contours';
import ThemeToggle from '@/components/ThemeToggle';
import { profile, projects, experience, skillGroups, education } from '@/data/resume';

function Section({
  id,
  label,
  sub,
  className,
  children,
}: {
  id?: string;
  label: string;
  sub: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={className}>
      <div className="wrap sec-grid">
        <div className="sec-label">
          <div className="eyebrow">{label}</div>
          <small>{sub}</small>
        </div>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <nav>
        <div className="wrap">
          <a className="brand" href="#top">
            {profile.name}
          </a>
          <div className="links">
            <a href="#work">Work</a>
            <a className="optional" href="#experience">
              Experience
            </a>
            <a className="optional" href="#skills">
              Skills
            </a>
            <a href="#contact">Contact</a>
            <a href={profile.github} rel="noopener">
              GitHub
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <header id="top">
        <Contours />
        <div className="wrap hero">
          <div className="eyebrow">
            <span>Kathmandu, Nepal</span>
            <span>27.7°N 85.3°E</span>
            <span>Alt 1,400 m</span>
          </div>
          <h1>
            Software built to work <em>offline-first</em>, ship on time, and think a little.
          </h1>
          <p className="lede">
            I&apos;m Shreedhar — a software engineer with 4+ years across mobile and full-stack.
            Flutter apps with offline-first sync, NestJS + React platforms, and generative AI
            features that earn their place — carried all the way to production, Google Play, and
            the App&nbsp;Store.
          </p>
          <div className="cta-row">
            <a className="btn solid" href="#work">
              See my work
            </a>
            <a className="btn ghost" href={`mailto:${profile.email}`}>
              Get in touch
            </a>
          </div>
        </div>
      </header>

      <Section label="About" sub="Who I am" className="about">
        <div>
          <p>
            I&apos;m a <strong>Software Engineer II at YoungInnovations</strong> in Kathmandu.
            My home turf is <strong>Flutter with Clean Architecture and the Bloc pattern</strong>,
            but these days I work the whole stack — right now I&apos;m leading full-stack delivery
            of a <strong>case management platform for UNFPA</strong> built on NestJS, Prisma,
            PostgreSQL, and React.
          </p>
          <p>
            The problems I enjoy most are the unglamorous hard ones:{' '}
            <strong>offline-first data sync</strong>, consent-driven intake workflows,
            role-based access control that actually protects people, bilingual interfaces where
            every error message lands in the reader&apos;s language, and store releases that pass
            review the first time. Much of my recent work is{' '}
            <strong>integrating generative AI</strong> into products — and helping clients figure
            out where AI genuinely helps and where it doesn&apos;t.
          </p>
          <p>
            Beyond the editor, I mentor junior developers, run code-review sessions, and sit in
            the room with clients translating business needs into technical specs. And when
            I&apos;m properly offline myself, you&apos;ll likely find me on a trail somewhere in
            the Himalaya.
          </p>
        </div>
      </Section>

      <Section id="work" label="Selected work" sub="Shipped & maintained">
        <div>
          {projects.map((p) => (
            <div key={p.name} className={p.spotlight ? 'card spotlight' : 'card'}>
              <h3>
                {p.name}
                {p.badge && <span className="badge">{p.badge}</span>}
              </h3>
              <div className="role">{p.role}</div>
              <p>{p.description}</p>
              <div className="tag-row">
                {p.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              {p.links.length > 0 && (
                <div className="links">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} rel="noopener">
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section id="experience" label="Experience" sub="2021 — present">
        <ul className="tl">
          {experience.map((job) => (
            <li key={job.company}>
              <div className="when">{job.when}</div>
              <h3>
                {job.role} · <span className="co">{job.company}</span>
              </h3>
              <ul>
                {job.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="skills" label="Skills" sub="Daily drivers">
        <div className="skill-groups">
          {skillGroups.map((g) => (
            <div key={g.title} className="skill-group">
              <h3>{g.title}</h3>
              <ul>
                {g.items.map((s) => (
                  <li key={s} className="tag">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Education" sub="Kathmandu">
        <div className="edu">
          {education.map((e) => (
            <div key={e.degree}>
              <h3>{e.degree}</h3>
              <p>{e.school}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="contact" label="Contact" sub="Open to interesting work" className="contact">
        <div>
          <h2>Have a product that needs to survive bad networks and good ideas?</h2>
          <p>
            I&apos;m happy to talk about Flutter, full-stack architecture, AI features that earn
            their place — or the best trekking season in Nepal.
          </p>
          <div className="cta-row">
            <a className="btn solid" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <a className="btn ghost" href={profile.github} rel="noopener">
              github.com/shreedhar73 ↗
            </a>
          </div>
        </div>
      </Section>

      <footer>
        <div className="wrap">
          <span>© 2026 {profile.name}</span>
          <span className="mono">KTM · 1,400 m above sea level</span>
        </div>
      </footer>
    </>
  );
}
