import morgan, { TokenIndexer } from "morgan";
import { IncomingMessage, ServerResponse } from "http";
import chalk from "chalk"

export const formatDate = (date = new Date()): string => {
  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const customReqFormat = (tokens: TokenIndexer, req: IncomingMessage, res: ServerResponse) => {
  const time = chalk.bold.gray(formatDate());
  const url = chalk.yellow(tokens.url!(req, res));
  const method = chalk.green(tokens.method!(req, res));

  return `[${time}] ${method} ${url}`;
};

const customResFormat = (tokens: TokenIndexer, req: IncomingMessage, res: ServerResponse) => {
  const time = chalk.bold.gray(formatDate());
  const url = chalk.yellow(tokens.url!(req, res));
  const method = chalk.green(tokens.method!(req, res));
  const status = chalk.hex("#8a2be2")(tokens.status!(req, res));
  const responseTime = tokens["response-time"]!(req, res);

  return `[${time}] ${method} ${url} ${status} ${responseTime} ms`;
};

export const requestLogger = morgan(customReqFormat, { immediate: true });
export const responseLogger = morgan(customResFormat);