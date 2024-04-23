const XLSX = require('exceljs');
const { unlink } = require('fs/promises');
const httpStatus = require('http-status');
const multer = require('multer');
const ApiError = require('./ApiError');

const exportData = async (dataArray, _type = 'excel', tempName = '', columns = []) => {
  const arrayToProcess = dataArray.map((obj) => {
    const dataObj = { ...obj };
    if (dataObj.modifiedByUserId) {
      dataObj.modifiedByUser = `${dataObj.modifiedByUserId.firstName} ${dataObj.modifiedByUserId.lastName}`;
      delete dataObj.modifiedByUserId;
    }
    if (obj.createdByUserId) {
      dataObj.createdByUser = `${dataObj.createdByUserId.firstName} ${dataObj.createdByUserId.lastName}`;
      delete dataObj.createdByUserId;
    }
    delete dataObj.organization;
    return dataObj;
  });
  const array = arrayToProcess.map((obj, index) => {
    const resObj = {};
    Object.keys(obj).forEach((key) => {
      const newKey = key
        .split('_')
        .map((name) => name.replace(name[0], name[0].toUpperCase()))
        .join(' ');

      if (toString.call(obj[key]).slice(8, -1) === 'Array') {
        if (toString.call(obj[key][0]).slice(8, -1) === 'Object') {
          resObj[newKey] = obj[key];
        } else {
          resObj[newKey] = obj[key].join(', ');
        }
      } else {
        resObj[newKey] = obj[key];
      }
    });
    let data = { 'S.No.': index + 1, id: resObj.Id };
    delete resObj.Id;
    if (tempName === 'resumeImportTemplate') delete data.id;
    data = { ...data, ...resObj };
    return data;
  });
  if (_type === 'excel') {
    const workBook = new XLSX.Workbook();
    const workSheet = workBook.addWorksheet('resumes');

    const colsList = columns.map((value) =>
      value.trim().toLowerCase() === 'id'
        ? 'id'
        : value
            .trim()
            .split('_')
            .map((name) => name.replace(name[0], name[0].toUpperCase()))
            .join(' ')
    );
    workSheet.columns = (colsList.length ? colsList : Object.keys(array[0])).map((colName) => {
      const colNameLength = colName.replaceAll('.', '').length;
      const colLength = Math.max(...array.map((ar) => `${ar[colName]}`.length));
      const length = colLength > colNameLength ? colLength : colNameLength;
      // eslint-disable-next-line no-nested-ternary
      return { header: colName, key: colName, width: length < 70 ? (length > 25 ? length : 25) : 70 };
    });

    array.forEach((data) => {
      workSheet.addRow(data);
    });

    workSheet.getRow(1).eachCell((cell) => {
      // eslint-disable-next-line no-param-reassign
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      // eslint-disable-next-line no-param-reassign
      cell.fill = { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFF0000' } };
      // eslint-disable-next-line no-param-reassign
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });
    array.forEach((_, i) => {
      workSheet.getRow(i + 2).eachCell((cell) => {
        // eslint-disable-next-line no-param-reassign
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      });
    });
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await workBook.xlsx.writeFile(`./src/controllers/files/${tempName || 'resumes'}_${array[0].id || 1}.xlsx`);

    return `./src/controllers/files/${tempName || 'resumes'}_${array[0].id || 1}.xlsx`;
  }
  throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Invalid export type passed');
};

const excelToJosn = async (resums, user) => {
  const upload = multer({ dest: 'uploads/' }).single('resumes');
  const obs = new Promise((resolve, rej) => {
    upload(resums, user.firstName, () => {
      if (resums.file.originalname.split('.').slice(-1)[0].startsWith('xls')) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const workbook = new XLSX.Workbook().xlsx.readFile(resums.file.path);

        workbook.then((res) => {
          unlink(resums.file.path).then(() => {
            res.eachSheet((workSheet) => {
              const xlsxJson = [];
              const rows = [];
              workSheet.eachRow((row) => {
                const cells = [];
                let index = 0;
                row.eachCell((cell, i) => {
                  if (index + 1 !== i) {
                    cells.push(undefined);
                  }
                  index = i;
                  cells.push(cell.value);
                });
                rows.push(cells);
              });
              rows.slice(1).forEach((row) => {
                const json = {};
                rows[0].forEach((element, i) => {
                  const name = (element.indexOf('(') === -1 ? element : element.slice(0, element.indexOf('(')))
                    .trim()
                    .split(' ')
                    .map((n) => n.replace(n[0], n[0].toLowerCase()))
                    .join('_');
                  json[name] =
                    toString.call(row[i]).slice(8, -1) === 'Object'
                      ? `${row[i].text}`
                      : (row[i] && `${row[i]}`) || undefined;
                });
                delete json['s.No.'];

                xlsxJson.push({
                  ...json,
                  organization: `${user.organization}`,
                  createdByUserId: `${user.id || user._id}`,
                  modifiedByUserId: `${user.id || user._id}`,
                  modifiedByUserRole: `${user.role}`,
                  createdByUserRole: `${user.role}`,
                  source: 'EXCEL-IMPORT',
                });
              });

              resolve(xlsxJson);
            });
          });
        });
      } else {
        unlink(resums.file.path).then(() => {
          rej(
            new ApiError(httpStatus.BAD_REQUEST, 'Invalid file!!. Please upload an valid excel format sheet (.xls, .xlsx).')
          );
        });
      }
    });
  });

  return obs;
};

module.exports = { exportData, excelToJosn };
