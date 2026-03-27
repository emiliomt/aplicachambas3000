// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (buffer: Buffer) => Promise<{ text: string; numpages: number; info: Record<string, unknown> }>;

export interface ParsedPDF {
  text: string;
  numPages: number;
  info: Record<string, unknown>;
}

export async function parsePDF(buffer: Buffer): Promise<ParsedPDF> {
  const data = await pdfParse(buffer);
  return {
    text: data.text,
    numPages: data.numpages,
    info: data.info,
  };
}
