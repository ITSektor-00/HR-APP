import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile } from 'formidable';
import fs from 'fs';
import pdfParse from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = formidable({ multiples: false, keepExtensions: true });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Greška pri parsiranju.' });
    const fileField = files.file;
    const file: FormidableFile | undefined = Array.isArray(fileField) ? fileField[0] : fileField;
    if (!file) return res.status(400).json({ error: 'Fajl nije poslat.' });
    const pdfBuffer = fs.readFileSync(file.filepath);
    const pdfData = await pdfParse(pdfBuffer);
    const text = pdfData.text;

    // Regex za srpski PDF (prilagodi po potrebi)
    const prezime = /Prezime:\s*([^\n]+)/.exec(text)?.[1]?.trim() || '';
    const ime = /Ime:\s*([^\n]+)/.exec(text)?.[1]?.trim() || '';
    const roditelj = /Ime jednog roditelja:\s*([^\n]+)/.exec(text)?.[1]?.trim() || '';
    const datum_rodjenja = /Datum rođenja:\s*([^\n]+)/.exec(text)?.[1]?.trim() || '';
    const mesto_rodjenja = /Mesto rođenja, opština i država:\s*([^\n]+)/.exec(text)?.[1]?.trim() || '';
    const prebivaliste = /Prebivalište:\s*([^\n]+)/.exec(text)?.[1]?.trim() || '';
    const datum_promene_adrese = /Datum promene adrese:\s*([^\n]+)/.exec(text)?.[1]?.trim() || '';
    const jmbg = /JMBG:\s*([^\n]+)/.exec(text)?.[1]?.trim() || '';
    const pol = /Pol:\s*([^\n]+)/.exec(text)?.[1]?.trim() || '';
    const broj_dokumenta = /Broj dokumenta:\s*([^\n]+)/.exec(text)?.[1]?.trim() || '';
    const datum_izdavanja = /Datum izdavanja:\s*([^\n]+)/.exec(text)?.[1]?.trim() || '';
    const vazi_do = /Važi do:\s*([^\n]+)/.exec(text)?.[1]?.trim() || '';

    return res.json({
      prezime,
      ime,
      roditelj,
      datum_rodjenja,
      mesto_rodjenja,
      prebivaliste,
      datum_promene_adrese,
      jmbg,
      pol,
      broj_dokumenta,
      datum_izdavanja,
      vazi_do,
    });
  });
} 