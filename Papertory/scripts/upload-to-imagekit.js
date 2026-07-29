const ImageKit = require('imagekit');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');
const articlesData = require('../src/app/articles.json');

require('dotenv').config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const downloadDir = path.join(__dirname, '../.tmp/images');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(downloadDir, filename));
    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filename);
      });
    }).on('error', reject);
  });
}

const imageMap = new Map();
const uniqueImages = [];

articlesData.articles.forEach(article => {
  if (article.imageUrl && !imageMap.has(article.imageUrl)) {
    imageMap.set(article.imageUrl, null);
    uniqueImages.push(article.imageUrl);
  }
});

console.log(`🖼️  총 ${articlesData.articles.length}개 기사, ${uniqueImages.length}개 고유 이미지\n`);

async function uploadAll() {
  try {
    for (let i = 0; i < uniqueImages.length; i++) {
      const url = uniqueImages[i];
      const filename = `article-${i + 1}.jpg`;

      console.log(`[${i + 1}/${uniqueImages.length}] 다운로드: ${url}`);
      await downloadImage(url, filename);

      const fileBuffer = fs.readFileSync(path.join(downloadDir, filename));

      console.log(`[${i + 1}/${uniqueImages.length}] ImageKit 업로드 중...`);
      const uploadResponse = await imagekit.upload({
        file: fileBuffer,
        fileName: `papertory-article-${i + 1}.jpg`,
        folder: '/papertory/articles/',
        tags: ['papertory', 'article'],
      });

      imageMap.set(url, uploadResponse.url);
      console.log(`✅ 완료: ${uploadResponse.url}\n`);

      fs.unlinkSync(path.join(downloadDir, filename));
    }

    const mapping = Object.fromEntries(imageMap);
    fs.writeFileSync(
      path.join(__dirname, '../image-mapping.json'),
      JSON.stringify(mapping, null, 2)
    );

    console.log('✨ 매핑 파일 저장 완료: image-mapping.json');
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
}

uploadAll();
