import PizZip from 'pizzip';
import DocxTemplater from 'docxtemplater';

function getFileBinaryString(template) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    }
    reader.onerror = reject;
    reader.readAsBinaryString(template);
  });
}

// 无需图片
export async function generateDocxFile(template, fileData) {
  return new Promise((resolve, reject) => {
    getFileBinaryString(template)
      .then(templateData => {
        const zip = new PizZip(templateData);
        const doc = new DocxTemplater()
          .loadZip(zip)
          .render(fileData);
        const out = doc.getZip().generate({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        resolve(out);
      })
      .catch(reject);
  });
}

function convertImgToBase64(url, outputFormat) {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement(
      'CANVAS',
    );
    const ctx = canvas.getContext('2d'),
      img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL(outputFormat || 'image/png');
      canvas = null;
      resolve(dataURL);
    };
    img.onerror = function (e) {
      reject(e);
    };
    img.src = url;
  });
}

const imageOpts = {
  centered: false,
  getImage: function (tagValue, tagName) {
    return new Promise((resolve) => {
      if (typeof tagValue === 'string' && base64Regex.test(tagValue)) {
        return resolve(tagValue);
      } else {
        convertImgToBase64(tagValue).then((base64) => {
          return resolve(base64Parser(base64));
        });
      }
    });
  },
  getSize: function (img, tagValue, tagName) { // img是图片Buffer，tagValue是图片地址，tagName是图片在模板中定义的标签名
    return [150, 150]; // [宽, 高]
  }
};

// 有图片
export async function generateDocxFileWithImg(template, fileData) {
  return new Promise((resolve, reject) => {
    getFileBinaryString(template)
      .then(templateData => {
        const zip = new PizZip(templateData);
        const doc = new DocxTemplater()
          .loadZip(zip)
          .attachModule(new ImageModule(imageOpts)) // 载入模块
          .compile();
        // 异步填充数据
        doc.resolveData(fileData)
          .then(() => {
            doc.render();
            const out = doc.getZip().generate({
              type: 'blob',
              mimeType:
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });
            docxLists.push({ file: out, fileName });
            resolve();
          });
      })
      .catch(reject);
  });
}