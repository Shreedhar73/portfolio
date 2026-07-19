import { profile, projects } from "@/data/resume";
import { BootLog, PhoneShowcase, Uptime, Rv, type ScreenApp } from "./fx";

/* presentation meta for the mobile apps, keyed by project name */
const APP_META: Record<
  string,
  { initials: string; color: string; status: string }
> = {
  OnlyEver: { initials: "OE", color: "#6ea8ff", status: "LIVE" },
  "नागरिक सहभागिता (Citizen Participation)": {
    initials: "ना",
    color: "#3ddc84",
    status: "SHIPPED",
  },
  "Municipal Association of Nepal": {
    initials: "M",
    color: "#34e3c4",
    status: "SHIPPED",
  },
  "Level Up (25hours Hotels)": {
    initials: "LU",
    color: "#ffb454",
    status: "SHIPPED",
  },
};

// prod: apex main site (set NEXT_PUBLIC_MAIN_URL on Vercel). dev: same-origin root.
const MAIN_URL = process.env.NEXT_PUBLIC_MAIN_URL || "/";

const mobileProjects = projects.filter((p) => p.tags.includes("Flutter"));

const screens: ScreenApp[] = mobileProjects.map((p) => {
  const m = APP_META[p.name];
  const short = p.name.replace(/\s*\(.*?\)\s*/g, "").trim();
  return {
    name: short,
    role: p.role.split("·")[0].trim(),
    initials: m?.initials ?? short.slice(0, 2).toUpperCase(),
    color: m?.color ?? "#34e3c4",
  };
});

const DOCTOR = [
  { k: "Flutter", d: "Clean Architecture · Bloc · flavors" },
  { k: "Dart", d: "null-safe · isolates · codegen" },
  { k: "Offline-first", d: "SQLite · Realm · MongoDB sync" },
  { k: "Firebase", d: "auth · realtime messaging · FCM" },
  { k: "Payments", d: "Stripe · multi-currency" },
  { k: "Release", d: "Play Store + App Store · 0 rejections" },
  { k: "i18n", d: "bilingual EN/नेपाली interfaces" },
  { k: "Native bridge", d: "platform channels · Arduino IoT" },
];

const DEPS: { name: string; ver: string }[] = [
  { name: "flutter", ver: "sdk" },
  { name: "flutter_bloc", ver: "^8.1" },
  { name: "clean_architecture", ver: "domain/data/presentation" },
  { name: "sqflite", ver: "^2.3" },
  { name: "realm", ver: "^1.9" },
  { name: "firebase_messaging", ver: "^14.7" },
  { name: "flutter_stripe", ver: "^10.0" },
  { name: "flutter_localizations", ver: "sdk" },
  { name: "generative_ai", ver: "on-device + API" },
];

