// Architecture diagrams. "d" = desktop coordinates, "m" = phone coordinates.
// See Diagram.jsx for the format.

const down = (...ids) => Object.fromEntries(ids.map((id) => [id, 'down']))

/* ------------------------------------------------------------------ */
/* Multi-AZ gaming platform                                            */
/* ------------------------------------------------------------------ */
const GA_BASE = ['e1', 'e2', 'e3', 'e4']
const AZ_A_DOWN = down('gsa', 'redisa', 'rdsa', 'mta')

export const gaming = {
  name: 'MULTI_AZ_GAMING_PLATFORM // AWS · TERRAFORM',
  size: { d: [1200, 722], m: [360, 736] },
  groups: [
    { id: 'aws', kind: 'aws', label: 'AWS Cloud · us-east-1', d: [20, 20, 1160, 688], m: [4, 4, 352, 728] },
    { id: 'vpc', kind: 'vpc', label: 'VPC 10.0.0.0/24', d: [60, 140, 1080, 556], m: [10, 112, 340, 614] },
    { id: 'aza', kind: 'az', label: 'us-east-1a · public subnet 10.0.0.0/26', ml: 'us-east-1a', d: [90, 275, 480, 328], m: [16, 235, 160, 400] },
    { id: 'azb', kind: 'az', label: 'us-east-1b · public subnet 10.0.0.64/26', ml: 'us-east-1b', d: [630, 275, 480, 328], m: [184, 235, 160, 400] },
    { id: 'asg', kind: 'asg', label: 'Auto Scaling group · min 2 / max 6', ml: 'ASG 2–6', d: [120, 300, 960, 108], m: [22, 258, 316, 88] },
  ],
  nodes: [
    { id: 'users', icon: 'users', label: 'Players', lp: 'r', mlp: 'r', d: [600, 62], m: [180, 40] },
    { id: 'igw', icon: 'igw', label: 'Internet gateway', lp: 'r', mlp: 'r', d: [600, 140], m: [180, 112] },
    { id: 'nlb', icon: 'nlb', label: 'Network Load Balancer', sub: 'TCP 80 · UDP 3478', ml: 'NLB', lp: 'r', mlp: 'r', d: [600, 215], m: [180, 180] },
    { id: 'gsa', icon: 'ec2', label: 'Game server', sub: 'EC2 t3.micro', msub: '', d: [380, 345], m: [96, 300] },
    { id: 'gsb', icon: 'ec2', label: 'Game server', sub: 'EC2 t3.micro', msub: '', d: [820, 345], m: [264, 300] },
    { id: 'redisa', icon: 'redis', label: 'Redis', sub: 'primary', d: [490, 458], m: [132, 392] },
    { id: 'redisb', icon: 'redis', label: 'Redis', sub: 'replica', d: [710, 458], m: [228, 392] },
    { id: 'rdsa', icon: 'rds', label: 'PostgreSQL', sub: 'primary', ml: 'RDS', d: [400, 552], m: [56, 474] },
    { id: 'rdsb', icon: 'rds', label: 'PostgreSQL', sub: 'standby', ml: 'RDS', d: [800, 552], m: [304, 474] },
    { id: 'mta', icon: 'mount', label: 'EFS mount target', ml: 'EFS mount', d: [170, 500], m: [96, 568] },
    { id: 'mtb', icon: 'mount', label: 'EFS mount target', ml: 'EFS mount', d: [1030, 500], m: [264, 568] },
    { id: 'efs', icon: 'efs', label: 'Amazon EFS', sub: 'encrypted · shared', ml: 'EFS', msub: 'shared', mlp: 'r', d: [600, 640], m: [180, 682] },
  ],
  edges: [
    { id: 'e1', from: 'users', to: 'igw' },
    { id: 'e2', from: 'igw', to: 'nlb' },
    { id: 'e3', from: 'nlb', to: 'gsa', via: [[600, 258], [380, 258]], mvia: [[180, 222], [96, 222]] },
    { id: 'e4', from: 'nlb', to: 'gsb', via: [[600, 258], [820, 258]], mvia: [[180, 222], [264, 222]] },
    { id: 'e5', from: 'gsa', to: 'redisa' },
    { id: 'e6', from: 'gsa', to: 'rdsa' },
    { id: 'e7', from: 'gsa', to: 'mta' },
    { id: 'e8', from: 'gsb', to: 'redisa' },
    { id: 'e9', from: 'gsb', to: 'rdsa', only: 'd' },
    { id: 'e10', from: 'gsb', to: 'mtb' },
    { id: 'e11', from: 'mta', to: 'efs', via: [[170, 640]], mvia: [[96, 682]] },
    { id: 'e12', from: 'mtb', to: 'efs', via: [[1030, 640]], mvia: [[264, 682]] },
    { id: 'e13', from: 'redisa', to: 'redisb', dashed: true, label: 'replication' },
    { id: 'e14', from: 'rdsa', to: 'rdsb', dashed: true, label: 'synchronous replication' },
    { id: 'e15', from: 'gsb', to: 'redisb' },
    { id: 'e16', from: 'gsb', to: 'rdsb' },
  ],
  scenes: [
    {
      id: 'traffic', label: 'Traffic', cumulative: true,
      steps: [
        { c: 'Players connect to one DNS name. The Network Load Balancer carries the game API on TCP 80 and voice on UDP 3478, which an Application Load Balancer cannot forward.', e: ['e1', 'e2'] },
        { c: 'Connections are spread across game servers in two Availability Zones.', e: ['e3', 'e4'] },
        { c: 'Sessions, matchmaking and leaderboards are kept in Redis for fast access.', e: ['e5', 'e8'] },
        { c: 'Player accounts and game data are stored in PostgreSQL (RDS Multi-AZ).', e: ['e6', 'e9'] },
        { c: 'Assets and maps sit on encrypted EFS, mounted on every server from its own zone.', e: ['e7', 'e10', 'e11', 'e12'] },
      ],
    },
    {
      id: 'heal', label: 'Self-healing', tag: 'VALIDATED',
      steps: [
        { c: 'Normal state: two healthy game servers, one per zone.', e: GA_BASE },
        { c: 'A game server in us-east-1b is terminated.', e: ['e1', 'e2', 'e3'], s: { gsb: 'down' } },
        { c: 'Its health checks fail, so the load balancer sends every player to the remaining server.', e: ['e1', 'e2', 'e3'], s: { gsb: 'down' } },
        { c: 'The Auto Scaling group launches a replacement from the launch template.', e: ['e1', 'e2', 'e3'], s: { gsb: 'new' } },
        { c: 'The new server passes its health checks and rejoins: 2/2 healthy again.', e: GA_BASE },
      ],
    },
    {
      id: 'failover', label: 'AZ failover', tag: 'BY DESIGN',
      steps: [
        { c: 'Normal state: primaries in us-east-1a, standbys kept in sync in us-east-1b.', e: ['e3', 'e4', 'e5', 'e6', 'e13', 'e14'] },
        { c: 'us-east-1a becomes unavailable.', e: ['e1', 'e2', 'e4'], s: AZ_A_DOWN },
        { c: 'ElastiCache promotes the Redis replica and RDS fails over to its standby. The endpoints stay the same, so the servers reconnect on their own.', e: ['e1', 'e2', 'e4', 'e15', 'e16'], s: { ...AZ_A_DOWN, redisb: 'promoted', rdsb: 'promoted' } },
        { c: 'Players keep playing from us-east-1b, with shared files still reachable through its own EFS mount target.', e: ['e1', 'e2', 'e4', 'e15', 'e16', 'e10', 'e12'], s: AZ_A_DOWN },
      ],
    },
    {
      id: 'security', label: 'Security groups',
      steps: [
        { c: 'Only the load balancer is open to the internet: TCP 80 and UDP 3478.', e: ['e1', 'e2'] },
        { c: "Game servers accept traffic from the load balancer's security group only.", e: ['e3', 'e4'] },
        { c: 'Redis (6379), PostgreSQL (5432) and EFS (2049) accept traffic from the game servers only. Rules reference security groups, not IP ranges.', e: ['e5', 'e6', 'e7', 'e8', 'e9', 'e10'] },
      ],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Doura — serverless virtual queue                                    */
/* ------------------------------------------------------------------ */
const LAMBDAS = ['health', 'agencies', 'tickets', 'queue', 'display']

export const doura = {
  name: 'DOURA // SERVERLESS_VIRTUAL_QUEUE · AWS',
  size: { d: [1200, 640], m: [360, 900] },
  groups: [
    { id: 'aws', kind: 'aws', label: 'AWS Cloud · us-east-1', d: [160, 20, 1024, 604], m: [4, 92, 352, 804] },
    { id: 'vpc', kind: 'vpc', label: 'VPC 10.0.0.0/16', d: [530, 56, 330, 500], m: [10, 270, 340, 252] },
    { id: 'subnet', kind: 'subnet', label: 'private subnet · no internet, no NAT', ml: 'private subnet · no NAT', d: [548, 88, 294, 456], m: [17, 294, 326, 220] },
  ],
  nodes: [
    { id: 'user', icon: 'mobile', label: 'Citizen / agent', sub: 'browser', msub: '', mlp: 'r', d: [72, 260], m: [180, 42] },
    { id: 's3', icon: 's3', label: 'S3 static website', ml: 'S3 website', d: [262, 110], m: [66, 148] },
    { id: 'cognito', icon: 'cognito', label: 'Cognito', sub: 'sign-in · 4 roles', msub: '', d: [262, 420], m: [294, 148] },
    { id: 'apigw', icon: 'apigw', label: 'API Gateway', sub: 'REST · 14 routes', mlp: 'r', d: [420, 260], m: [180, 218] },
    { id: 'health', icon: 'lambda', label: 'health', d: [640, 150], m: [52, 356] },
    { id: 'agencies', icon: 'lambda', label: 'agencies', d: [640, 235], m: [116, 356] },
    { id: 'tickets', icon: 'lambda', label: 'tickets', d: [640, 320], m: [180, 356] },
    { id: 'queue', icon: 'lambda', label: 'queue', d: [640, 405], m: [244, 356] },
    { id: 'display', icon: 'lambda', label: 'display', d: [640, 490], m: [308, 356] },
    { id: 'vpce', icon: 'endpoint', label: 'Gateway endpoint', sub: 'DynamoDB · S3', msub: '', mlp: 'r', d: [778, 320], m: [180, 462] },
    { id: 'ddb', icon: 'dynamodb', label: 'DynamoDB', sub: 'agencies · tickets · control', msub: '', d: [960, 320], m: [110, 592] },
    { id: 'notifier', icon: 'lambda', label: 'notifier', sub: 'Lambda · outside the VPC', msub: 'Lambda', d: [960, 470], m: [110, 684] },
    { id: 'snst', icon: 'sns', label: 'SNS', sub: 'ticket-events', d: [1100, 470], m: [110, 776] },
    { id: 'mail', icon: 'email', label: 'Citizen e-mail', d: [1100, 568], m: [110, 858] },
    { id: 'cw', icon: 'cloudwatch', label: 'CloudWatch', sub: 'logs · alarms', d: [960, 150], m: [290, 592] },
    { id: 'snsa', icon: 'sns', label: 'SNS', sub: 'alerts', d: [1100, 150], m: [290, 684] },
    { id: 'admin', icon: 'email', label: 'Admin e-mail', lp: 'l', d: [1100, 62], m: [290, 776] },
  ],
  edges: [
    { id: 'a1', from: 'user', to: 's3', label: 'load pages' },
    { id: 'a2', from: 'user', to: 'cognito', label: 'sign in' },
    { id: 'a3', from: 'user', to: 'apigw', label: 'REST + token' },
    { id: 'a4', from: 'apigw', to: 'cognito', dashed: true, label: 'verify token' },
    ...LAMBDAS.map((l, i) => ({ id: `l${i + 1}`, from: 'apigw', to: l })),
    { id: 'd1', from: 'agencies', to: 'vpce' },
    { id: 'd2', from: 'tickets', to: 'vpce' },
    { id: 'd3', from: 'queue', to: 'vpce' },
    { id: 'd4', from: 'display', to: 'vpce' },
    { id: 'd5', from: 'vpce', to: 'ddb' },
    { id: 's1', from: 'ddb', to: 'notifier', label: 'Stream', ml: true },
    { id: 's2', from: 'notifier', to: 'snst' },
    { id: 's3', from: 'snst', to: 'mail' },
    { id: 'c1', from: 'health', mfrom: 'display', to: 'cw', label: 'logs & metrics (all Lambdas)' },
    { id: 'c2', from: 'cw', to: 'snsa', label: 'alarm' },
    { id: 'c3', from: 'snsa', to: 'admin' },
  ],
  scenes: [
    {
      id: 'take', label: 'Take a ticket', cumulative: true,
      steps: [
        { c: 'A citizen opens the site, served from S3, and signs in with Cognito.', e: ['a1', 'a2'] },
        { c: 'POST /tickets goes through API Gateway, which verifies the Cognito token. The role is checked again inside the Lambda.', e: ['a3', 'a4'] },
        { c: 'The tickets Lambda hashes the national ID (never stored in clear), takes a one-active-ticket lock and increments an atomic counter, so numbers stay unique under concurrent requests.', e: ['l3'] },
        { c: 'The ticket is written to DynamoDB through a VPC gateway endpoint: the Lambdas have no internet access and no NAT gateway is needed.', e: ['d2', 'd5'] },
      ],
    },
    {
      id: 'call', label: 'Call next',
      steps: [
        { c: 'An agent calls the next ticket from their counter.', e: ['a3', 'a4', 'l4'] },
        { c: 'The queue Lambda takes the oldest waiting ticket and moves it to CALLED with a conditional write, so two counters can never get the same ticket.', e: ['l4', 'd3', 'd5'] },
        { c: "The waiting-room screen and the citizen's page poll for the new position.", e: ['a3', 'l3', 'l5', 'd2', 'd4', 'd5'] },
      ],
    },
    {
      id: 'notify', label: 'Notify',
      steps: [
        { c: 'Every ticket change is published on the DynamoDB Stream.', e: ['s1'] },
        { c: 'The notifier Lambda runs outside the VPC, so it reaches SNS without a paid interface endpoint.', e: ['s1', 's2'] },
        { c: 'SNS e-mails the citizen when their ticket is served or cancelled.', e: ['s2', 's3'] },
      ],
    },
    {
      id: 'ops', label: 'Operations',
      steps: [
        { c: 'Every Lambda writes JSON logs to CloudWatch with sensitive fields masked.', e: ['c1'], n: LAMBDAS },
        { c: 'One error alarm per Lambda publishes to an SNS topic that e-mails the administrator.', e: ['c1', 'c2', 'c3'] },
        { c: 'The whole stack is created by Python/Boto3 code that can be re-run safely, and 69 automated tests run in CI on every push.', n: ['s3', 'cognito', 'apigw', ...LAMBDAS, 'vpce', 'ddb', 'notifier', 'snst', 'cw', 'snsa'] },
      ],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* openstack-k8s-resilience                                            */
/* ------------------------------------------------------------------ */
const OS_PATH = ['p1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7']

export const resilience = {
  name: 'OPENSTACK_K8S_RESILIENCE // K3S ON OPENSTACK ON AWS',
  size: { d: [1200, 700], m: [360, 962] },
  groups: [
    { id: 'aws', kind: 'aws', label: 'AWS Cloud · us-east-1', d: [150, 16, 1040, 672], m: [4, 96, 352, 862] },
    { id: 'ec2', kind: 'host', label: 'EC2 r8i.large · Ubuntu · nested virtualization · provisioned with Terraform', ml: 'EC2 r8i.large · nested virtualization', d: [166, 44, 1010, 634], m: [9, 114, 342, 838] },
    { id: 'os', kind: 'openstack', label: 'OpenStack (DevStack)', sub: 'Keystone · Nova · Glance · Neutron · Cinder · Swift', msub: 'Keystone · Nova · Glance · Neutron · Cinder · Swift', d: [340, 78, 820, 588], m: [15, 212, 330, 732] },
    { id: 'proj', kind: 'dashed', label: 'project: resilience · k3s-net 10.20.0.0/24 (MTU 1442)', ml: 'project: resilience', d: [358, 140, 784, 398], m: [21, 252, 318, 524] },
    { id: 'cluster', kind: 'k8s', lpos: 'b', label: 'k3s cluster · namespace registration · flannel VXLAN (MTU 1392)', ml: 'k3s cluster · flannel VXLAN', d: [398, 268, 722, 256], m: [27, 342, 306, 424] },
    { id: 'nodea', kind: 'vm', label: 'VM node-a · k3s server', d: [416, 296, 334, 208], m: [33, 366, 294, 186] },
    { id: 'nodeb', kind: 'vm', label: 'VM node-b · k3s agent', d: [768, 296, 334, 208], m: [33, 564, 294, 186] },
  ],
  nodes: [
    { id: 'github', icon: 'github', label: 'GitHub', sub: 'source', msub: '', d: [72, 70], m: [60, 40] },
    { id: 'ghcr', icon: 'ghcr', label: 'Container registry', sub: 'GHCR', ml: 'GHCR', msub: '', d: [72, 190], m: [170, 40] },
    { id: 'laptop', icon: 'laptop', label: 'Developer laptop', sub: 'Terraform · SSH tunnels', ml: 'Laptop', msub: '', d: [72, 370], m: [290, 40] },
    { id: 'jenkins', icon: 'jenkins', label: 'Jenkins', sub: 'delivery · backup-verify', msub: '', d: [258, 150], m: [285, 166] },
    { id: 'probe', icon: 'probe', label: 'probe · loadgen', sub: '1 request / second', ml: 'probe', msub: '', d: [258, 450], m: [70, 166] },
    { id: 'fip', icon: 'fip', label: 'Floating IP', d: [440, 208], m: [90, 296] },
    { id: 'router', icon: 'router', label: 'k3s-router', mlp: 'r', d: [580, 208], m: [230, 296] },
    { id: 'traefik', icon: 'traefik', label: 'Traefik ingress', ml: 'Traefik', d: [620, 358], m: [250, 420] },
    { id: 'web1', icon: 'pod', label: 'web pod', d: [480, 450], m: [165, 502] },
    { id: 'pg', icon: 'postgres', label: 'PostgreSQL', sub: 'StatefulSet', msub: '', d: [660, 450], m: [75, 502] },
    { id: 'web2', icon: 'pod', label: 'web pod', d: [850, 358], m: [250, 640] },
    { id: 'cron', icon: 'cron', label: 'CronJob', sub: 'pg-backup', d: [1010, 358], m: [150, 640] },
    { id: 'cinder', icon: 'cinder', label: 'Cinder volume', sub: 'PVC → PV · CSI driver', msub: 'CSI driver', lp: 'r', d: [660, 596], m: [75, 866] },
    { id: 'swift', icon: 'swiftobj', label: 'Swift object storage', sub: 'registration-backups', ml: 'Swift', msub: 'backups', lp: 'l', d: [1010, 596], m: [250, 866] },
  ],
  edges: [
    { id: 'r1', from: 'laptop', to: 'fip', label: 'SSH tunnel' },
    { id: 'r2', from: 'fip', to: 'router' },
    { id: 'r3', from: 'router', to: 'traefik' },
    { id: 'r4', from: 'traefik', to: 'web1' },
    { id: 'r5', from: 'traefik', to: 'web2' },
    { id: 'r6', from: 'web1', to: 'pg' },
    { id: 'r7', from: 'web2', to: 'pg' },
    { id: 'r8', from: 'pg', to: 'cinder', label: 'attached via Nova' },
    { id: 'j1', from: 'jenkins', to: 'github', label: 'poll every 5 min' },
    { id: 'j2', from: 'jenkins', to: 'ghcr', label: 'push image' },
    { id: 'j3', from: 'jenkins', to: 'fip', label: 'kubectl :6443' },
    { id: 'j4', from: 'ghcr', to: [398, 292], mto: [140, 342], dashed: true, label: 'pull image' },
    { id: 'p1', from: 'probe', to: 'fip', label: 'HTTP' },
    { id: 'b1', from: 'cron', to: 'swift', label: 'pg_dump every 15 min' },
    { id: 'b2', from: 'swift', to: 'jenkins', via: [[1010, 650], [205, 650], [205, 150]], mvia: [[250, 916], [338, 916], [338, 166]], label: 'nightly restore test' },
  ],
  scenes: [
    {
      id: 'request', label: 'Request path', cumulative: true,
      steps: [
        { c: "The portal is reached through an SSH tunnel to the cluster's floating IP.", e: ['r1', 'r2'] },
        { c: 'Neutron routes the request into the k3s network, where Traefik ingress receives it.', e: ['r3'] },
        { c: 'Traefik balances across web pods running on both nodes.', e: ['r4', 'r5'] },
        { c: 'Registrations are written to PostgreSQL with row locks and idempotent receipts: no overbooking and no duplicates.', e: ['r6', 'r7'] },
        { c: 'The database lives on a Cinder volume attached through the Cinder CSI driver, so the data outlives the pod and the VM.', e: ['r8'] },
      ],
    },
    {
      id: 'delivery', label: 'Delivery',
      steps: [
        { c: 'Jenkins polls the GitHub repository every 5 minutes.', e: ['j1'] },
        { c: 'It builds the image with Podman and pushes it to the container registry.', e: ['j2'] },
        { c: 'It rolls the new version out with kubectl through the floating IP. If the rollout is not healthy, it rolls back automatically.', e: ['j3'] },
        { c: 'The nodes pull the new image and replace the web pods one at a time.', e: ['j4', 'r4', 'r5'] },
      ],
    },
    {
      id: 'backup', label: 'Backups',
      steps: [
        { c: 'A CronJob runs pg_dump every 15 minutes and stores the dump in Swift object storage.', e: ['b1'], n: ['pg'] },
        { c: 'Every night Jenkins restores the latest backup, to prove that it can actually be restored.', e: ['b1', 'b2'] },
      ],
    },
    {
      id: 'drills', label: 'Failure drills',
      steps: [
        { c: 'A probe sends one request per second while the platform is broken on purpose. Each drill records downtime, data lost (RPO) and correctness.', e: OS_PATH },
        { c: 'Drill 1 · a web pod is killed. The other pod keeps serving while Kubernetes starts a new one.', e: ['p1', 'r2', 'r3', 'r5', 'r7'], s: { web1: 'down' } },
        { c: 'Drill 2 · a VM is deleted. Its pods are rescheduled on the surviving node.', e: ['p1', 'r2', 'r3', 'r4', 'r6'], s: { web2: 'down', cron: 'down' } },
        { c: 'Drill 3 · a table is dropped. The data is restored from the latest Swift backup.', s: { pg: 'restore', swift: 'hot' } },
        { c: 'Drill 4 · the whole host is restarted. OpenStack, the VMs and the cluster come back with the data intact on Cinder.', e: ['r8'], s: { pg: 'hot', cinder: 'hot' } },
      ],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* OIT internship — zero-touch staging pipeline                        */
/* ------------------------------------------------------------------ */
export const oit = {
  name: 'PREVIEW_ENVIRONMENT_PLATFORM // GITLAB CI → HELM → K3S',
  size: { d: [1200, 540], m: [360, 730] },
  groups: [
    { id: 'ci', kind: 'box', label: 'GitLab CI/CD (self-hosted)', ml: 'GitLab CI/CD', d: [164, 165, 420, 190], m: [92, 8, 260, 108] },
    { id: 'cluster', kind: 'k8s', label: 'k3s cluster · staging namespace', d: [650, 44, 530, 474], m: [8, 252, 344, 470] },
  ],
  nodes: [
    { id: 'dev', icon: 'git', label: 'Merge to main', ml: 'merge', d: [72, 262], m: [46, 62] },
    { id: 'test', icon: 'test', label: 'test', d: [240, 262], m: [132, 62] },
    { id: 'build', icon: 'build', label: 'build', sub: 'SHA-tagged images', msub: '', d: [372, 262], m: [222, 62] },
    { id: 'deploy', icon: 'helm', label: 'deploy-staging', sub: 'helm upgrade --wait', ml: 'deploy', msub: '', d: [504, 262], m: [310, 62] },
    { id: 'ansible', icon: 'ansible', label: 'Ansible role', sub: 'k3s_staging · idempotent', msub: 'k3s_staging', d: [504, 74], m: [70, 182] },
    { id: 'users', icon: 'users', label: 'Users', sub: 'HTTPS', d: [560, 452], m: [190, 182] },
    { id: 'traefik', icon: 'traefik', label: 'Traefik ingress', sub: 'automatic TLS', mlp: 'r', d: [742, 262], m: [180, 318] },
    { id: 'fe', icon: 'react', label: 'frontend', sub: 'React · nginx', msub: '', d: [892, 160], m: [90, 428] },
    { id: 'be', icon: 'spring', label: 'backend', sub: 'Spring Boot', msub: '', d: [892, 364], m: [270, 428] },
    { id: 'pg', icon: 'postgres', label: 'PostgreSQL', sub: 'persistent volume', msub: 'PVC', d: [1080, 230], m: [76, 584] },
    { id: 'minio', icon: 'minio', label: 'MinIO', sub: 'object storage', msub: '', d: [1080, 346], m: [180, 644] },
    { id: 'pdf', icon: 'pdf', label: 'Gotenberg', sub: 'PDF rendering', msub: '', d: [1080, 458], m: [288, 584] },
  ],
  edges: [
    { id: 'g1', from: 'dev', to: 'test' },
    { id: 'g2', from: 'test', to: 'build' },
    { id: 'g3', from: 'build', to: 'deploy' },
    { id: 'g4', from: 'deploy', to: [650, 262], mto: [310, 252], label: 'Helm release' },
    { id: 'a1', from: 'ansible', to: [650, 74], mto: [70, 252], label: 'provisions' },
    { id: 'u1', from: 'users', to: 'traefik' },
    { id: 'u2', from: 'traefik', to: 'fe', label: '/', ml: true },
    { id: 'u3', from: 'traefik', to: 'be', label: '/api', ml: true },
    { id: 'u4', from: 'be', to: 'pg' },
    { id: 'u5', from: 'be', to: 'minio' },
    { id: 'u6', from: 'be', to: 'pdf' },
  ],
  scenes: [
    {
      id: 'deploy', label: 'Deploy', cumulative: true,
      steps: [
        { c: 'A merge to main starts the pipeline, tests first.', e: ['g1'] },
        { c: 'Images are built and tagged with the commit SHA, so every deploy is traceable and reproducible.', e: ['g2'] },
        { c: 'The deploy job runs helm upgrade --install --wait. If the pods do not become healthy, the job fails instead of reporting success.', e: ['g3', 'g4'] },
        { c: 'The new version is live over HTTPS, with no manual step.', e: ['u1', 'u2', 'u3'] },
      ],
    },
    {
      id: 'request', label: 'In the cluster',
      steps: [
        { c: 'Traefik terminates TLS and routes / to the frontend and /api to the backend.', e: ['u1', 'u2', 'u3'] },
        { c: 'The backend finds PostgreSQL, MinIO and Gotenberg by Service DNS, so the same Helm chart deploys into any namespace.', e: ['u4', 'u5', 'u6'] },
      ],
    },
    {
      id: 'provision', label: 'Provisioning',
      steps: [
        { c: 'An idempotent Ansible role installs k3s, cert-manager and Traefik. Re-running it on a healthy node changes nothing.', e: ['a1'], n: ['traefik'] },
      ],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* VulnForge                                                           */
/* ------------------------------------------------------------------ */
export const vulnforge = {
  name: 'VULNFORGE // SELF_HOSTED_DAST · RHEL 10',
  size: { d: [1200, 520], m: [360, 640] },
  groups: [
    { id: 'host', kind: 'openstack', label: 'RHEL 10 host · hardened · rootless Podman', ml: 'RHEL 10 · rootless Podman', d: [170, 30, 670, 462], m: [8, 96, 344, 404] },
    { id: 'targets', kind: 'dashed', lpos: 'b', label: 'vulnerable target apps (containers)', ml: 'target apps', d: [262, 338, 356, 136], m: [16, 316, 328, 96] },
  ],
  nodes: [
    { id: 'ansible', icon: 'ansible', label: 'Ansible', sub: 'site.yml · under 5 min', msub: 'site.yml', mlp: 'r', d: [72, 250], m: [180, 42] },
    { id: 'n8n', icon: 'n8n', label: 'n8n', sub: 'nightly schedule', lp: 'r', mlp: 'r', d: [440, 96], m: [180, 152] },
    { id: 'zap', icon: 'zap', label: 'OWASP ZAP', d: [360, 226], m: [100, 238] },
    { id: 'nuclei', icon: 'nuclei', label: 'Nuclei', d: [520, 226], m: [260, 238] },
    { id: 't1', icon: 'target', label: 'DVWA', d: [330, 400], m: [70, 362] },
    { id: 't2', icon: 'target', label: 'Juice Shop', d: [440, 400], m: [180, 362] },
    { id: 't3', icon: 'target', label: 'WebGoat', d: [550, 400], m: [290, 362] },
    { id: 'parser', icon: 'python', label: 'parser.py', sub: 'dedupe · score', mlp: 'r', d: [730, 226], m: [180, 456] },
    { id: 'reports', icon: 'markdown', label: 'Markdown reports', sub: 'committed to Git', ml: 'reports', msub: '', d: [1010, 150], m: [100, 566] },
    { id: 'discord', icon: 'discord', label: 'Discord alert', sub: 'risk score', msub: '', d: [1010, 310], m: [260, 566] },
  ],
  edges: [
    { id: 'v1', from: 'ansible', to: [170, 250], mto: [180, 96], label: 'deploys' },
    { id: 'v2', from: 'n8n', to: 'zap' },
    { id: 'v3', from: 'n8n', to: 'nuclei' },
    { id: 'v4', from: 'zap', to: 't1' },
    { id: 'v5', from: 'zap', to: 't2' },
    { id: 'v6', from: 'nuclei', to: 't2' },
    { id: 'v7', from: 'nuclei', to: 't3' },
    { id: 'v8', from: 'zap', to: 'parser', via: [[360, 164], [730, 164]] },
    { id: 'v9', from: 'nuclei', to: 'parser' },
    { id: 'v10', from: 'parser', to: 'reports' },
    { id: 'v11', from: 'parser', to: 'discord' },
  ],
  scenes: [
    {
      id: 'scan', label: 'Nightly scan', cumulative: true,
      steps: [
        { c: 'n8n starts both scanners every night.', e: ['v2', 'v3'] },
        { c: 'OWASP ZAP and Nuclei scan the target applications, which run as rootless Podman containers.', e: ['v4', 'v5', 'v6', 'v7'] },
        { c: 'A Python parser normalizes, deduplicates and severity-scores the findings from both engines.', e: ['v8', 'v9'] },
        { c: 'A Markdown report is committed to the repository and a Discord alert carries the risk score.', e: ['v10', 'v11'] },
      ],
    },
    {
      id: 'deploy', label: 'Deploy',
      steps: [
        { c: 'One Ansible playbook builds the whole stack in under 5 minutes: hardened host, Podman network, targets, scanners and n8n.', e: ['v1'], n: ['n8n', 'zap', 'nuclei', 't1', 't2', 't3', 'parser'] },
        { c: 'Hardening covers SSH, sysctl, auditd, PAM, firewalld and SELinux in enforcing mode. Lynis hardening index: 66 → 74.', n: ['ansible'] },
      ],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* CloudOps Manager — AWS hosting                                      */
/* ------------------------------------------------------------------ */
export const cloudops = {
  name: 'CLOUDOPS_MANAGER // AWS_HOSTING · THREE-TIER VPC',
  size: { d: [1200, 706], m: [360, 642] },
  groups: [
    { id: 'aws', kind: 'aws', label: 'AWS Cloud · us-east-1', d: [20, 96, 1160, 596], m: [4, 62, 352, 574] },
    { id: 'vpc', kind: 'vpc', label: 'VPC cloudops-vpc 10.0.0.0/16', ml: 'VPC 10.0.0.0/16', d: [50, 170, 1100, 512], m: [9, 100, 342, 530] },
    { id: 'aza', kind: 'az', label: 'Availability Zone us-east-1a', ml: 'us-east-1a', d: [75, 205, 510, 466], m: [14, 150, 163, 472] },
    { id: 'azb', kind: 'az', label: 'Availability Zone us-east-1b', ml: 'us-east-1b', d: [615, 205, 510, 466], m: [183, 150, 163, 472] },
    { id: 'puba', kind: 'subnet', label: 'public-a 10.0.1.0/24', ml: 'public-a', d: [95, 236, 470, 96], m: [19, 172, 153, 92] },
    { id: 'pubb', kind: 'subnet', label: 'public-b 10.0.2.0/24', ml: 'public-b', d: [635, 236, 470, 96], m: [188, 172, 153, 92] },
    { id: 'appa', kind: 'private', label: 'app-a 10.0.11.0/24', ml: 'app-a', d: [95, 344, 470, 156], m: [19, 276, 153, 170] },
    { id: 'appb', kind: 'private', label: 'app-b 10.0.12.0/24', ml: 'app-b', d: [635, 344, 470, 156], m: [188, 276, 153, 170] },
    { id: 'asg', kind: 'asg', lpos: 'b', label: 'Auto Scaling group cloudops-asg · min 2 / max 4 · CPU target 60%', ml: 'ASG 2–4 · CPU target 60%', d: [130, 368, 940, 122], m: [24, 300, 312, 138] },
    { id: 'dba', kind: 'private', label: 'db-a 10.0.21.0/24 · private', ml: 'db-a · private', d: [95, 512, 470, 146], m: [19, 458, 153, 150] },
    { id: 'dbb', kind: 'private', label: 'db-b 10.0.22.0/24 · private', ml: 'db-b · private', d: [635, 512, 470, 146], m: [188, 458, 153, 150] },
  ],
  nodes: [
    { id: 'users', icon: 'users', label: 'Users', sub: 'browser · HTTP 80', lp: 'r', mlp: 'r', d: [600, 46], m: [180, 34] },
    { id: 'igw', icon: 'igw', label: 'Internet gateway', lp: 'r', mlp: 'r', d: [600, 170], m: [180, 100] },
    { id: 'alb', icon: 'nlb', label: 'Application Load Balancer', sub: '/api/* → backend :3001 · default → frontend :3000', ml: 'ALB', msub: '', lp: 'r', d: [600, 284], m: [180, 218] },
    { id: 'ec2a', icon: 'ec2', label: 'EC2 t3.small', sub: 'Docker Compose · frontend + backend', ml: 'EC2', msub: 'frontend + backend', d: [330, 414], m: [96, 352] },
    { id: 'ec2b', icon: 'ec2', label: 'EC2 t3.small', sub: 'Docker Compose · frontend + backend', ml: 'EC2', msub: 'frontend + backend', d: [870, 414], m: [264, 352] },
    { id: 'rds', icon: 'rds', label: 'RDS PostgreSQL 16', sub: 'db.t3.micro · backups on', ml: 'RDS PostgreSQL', msub: 'db.t3.micro', lp: 'r', d: [330, 594], m: [96, 528] },
    { id: 'standby', icon: 'standby', label: 'Multi-AZ standby', sub: 'not allowed in Learner Lab', msub: 'not in Learner Lab', lp: 'r', d: [870, 594], m: [264, 528] },
  ],
  edges: [
    { id: 'c1', from: 'users', to: 'igw' },
    { id: 'c2', from: 'igw', to: 'alb' },
    { id: 'c3', from: 'alb', to: 'ec2a', via: [[600, 340], [330, 340]], mvia: [[180, 270], [96, 270]] },
    { id: 'c4', from: 'alb', to: 'ec2b', via: [[600, 340], [870, 340]], mvia: [[180, 270], [264, 270]] },
    { id: 'c5', from: 'ec2a', to: 'rds', label: '5432' },
    { id: 'c6', from: 'ec2b', to: 'rds', via: [[870, 506], [420, 506]], mvia: [[264, 452], [140, 452]], label: '5432' },
  ],
  scenes: [
    {
      id: 'request', label: 'Request path', cumulative: true,
      steps: [
        { c: 'Users reach the platform over HTTP through the internet gateway.', e: ['c1', 'c2'] },
        { c: 'The Application Load Balancer sits in two public subnets. It routes /api/* to the backend on port 3001 and everything else to the frontend on port 3000.', e: ['c3', 'c4'] },
        { c: 'Each EC2 instance runs the Next.js frontend and the NestJS backend with Docker Compose, in a private application subnet.', n: ['ec2a', 'ec2b'] },
        { c: 'The backend reaches RDS PostgreSQL on port 5432, in a private database subnet.', e: ['c5', 'c6'] },
      ],
    },
    {
      id: 'scaling', label: 'Scaling', tag: 'BY DESIGN',
      steps: [
        { c: 'The Auto Scaling group keeps two instances running, one per Availability Zone.', e: ['c1', 'c2', 'c3', 'c4'] },
        { c: 'When average CPU passes the 60% target, the group adds instances, up to four.', e: ['c1', 'c2', 'c3', 'c4'], s: { ec2a: 'hot', ec2b: 'hot' } },
        { c: 'If an instance fails its health check, the load balancer stops routing to it.', e: ['c1', 'c2', 'c3'], s: { ec2b: 'down' } },
        { c: 'The group replaces it from the launch template, and traffic is balanced again.', e: ['c1', 'c2', 'c3', 'c4'], s: { ec2b: 'new' } },
      ],
    },
    {
      id: 'network', label: 'Network tiers',
      steps: [
        { c: 'Three subnet tiers per zone: public for the load balancer, private for the application, private for the database.', n: ['alb', 'ec2a', 'ec2b', 'rds'] },
        { c: 'The database runs in a single zone. A Multi-AZ standby is not allowed in the AWS Learner Lab, so the second database subnet is reserved for it.', n: ['rds'], s: { standby: 'hot' } },
      ],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* MedFlow — pharmacy AI agent                                         */
/* ------------------------------------------------------------------ */
const MF_ALL = ['pharm', 'analyst', 'engine', 'agent', 'llm', 'mcp', 'query', 'neo4j', 'pg']

export const medflow = {
  name: 'PHARMACY_AI_AGENT // TWO CONSUMERS, ONE CLINICAL LAYER',
  size: { d: [1200, 580], m: [360, 640] },
  groups: [
    { id: 'counter', kind: 'subnet', lpos: 'b', label: 'counter path · deterministic, no language model', ml: 'counter path', d: [150, 20, 330, 250], m: [8, 8, 168, 232] },
    { id: 'chat', kind: 'asg', lpos: 'b', label: 'conversational path · model selects tools', ml: 'conversational path', d: [690, 20, 490, 250], m: [184, 8, 168, 320] },
  ],
  nodes: [
    { id: 'pharm', icon: 'user', label: 'Pharmacist', sub: 'scan screen (Streamlit)', msub: '', d: [315, 66], m: [92, 50] },
    { id: 'analyst', icon: 'client', label: 'Analyst', sub: 'any MCP client', msub: '', d: [860, 66], m: [240, 50] },
    { id: 'engine', icon: 'scan', label: 'Reactive engine', sub: 'concurrent checks', msub: '', d: [315, 186], m: [92, 160] },
    { id: 'agent', icon: 'agent', label: 'Conversational agent', sub: 'tool-calling loop', ml: 'Agent', msub: '', d: [860, 186], m: [240, 150] },
    { id: 'llm', icon: 'llm', label: 'Language model', sub: 'phrases answers only', ml: 'LLM', msub: '', d: [1070, 186], m: [316, 150] },
    { id: 'mcp', icon: 'mcp', label: 'MCP server', sub: '10 clinical tools', lp: 'r', d: [760, 316], m: [240, 262] },
    { id: 'query', icon: 'query', label: 'Clinical query layer', sub: 'ten safety functions · read-only', msub: 'read-only', lp: 'r', mlp: 'r', d: [560, 392], m: [150, 400] },
    { id: 'neo4j', icon: 'neo4j', label: 'Neo4j knowledge graph', sub: 'interactions · metabolic paths · disease hierarchy', ml: 'Neo4j graph', msub: 'clinical knowledge', d: [380, 500], m: [92, 540] },
    { id: 'pg', icon: 'postgres', label: 'PostgreSQL', sub: 'patients · labs · memory · audit trail', msub: 'patients · audit', d: [800, 500], m: [264, 540] },
  ],
  edges: [
    { id: 'm1', from: 'pharm', to: 'engine' },
    { id: 'm2', from: 'engine', to: 'query' },
    { id: 'm3', from: 'analyst', to: 'agent' },
    { id: 'm4', from: 'agent', to: 'llm' },
    { id: 'm5', from: 'agent', to: 'mcp', label: 'MCP' },
    { id: 'm6', from: 'mcp', to: 'query' },
    { id: 'm7', from: 'query', to: 'neo4j' },
    { id: 'm8', from: 'query', to: 'pg' },
  ],
  scenes: [
    {
      id: 'counter', label: 'Counter scan', cumulative: true,
      steps: [
        { c: 'The pharmacist enters a prescription for a patient.', e: ['m1'] },
        { c: 'The reactive engine runs every check at once: interactions, metabolic pathways, contraindications, allergies, duplication and dose. No language model is involved, so it cannot invent an interaction.', e: ['m2'] },
        { c: 'The checks read a Neo4j knowledge graph and the patient record in PostgreSQL. A single scan takes at most 311 ms.', e: ['m7', 'm8'] },
        { c: 'The pharmacist gets a ranked alert report, and each finding shows the reasoning that produced it.', n: ['pharm', 'engine'] },
      ],
    },
    {
      id: 'agent', label: 'Agent path',
      steps: [
        { c: 'An analyst asks a question in plain language.', e: ['m3'] },
        { c: 'The language model chooses which clinical tools to call. It words the answer, but it is never the source of clinical facts.', e: ['m3', 'm4'] },
        { c: 'The tools are exposed over the Model Context Protocol, so any compatible client can reuse them.', e: ['m5', 'm6'] },
        { c: 'Both paths share one query layer, so each clinical rule exists in exactly one place.', e: ['m2', 'm6', 'm7', 'm8'] },
      ],
    },
    {
      id: 'safety', label: 'Fail-safe', tag: 'TESTED',
      steps: [
        { c: 'If the knowledge graph is unreachable, the report says that no safety check was performed. It never shows a clean result.', e: ['m1', 'm2'], s: { neo4j: 'down' } },
        { c: 'Evaluated on fixed trap cases: 8 of 8 dangerous prescriptions detected, no false alarms on 10 safe ones, 246 automated tests.', n: MF_ALL },
      ],
    },
  ],
}

export const DIAGRAMS = { gaming, doura, resilience, oit, vulnforge, cloudops, medflow }
