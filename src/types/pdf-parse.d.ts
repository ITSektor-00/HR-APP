declare module 'pdf-parse' {
  function pdf(dataBuffer: Buffer | Uint8Array): Promise<{ text: string }>;
  export default pdf;
} 