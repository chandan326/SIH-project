import styles from './RelatedWork.module.css';

// Public production URLs; keep this directory in sync across the portfolio.
const projects = [
  {
    "name": "Sabd Studio",
    "description": "AI content studio",
    "url": "https://sabd-studio.vercel.app/",
    "badge": "S"
  },
  {
    "name": "PANNA.AI",
    "description": "Read, write & publish",
    "url": "https://book-tau-green.vercel.app/",
    "badge": "P"
  },
  {
    "name": "Aethra",
    "description": "Creative marketplace",
    "url": "https://aethra-gamma.vercel.app/",
    "badge": "Ae"
  },
  {
    "name": "GreenHealth",
    "description": "AI plant health",
    "url": "https://greenhealth-indol.vercel.app/",
    "badge": "G"
  },
  {
    "name": "AgentFlow",
    "description": "AI data workflows",
    "url": "https://agentflow-mu.vercel.app/",
    "badge": "Af"
  },
  {
    "name": "BlueHub",
    "description": "Bluetooth management",
    "url": "https://bluthoth.vercel.app/",
    "badge": "B"
  }
];

export default function RelatedWork() {
  return (
    <nav className={styles.relatedWork} aria-labelledby="related-work-heading" data-theme="dark">
      <h2 id="related-work-heading" className={styles.heading}>Related Work</h2>
      <p className={styles.intro}>Explore more projects by Chandan.</p>
      <ul className={styles.grid}>
        {projects.map(project => (
          <li key={project.url}>
            <a className={styles.card} href={project.url}>
              <span className={styles.badge} aria-hidden="true">{project.badge}</span>
              <span className={styles.copy}>
                <span className={styles.name}>{project.name}</span>
                <span className={styles.description}>{project.description}</span>
              </span>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
