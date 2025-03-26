import { _mail } from '@my-workspace/prisma_cruds';

export async function getMailerContext(context: string) {
  const mailerContexts = await _mail.findManyContext(
    {
      where: {
        context: {
          equals: context
        }
      }
    },
    {
      addresses_from: true,
      addresses_reply_to: true,
      mailer_ccs: { include: { mailer_addresses: true } },
      mailer_tos: { include: { mailer_addresses: true } }
    }
  );
  const result = mailerContexts.map((mContext) => {
    return {
      ...mContext,
      cc: mContext.mailer_ccs.map((ccs) => {
        return ccs.mailer_addresses;
      }),
      to: mContext.mailer_tos.map((to) => {
        return to.mailer_addresses;
      }),
      from: mContext.addresses_from,
      reply_to: mContext.addresses_reply_to
    };
  });
  return result;
}
