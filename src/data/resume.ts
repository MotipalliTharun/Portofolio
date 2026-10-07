// Single source of truth for all site content. Update this file to update the site.

export type StageId = 'hero' | 'about' | 'experience' | 'projects' | 'skills' | 'education' | 'contact';

export interface Stage {
  id: StageId;
  index: string;
  stage: string;
  nav: string;
  /** What Bit says while this stage is on screen. */
  bitSays: string;
  /** OKLCH hue for this section's palette. */
  hue: number;
}

export const stages: Stage[] = [
  { id: 'hero', index: '00', stage: 'ingest', nav: 'Home', bitSays: 'ingesting…', hue: 255 },
  { id: 'about', index: '01', stage: 'cleanse', nav: 'About', bitSays: 'cleaning…', hue: 45 },
  { id: 'experience', index: '02', stage: 'join', nav: 'Experience', bitSays: 'joining…', hue: 255 },
  { id: 'projects', index: '03', stage: 'build', nav: 'Projects', bitSays: 'building…', hue: 30 },
  { id: 'skills', index: '04', stage: 'index', nav: 'Skills', bitSays: 'indexing…', hue: 150 },
  { id: 'education', index: '05', stage: 'archive', nav: 'Education', bitSays: 'archiving…', hue: 75 },
  { id: 'contact', index: '06', stage: 'serve', nav: 'Contact', bitSays: 'served ✓', hue: 45 },
];

export const stageById = (id: StageId): Stage => stages.find((s) => s.id === id)!;

export const profile = {
  name: 'Tharun Motipalli',
  firstName: 'Tharun',
  lastName: 'Motipalli',
  title: 'Data Engineer',
  location: 'Sunnyvale, CA',
  timezone: 'America/Los_Angeles',
  email: 'motipallitharun@outlook.com',
  linkedin: 'https://www.linkedin.com/in/tharun-motipalli',
  linkedinLabel: 'linkedin.com/in/tharun-motipalli',
  availability: 'Open to data engineering roles',
  /** Drop the PDF at public/Tharun_Motipalli_Resume.pdf and the résumé buttons appear. */
  resume: `${import.meta.env.BASE_URL}Tharun_Motipalli_Resume.pdf`,
  rotatingRoles: ['lakehouse pipelines', 'data quality systems', 'REST APIs', 'Airflow workflows'],
  summary: [
    'I’m a software and data engineer with production experience across healthcare (Cigna), pharmaceutical manufacturing (Johnson & Johnson) and UK energy tech (clearVUE).',
    'I own delivery end to end, from requirements and design to deployment and daily operations, building scalable pipelines and APIs with Python, PySpark, SQL, Databricks and AWS. I lead sprint demos and code reviews, mentor teammates and work closely with engineering, analytics, operations and client teams.',
  ],
  /** The facts a recruiter scans for first. */
  glance: [
    { label: 'Now', value: 'Data Engineer, The Cigna Group' },
    { label: 'Domains', value: 'Healthcare · Pharma · Energy' },
    { label: 'Core stack', value: 'PySpark · Databricks · AWS · Airflow' },
    { label: 'Education', value: 'M.S. Computer Science, Florida Tech' },
  ],
  principles: [
    {
      title: 'Own it end to end',
      body: 'From requirements and data model to deployment, on-call triage and the stakeholder demo.',
    },
    {
      title: 'Data you can trust',
      body: 'Validation, alerting and PHI masking built into the pipeline, not bolted on after.',
    },
    {
      title: 'Ship in small sprints',
      body: 'Stories, design reviews, CI/CD with Terraform and Jenkins, demoed every two weeks.',
    },
  ],
};

export type Status = 'running' | 'success';

export interface Experience {
  id: string;
  taskId: string;
  role: string;
  company: string;
  client?: string;
  location: string;
  start: string; // YYYY-MM
  end?: string; // YYYY-MM, undefined = present
  project?: { name: string; description: string };
  highlights: { label?: string; text: string }[];
  stack: string[];
}

