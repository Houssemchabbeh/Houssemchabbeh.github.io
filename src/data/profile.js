// ---------------------------------------------------------------------------
// Single source of content for the site. Edit this file to update the page.
// Adding a certification = adding one entry to `certs` (the count on the hero,
// the heading and the tiles all follow). When CKA is passed, move it from
// `targets` to `certs`.
// ---------------------------------------------------------------------------

export const profile = {
  name: 'Houssem Ben Chabbeh',
  mark: 'HBC',
  handle: 'houssem@cloud',
  role: 'Cloud & DevOps Engineer',
  location: 'Ariana, Tunisia',
  statement: 'I build infrastructure that survives failure, then I break it to prove it.',
  bio: [
    'Engineering student at TEK-UP University, in the second year of the engineering cycle, specializing in Cloud & Infrastructure Management.',
    'I design AWS architectures, automate them with Terraform and Ansible, and run them on Kubernetes and RHEL. My work is backed by certifications from Red Hat, AWS and the Python Institute.',
  ],
  taglines: ['Cloud & DevOps Engineer', 'Infrastructure Automation', 'Linux & Kubernetes', 'AWS · Terraform · Ansible'],
  links: {
    email: 'houssemchabbeh33@gmail.com',
    github: 'https://github.com/Houssemchabbeh',
    linkedin: 'https://www.linkedin.com/in/houssem-ben-chabbeh-22bb02319/',
    credly: 'https://www.credly.com/users/houssem-ben-chabbeh',
    cv: './Houssem-Ben-Chabbeh-CV.pdf', // file lives in /public; replace it to update the CV
  },
}

export const certs = [
  { name: 'AWS Certified Developer – Associate', short: 'AWS DVA', img: './badges/aws-dva.png', issuer: 'Amazon Web Services', date: '2026-08' },
  { name: 'AWS Certified Solutions Architect – Associate', short: 'AWS SAA', img: './badges/aws-saa.png', issuer: 'Amazon Web Services', date: '2026-04' },
  { name: 'Red Hat Certified Developer in Cloud-native Applications', short: 'EX188', img: './badges/ex188.png', issuer: 'Red Hat', date: '2026-05' },
  { name: 'Red Hat Certified Engineer in Enterprise Linux', short: 'RHCE', img: './badges/rhce.png', issuer: 'Red Hat', date: '2026-02' },
  { name: 'Red Hat Certified Engineer in Ansible', short: 'RHCE Ansible', img: './badges/rhce-ansible.png', issuer: 'Red Hat', date: '2026-02' },
  { name: 'Red Hat Certified Advanced System Administrator in Ansible', short: 'Adv. SysAdmin', img: './badges/adv-sysadmin.png', issuer: 'Red Hat', date: '2026-02' },
  { name: 'Red Hat Certified System Administrator', short: 'RHCSA', img: './badges/rhcsa.png', issuer: 'Red Hat', date: '2025-12' },
  { name: 'PCAP – Certified Associate in Python Programming', short: 'PCAP', img: './badges/pcap.png', issuer: 'Python Institute', date: '2026-03' },
]

export const targets = [
  { name: 'Certified Kubernetes Administrator', short: 'CKA', issuer: 'CNCF · Linux Foundation', status: 'IN_PROGRESS' },
]

export const stack = [
  {
    title: 'CLOUD', pid: 'PID_1042',
    items: ['AWS', 'OpenStack', 'VPC', 'EC2 · Auto Scaling', 'Load Balancing', 'RDS', 'ElastiCache', 'EFS · S3', 'Lambda', 'API Gateway', 'DynamoDB', 'Cognito', 'SNS', 'CloudWatch'],
  },
  {
    title: 'AUTOMATION', pid: 'PID_2210',
    items: ['Terraform', 'Ansible', 'Jenkins', 'GitLab CI/CD', 'GitHub Actions', 'Python · Boto3', 'Bash'],
  },
  {
    title: 'CONTAINERS', pid: 'PID_3307',
    items: ['Kubernetes', 'k3s', 'Helm', 'Docker', 'Podman', 'Traefik', 'cert-manager'],
  },
  {
    title: 'LINUX', pid: 'PID_4096',
    items: ['RHEL', 'Ubuntu', 'System administration', 'systemd', 'firewalld', 'SELinux', 'Hardening', 'Networking · DNS · TLS'],
  },
]

