import ThemeToggle from '@/components/ThemeToggle';
import {
  Typewriter,
  Namaste,
  KtmClock,
  ScrollProgress,
  CursorBlob,
  Reveal,
  Tilt,
} from '@/components/Fun';
import { profile, roles, stats, projects, experience, skills, education } from '@/data/resume';

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <CursorBlob />

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
        <Namaste />
        <h1 className="pop" style={{ ['--d' as string]: '.08s' }}>
          I make software that&apos;s <span className="grad">actually fun</span> to use.
        </h1>
        <div className="pop" style={{ ['--d' as string]: '.16s' }}>
          <Typewriter words={roles} />
        </div>
        <p className="sub pop" style={{ ['--d' as string]: '.24s' }}>
          {profile.name} — software engineer in Kathmandu. 4+ years shipping Flutter apps with
          offline-first sync, NestJS + React platforms, and AI features that earn their place.
          Currently building a case management platform for UNFPA.
        </p>
        <div className="cta-row pop" style={{ ['--d' as string]: '.32s' }}>
          <a className="btn solid" href="#work">
            See my work ↓
          </a>
          <a className="btn ghost" href={`mailto:${profile.email}`}>
            Say hello 👋
          </a>
        </div>
      </header>

      <div className="wrap bento">
        <div className="tile teal pop" style={{ ['--d' as string]: '.4s' }}>
          <div className="label">Local time — Kathmandu 🇳🇵</div>
          <KtmClock />
          <div className="label mono">UTC+5:45, yes really</div>
        </div>
        {stats.map((s, i) => (
          <div key={s.label} className="tile mango pop" style={{ ['--d' as string]: `${0.46 + i * 0.06}s` }}>
            <div className="big">{s.value}</div>
            <div className="label">{s.label}</div>
          </div>
        ))}
        <div className="tile rhodo wide pop" style={{ ['--d' as string]: '.72s' }}>
          <div className="label">Currently</div>
          <div>
            Leading full-stack delivery of the <strong>UNFPA Safehouse platform</strong> — and
            when properly offline, walking Himalayan trails. ⛰️
          </div>
          <a className="tile-link" href="#work">
            What I&apos;m shipping →
          </a>
        </div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="track">
          {[0, 1].map((n) => (
            <span key={n} className="item">
              {skills.map((s) => (
                <span key={s} className="item">
                  {s}
                </span>
              ))}
            </span>
          ))}
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
              <Reveal key={p.name} delay={(i % 2) * 0.08}>
                <Tilt className={p.spotlight ? 'card spotlight' : 'card'} accent={p.accent}>
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
                </Tilt>
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
            <span className="count mono">hover around, they&apos;re ticklish</span>
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
            <h2>Let&apos;s build something people keep on their home screen.</h2>
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
