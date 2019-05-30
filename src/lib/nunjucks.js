const path = require('path');
const fs = require('fs');

let nunjuckspages = [];
const directoryPath = path.join(__dirname, '../view/pages');

const templates = getTemplateFiles(directoryPath);
templates.forEach((item, index) => {
    let fileObj = {
        from: item,
        to: path.basename(item).replace('.nunjucks', '.html')
    };
    nunjuckspages.push(fileObj);
});




function getTemplateFiles(dir, allFiles = []) {
    const files = fs.readdirSync(dir).map(f => path.join(dir, f));
    allFiles.push(...files);
    files.forEach(f => {
        fs.statSync(f).isDirectory() && getTemplateFiles(f, allFiles)
    });
    return allFiles
}

module.exports = nunjuckspages;
