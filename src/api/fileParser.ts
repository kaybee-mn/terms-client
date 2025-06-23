import * as pdfjsLib from 'pdfjs-dist';
import mammoth from "mammoth";

const readDocx = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const { value: text } = await mammoth.extractRawText({ arrayBuffer });
  console.log(text);
  return text;
};

const readPdf = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(' ') + '\n';
  }

  return text;
};

export default {readPdf, readDocx}
