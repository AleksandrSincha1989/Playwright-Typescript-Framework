import { mkdir, writeFile, appendFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { inspect } from 'node:util';

export class TestLogger {
  private writeChain: Promise<void>;

  constructor(private readonly filePath: string) {
    this.writeChain = this.initialize();
  }

  async log(message: string, value?: unknown): Promise<void> {
    await this.enqueueWrite(this.formatLine('INFO', message, value));
  }

  async debug(message: string, value?: unknown): Promise<void> {
    await this.enqueueWrite(this.formatLine('DEBUG', message, value));
  }

  async error(message: string, value?: unknown): Promise<void> {
    await this.enqueueWrite(this.formatLine('ERROR', message, value));
  }

  async flush(): Promise<void> {
    await this.writeChain;
  }

  get path(): string {
    return this.filePath;
  }

  private async initialize(): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, '');
  }

  private async enqueueWrite(line: string): Promise<void> {
    this.writeChain = this.writeChain.then(async () => {
      await mkdir(dirname(this.filePath), { recursive: true });
      await appendFile(this.filePath, line);
    });
    await this.writeChain;
  }

  private formatLine(level: string, message: string, value?: unknown): string {
    const timestamp = new Date().toISOString();
    const serializedValue = value === undefined ? '' : ` ${inspect(value, { depth: 5, breakLength: 120 })}`;
    return `[${timestamp}] [${level}] ${message}${serializedValue}\n`;
  }
}