export const experience: Experience[] = [
  {
    id: 'cigna',
    taskId: 'cigna.data_engineer',
    role: 'Data Engineer',
    company: 'The Cigna Group',
    location: 'California, USA · Remote',
    start: '2025-07',
    project: {
      name: 'Healthcare Claims & Member Data Platform',
      description: 'An AWS and Databricks lakehouse for analytics.',
    },
    highlights: [
      { text: 'Build PySpark ETL pipelines in Databricks that ingest claims, eligibility and provider data from Amazon S3 into layered Delta Lake tables (raw, cleansed, curated).' },
      { text: 'Orchestrate and monitor daily workloads with Airflow, AWS Glue, Lambda and Step Functions; run daily health checks, triage failures and resolve root causes to meet data SLAs.' },
      { text: 'Enforce data quality and HIPAA compliance through automated validation, alerting and PHI masking.' },
      { text: 'Develop Python REST APIs on API Gateway and Lambda that expose curated datasets, and tune SQL in Athena and PostgreSQL for faster reporting.' },
      { text: 'Drive two-week Agile sprints: break features into stories, lead design and code reviews, ship through Jenkins CI/CD with Terraform, and demo releases to stakeholders.' },
    ],
    stack: ['Python', 'PySpark', 'SQL', 'Databricks', 'Delta Lake', 'Airflow', 'S3', 'Glue', 'Lambda', 'Step Functions', 'API Gateway', 'Athena', 'PostgreSQL', 'Jenkins', 'Terraform'],
  },
  {
    id: 'jnj',
    taskId: 'jnj.data_analyst_intern',
    role: 'Data Analyst Intern',
    company: 'Johnson & Johnson',
    location: 'United States',
    start: '2024-10',
    end: '2025-05',
    highlights: [
      { label: 'QC variation analysis', text: 'Led analysis of manufacturing quality-control data across test methods and sites with Python and SQL, pinpointing the drivers of test variation.' },
      { label: 'Multi-site data model', text: 'Designed a unified Databricks data model that merged inconsistent site datasets into one reliable source for reporting.' },
      { label: 'Data quality monitor', text: 'Built a Python validation job that flagged missing, duplicate and out-of-range results before they reached dashboards.' },
      { text: 'Owned daily Power BI dashboards and Excel reports on yield and productivity, and presented updates to operations, quality and IT teams.' },
    ],
    stack: ['Python', 'SQL', 'Databricks', 'Data Modeling', 'Data Quality', 'Power BI', 'Excel'],
  },
  {
    id: 'ngp',
    taskId: 'ngp.software_engineer_intern',
    role: 'Software Engineer Intern',
    company: 'NGP Websmart Pvt. Ltd.',
    client: 'NGP Ltd, UK',
    location: 'Chennai, India',
    start: '2022-08',
    end: '2023-06',
    highlights: [
      { text: 'Owned production REST APIs in Python and Node.js for clearVUE, a live UK energy-monitoring SaaS delivering smart-meter and IoT data to dashboards and real-time alerts.' },
      { text: 'Led an automated ingestion pipeline for time-series energy data in PostgreSQL and MySQL, replacing manual uploads with faster, more reliable reporting.' },
      { text: 'Shipped backend features for the Business Energy Quotes service and the in-house ERP-CRM, optimizing SQL queries and MongoDB data models.' },
      { text: 'Served as the Chennai team’s point of contact for UK stakeholders, ran sprint demos and mentored new interns on the codebase and Git workflow.' },
    ],
    stack: ['Python', 'Node.js', 'REST APIs', 'PostgreSQL', 'MySQL', 'MongoDB', 'Git'],
  },
];

export const projectTags = ['Spark', 'Databricks', 'Airflow', 'Python', 'ML / AI'] as const;
export type ProjectTag = (typeof projectTags)[number];

export interface Project {
  id: string;
  title: string;
  kind: string;
  summary: string;
  problem: string;
  approach: string[];
  flow: string[];
  stack: string[];
  tags: ProjectTag[];
}

