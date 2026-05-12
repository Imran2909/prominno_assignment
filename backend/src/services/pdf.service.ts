import PDFDocument from 'pdfkit';
import type { ProductDocument } from '../models/Product.js';

const parseDataUrl = (dataUrl: string): Buffer | null => {
  const [, base64] = dataUrl.split(',');
  if (!base64) {
    return null;
  }

  return Buffer.from(base64, 'base64');
};

export const createProductPdf = (product: ProductDocument): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 48, size: 'A4' });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const totalPrice = product.brands.reduce((sum, brand) => sum + Number(brand.price), 0);

    doc.fontSize(22).text('Product Details', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Product Name: ${product.productName}`);
    doc.moveDown(0.5);
    doc.text(`Description: ${product.productDescription}`);
    doc.moveDown();
    doc.fontSize(16).text('Brand Details', { underline: true });
    doc.moveDown(0.5);

    product.brands.forEach((brand, index) => {
      if (doc.y > 660) {
        doc.addPage();
      }

      doc.fontSize(13).text(`${index + 1}. ${brand.brandName}`, { continued: false });
      doc.fontSize(11).text(`Detail: ${brand.detail}`);
      doc.text(`Price: Rs. ${Number(brand.price).toFixed(2)}`);

      const imageBuffer = parseDataUrl(brand.image);
      if (imageBuffer) {
        try {
          doc.image(imageBuffer, { fit: [120, 80] });
        } catch {
          doc.fontSize(10).fillColor('red').text('Image could not be rendered').fillColor('black');
        }
      }

      doc.moveDown();
    });

    doc.moveDown();
    doc.fontSize(15).text(`Total Price: Rs. ${totalPrice.toFixed(2)}`, { align: 'right' });
    doc.end();
  });
};
