const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const oldFolder = path.join(publicDir, '_posts');
const newFolder = path.join(publicDir, 'md-images');

// 检查 _posts 文件夹是否存在
fs.access(oldFolder, fs.constants.F_OK, (err) => {
  if (err) {
    console.error('Error: _posts folder does not exist.');
    process.exit(1);
  } else {
    // 重命名文件夹
    fs.rename(oldFolder, newFolder, (err) => {
      if (err) {
        console.error('Error renaming folder:', err);
        process.exit(1);
      } else {
        console.log('Folder renamed successfully.');
      }
    });
  }
});