export default function MobilePage() {
  return (
    <>
      <div className="md-bar">
        <div className="md-bar-in">
          <span className="md-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="path">
            <b>~/shreedhar</b>
            <span className="hideable"> / mobile · flutter · release</span>
          </span>
          <span className="spacer" />
          <span className="md-live">
            <span className="pulse" aria-hidden="true" />
            <Uptime />
          </span>
          <a className="home" href={MAIN_URL}>
            ← main site
          </a>
        </div>
      </div>

      <div className="md-wrap">
        {/* ---------- hero ---------- */}
        <section className="md-hero">
          <div>
            <div className="md-kicker">// mobile engineer · Kathmandu</div>
            <h1>
              I build apps that survive{" "}
              <span className="grad">bad networks</span> and ship on time.
            </h1>
            <p className="lede">
              4+ years of production Flutter — offline-first architecture, Clean
              Architecture with Bloc, and generative-AI features that earn their
              place. 10+ apps on Google Play and the App Store, zero store
              rejections.
            </p>
            <BootLog />
            <div className="md-cta">
              <a className="md-btn primary" href="#apps">
                ▸ view builds
              </a>
              <a
                className="md-btn ghost"
                href={profile.playStore}
                rel="noopener"
              >
                Google Play ↗
              </a>
            </div>
          </div>

          <div>
            <PhoneShowcase apps={screens} />
            <div className="md-phone-cap">
              live preview · <b>{screens.length}</b> shipped apps cycling
            </div>
          </div>
        </section>

        {/* ---------- doctor ---------- */}
        <section className="md-sec">
          <Rv className="md-sec-h">
            <span className="hash">#</span>
            <h2>flutter doctor</h2>
            <span className="n">no issues found</span>
          </Rv>
          <Rv>
            <div className="md-doctor mono">
              <div className="head">
                Doctor summary — <b>toolchain &amp; capabilities</b>
              </div>
              <div className="md-check">
                {DOCTOR.map((c) => (
                  <div className="item" key={c.k}>
                    <span className="tick">[✓]</span>
                    <span>
                      <b>{c.k}</b> <span className="d">— {c.d}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Rv>
        </section>

        {/* ---------- apps ---------- */}
        <section className="md-sec" id="apps">
          <Rv className="md-sec-h">
            <span className="hash">#</span>
            <h2>shipped builds</h2>
            <span className="n">
              {mobileProjects.length} apps · Play + App Store
            </span>
          </Rv>
          <div className="md-apps">
            {mobileProjects.map((p, idx) => {
              const m = APP_META[p.name];
              const short = p.name.replace(/\s*\(.*?\)\s*/g, "").trim();
              const ac = m?.color ?? "#34e3c4";
              return (
                <Rv key={p.name} delay={(idx % 2) * 0.08}>
                  <article
                    className="md-card"
                    style={{ ["--ac" as string]: ac }}
                  >
                    <div className="top">
                      <div className="badge-ico">
                        {m?.initials ?? short.slice(0, 2)}
                      </div>
                      <div>
                        <h3>{short}</h3>
                        <div className="role">{p.role}</div>
                      </div>
                      <span className="status">{m?.status ?? "SHIPPED"}</span>
                    </div>
                    <p>{p.description}</p>
                    <div className="md-pkgs">
                      {p.tags.map((t) => (
                        <span className="md-pkg" key={t}>
                          {t.toLowerCase().replace(/[^a-z0-9]+/g, "_")}
                          <span className="v"> ^1.0</span>
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
                  </article>
                </Rv>
              );
            })}
          </div>
        </section>

        {/* ---------- pubspec ---------- */}
        <section className="md-sec">
          <Rv className="md-sec-h">
            <span className="hash">#</span>
            <h2>pubspec.yaml</h2>
            <span className="n">daily drivers</span>
          </Rv>
          <Rv>
            <div className="md-pubspec">
              <div className="fh">
                <span className="dot" style={{ background: "#ff5f57" }} />
                <span className="dot" style={{ background: "#febc2e" }} />
                <span className="dot" style={{ background: "#28c840" }} />
                <span style={{ marginLeft: 6 }}>pubspec.yaml</span>
              </div>
              <div className="code mono">
                <span className="ln">
                  <span className="key">name</span>
                  <span className="k">:</span>{" "}
                  <span className="v">shreedhar_pandeya</span>
                </span>
                <span className="ln">
                  <span className="key">description</span>
                  <span className="k">:</span>{" "}
                  <span className="v">
                    Mobile engineer &amp; full-stack builder.
                  </span>
                </span>
                <span className="ln">
                  <span className="c"># {profile.location}</span>
                </span>
                <span className="ln"> </span>
                <span className="ln">
                  <span className="key">dependencies</span>
                  <span className="k">:</span>
                </span>
                {DEPS.map((d) => (
                  <span className="ln dep" key={d.name}>
                    <span className="key">{d.name}</span>
                    <span className="k">:</span>{" "}
                    <span className="v">{d.ver}</span>
                  </span>
                ))}
              </div>
            </div>
          </Rv>
        </section>

        {/* ---------- contact ---------- */}
        <Rv>
          <section className="md-contact">
            <h2>Got an app that has to work where the signal doesn&apos;t?</h2>
            <p>
              Flutter, offline-first sync, native bridges, AI features — from
              architecture to a clean store release. Let&apos;s build it.
            </p>
            <div className="md-cta">
              <a className="md-btn primary" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <a className="md-btn ghost" href={profile.github} rel="noopener">
                github.com/shreedhar73 ↗
              </a>
            </div>
          </section>
        </Rv>

        <footer className="md-foot mono">
          <span>© 2026 {profile.name} · built with Flutter &amp; Next.js</span>
          <span>
            <span className="ok">● passing</span> · Kathmandu UTC+5:45
          </span>
        </footer>
      </div>
    </>
  );
}
