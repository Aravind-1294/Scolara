// app/utils/textExtractor.ts
import { createWorker } from 'tesseract.js';

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export async function extractText(file: File): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
      } else if (file.type === 'application/pdf') {
        const pdfText = await extractFromPdf(file);
        // Use OCR if PDF text extraction yields little or no text
        if (!pdfText || pdfText.trim().length < 100) {
          const ocrText = await extractWithOCR(file);
          resolve(ocrText);
        } else {
          resolve(pdfText);
        }
      } else if (file.type.startsWith('image/')) {
        const text = await extractWithOCR(file);
        resolve(text);
      } else {
        reject(new Error('Unsupported file type'));
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function extractWithOCR(file: File): Promise<string> {
  const worker = await createWorker('eng');
  try {
    const imageUrl = URL.createObjectURL(file);
    const { data: { text } } = await worker.recognize(imageUrl);
    URL.revokeObjectURL(imageUrl);
    return text;
  } finally {
    await worker.terminate();
  }
}

async function extractFromPdf(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    loadPdfJs()
      .then(async () => {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          let fullText = '';

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
            fullText += pageText + '\n';
          }

          resolve(fullText);
        } catch (error) {
          reject(error);
        }
      })
      .catch(reject);
  });
}

function loadPdfJs(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve();
    };
    
    script.onerror = () => reject(new Error('Failed to load PDF.js'));
    document.head.appendChild(script);
  });
}