export const projects: Project[] = [
  {
    id: 'energy-anomaly',
    title: 'ML Energy Anomaly Detection',
    kind: 'Streaming · ML',
    summary: 'Streams smart-meter readings and flags abnormal usage with an Isolation Forest model, served through a REST API.',
    problem: 'Energy customers only notice wasted consumption after the bill arrives. Smart meters already emit readings every few minutes, so anomalies can be caught while they happen.',
    approach: [
      'Kafka topics carry smart-meter readings into Spark Structured Streaming.',
      'Streaming jobs build rolling usage features per meter.',
      'An Isolation Forest model, tracked and versioned in MLflow, scores each window.',
      'FastAPI serves anomaly scores and alerts to downstream dashboards.',
    ],
    flow: ['Kafka', 'Spark Streaming', 'Features', 'Isolation Forest', 'FastAPI'],
    stack: ['Kafka', 'Spark Streaming', 'scikit-learn', 'MLflow', 'FastAPI', 'Python'],
    tags: ['Spark', 'Python', 'ML / AI'],
  },
  {
    id: 'claims-lakehouse',
    title: 'Healthcare Claims Lakehouse',
    kind: 'Lakehouse',
    summary: 'A medallion lakehouse on synthetic claims data with incremental merges, PHI masking and Airflow-orchestrated quality gates.',
    problem: 'Claims data arrives late, duplicated and full of PHI. Analysts need a curated layer they can query safely without re-running full loads.',
    approach: [
      'Raw files land in S3 and load into bronze Delta tables as-is.',
      'Silver applies schema enforcement, deduplication and PHI masking.',
      'Gold builds analytics-ready marts with incremental MERGE INTO upserts.',
      'Airflow runs each layer behind quality gates that stop bad data from moving forward.',
    ],
    flow: ['S3', 'Bronze', 'Silver · PHI masked', 'Gold', 'Analytics'],
    stack: ['PySpark', 'Databricks', 'Delta Lake', 'Airflow', 'S3'],
    tags: ['Spark', 'Databricks', 'Airflow', 'Python'],
  },
  {
    id: 'dq-framework',
    title: 'Data Quality Monitoring Framework',
    kind: 'Data quality',
    summary: 'Reusable checks for completeness, duplicates and out-of-range values, with pass/fail results published to a Power BI dashboard.',
    problem: 'Every team wrote its own one-off validation scripts, so failures were caught inconsistently and nobody had one view of data health.',
    approach: [
      'Declarative Great Expectations suites for completeness, uniqueness and value ranges.',
      'A Python runner validates each dataset and writes results to a SQL table.',
      'A Power BI dashboard shows pass/fail trends per dataset and check.',
    ],
    flow: ['Datasets', 'Expectations', 'Validate', 'Results table', 'Power BI'],
    stack: ['Python', 'Great Expectations', 'SQL', 'Power BI'],
    tags: ['Python'],
  },
  {
    id: 'triage-assistant',
    title: 'AI Pipeline Failure Triage Assistant',
    kind: 'LLM agent',
    summary: 'An LLM agent that reads failed-job logs, classifies the root cause and posts suggested fixes for on-call engineers.',
    problem: 'On-call engineers spend the first part of every incident reading long Spark and Airflow logs to work out what actually broke.',
    approach: [
      'Airflow failure callbacks collect the failed task’s logs from Databricks.',
      'A LangChain agent extracts the relevant error and classifies the root cause.',
      'The agent drafts a suggested fix and posts it for the on-call engineer.',
    ],
    flow: ['Failed task', 'Log parse', 'Classify cause', 'Suggest fix', 'On-call'],
    stack: ['Python', 'LangChain', 'OpenAI API', 'Airflow', 'Databricks'],
    tags: ['Python', 'Airflow', 'Databricks', 'ML / AI'],
  },
];

export interface Skill {
  name: string;
  /** Stack names that count as using this skill (for lineage tracing). Defaults to [name]. */
  match?: string[];
}

export type FlowStageId = 'ingest' | 'process' | 'store' | 'orchestrate' | 'validate' | 'serve' | 'learn' | 'ship';

export interface FlowStage {
  id: FlowStageId;
  label: string;
  /** How I use these tools in real work. */
  how: string;
  /** Where it happened. */
  where: string;
  skills: Skill[];
}

