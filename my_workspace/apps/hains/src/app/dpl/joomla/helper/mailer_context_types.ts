export type MailerAddresse = {
  id: number;
  name: string;
  addresse: string;
};

export type ContextOptions = {
  from?: string;
  to?: string[];
  cc?: string[];
  reply_to?: string;
  attachment?: string;
  subject?: string;
  body?: string;
  params?: string[];
};

export type Context = {
  context: string;
  options?: ContextOptions;
};

export type MailerContext = {
  id: number;
  context: string;
  subject: string;
  from_id?: number;
  reply_to_id?: number;
  to: MailerAddresse[];
  cc: MailerAddresse[];
  body: string;
};

export type MailerData = {
  contexte: Context[];
  mailer_contexts: MailerContext[];
  mailer_addresses: MailerAddresse[];
  reason?: string;
};

export const defaultAddresse: MailerAddresse = {
  id: 0,
  name: '',
  addresse: ''
};

export const defaultMailerContext: MailerContext = {
  id: 0,
  context: '',
  subject: '',
  to: [],
  cc: [],
  body: ''
};