export const projects = [
  {
    id: 'resilience',
    title: 'Resilience',
    kicker: 'Kubernetes · OpenStack · Disaster recovery',
    year: '2026',
    status: 'IN_PROGRESS',
    summary:
      'A course-registration portal on Kubernetes (k3s), running on a private OpenStack cloud, hosted on a single AWS EC2 machine built with Terraform. Then it is broken on purpose to measure how it recovers.',
    facts: [
      'PostgreSQL stores its data on a Cinder volume through the Cinder CSI driver',
      'Backups go to Swift every 15 minutes and are restore-tested every night',
      'Jenkins delivers new versions with automatic rollback',
      'Failure drills: a pod is killed, a VM is deleted, a table is dropped, the host is restarted',
    ],
    stack: ['Terraform', 'AWS EC2', 'OpenStack', 'Kubernetes (k3s)', 'Cinder CSI', 'Swift', 'Jenkins', 'Podman', 'PostgreSQL'],
    repo: 'https://github.com/Houssemchabbeh/openstack-k8s-resilience',
    diagram: 'resilience',
  },
  {
    id: 'doura',
    title: 'Doura',
    kicker: 'Serverless platform · AWS',
    year: '2026',
    summary:
      'A fully serverless AWS platform that lets citizens of Tunisian public offices take a queue ticket remotely, follow their position in real time and get an e-mail when their turn comes. Built with a team of four; I worked across the whole platform, from architecture to deployment.',
    facts: [
      'Built entirely on AWS services: S3, Cognito, API Gateway, Lambda, DynamoDB and Streams, SNS, CloudWatch',
      'Ticket numbers stay unique under concurrent requests (atomic counter and conditional writes)',
      'The national ID is never stored or logged, only a salted hash',
      'The whole stack is deployed by re-runnable Python/Boto3 code, with 69 automated tests in CI',
    ],
    stack: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'Cognito', 'S3', 'SNS', 'CloudWatch', 'VPC endpoints', 'Python · Boto3', 'GitHub Actions'],
    repo: 'https://github.com/Houssemchabbeh/Doura-Smart-Virtual-Queue-Platform-for-Public-Services',
    diagram: 'doura',
  },
  {
    id: 'gaming',
    title: 'Multi-AZ',
    kicker: 'High availability · AWS · Terraform',
    year: '2026',
    summary:
      'A highly available multiplayer gaming platform with voice chat. Designed during a cloud architecture lab exam, then built end to end with Terraform across two Availability Zones.',
    facts: [
      '27 AWS resources deployed with Terraform in about 15 minutes',
      'Network Load Balancer for TCP game traffic and UDP voice',
      'Redis and PostgreSQL each keep a standby in the other zone',
      'An automated end-to-end test runs inside every server through Systems Manager, with no SSH',
    ],
    stack: ['Terraform', 'VPC', 'NLB', 'EC2 Auto Scaling', 'ElastiCache Redis', 'RDS PostgreSQL', 'EFS', 'Systems Manager', 'Python · Boto3'],
    repo: 'https://github.com/Houssemchabbeh/aws-multi-az-gaming-platform-architecture',
    diagram: 'gaming',
  },
  {
    id: 'vulnforge',
    title: 'VulnForge',
    kicker: 'Security automation · RHEL',
    year: '2026',
    summary:
      'A self-hosted DAST platform on RHEL 10. OWASP ZAP and Nuclei scan real web application stacks every night, orchestrated by n8n, with scored reports and Discord alerts.',
    facts: [
      'One Ansible playbook deploys the full stack in under 5 minutes',
      'A Python parser normalizes, deduplicates and severity-scores findings from both scanners',
      'Host hardening raised the Lynis index from 66 to 74',
      'Everything runs as rootless Podman containers',
    ],
    stack: ['RHEL 10', 'Ansible', 'Podman', 'OWASP ZAP', 'Nuclei', 'n8n', 'Python', 'SELinux · firewalld'],
    repo: 'https://github.com/Houssemchabbeh/vulnforge',
    diagram: 'vulnforge',
  },
  {
    id: 'cloudops',
    title: 'CloudOps',
    kicker: 'Full-stack platform · AWS hosting',
    year: '2026',
    status: 'IN_PROGRESS',
    summary:
      'CloudOps Manager: a web platform to manage projects, servers and applications, with CPU/RAM monitoring, alerts and a dashboard.',
    facts: [
      'NestJS REST API documented with Swagger, on PostgreSQL with Prisma',
      'JWT authentication with three roles: Admin, DevOps, Viewer',
      'Unit and end-to-end tests on the API',
      'Hosted on AWS: a load balancer in front of an Auto Scaling group across two zones, with RDS PostgreSQL in private subnets',
    ],
    stack: ['NestJS', 'Next.js', 'TypeScript', 'PostgreSQL · Prisma', 'JWT', 'Docker Compose', 'Jest', 'AWS ALB', 'EC2 Auto Scaling', 'RDS'],
    repo: null,
    diagram: 'cloudops',
  },
]

export const moreRepos = [
  { name: 'aws-vpc-two-tier-architecture', note: 'Two-tier VPC with layered Security Groups and NACLs', url: 'https://github.com/Houssemchabbeh/aws-vpc-two-tier-architecture' },
  { name: 'rhel-hardening-ansible', note: 'RHEL hardening with Ansible roles, Vault and firewalld', url: 'https://github.com/Houssemchabbeh/rhel-hardening-ansible' },
  { name: 'Rhce-labs', note: 'Hands-on labs from my RHCE preparation', url: 'https://github.com/Houssemchabbeh/Rhce-labs' },
]