/** Skills placed at the stage of the data platform where I actually use them. */
export const skillFlow: FlowStage[] = [
  {
    id: 'ingest',
    label: 'Ingest',
    how: 'Land claims, eligibility and provider files from S3, smart-meter streams from Kafka, and source databases into the raw layer.',
    where: 'Cigna · clearVUE · Energy Anomaly Detection',
    skills: [{ name: 'S3' }, { name: 'Kafka' }, { name: 'Glue' }, { name: 'Python' }],
  },
  {
    id: 'process',
    label: 'Process',
    how: 'Clean, join and enrich data at scale with PySpark notebooks and jobs on Databricks.',
    where: 'Cigna · Johnson & Johnson · Claims Lakehouse',
    skills: [
      { name: 'PySpark' },
      { name: 'Apache Spark', match: ['PySpark', 'Spark Streaming'] },
      { name: 'Databricks' },
      { name: 'SQL', match: ['SQL', 'Athena', 'PostgreSQL', 'MySQL'] },
    ],
  },
  {
    id: 'store',
    label: 'Store',
    how: 'Model raw, cleansed and curated Delta tables, and design schemas in relational and document stores.',
    where: 'Cigna · J&J multi-site model · clearVUE',
    skills: [
      { name: 'Delta Lake' },
      { name: 'Data Modeling', match: ['Data Modeling', 'Delta Lake'] },
      { name: 'PostgreSQL' },
      { name: 'MySQL' },
      { name: 'MongoDB' },
    ],
  },
  {
    id: 'orchestrate',
    label: 'Orchestrate',
    how: 'Schedule, retry and monitor daily workloads, then triage failures and fix root causes to meet SLAs.',
    where: 'Cigna · Claims Lakehouse · Triage Assistant',
    skills: [{ name: 'Airflow' }, { name: 'Step Functions' }, { name: 'Lambda' }],
  },
  {
    id: 'validate',
    label: 'Validate',
    how: 'Gate every layer with completeness, duplicate and range checks, plus PHI masking for HIPAA.',
    where: 'Cigna · J&J quality monitor · DQ Framework',
    skills: [{ name: 'Data Quality', match: ['Data Quality', 'Great Expectations'] }, { name: 'Great Expectations' }],
  },
  {
    id: 'serve',
    label: 'Serve',
    how: 'Expose curated data through REST APIs and fast SQL, and report it in dashboards people use daily.',
    where: 'Cigna APIs · clearVUE · J&J dashboards',
    skills: [
      { name: 'REST APIs', match: ['REST APIs', 'FastAPI', 'API Gateway'] },
      { name: 'API Gateway' },
      { name: 'FastAPI' },
      { name: 'Athena' },
      { name: 'Power BI' },
      { name: 'Excel' },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    how: 'Score anomalies with ML models tracked in MLflow, and triage failed jobs with an LLM agent.',
    where: 'Energy Anomaly Detection · Triage Assistant',
    skills: [{ name: 'scikit-learn' }, { name: 'MLflow' }, { name: 'LangChain' }],
  },
  {
    id: 'ship',
    label: 'Ship',
    how: 'Version everything in Git, and deploy pipelines and infrastructure through Jenkins CI/CD with Terraform.',
    where: 'Cigna · clearVUE',
    skills: [{ name: 'Git' }, { name: 'Jenkins' }, { name: 'CI/CD', match: ['Jenkins'] }, { name: 'Terraform' }, { name: 'Linux' }],
  },
];

/** Languages run underneath every stage. */
export const languages: Skill[] = [
  { name: 'Python' },
  { name: 'PySpark' },
  { name: 'SQL', match: ['SQL', 'Athena', 'PostgreSQL', 'MySQL'] },
  { name: 'Java' },
  { name: 'JavaScript', match: ['Node.js'] },
  { name: 'Shell' },
];

/** How I work with people around the pipeline. Each line comes from the resume. */
export const practices = [
  {
    id: 'demos',
    title: 'Demo every sprint',
    body: 'Lead two-week sprint demos at Cigna and presented dashboard updates to operations, quality and IT teams at J&J.',
  },
  {
    id: 'mentoring',
    title: 'Review and mentor',
    body: 'Lead design and code reviews, and mentored new interns on the codebase and Git workflow.',
  },
  {
    id: 'client',
    title: 'Bridge time zones',
    body: 'Point of contact between the Chennai team and UK stakeholders, turning client feedback into user stories.',
  },
];

export const delivery = ['Agile / Scrum', 'Sprint planning', 'Stakeholder management', 'ServiceNow'];

export const education = [
  {
    degree: 'Master of Science in Computer Science',
    short: 'M.S. Computer Science',
    school: 'Florida Institute of Technology',
    location: 'Melbourne, FL',
    years: '2023 – 2025',
  },
  {
    degree: 'Bachelor of Technology in Computer Science',
    short: 'B.Tech Computer Science',
    school: 'Hindustan Institute of Technology and Science',
    location: 'Chennai, India',
    years: '2019 – 2023',
  },
];

export const publication = {
  title: 'Manipulation of 3D Objects in Handheld Augmented Reality for Campus Virtual Visit',
  authors: 'Tharun M., Naveen R., Malarvel M.',
  venue: 'Next-Gen Technologies in Computational Intelligence',
  publisher: 'CRC Press',
  year: 2024,
};

export const ticker = [
  'Python', 'PySpark', 'SQL', 'Databricks', 'Delta Lake', 'Airflow', 'AWS Glue', 'Lambda',
  'Step Functions', 'API Gateway', 'Athena', 'PostgreSQL', 'MongoDB', 'Kafka', 'MLflow',
  'Terraform', 'Jenkins', 'Power BI',
];
