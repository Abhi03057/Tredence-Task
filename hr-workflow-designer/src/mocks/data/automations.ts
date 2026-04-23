import type { Automation } from '../../types/workflow.types';

export const mockAutomations: Automation[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    params: ['to', 'subject', 'body'],
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient'],
  },
  {
    id: 'slack_notify',
    label: 'Slack Notification',
    params: ['channel', 'message'],
  },
  {
    id: 'create_ticket',
    label: 'Create JIRA Ticket',
    params: ['project', 'summary', 'priority'],
  },
];
