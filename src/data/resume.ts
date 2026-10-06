// Single source of truth for all site content. Update this file to update the site.

export type StageId = 'hero' | 'about' | 'experience' | 'projects' | 'skills' | 'education' | 'contact';

export interface Stage {
  id: StageId;
  index: string;
  stage: string;
  nav: string;
  /** What Bit says while this stage is on screen. */
  bitSays: string;
}

export const stages: Stage[] = [
  { id: 'hero', index: '00', stage: 'ingest', nav: 'Home', bitSays: 'ingesting…' },
  { id: 'about', index: '01', stage: 'cleanse', nav: 'About', bitSays: 'cleaning…' },
  { id: 'experience', index: '02', stage: 'join', nav: 'Experience', bitSays: 'joining…' },
  { id: 'projects', index: '03', stage: 'build', nav: 'Projects', bitSays: 'building…' },
  { id: 'skills', index: '04', stage: 'index', nav: 'Skills', bitSays: 'indexing…' },
  { id: 'education', index: '05', stage: 'archive', nav: 'Education', bitSays: 'archiving…' },
  { id: 'contact', index: '06', stage: 'serve', nav: 'Contact', bitSays: 'served ✓' },
];

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
  rotatingRoles: ['lakehouse pipelines', 'data quality systems', 'REST APIs', 'Airflow workflows'],
  summary: [
    'I’m a software and data engineer with production experience across healthcare (Cigna), pharmaceutical manufacturing (Johnson & Johnson) and UK energy tech (clearVUE).',
    'I own delivery end to end, from requirements and design to deployment and daily operations, building scalable pipelines and APIs with Python, PySpark, SQL, Databricks and AWS. I lead sprint demos and code reviews, mentor teammates and work closely with engineering, analytics, operations and client teams.',
  ],
  stats: [
    { value: 3, suffix: '', label: 'Industries shipped in', detail: 'Healthcare, pharma, energy' },
    { value: 4, suffix: '', label: 'Build projects', detail: 'Streaming, lakehouse, DQ, LLM' },
    { value: 6, suffix: '', label: 'AWS services in production', detail: 'S3, Glue, Lambda, Step Fn, API GW, Athena' },
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

export interface SkillGroup {
  name: string;
  skills: { name: string; match?: string[] }[];
}

/** `match` lists the stack names that count as using this skill (for lineage tracing). */
export const skillGroups: SkillGroup[] = [
  {
    name: 'Languages',
    skills: [
      { name: 'Python' },
      { name: 'PySpark', match: ['PySpark'] },
      { name: 'SQL', match: ['SQL', 'Athena', 'PostgreSQL', 'MySQL'] },
      { name: 'Java' },
      { name: 'JavaScript', match: ['Node.js'] },
      { name: 'Shell' },
    ],
  },
  {
    name: 'Data engineering',
    skills: [
      { name: 'Apache Spark', match: ['PySpark', 'Spark Streaming'] },
      { name: 'Databricks' },
      { name: 'Delta Lake' },
      { name: 'Airflow' },
      { name: 'Kafka' },
      { name: 'Data Modeling', match: ['Data Modeling', 'Delta Lake'] },
      { name: 'Data Quality', match: ['Data Quality', 'Great Expectations'] },
    ],
  },
  {
    name: 'Cloud (AWS)',
    skills: [
      { name: 'S3' },
      { name: 'Glue' },
      { name: 'Lambda' },
      { name: 'Step Functions' },
      { name: 'API Gateway' },
      { name: 'Athena' },
    ],
  },
  {
    name: 'Databases',
    skills: [{ name: 'PostgreSQL' }, { name: 'MySQL' }, { name: 'MongoDB' }],
  },
  {
    name: 'Backend & ML',
    skills: [
      { name: 'REST APIs', match: ['REST APIs', 'FastAPI', 'API Gateway'] },
      { name: 'FastAPI' },
      { name: 'MLflow' },
      { name: 'scikit-learn' },
      { name: 'LangChain' },
    ],
  },
  {
    name: 'Analytics',
    skills: [{ name: 'Power BI' }, { name: 'Excel' }],
  },
  {
    name: 'DevOps & tools',
    skills: [
      { name: 'Git' },
      { name: 'Jenkins' },
      { name: 'Terraform' },
      { name: 'CI/CD', match: ['Jenkins'] },
      { name: 'Linux' },
      { name: 'ServiceNow' },
    ],
  },
  {
    name: 'Delivery',
    skills: [
      { name: 'Agile / Scrum' },
      { name: 'Code Reviews' },
      { name: 'Stakeholder Mgmt' },
      { name: 'Mentoring' },
    ],
  },
];

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
