import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

import { getCourseDetails } from "@/queries/courses";
import { getLoggedInUser } from "@/lib/loggedin-user";
import { getAReport } from "@/queries/reports";
import { FormatMyDate } from "@/lib/date";

export async function GET(request) {
  try {
    
    const kalamFontUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/fonts/kalam/Kalam-Regular.ttf`;
    const kalamFontBytes = await fetch(kalamFontUrl).then((res) =>
      res.arrayBuffer()
    );

    const montserratItalicFontUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/fonts/montserrat/Montserrat-Italic.ttf`;
    const montserratItalicFontBytes = await fetch(montserratItalicFontUrl).then(
      (res) => res.arrayBuffer()
    );

    const montserratFontUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/fonts/montserrat/Montserrat-Medium.ttf`;
    const montserratFontBytes = await fetch(montserratFontUrl).then((res) =>
      res.arrayBuffer()
    );

    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('courseId');
    const course = await getCourseDetails(courseId);
    const loggedInUser = await getLoggedInUser();
    const report = await getAReport({ course: courseId, student: loggedInUser.id });

    const completionDate = report?.completion_date
      ? FormatMyDate(report.completion_date)
      : FormatMyDate(Date.now());

    const completionInfo = {
      name: `${loggedInUser?.firstName} ${loggedInUser?.lastName}`,
      completionDate,
      courseName: course.title,
      instructor: `${course?.instructor?.firstName} ${course?.instructor?.lastName}`,
      instructorDesignation: `${course?.instructor?.designation}`,
      sign: "/logo.png",
    };

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const kalamFont = await pdfDoc.embedFont(kalamFontBytes);
    const montserratItalic = await pdfDoc.embedFont(montserratItalicFontBytes);
    const montserrat = await pdfDoc.embedFont(montserratFontBytes);

    const page = pdfDoc.addPage([841.89, 595.28]);
    const { width, height } = page.getSize();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`;
    const logoBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
    const logo = await pdfDoc.embedPng(logoBytes);
    const logoDimns = logo.scale(0.5);
    page.drawImage(logo, {
      x: width / 2 - logoDimns.width / 2,
      y: height - 120,
      width: logoDimns.width,
      height: logoDimns.height,
    });

    const titleFontSize = 30;
    const titleText = "Certificate Of Completion";
    const titleTextWidth = montserrat.widthOfTextAtSize(titleText, titleFontSize);

    page.drawText(titleText, {
      x: width / 2 - titleTextWidth / 2,
      y: height - (logoDimns.height + 125),
      size: titleFontSize,
      font: montserrat,
      color: rgb(0, 0.53, 0.71),
    });

    const nameLabelText = "This certificate is hereby bestowed upon";
    const nameLabelFontSize = 20;
    const nameLabelTextWidth = montserratItalic.widthOfTextAtSize(nameLabelText, nameLabelFontSize);

    page.drawText(nameLabelText, {
      x: width / 2 - nameLabelTextWidth / 2,
      y: height - (logoDimns.height + 170),
      size: nameLabelFontSize,
      font: montserratItalic,
      color: rgb(0, 0, 0),
    });

    const nameText = completionInfo.name;
    const nameFontSize = 40;
    const nameTextWidth = timesRomanFont.widthOfTextAtSize(nameText, nameFontSize);

    page.drawText(nameText, {
      x: width / 2 - nameTextWidth / 2,
      y: height - (logoDimns.height + 220),
      size: nameFontSize,
      font: kalamFont,
      color: rgb(0, 0, 0),
    });

    const detailsText = `This is to certify that ${completionInfo.name} successfully completed the ${completionInfo.courseName} course on ${completionInfo.completionDate} by ${completionInfo.instructor}`;
    const detailsFontSize = 16;

    page.drawText(detailsText, {
      x: width / 2 - 700 / 2,
      y: height - 330,
      size: detailsFontSize,
      font: montserrat,
      color: rgb(0, 0, 0),
      maxWidth: 700,
      wordBreaks: [" "],
    });

    const pdfBytes = await pdfDoc.save();
    return new Response(pdfBytes, {
      headers: { "Content-Type": "application/pdf" },
    });
  } catch (error) {
    console.log(error);
    return new Response("An error occurred while generating the PDF.", { status: 500 });
  }
}
