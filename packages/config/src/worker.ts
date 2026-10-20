import type { WorkerConfig } from '@flarewatch/shared';
import { privateIngressMonitors } from './private-ingress';

export const workerConfig: WorkerConfig = {
  // These follow public DNS from the scheduled Worker's location. They are
  // service availability samples, not a worldwide consensus or mail delivery test.
  monitors: [
    {
      id: 'mail-submission',
      name: 'Mail submission (587 TCP)',
      tooltip:
        'TCP connection through public DNS from one check location; does not test mail delivery.',
      method: 'TCP_PING',
      target: 'mail.h00t.works:587',
      timeout: 10000,
      downAfterChecks: 2,
      link: false,
    },
    {
      id: 'mail-imap',
      name: 'IMAP (993 TCP)',
      tooltip:
        'TCP connection through public DNS from one check location; does not test sign-in or TLS.',
      method: 'TCP_PING',
      target: 'mail.h00t.works:993',
      timeout: 10000,
      downAfterChecks: 2,
      link: false,
    },
    {
      id: 'stalwart-ready',
      name: 'Mail service readiness',
      tooltip: 'Stalwart readiness through the gateway selected by public DNS.',
      method: 'GET',
      target: 'https://mail.h00t.works/healthz/ready',
      expectedCodes: [200],
      responseJsonPath: '$.status',
      responseJsonValue: 200,
      timeout: 10000,
      downAfterChecks: 2,
      link: false,
    },
    {
      id: 'directus',
      name: 'Directus',
      tooltip:
        'Directus availability through public DNS from one check location; dependency health is not checked.',
      method: 'GET',
      target: 'https://vault.smbergen.no/server/ping',
      expectedCodes: [200],
      responseKeyword: 'pong',
      timeout: 10000,
      downAfterChecks: 2,
      link: false,
    },
    ...privateIngressMonitors,
  ],
};
