// Icon registry for the architecture diagrams.
// AWS icons come from the official AWS Architecture Icons set (via the
// aws-icons package); other tools use simple-icons brand glyphs.
import ec2 from 'aws-icons/icons/architecture-service/AmazonEC2.svg'
import asg from 'aws-icons/icons/architecture-service/AmazonEC2AutoScaling.svg'
import elb from 'aws-icons/icons/architecture-service/ElasticLoadBalancing.svg'
import elasticache from 'aws-icons/icons/architecture-service/AmazonElastiCache.svg'
import rds from 'aws-icons/icons/architecture-service/AmazonRDS.svg'
import efs from 'aws-icons/icons/architecture-service/AmazonEFS.svg'
import lambda from 'aws-icons/icons/architecture-service/AWSLambda.svg'
import apigw from 'aws-icons/icons/architecture-service/AmazonAPIGateway.svg'
import dynamodb from 'aws-icons/icons/architecture-service/AmazonDynamoDB.svg'
import cognito from 'aws-icons/icons/architecture-service/AmazonCognito.svg'
import cloudwatch from 'aws-icons/icons/architecture-service/AmazonCloudWatch.svg'
import sns from 'aws-icons/icons/architecture-service/AmazonSimpleNotificationService.svg'
import s3 from 'aws-icons/icons/architecture-service/AmazonSimpleStorageService.svg'
import vpc from 'aws-icons/icons/architecture-service/AmazonVirtualPrivateCloud.svg'
import igw from 'aws-icons/icons/resource/AmazonVPCInternetGateway.svg'
import users from 'aws-icons/icons/resource/Users.svg'
import user from 'aws-icons/icons/resource/User.svg'
import client from 'aws-icons/icons/resource/Client.svg'
import email from 'aws-icons/icons/resource/Email.svg'
import mobile from 'aws-icons/icons/resource/Mobileclient.svg'
import disk from 'aws-icons/icons/resource/Disk.svg'

import {
  siKubernetes, siK3s, siJenkins, siOpenstack, siTerraform, siGithub, siPostgresql,
  siAnsible, siGitlab, siHelm, siTraefikproxy, siPodman, siRedhat, siN8n, siDiscord,
  siSpringboot, siReact, siMinio, siPython, siZap, siGit, siMarkdown, siDocker, siNeo4j,
} from 'simple-icons'

const aws = (url) => ({ type: 'img', url })
// generic AWS line icons are drawn dark for light backgrounds: invert them
const line = (url) => ({ type: 'img', url, invert: true })
const brand = (icon, color) => ({ type: 'path', d: icon.path, color: color || `#${icon.hex}` })
const glyph = (text, color = '#9ca3af') => ({ type: 'glyph', text, color })

export const ICONS = {
  ec2: aws(ec2), asg: aws(asg), nlb: aws(elb), redis: aws(elasticache), rds: aws(rds),
  efs: aws(efs), lambda: aws(lambda), apigw: aws(apigw), dynamodb: aws(dynamodb),
  cognito: aws(cognito), cloudwatch: aws(cloudwatch), sns: aws(sns), s3: aws(s3),
  vpc: aws(vpc), igw: aws(igw),
  users: line(users), user: line(user), client: line(client), email: line(email),
  mobile: line(mobile), disk: line(disk),

  k8s: brand(siKubernetes), k3s: brand(siK3s), jenkins: brand(siJenkins),
  openstack: brand(siOpenstack), terraform: brand(siTerraform), github: brand(siGithub, '#ffffff'),
  postgres: brand(siPostgresql, '#6f8df0'), ansible: brand(siAnsible, '#ff4d4d'), gitlab: brand(siGitlab),
  helm: brand(siHelm, '#7aa2ff'), traefik: brand(siTraefikproxy), podman: brand(siPodman, '#b46bd0'),
  redhat: brand(siRedhat, '#ff4d4d'), n8n: brand(siN8n), discord: brand(siDiscord),
  spring: brand(siSpringboot), react: brand(siReact), minio: brand(siMinio, '#e8526a'),
  python: brand(siPython, '#5a9fd4'), zap: brand(siZap, '#4a9eff'), git: brand(siGit),
  markdown: brand(siMarkdown, '#ffffff'), docker: brand(siDocker), neo4j: brand(siNeo4j, '#6ea8ff'),

  pod: glyph('POD', '#60a5fa'), cron: glyph('CRON', '#fbbf24'), fip: glyph('FIP', '#22d3ee'),
  router: glyph('RTR', '#a78bfa'), probe: glyph('RPS', '#22c55e'), pdf: glyph('PDF', '#f472b6'),
  nuclei: glyph('NUC', '#c084fc'), target: glyph('APP', '#f87171'), parser: glyph('.PY', '#5a9fd4'),
  test: glyph('TEST', '#22c55e'), build: glyph('IMG', '#60a5fa'), endpoint: glyph('VPCE', '#a78bfa'),
  mount: glyph('MT', '#84cc16'), ghcr: glyph('GHCR', '#ffffff'), laptop: glyph('DEV', '#ffffff'),
  standby: glyph('N/A', '#6b7280'), scan: glyph('SCAN', '#22c55e'), agent: glyph('AGNT', '#fbbf24'),
  llm: glyph('LLM', '#c084fc'), mcp: glyph('MCP', '#22d3ee'), query: glyph('QRY', '#ffffff'),
  cinder: glyph('VOL', '#ED1944'), swiftobj: glyph('OBJ', '#ED1944'),
}
