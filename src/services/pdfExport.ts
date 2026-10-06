import { jsPDF } from 'jspdf';
import { Calendar } from '../types/calendar';
import { getCalendarGridDays } from '../config/months';

export async function generateCalendarPDF(calendar: Calendar): Promise<void> {
  const isLandscape = calendar.formatSettings.orientation === 'landscape';
  const orientation = isLandscape ? 'l' : 'p';
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Helper to draw clean text
  const primaryChild = calendar.children.find((c) => c.isPrimary) || calendar.children[0];
  const childrenNames = calendar.togetherMode && calendar.children.length > 1
    ? calendar.children.map((c) => c.name).join(' и ')
    : (primaryChild?.name || 'Наш малыш');

  // PAGE 1: COVER
  doc.setFillColor(250, 247, 242); // #FAF7F2 milk canvas
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative border
  doc.setDrawColor(210, 195, 180);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Cover Header
  const headerSubtitle = calendar.giftRecipient === 'grandparents'
    ? 'Л Ю Б И М Ы М   Б А Б У Ш К Е   И   Д Е Д У Ш К Е'
    : calendar.giftRecipient === 'grandma'
    ? 'Л Ю Б И М О Й   Б А Б У Ш К Е'
    : calendar.giftRecipient === 'grandpa'
    ? 'Л Ю Б И М О М У   Д Е Д У Ш К Е'
    : 'С Е М Е Й Н Ы Й   К А Л Е Н Д А Р Ь';

  doc.setTextColor(44, 39, 35);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(headerSubtitle, pageWidth / 2, 40, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(36);
  doc.text('МОЙ ГОД', pageWidth / 2, 60, { align: 'center' });

  doc.setFontSize(48);
  doc.setTextColor(166, 83, 58); // Terracotta
  doc.text(String(calendar.year), pageWidth / 2, 85, { align: 'center' });

  // Child name
  doc.setFontSize(22);
  doc.setTextColor(44, 39, 35);
  doc.text(childrenNames, pageWidth / 2, 110, { align: 'center' });

  // Tagline
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(112, 102, 93);
  const pdfTagline = calendar.giftRecipient === 'grandparents' || calendar.giftRecipient === 'grandma' || calendar.giftRecipient === 'grandpa'
    ? '12 месяцев с любимыми внуками. Каждый день рядом.'
    : '12 месяцев. 12 историй. Один год твоего ребёнка.';
  doc.text(pdfTagline, pageWidth / 2, 125, { align: 'center' });

  // Dedication if enabled
  if (calendar.dedication.enabled && calendar.dedication.text) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(70, 65, 60);
    const splitDedication = doc.splitTextToSize(`«${calendar.dedication.text}»`, pageWidth - 60);
    doc.text(splitDedication, pageWidth / 2, pageHeight - 55, { align: 'center' });

    if (calendar.dedication.author) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(140, 130, 120);
      doc.text(`— ${calendar.dedication.author}`, pageWidth / 2, pageHeight - 38, { align: 'center' });
    }
  }

  // 12 MONTH PAGES
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  for (let m = 0; m < calendar.months.length; m++) {
    const month = calendar.months[m];
    doc.addPage('a4', orientation);

    // Background
    doc.setFillColor(250, 247, 242);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Thin frame
    doc.setDrawColor(230, 220, 210);
    doc.setLineWidth(0.3);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Month Heading
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(44, 39, 35);
    doc.text(`${month.monthName.toUpperCase()}`, pageWidth / 2, 26, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(166, 83, 58);
    doc.text(`${month.themeTitle}  ·  ${calendar.year}`, pageWidth / 2, 33, { align: 'center' });

    // Photo Box Placeholder / Container
    const photoWidth = pageWidth - 40;
    const photoHeight = isLandscape ? 85 : 120;
    const photoX = 20;
    const photoY = 40;

    doc.setFillColor(242, 235, 226);
    doc.roundedRect(photoX, photoY, photoWidth, photoHeight, 3, 3, 'F');

    // Inner photo illustration/badge
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(120, 110, 100);
    doc.text(`[ Фотосюжет месяца: ${month.themeTitle} ]`, pageWidth / 2, photoY + photoHeight / 2 - 4, { align: 'center' });
    doc.setFontSize(8);
    doc.text(`С участием: ${childrenNames}`, pageWidth / 2, photoY + photoHeight / 2 + 5, { align: 'center' });

    // Story Caption below photo
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(60, 55, 50);
    const captionText = `«${month.storyCaption}»`;
    const splitCaption = doc.splitTextToSize(captionText, photoWidth);
    doc.text(splitCaption, pageWidth / 2, photoY + photoHeight + 12, { align: 'center' });

    // Calendar Grid
    const gridY = photoY + photoHeight + 22;
    const cellWidth = photoWidth / 7;
    const cellHeight = isLandscape ? 6.5 : 8;

    // Day of week headers
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    dayNames.forEach((dName, i) => {
      const isWk = i >= 5;
      doc.setTextColor(isWk ? 180 : 80, isWk ? 60 : 75, isWk ? 50 : 70);
      doc.text(dName, photoX + i * cellWidth + cellWidth / 2, gridY, { align: 'center' });
    });

    // Separator line under weekdays
    doc.setDrawColor(215, 205, 195);
    doc.setLineWidth(0.2);
    doc.line(photoX, gridY + 2, photoX + photoWidth, gridY + 2);

    // Days numbers
    const days = getCalendarGridDays(calendar.year, month.monthNumber - 1);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    days.forEach((day, index) => {
      const col = index % 7;
      const row = Math.floor(index / 7);
      const cellX = photoX + col * cellWidth + cellWidth / 2;
      const cellY = gridY + 8 + row * cellHeight;

      if (day.isCurrentMonth) {
        if (day.isHoliday || day.isWeekend) {
          doc.setTextColor(180, 60, 50); // Red / terracotta for weekends and holidays
          doc.setFont('helvetica', 'bold');
        } else {
          doc.setTextColor(44, 39, 35);
          doc.setFont('helvetica', 'normal');
        }
        doc.text(String(day.dayNumber), cellX, cellY, { align: 'center' });
      } else {
        doc.setTextColor(190, 185, 180);
        doc.setFont('helvetica', 'normal');
        doc.text(String(day.dayNumber), cellX, cellY, { align: 'center' });
      }
    });

    // Page footer note
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(160, 150, 140);
    doc.text(`МОЙ ГОД ${calendar.year}  ·  С любовью для всей семьи`, pageWidth / 2, pageHeight - 12, { align: 'center' });
  }

  // Save the PDF file
  const fileName = `Календарь_Мой_Год_${calendar.year}_${childrenNames.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
}
