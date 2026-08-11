import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface LessonData {
  id: string;
  title: string;
  level: string;
  unit: string;
  duration: string;
  date: string;
  content: any;
}

export interface SchoolInfo {
  wilaya: string;
  directorate: string;
  establishment: string;
  teacherName: string;
  academicYear: string;
}

const levelLabels: Record<string, string> = {
  FIRST: 'السنة الأولى متوسط',
  SECOND: 'السنة الثانية متوسط',
  THIRD: 'السنة الثالثة متوسط',
  FOURTH: 'السنة الرابعة متوسط',
};

export async function exportToPDF(lesson: LessonData, schoolInfo: SchoolInfo): Promise<void> {
  // إنشاء HTML مؤقت لعرض المحتوى
  const container = document.createElement('div');
  container.style.direction = 'rtl';
  container.style.fontFamily = 'Cairo, sans-serif';
  container.style.padding = '40px';
  container.style.maxWidth = '210mm';
  container.style.margin = '0 auto';
  container.style.background = 'white';

  // بناء المحتوى
  const contentHtml = lesson.content?.raw || 'لا يوجد محتوى';

  container.innerHTML = `
    <div style="text-align: center; border-bottom: 2px solid #0369a1; padding-bottom: 20px; margin-bottom: 20px;">
      <h1 style="font-size: 24px; color: #0369a1;">المذكرة البيداغوجية</h1>
      <p style="font-size: 14px; color: #555;">${schoolInfo.wilaya} | وزارة التربية الوطنية</p>
      <p style="font-size: 14px; color: #555;">مديرية التربية لولاية ${schoolInfo.wilaya}</p>
      <p style="font-size: 14px; color: #555;">المؤسسة التعليمية: ${schoolInfo.establishment}</p>
      <p style="font-size: 14px; color: #555;">الأستاذ: ${schoolInfo.teacherName}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <p><strong>المادة:</strong> العلوم الفيزيائية والتكنولوجيا</p>
      <p><strong>المستوى:</strong> ${levelLabels[lesson.level] || lesson.level}</p>
      <p><strong>الوحدة التعلمية:</strong> ${lesson.unit}</p>
      <p><strong>عنوان الدرس:</strong> ${lesson.title}</p>
      <p><strong>المدة:</strong> ${lesson.duration} دقيقة</p>
      <p><strong>التاريخ:</strong> ${lesson.date}</p>
    </div>

    <div style="font-size: 14px; line-height: 1.8;">
      ${contentHtml.replace(/\n/g, '<br />')}
    </div>

    <div style="border-top: 2px solid #0369a1; margin-top: 30px; padding-top: 10px; text-align: center; font-size: 12px; color: #888;">
      <p>© 2026 Brahim Machet — جميع الحقوق محفوظة</p>
      <p>إعداد وتصميم: المخبري إبراهيم معشت</p>
      <p>تم التصدير بواسطة: مذكرتي في العلوم الفيزيائية AI</p>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: container.scrollWidth,
      height: container.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`مذكرة_${lesson.title}_${lesson.date}.pdf`);
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error('فشل تصدير PDF');
  } finally {
    document.body.removeChild(container);
  }
}
