import { Logger as TSLog, ILogObj, IMeta } from 'tslog';
import { createStream } from 'rotating-file-stream';
import { DateTime } from 'luxon';

const stream = createStream("requests.log", {
  size: "1M",
  interval: "1d",
  path: "logs"
});

export const logger: TSLog<ILogObj> = new TSLog({
  prettyLogTemplate: '{{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t[{{filePathWithLine}}{{name}}]\t',
  type: 'pretty',
})

logger.attachTransport(({ _meta, '0': msg }) => {
  const { runtime, logLevelName, date } = _meta as IMeta;
  const dateTimeFormatted = DateTime.fromJSDate(date).toFormat('dd/MM/yyyy HH:mm:ss.SSS');
  stream.write(`${dateTimeFormatted} ${runtime} ${logLevelName} ${msg}\n`);
});