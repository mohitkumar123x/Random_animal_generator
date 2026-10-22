const fs = require('fs');
const path = require('path');

const tPath = path.join(__dirname, '../src/i18n/data/translations.json');
const t = JSON.parse(fs.readFileSync(tPath, 'utf8'));

const placeholders = {
  en: 'Press <kbd class="rounded border border-hairline bg-canvas-elevated px-1.5 py-0.5 font-mono text-faint dark:border-[#333] dark:bg-[#1a1a1a]">Space</kbd> or tap the button to generate',
  ar: 'اضغط <kbd class="rounded border border-hairline bg-canvas-elevated px-1.5 py-0.5 font-mono text-faint dark:border-[#333] dark:bg-[#1a1a1a]">مسافة</kbd> أو اضغط على الزر لإنشاء',
  de: 'Drücken Sie <kbd class="rounded border border-hairline bg-canvas-elevated px-1.5 py-0.5 font-mono text-faint dark:border-[#333] dark:bg-[#1a1a1a]">Leertaste</kbd> oder tippen Sie auf die Schaltfläche zum Generieren',
  es: 'Presiona <kbd class="rounded border border-hairline bg-canvas-elevated px-1.5 py-0.5 font-mono text-faint dark:border-[#333] dark:bg-[#1a1a1a]">Espacio</kbd> o toca el botón para generar',
  fr: 'Appuyez sur <kbd class="rounded border border-hairline bg-canvas-elevated px-1.5 py-0.5 font-mono text-faint dark:border-[#333] dark:bg-[#1a1a1a]">Espace</kbd> ou appuyez sur le bouton pour générer',
  it: 'Premi <kbd class="rounded border border-hairline bg-canvas-elevated px-1.5 py-0.5 font-mono text-faint dark:border-[#333] dark:bg-[#1a1a1a]">Spazio</kbd> o tocca il pulsante per generare',
  ja: '<kbd class="rounded border border-hairline bg-canvas-elevated px-1.5 py-0.5 font-mono text-faint dark:border-[#333] dark:bg-[#1a1a1a]">スペース</kbd>キーを押すか、ボタンをタップして生成',
  ko: '<kbd class="rounded border border-hairline bg-canvas-elevated px-1.5 py-0.5 font-mono text-faint dark:border-[#333] dark:bg-[#1a1a1a]">스페이스</kbd>를 누르거나 버튼을 눌러 생성',
  pt: 'Pressione <kbd class="rounded border border-hairline bg-canvas-elevated px-1.5 py-0.5 font-mono text-faint dark:border-[#333] dark:bg-[#1a1a1a]">Espaço</kbd> ou toque no botão para gerar',
  'zh-CN': '按 <kbd class="rounded border border-hairline bg-canvas-elevated px-1.5 py-0.5 font-mono text-faint dark:border-[#333] dark:bg-[#1a1a1a]">空格键</kbd> 或点击按钮生成',
  'zh-TW': '按 <kbd class="rounded border border-hairline bg-canvas-elevated px-1.5 py-0.5 font-mono text-faint dark:border-[#333] dark:bg-[#1a1a1a]">空白鍵</kbd> 或點擊按鈕生成',
};

const fullscreens = {
  en: 'Fullscreen',
  ar: 'ملء الشاشة',
  de: 'Vollbild',
  es: 'Pantalla completa',
  fr: 'Plein écran',
  it: 'Schermo intero',
  ja: '全画面',
  ko: '전체 화면',
  pt: 'Tela cheia',
  'zh-CN': '全屏',
  'zh-TW': '全螢幕',
};

const photoBys = {
  en: 'Photo by {photographer} on Pexels',
  ar: 'الصورة بواسطة {photographer} على Pexels',
  de: 'Foto von {photographer} auf Pexels',
  es: 'Foto de {photographer} en Pexels',
  fr: 'Photo de {photographer} sur Pexels',
  it: 'Foto di {photographer} su Pexels',
  ja: 'Pexelsの{photographer}による写真',
  ko: 'Pexels의 {photographer} 사진',
  pt: 'Foto de {photographer} no Pexels',
  'zh-CN': '照片由 Pexels 上的 {photographer} 提供',
  'zh-TW': '照片由 Pexels 上的 {photographer} 提供',
};

for (const loc of Object.keys(t)) {
  if (placeholders[loc]) t[loc].placeholder = placeholders[loc];
  if (fullscreens[loc]) t[loc].fullscreen = fullscreens[loc];
  if (photoBys[loc]) t[loc].photo_by = photoBys[loc];
}

fs.writeFileSync(tPath, JSON.stringify(t, null, 2), 'utf8');
console.log('Updated translations.json successfully!');
