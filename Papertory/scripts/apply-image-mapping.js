const fs = require('fs');
const path = require('path');

// 매핑 파일 읽기
const mappingPath = path.join(__dirname, '../image-mapping.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// articles.json 읽기
const articlesPath = path.join(__dirname, '../src/app/articles.json');
const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

// imageUrl 업데이트
let updatedCount = 0;
articlesData.articles.forEach(article => {
  if (article.imageUrl && mapping[article.imageUrl]) {
    article.imageUrl = mapping[article.imageUrl];
    updatedCount++;
  }
});

// 파일 저장
fs.writeFileSync(articlesPath, JSON.stringify(articlesData, null, 2));

console.log(`✓ ${updatedCount}개 기사의 이미지 URL 업데이트 완료!`);
console.log(`📁 업데이트된 파일: src/app/articles.json`);
