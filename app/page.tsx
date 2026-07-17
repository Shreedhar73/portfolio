import ThemeToggle from '@/components/ThemeToggle';
import Customizer from '@/components/Customizer';
import Contours from '@/components/Contours';
import { KtmClock, ScrollProgress, Reveal, CursorGlow, Typewriter } from '@/components/Fun';
import { profile, roles, stats, projects, experience, skills, education } from '@/data/resume';

// prod: subdomain (set NEXT_PUBLIC_MOBILE_URL on Vercel). dev: same-origin route.
const MOBILE_URL = process.env.NEXT_PUBLIC_MOBILE_URL || '/mobile';

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Customizer />

      {/* floating action → mobile-engineer sub-portfolio.
          dev: /mobile route · prod: https://mobile.shreedharpandeya.com.np via NEXT_PUBLIC_MOBILE_URL */}
      <a
        className="fab-mobile"
        href={MOBILE_URL}
        aria-label="Open the mobile-engineer portfolio"
        title="Mobile-engineer portfolio"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="6" y="2.5" width="12" height="19" rx="2.6" />
          <path d="M10.5 18.5h3" />
        </svg>
        <span className="fab-mobile-label">Mobile dev →</span>
        <span className="fab-mobile-ping" aria-hidden="true" />
      </a>

      <div className="nav-shell">
        <nav>
          <a className="brand" href="#top">
            SP
          </a>
          <a className="link" href="#work">
            Work
          </a>
          <a className="link optional" href="#experience">
            Experience
          </a>
          <a className="link optional" href="#skills">
            Skills
          </a>
          <a className="link" href="#contact">
            Contact
          </a>
          <a className="link" href={profile.github} rel="noopener">
            GitHub
          </a>
          <ThemeToggle />
        </nav>
      </div>

      <header id="top" className="wrap hero">
        <Contours />
        <div className="greeting pop">नमस्ते — I&apos;m Shreedhar</div>
        <h1 className="pop" style={{ ['--d' as string]: '.08s' }}>
          Software built <em>offline-first</em>, shipped on time.
        </h1>
        <p className="sub pop" style={{ ['--d' as string]: '.16s' }}>
          Software engineer in Kathmandu with 4+ years across mobile and full-stack — Flutter
          apps with offline-first sync, NestJS + React platforms, and generative AI features
          that earn their place. Currently building a case management platform for UNFPA.
        </p>
        <div className="ticker mono pop" style={{ ['--d' as string]: '.2s' }}>
          <span className="prompt">$</span> I build <Typewriter words={roles} />
        </div>
        <div className="cta-row pop" style={{ ['--d' as string]: '.24s' }}>
          <a className="btn solid" href="#work">
            See my work
          </a>
          <a className="btn ghost" href={`mailto:${profile.email}`}>
            Get in touch
          </a>
        </div>
      </header>

      <div className="wrap bento">
        <div className="tile pop" style={{ ['--d' as string]: '.3s' }}>
          <div className="label">Local time — Kathmandu</div>
          <KtmClock />
          <div className="label mono">UTC+5:45</div>
        </div>
        {stats.map((s, i) => (
          <div key={s.label} className="tile pop" style={{ ['--d' as string]: `${0.36 + i * 0.06}s` }}>
            <div className="big">{s.value}</div>
            <div className="label">{s.label}</div>
          </div>
        ))}
        <div className="tile wide pop" style={{ ['--d' as string]: '.6s' }}>
          <div className="label">Currently</div>
          <div>
            Leading full-stack delivery of the <strong>UNFPA Safehouse platform</strong> — and
            when properly offline, walking Himalayan trails.
          </div>
          <a className="tile-link" href="#work">
            What I&apos;m shipping →
          </a>
        </div>
      </div>

      <main className="wrap">
        <section id="work">
          <Reveal className="sec-head">
            <h2>Selected work</h2>
            <span className="count mono">{projects.length} projects · shipped &amp; maintained</span>
          </Reveal>
          <div className="projects">
            {projects.map((p, i) => (
              <Reveal
                key={p.name}
                className={p.spotlight ? 'card spotlight' : 'card'}
                delay={(i % 2) * 0.08}
              >
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
              </Reveal>
            ))}
          </div>
        </section>

        <section id="experience">
          <Reveal className="sec-head">
            <h2>Experience</h2>
            <span className="count mono">2021 — present</span>
          </Reveal>
          <Reveal as="ul" className="tl">
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
          </Reveal>
        </section>

        <section id="skills">
          <Reveal className="sec-head">
            <h2>Toolbox</h2>
            <span className="count mono">daily drivers</span>
          </Reveal>
          <Reveal className="skill-cloud">
            {skills.map((s) => (
              <span key={s} className="tag">
                {s}
              </span>
            ))}
          </Reveal>
          <Reveal className="edu" delay={0.1}>
            {education.map((e) => (
              <div key={e.degree}>
                <h3>{e.degree}</h3>
                <p>{e.school}</p>
              </div>
            ))}
          </Reveal>
        </section>

        <Reveal>
          <div id="contact" className="contact-box">
            <h2>Have a product that needs to survive bad networks and good ideas?</h2>
            <p>
              Flutter, full-stack architecture, AI features that earn their place — or the best
              trekking season in Nepal. All valid reasons to write.
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
        </Reveal>
      </main>

      <footer>
        <div className="wrap">
          <span>© 2026 {profile.name}</span>
          <span className="mono">Made in Kathmandu · UTC+5:45</span>
        </div>
      </footer>
    </>
  );
}
