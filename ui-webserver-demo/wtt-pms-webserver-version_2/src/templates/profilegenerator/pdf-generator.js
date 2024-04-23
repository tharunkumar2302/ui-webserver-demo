const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');

const createPDF = async (resumeDetails) => {
  var templateHtml = fs.readFileSync(path.join('src/templates/profilegenerator', 'profile.html'), 'utf8');
  var template = handlebars.compile(templateHtml);
  const data = {
    Name: resumeDetails.firstName + resumeDetails.lastName,
    phone_no: resumeDetails.phone_no,
    email: resumeDetails.email,
    primary_skill: resumeDetails.primary_skill,
    experience_details: resumeDetails.experience_details,
    education_details: resumeDetails.education_details,
    current_location: resumeDetails.current_location,
    present_address: resumeDetails.present_address,
    date_of_birth: resumeDetails.date_of_birth,
  };
  var html = template(data);
  const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		headless: true
	});

  var page = await browser.newPage();

  await page.goto(`data:text/html;charset=UTF-8,${html}`, {
    waitUntil: 'networkidle0',
  });
  // await page.setViewport({ width: 1920, height: 1080 });
  const pdfBuffer = await page.pdf({
    format: 'A4',
    width: '800px',
    headerTemplate: '<p></p>',
    footerTemplate: '<p></p>',
    displayHeaderFooter: false,
    printBackground: true,
  });

  await browser.close();
  return pdfBuffer;
};
module.exports = {
  createPDF,
};