export const experience = [
  {
    org: 'Tunisian Engineers Order (OIT)',
    role: 'Infrastructure / DevOps Intern',
    period: 'Jul – Aug 2026',
    project: 'Internal Preview Environment Platform',
    headline:
      'Built the path that takes an application from a Git merge to a live, HTTPS-secured staging environment on a self-hosted Kubernetes cluster, with no manual step.',
    bullets: [
      'Provisioned a k3s cluster with an idempotent Ansible role (Infrastructure as Code).',
      "Extended the application's Helm chart to run the full stack in the cluster: backend, frontend, PostgreSQL with persistent storage, file storage and a document service.",
      'Built the GitLab CI/CD job that deploys to staging on every merge to main, with traceable image versions, secrets injected at deploy time, and Traefik ingress with TLS.',
      'Wrote the deployment guide and documented the known limitations.',
    ],
    tools: ['Kubernetes (k3s)', 'Helm', 'Ansible', 'GitLab CI/CD', 'Traefik', 'Docker'],
    diagram: 'oit',
  },
  {
    org: 'MedFlow',
    role: 'Data Science Intern',
    period: 'Jul – Aug 2026',
    project: 'Pharmacy AI Agent: drug interaction detection and prescription intelligence',
    headline:
      "Worked in a 3-person team on a decision-support agent that screens a prescription against a patient's medications, conditions, allergies and lab results, and explains every alert it raises.",
    bullets: [
      'Clinical knowledge is stored in a Neo4j graph (interactions, metabolic pathways, disease hierarchy), built from sources such as ANSM, OpenFDA and RxNorm; patient records and the audit trail are in PostgreSQL.',
      "A deterministic engine answers at the pharmacist's counter without any language model, so it cannot invent an interaction.",
      'A conversational agent reaches the same ten clinical tools over the Model Context Protocol (MCP), with the language model only wording the answers.',
      'Measured results: all 8 dangerous test prescriptions detected, no false alarms on 10 safe ones, a scan in at most 311 ms, 246 automated tests.',
    ],
    tools: ['Python', 'Neo4j', 'PostgreSQL', 'MCP', 'LLM tool calling', 'FastAPI', 'Streamlit', 'Docker Compose'],
    diagram: 'medflow',
  },
]

export const education = [
  { k: 'DEGREE', v: 'Engineering degree in Computer Science', sub: 'TEK-UP University · 2025 – 2028 · Specialization: Cloud & Infrastructure Management' },
  { k: 'PREP', v: 'Preparatory cycle, Mathematics & Physics', sub: 'IPEIN Nabeul · 2023 – 2025' },
]

export const activities = [
  { k: 'EVENT', v: 'TEK-UP Digital Kongress 2026', sub: 'Presented the poster "Prompt Engineering as a New Technical Competency" to a 14-member international jury' },
  { k: 'LANG', v: 'Arabic · French · English', sub: 'Native · bilingual · professional fluency (German: beginner)' },
]

// Shown in the log stream, oldest first. Recent GitHub pushes from
// src/data/activity.json (refreshed by `npm run activity`) are appended.
export const timeline = [
  { ts: '2025-12-30', src: 'CERT', msg: 'RHCSA passed :: Red Hat Certified System Administrator' },
  { ts: '2026-02-06', src: 'CERT', msg: 'RHCE passed :: Enterprise Linux + Ansible + Advanced SysAdmin badges issued' },
  { ts: '2026-03-09', src: 'CERT', msg: 'PCAP passed :: Certified Associate Python Programmer' },
  { ts: '2026-04-08', src: 'CERT', msg: 'AWS Solutions Architect Associate passed' },
  { ts: '2026-04-27', src: 'EVENT', msg: 'Digital Kongress :: poster presented to an international jury' },
  { ts: '2026-05-19', src: 'CERT', msg: 'Red Hat Cloud-native Developer (EX188) passed' },
  { ts: '2026-06-30', src: 'BUILD', msg: 'vulnforge :: nightly DAST pipeline live, Lynis 66 -> 74' },
  { ts: '2026-07-01', src: 'WORK', msg: 'OIT internship started :: infrastructure / DevOps' },
  { ts: '2026-08-11', src: 'CERT', msg: 'AWS Developer Associate passed' },
  { ts: '2026-08-30', src: 'WORK', msg: 'OIT :: zero-touch staging pipeline delivered (GitLab CI -> Helm -> k3s)' },
  { ts: '2026-10-30', src: 'BUILD', msg: 'multi-az gaming platform :: 27 resources applied with Terraform' },
  { ts: '2026-11-05', src: 'BUILD', msg: 'doura :: serverless queue platform, 69 tests green in CI' },
  { ts: '2026-11-11', src: 'BUILD', msg: 'openstack-k8s-resilience :: k3s cluster up on OpenStack' },
  { ts: 'NEXT', src: 'TARGET', msg: 'CKA :: Certified Kubernetes Administrator, in progress' },
]
