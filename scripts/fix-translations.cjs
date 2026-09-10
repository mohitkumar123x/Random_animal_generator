/**
 * fix-translations.cjs
 * 1. Adds missing i18n keys to translations.json
 * 2. Regenerates all locale index pages with proper translations
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TRANSLATIONS_FILE = path.join(ROOT, 'src/data/translations.json');
const PAGES_DIR = path.join(ROOT, 'src/pages');

// ─── Missing keys per locale ─────────────────────────────────────────────────
const missingKeys = {
  en: {
    generating: 'Generating...',
    shuffling: 'Shuffling through animals',
    almost_there: 'Almost there...',
    picking: 'Picking the perfect one',
    found_it: 'Found it!',
    revealing: 'Revealing your animal',
    score: 'Score',
    next: 'Next',
    close: 'Close',
    view: 'View',
    animals_label: 'Animals',
    categories_label: 'Categories',
    conservation_levels_label: 'Conservation Levels',
    free_label: 'Free',
    cons_lc: 'Least Concern',
    cons_nt: 'Near Threatened',
    cons_vu: 'Vulnerable',
    cons_en: 'Endangered',
    cons_cr: 'Critically Endangered',
    cons_ew: 'Extinct in Wild',
    cons_ex: 'Extinct',
    cons_dd: 'Data Deficient',
    quiz_eat: 'What does the {name} eat?',
    quiz_live: 'Where does the {name} live?',
    cookie_notice: 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.',
    accept: 'Accept',
  },
  es: {
    generating: 'Generando...',
    shuffling: 'Mezclando animales',
    almost_there: '¡Casi listo...',
    picking: 'Eligiendo el perfecto',
    found_it: '¡Encontrado!',
    revealing: 'Revelando tu animal',
    score: 'Puntuación',
    next: 'Siguiente',
    close: 'Cerrar',
    view: 'Ver',
    animals_label: 'Animales',
    categories_label: 'Categorías',
    conservation_levels_label: 'Niveles de Conservación',
    free_label: 'Gratis',
    cons_lc: 'Preocupación Menor',
    cons_nt: 'Casi Amenazado',
    cons_vu: 'Vulnerable',
    cons_en: 'En Peligro',
    cons_cr: 'En Peligro Crítico',
    cons_ew: 'Extinto en Estado Silvestre',
    cons_ex: 'Extinto',
    cons_dd: 'Datos Insuficientes',
    quiz_eat: '¿Qué come el {name}?',
    quiz_live: '¿Dónde vive el {name}?',
    cookie_notice: 'Usamos cookies para mejorar tu experiencia. Al continuar visitando este sitio, aceptas el uso de cookies.',
    accept: 'Aceptar',
    daily: 'Animal Destacado de Hoy',
  },
  ja: {
    generating: '生成中...',
    shuffling: '動物をシャッフル中',
    almost_there: 'もうすぐ...',
    picking: '最適な動物を選択中',
    found_it: '見つけた！',
    revealing: 'あなたの動物を公開',
    score: 'スコア',
    next: '次へ',
    close: '閉じる',
    view: '表示',
    animals_label: '動物',
    categories_label: 'カテゴリー',
    conservation_levels_label: '保全レベル',
    free_label: '無料',
    cons_lc: '低危険種',
    cons_nt: '準絶滅危惧',
    cons_vu: '危急種',
    cons_en: '絶滅危惧種',
    cons_cr: '近絶滅種',
    cons_ew: '野生絶滅',
    cons_ex: '絶滅',
    cons_dd: 'データ不足',
    quiz_eat: '{name}は何を食べますか？',
    quiz_live: '{name}はどこに住んでいますか？',
    cookie_notice: 'このサイトではCookieを使用してあなたの体験を向上させています。引き続きご利用いただくことで、Cookieの使用に同意したことになります。',
    accept: '同意する',
    daily: '今日の注目動物',
  },
  fr: {
    generating: 'Génération...',
    shuffling: 'Mélange des animaux',
    almost_there: 'Presque là...',
    picking: 'Sélection du parfait',
    found_it: 'Trouvé !',
    revealing: 'Votre animal est révélé',
    score: 'Score',
    next: 'Suivant',
    close: 'Fermer',
    view: 'Voir',
    animals_label: 'Animaux',
    categories_label: 'Catégories',
    conservation_levels_label: 'Niveaux de Conservation',
    free_label: 'Gratuit',
    cons_lc: 'Préoccupation Mineure',
    cons_nt: 'Quasi Menacé',
    cons_vu: 'Vulnérable',
    cons_en: 'En Danger',
    cons_cr: 'En Danger Critique',
    cons_ew: 'Éteint à l\'État Sauvage',
    cons_ex: 'Éteint',
    cons_dd: 'Données Insuffisantes',
    quiz_eat: 'Que mange le {name} ?',
    quiz_live: 'Où vit le {name} ?',
    cookie_notice: 'Nous utilisons des cookies pour améliorer votre expérience. En continuant à visiter ce site, vous acceptez notre utilisation des cookies.',
    accept: 'Accepter',
    daily: 'Animal Vedette du Jour',
  },
  de: {
    generating: 'Generiere...',
    shuffling: 'Tiere werden gemischt',
    almost_there: 'Fast da...',
    picking: 'Das Perfekte wird ausgewählt',
    found_it: 'Gefunden!',
    revealing: 'Ihr Tier wird enthüllt',
    score: 'Punkte',
    next: 'Weiter',
    close: 'Schließen',
    view: 'Ansehen',
    animals_label: 'Tiere',
    categories_label: 'Kategorien',
    conservation_levels_label: 'Schutzstufen',
    free_label: 'Kostenlos',
    cons_lc: 'Nicht Gefährdet',
    cons_nt: 'Vorwarnliste',
    cons_vu: 'Gefährdet',
    cons_en: 'Stark Gefährdet',
    cons_cr: 'Vom Aussterben Bedroht',
    cons_ew: 'In Freier Wildbahn Ausgestorben',
    cons_ex: 'Ausgestorben',
    cons_dd: 'Unzureichende Datenlage',
    quiz_eat: 'Was frisst der {name}?',
    quiz_live: 'Wo lebt der {name}?',
    cookie_notice: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Durch die weitere Nutzung dieser Website stimmen Sie der Verwendung von Cookies zu.',
    accept: 'Akzeptieren',
    daily: 'Heutiges Tier der Woche',
  },
  pt: {
    generating: 'Gerando...',
    shuffling: 'Embaralhando animais',
    almost_there: 'Quase lá...',
    picking: 'Escolhendo o perfeito',
    found_it: 'Encontrado!',
    revealing: 'Revelando seu animal',
    score: 'Pontuação',
    next: 'Próximo',
    close: 'Fechar',
    view: 'Ver',
    animals_label: 'Animais',
    categories_label: 'Categorias',
    conservation_levels_label: 'Níveis de Conservação',
    free_label: 'Grátis',
    cons_lc: 'Pouco Preocupante',
    cons_nt: 'Quase Ameaçado',
    cons_vu: 'Vulnerável',
    cons_en: 'Em Perigo',
    cons_cr: 'Em Perigo Crítico',
    cons_ew: 'Extinto na Natureza',
    cons_ex: 'Extinto',
    cons_dd: 'Dados Insuficientes',
    quiz_eat: 'O que o {name} come?',
    quiz_live: 'Onde vive o {name}?',
    cookie_notice: 'Usamos cookies para melhorar sua experiência. Ao continuar visitando este site, você concorda com o uso de cookies.',
    accept: 'Aceitar',
    daily: 'Animal em Destaque Hoje',
  },
  ko: {
    generating: '생성 중...',
    shuffling: '동물 섞는 중',
    almost_there: '거의 다 됐어요...',
    picking: '완벽한 것 선택 중',
    found_it: '찾았다!',
    revealing: '당신의 동물 공개 중',
    score: '점수',
    next: '다음',
    close: '닫기',
    view: '보기',
    animals_label: '동물',
    categories_label: '카테고리',
    conservation_levels_label: '보전 단계',
    free_label: '무료',
    cons_lc: '최소 관심',
    cons_nt: '준위협',
    cons_vu: '취약',
    cons_en: '위기',
    cons_cr: '위급',
    cons_ew: '야생 절멸',
    cons_ex: '절멸',
    cons_dd: '정보 부족',
    quiz_eat: '{name}은(는) 무엇을 먹나요?',
    quiz_live: '{name}은(는) 어디에 사나요?',
    cookie_notice: '이 사이트는 경험 향상을 위해 쿠키를 사용합니다. 계속 방문하시면 쿠키 사용에 동의하신 것입니다.',
    accept: '동의',
    daily: '오늘의 추천 동물',
  },
  it: {
    generating: 'Generazione...',
    shuffling: 'Mescolando animali',
    almost_there: 'Quasi lì...',
    picking: 'Scegliendo il perfetto',
    found_it: 'Trovato!',
    revealing: 'Il tuo animale è rivelato',
    score: 'Punteggio',
    next: 'Avanti',
    close: 'Chiudi',
    view: 'Vedi',
    animals_label: 'Animali',
    categories_label: 'Categorie',
    conservation_levels_label: 'Livelli di Conservazione',
    free_label: 'Gratuito',
    cons_lc: 'Minima Preoccupazione',
    cons_nt: 'Quasi Minacciato',
    cons_vu: 'Vulnerabile',
    cons_en: 'In Pericolo',
    cons_cr: 'In Pericolo Critico',
    cons_ew: 'Estinto in Natura',
    cons_ex: 'Estinto',
    cons_dd: 'Dati Insufficienti',
    quiz_eat: 'Cosa mangia il {name}?',
    quiz_live: 'Dove vive il {name}?',
    cookie_notice: 'Utilizziamo i cookie per migliorare la tua esperienza. Continuando a visitare questo sito, accetti l\'uso dei cookie.',
    accept: 'Accetta',
    daily: 'Animale in Evidenza Oggi',
  },
  'zh-CN': {
    generating: '生成中...',
    shuffling: '正在筛选动物',
    almost_there: '快好了...',
    picking: '选择最佳动物',
    found_it: '找到了！',
    revealing: '正在揭示您的动物',
    score: '分数',
    next: '下一个',
    close: '关闭',
    view: '查看',
    animals_label: '动物',
    categories_label: '类别',
    conservation_levels_label: '保护级别',
    free_label: '免费',
    cons_lc: '无危',
    cons_nt: '近危',
    cons_vu: '易危',
    cons_en: '濒危',
    cons_cr: '极危',
    cons_ew: '野外绝灭',
    cons_ex: '灭绝',
    cons_dd: '数据不足',
    quiz_eat: '{name}吃什么？',
    quiz_live: '{name}住在哪里？',
    cookie_notice: '我们使用Cookie来提升您的体验。继续访问本网站即表示您同意使用Cookie。',
    accept: '接受',
    daily: '今日特色动物',
  },
  'zh-TW': {
    generating: '生成中...',
    shuffling: '正在篩選動物',
    almost_there: '快好了...',
    picking: '選擇最佳動物',
    found_it: '找到了！',
    revealing: '正在揭示您的動物',
    score: '分數',
    next: '下一個',
    close: '關閉',
    view: '查看',
    animals_label: '動物',
    categories_label: '類別',
    conservation_levels_label: '保育級別',
    free_label: '免費',
    cons_lc: '無危',
    cons_nt: '近危',
    cons_vu: '易危',
    cons_en: '瀕危',
    cons_cr: '極危',
    cons_ew: '野外絕滅',
    cons_ex: '滅絕',
    cons_dd: '資料不足',
    quiz_eat: '{name}吃什麼？',
    quiz_live: '{name}住在哪裡？',
    cookie_notice: '我們使用Cookie來提升您的體驗。繼續訪問本網站即表示您同意使用Cookie。',
    accept: '接受',
    daily: '今日特色動物',
  },
  ar: {
    generating: 'جارٍ الإنشاء...',
    shuffling: 'جارٍ خلط الحيوانات',
    almost_there: 'اقتربنا...',
    picking: 'جارٍ اختيار الأفضل',
    found_it: 'وجدناه!',
    revealing: 'جارٍ الكشف عن حيوانك',
    score: 'النتيجة',
    next: 'التالي',
    close: 'إغلاق',
    view: 'عرض',
    animals_label: 'حيوانات',
    categories_label: 'الفئات',
    conservation_levels_label: 'مستويات الحفظ',
    free_label: 'مجاني',
    cons_lc: 'أقل اهتماماً',
    cons_nt: 'شبه مهدد',
    cons_vu: 'عرضة للخطر',
    cons_en: 'مهدد بالانقراض',
    cons_cr: 'في خطر شديد',
    cons_ew: 'منقرض في البرية',
    cons_ex: 'منقرض',
    cons_dd: 'بيانات غير كافية',
    quiz_eat: 'ماذا يأكل {name}؟',
    quiz_live: 'أين يعيش {name}؟',
    cookie_notice: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك. بالاستمرار في زيارة هذا الموقع، فإنك توافق على استخدامنا لملفات تعريف الارتباط.',
    accept: 'قبول',
    daily: 'الحيوان المميز اليوم',
  },
};

// ─── 1. Update translations.json ─────────────────────────────────────────────
const translations = JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, 'utf8'));

for (const [locale, keys] of Object.entries(missingKeys)) {
  if (!translations[locale]) translations[locale] = {};
  for (const [key, value] of Object.entries(keys)) {
    if (!translations[locale][key]) {
      translations[locale][key] = value;
    }
  }
}

fs.writeFileSync(TRANSLATIONS_FILE, JSON.stringify(translations, null, 2), 'utf8');
console.log('✅ translations.json updated');

// ─── 2. Generate locale page template ────────────────────────────────────────
function generateLocalePage(locale) {
  const importPath = locale === 'en' ? '../' : '../../';
  const canonical = locale === 'en'
    ? 'https://bestrandomanimalgenerator.com'
    : `https://bestrandomanimalgenerator.com/${locale}`;

  return `---
import Layout from '${importPath}layouts/Layout.astro';
import Navbar from '${importPath}components/Navbar.astro';
import Footer from '${importPath}components/Footer.astro';
import CategoryFilter from '${importPath}components/CategoryFilter.astro';
import ConservationFilter from '${importPath}components/ConservationFilter.astro';
import AnimalCard from '${importPath}components/AnimalCard.astro';
import animals from '${importPath}data/animals.json';
import { getTranslations } from '${importPath}utils/i18n';

const locale = '${locale}';
const t = getTranslations(locale);
---

<Layout
  title={t.title}
  description={t.description}
  canonical="${canonical}"
  locale={locale}
>
  <Navbar locale={locale} />

  <div id="gen-overlay" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-canvas/90 backdrop-blur-md dark:bg-[#0a0a0a]/90">
    <div class="flex flex-col items-center gap-6">
      <div class="relative">
        <div id="gen-ring" class="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-hairline dark:border-[#333] flex items-center justify-center">
          <div id="gen-emoji" class="text-6xl sm:text-7xl transition-transform duration-100">🐾</div>
        </div>
        <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-link animate-spin"></div>
      </div>
      <div class="text-center">
        <p id="gen-status" class="text-sm font-medium text-ink dark:text-[#ededed]">{t.generating}</p>
        <p id="gen-sub" class="text-xs text-muted mt-1">{t.shuffling}</p>
      </div>
      <div class="w-48 h-1.5 rounded-full bg-hairline dark:bg-[#333] overflow-hidden">
        <div id="gen-bar" class="h-full rounded-full bg-link transition-all duration-100" style="width: 0%"></div>
      </div>
    </div>
  </div>

  <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
    <section class="mb-10 text-center">
      <div class="mb-3 inline-flex items-center gap-1.5 rounded-full border border-hairline bg-canvas-elevated px-3 py-1 text-xs text-muted dark:border-[#333] dark:bg-[#1a1a1a] dark:text-[#888]">
        <span class="h-1.5 w-1.5 rounded-full bg-conservation-lc animate-pulse-gentle"></span>
        {animals.length}+ {t.animals_count}
      </div>
      <h1 class="text-3xl font-bold tracking-tight text-ink sm:text-4xl dark:text-[#ededed]">{t.hero_title}</h1>
      <p class="mx-auto mt-3 max-w-lg text-sm text-body sm:text-base dark:text-[#a1a1a1]" set:html={t.hero_desc} />
    </section>

    <section id="daily-section" class="mb-8 hidden">
      <div class="rounded-2xl border border-hairline bg-canvas-elevated overflow-hidden dark:border-[#333] dark:bg-[#1a1a1a]">
        <div class="flex items-center gap-2 px-4 py-2.5 border-b border-hairline dark:border-[#333] sm:px-5 sm:py-3">
          <span class="daily-badge text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">{t.daily_title}</span>
          <span class="text-xs text-muted">{t.daily_label}</span>
        </div>
        <div id="daily-card" class="p-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4 sm:p-5"></div>
      </div>
    </section>

    <div class="mb-6"><CategoryFilter /></div>
    <div class="mb-6"><ConservationFilter /></div>

    <div class="mb-6 flex flex-wrap items-center gap-3">
      <div class="flex items-center gap-2">
        <label for="count-select" class="text-xs text-muted">Show:</label>
        <select id="count-select" class="rounded-lg border border-hairline bg-canvas-elevated px-2.5 py-1.5 text-xs font-medium text-ink outline-none transition-colors focus:border-link dark:border-[#333] dark:bg-[#1a1a1a] dark:text-[#ededed] dark:focus:border-link">
          <option value="1">{t['1_animal']}</option>
          <option value="5">{t['5_animals']}</option>
          <option value="10">{t['10_animals']}</option>
          <option value="20">{t['20_animals']}</option>
        </select>
      </div>
      <button id="generate-btn" class="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95 dark:bg-[#ededed] dark:text-[#0a0a0a]"><span>🎲</span> {t.generate}</button>
      <button id="no-repeat-toggle" class="flex items-center gap-1.5 rounded-lg border border-hairline bg-canvas-elevated px-3 py-1.5 text-xs font-medium text-body transition-colors hover:bg-hairline-soft dark:border-[#333] dark:bg-[#1a1a1a] dark:text-[#a1a1a1] dark:hover:bg-[#222]"><span id="no-repeat-icon">🔁</span> {t.no_repeat}</button>
      <button id="sound-toggle" class="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline bg-canvas-elevated text-body transition-colors hover:bg-hairline-soft dark:border-[#333] dark:bg-[#1a1a1a] dark:text-[#a1a1a1] dark:hover:bg-[#222]" aria-label="Toggle sound">
        <svg id="sound-on-icon" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
        <svg id="sound-off-icon" class="h-4 w-4 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
      </button>
    </div>

    <div id="quiz-section" class="hidden mb-8">
      <div class="rounded-2xl border border-hairline bg-canvas-elevated p-6 dark:border-[#333] dark:bg-[#1a1a1a]">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-ink dark:text-[#ededed]">🧠 {t.animal_quiz}</h2>
          <div class="flex items-center gap-3">
            <span class="text-xs text-muted">{t.score}: <span id="quiz-score" class="font-bold text-ink dark:text-[#ededed]">0</span>/<span id="quiz-total" class="text-ink dark:text-[#ededed]">0</span></span>
            <button id="quiz-next" class="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 dark:bg-[#ededed] dark:text-[#0a0a0a]">{t.next} →</button>
          </div>
        </div>
        <div id="quiz-content"></div>
      </div>
    </div>

    <div id="compare-section" class="hidden mb-8">
      <div class="rounded-2xl border border-hairline bg-canvas-elevated p-6 dark:border-[#333] dark:bg-[#1a1a1a]">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-ink dark:text-[#ededed]">⚖️ {t.compare_animals}</h2>
          <button id="compare-close" class="text-xs text-muted hover:text-ink dark:hover:text-[#ededed]">✕ {t.close}</button>
        </div>
        <div id="compare-content" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
      </div>
    </div>

    <AnimalCard />
    <div id="multi-results" class="hidden mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>

    <section class="mt-16 rounded-2xl border border-hairline bg-canvas-elevated p-6 dark:border-[#333] dark:bg-[#1a1a1a]">
      <h2 class="mb-3 text-lg font-semibold text-ink dark:text-[#ededed]">{t.about_title}</h2>
      <p class="text-sm text-body leading-relaxed dark:text-[#a1a1a1]">{t.about_desc.replace('{count}', String(animals.length))}</p>
      <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div class="rounded-lg border border-hairline bg-canvas p-3 text-center dark:border-[#333] dark:bg-[#111]"><p class="text-2xl font-bold text-ink dark:text-[#ededed]">{animals.length}+</p><p class="text-xs text-muted">{t.animals_label}</p></div>
        <div class="rounded-lg border border-hairline bg-canvas p-3 text-center dark:border-[#333] dark:bg-[#111]"><p class="text-2xl font-bold text-ink dark:text-[#ededed]">8</p><p class="text-xs text-muted">{t.categories_label}</p></div>
        <div class="rounded-lg border border-hairline bg-canvas p-3 text-center dark:border-[#333] dark:bg-[#111]"><p class="text-2xl font-bold text-ink dark:text-[#ededed]">7</p><p class="text-xs text-muted">{t.conservation_levels_label}</p></div>
        <div class="rounded-lg border border-hairline bg-canvas p-3 text-center dark:border-[#333] dark:bg-[#111]"><p class="text-2xl font-bold text-ink dark:text-[#ededed]">100%</p><p class="text-xs text-muted">{t.free_label}</p></div>
      </div>
    </section>

    <section class="mt-8 rounded-2xl border border-hairline bg-canvas-elevated p-6 dark:border-[#333] dark:bg-[#1a1a1a]">
      <h2 class="mb-3 text-lg font-semibold text-ink dark:text-[#ededed]">{t.keyboard_title}</h2>
      <div class="grid gap-2 sm:grid-cols-3">
        <div class="flex items-center gap-3 rounded-lg border border-hairline bg-canvas p-3 dark:border-[#333] dark:bg-[#111]"><kbd class="flex-shrink-0 rounded border border-hairline bg-canvas-elevated px-2 py-1 font-mono text-xs text-faint dark:border-[#333] dark:bg-[#1a1a1a]">Space</kbd><span class="text-xs text-body">{t.generate_random}</span></div>
        <div class="flex items-center gap-3 rounded-lg border border-hairline bg-canvas p-3 dark:border-[#333] dark:bg-[#111]"><kbd class="flex-shrink-0 rounded border border-hairline bg-canvas-elevated px-2 py-1 font-mono text-xs text-faint dark:border-[#333] dark:bg-[#1a1a1a]">R</kbd><span class="text-xs text-body">{t.regenerate}</span></div>
        <div class="flex items-center gap-3 rounded-lg border border-hairline bg-canvas p-3 dark:border-[#333] dark:bg-[#111]"><kbd class="flex-shrink-0 rounded border border-hairline bg-canvas-elevated px-2 py-1 font-mono text-xs text-faint dark:border-[#333] dark:bg-[#1a1a1a]">M</kbd><span class="text-xs text-body">{t.toggle_sound}</span></div>
      </div>
    </section>

    <section class="mt-12 space-y-10 text-body">
      <div><h2 class="mb-4 text-xl font-bold text-ink dark:text-[#ededed]">{t.seo_h1}</h2><p class="text-sm leading-relaxed dark:text-[#a1a1a1]">{t.seo_p1}</p></div>
      <div><h2 class="mb-4 text-xl font-bold text-ink dark:text-[#ededed]">{t.seo_h2}</h2><p class="text-sm leading-relaxed dark:text-[#a1a1a1]">{t.seo_p2}</p></div>
      <div><h2 class="mb-4 text-xl font-bold text-ink dark:text-[#ededed]">{t.seo_h3}</h2><p class="text-sm leading-relaxed dark:text-[#a1a1a1]">{t.seo_p3}</p></div>
      <div><h2 class="mb-4 text-xl font-bold text-ink dark:text-[#ededed]">{t.seo_h4}</h2><p class="text-sm leading-relaxed dark:text-[#a1a1a1]">{t.seo_p4}</p></div>
    </section>

    <section class="mt-12 rounded-2xl border border-hairline bg-canvas-elevated p-6 dark:border-[#333] dark:bg-[#1a1a1a]">
      <h2 class="mb-6 text-xl font-bold text-ink dark:text-[#ededed]">{t.faq_title}</h2>
      <div class="space-y-3">
        {[{ q: t.faq_q1, a: t.faq_a1 },{ q: t.faq_q2, a: t.faq_a2 },{ q: t.faq_q3, a: t.faq_a3 },{ q: t.faq_q4, a: t.faq_a4 },{ q: t.faq_q5, a: t.faq_a5 },{ q: t.faq_q6, a: t.faq_a6 },{ q: t.faq_q7, a: t.faq_a7 }].map(({ q, a }) => (
          <details class="group rounded-xl border border-hairline bg-canvas dark:border-[#333] dark:bg-[#111]">
            <summary class="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold text-ink dark:text-[#ededed]"><span>{q}</span><svg class="h-5 w-5 flex-shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg></summary>
            <div class="border-t border-hairline px-5 pb-4 pt-3 dark:border-[#333]"><p class="text-sm leading-relaxed text-body dark:text-[#a1a1a1]">{a}</p></div>
          </details>
        ))}
      </div>
    </section>
  </main>

  <button id="mobile-generate-btn" class="sm:hidden fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-lg transition-all active:scale-90 dark:bg-[#ededed] dark:text-[#0a0a0a]" aria-label="Generate random animal"><span class="text-2xl">🎲</span></button>
  <Footer locale={locale} />
</Layout>

<script define:vars={{ animals: JSON.stringify(animals), locale, tJson: JSON.stringify(translations[locale] || translations.en) }}>
  const allAnimals = JSON.parse(animals);
  const t = JSON.parse(tJson);
  let soundEnabled = true, currentCategory = 'all', currentConservation = 'all', noRepeatMode = false;
  let seenAnimalIds = JSON.parse(localStorage.getItem('seenAnimals') || '[]');
  let compareList = [], quizState = { score: 0, total: 0, current: null };
  const audioCtx = typeof AudioContext !== 'undefined' ? new AudioContext() : null;

  function playGenerateSound() {
    if (!soundEnabled || !audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1046.5, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.2);
  }

  function getFilteredPool() {
    let pool = allAnimals;
    if (currentCategory !== 'all') pool = pool.filter(a => a.category === currentCategory);
    if (currentConservation !== 'all') pool = pool.filter(a => a.conservation === currentConservation);
    if (noRepeatMode) pool = pool.filter(a => !seenAnimalIds.includes(a.id));
    return pool;
  }

  function getRandomAnimals(count) {
    const pool = getFilteredPool();
    return [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
  }

  function showSpinner(callback) {
    const overlay = document.getElementById('gen-overlay');
    const emojiEl = document.getElementById('gen-emoji');
    const bar = document.getElementById('gen-bar');
    const statusEl = document.getElementById('gen-status');
    const subEl = document.getElementById('gen-sub');
    const ringEl = document.getElementById('gen-ring');
    const singleContainer = document.getElementById('animal-card-container');
    const multiContainer = document.getElementById('multi-results');

    overlay.classList.remove('hidden');
    singleContainer?.classList.add('hidden');
    multiContainer?.classList.add('hidden');

    const emojis = ['🐘','🦅','🐠','🦎','🐸','🦋','🐙','🦁','🐺','🦊','🐻','🐼','🦈','🐳','🐊','🐢','🦜','🐧','🦩','🦥','🐆','🦧','🦣','🦫','🦦','🦤'];
    const stages = [
      { text: t.generating, sub: t.shuffling, duration: 600 },
      { text: t.almost_there, sub: t.picking, duration: 500 },
      { text: t.found_it, sub: t.revealing, duration: 300 },
    ];

    let tick = 0, stageIdx = 0, elapsed = 0;
    const totalDuration = 1400, tickSpeed = 60;

    const tickInterval = setInterval(() => {
      tick++; elapsed += tickSpeed;
      bar.style.width = \`\${Math.min((elapsed / totalDuration) * 100, 100)}%\`;
      emojiEl.style.transform = \`scale(\${1 + Math.sin(tick * 0.5) * 0.15}) rotate(\${Math.sin(tick * 0.8) * 10}deg)\`;
      emojiEl.textContent = emojis[tick % emojis.length];
      if (stageIdx < stages.length - 1 && elapsed >= stages[stageIdx].duration) {
        stageIdx++;
        statusEl.textContent = stages[stageIdx].text;
        subEl.textContent = stages[stageIdx].sub;
        if (stageIdx === stages.length - 1) {
          ringEl.classList.add('border-conservation-lc');
          ringEl.classList.remove('border-hairline', 'dark:border-[#333]');
        }
      }
    }, tickSpeed);

    setTimeout(() => {
      clearInterval(tickInterval);
      bar.style.width = '100%';
      emojiEl.style.transform = 'scale(1.3)';
      ringEl.classList.add('border-conservation-lc');
      ringEl.classList.remove('border-hairline', 'dark:border-[#333]');
      setTimeout(() => {
        overlay.classList.add('hidden');
        ringEl.classList.remove('border-conservation-lc');
        ringEl.classList.add('border-hairline', 'dark:border-[#333]');
        bar.style.width = '0%';
        statusEl.textContent = t.generating;
        subEl.textContent = t.shuffling;
        emojiEl.style.transform = '';
        try { callback(); } catch(e) { console.error(e); }
      }, 300);
    }, totalDuration);
  }

  function generate() {
    const count = parseInt(document.getElementById('count-select')?.value || '1');
    showSpinner(() => {
      const animals = getRandomAnimals(count);
      playGenerateSound();
      if (noRepeatMode) {
        animals.forEach(a => { if (!seenAnimalIds.includes(a.id)) seenAnimalIds.push(a.id); });
        localStorage.setItem('seenAnimals', JSON.stringify(seenAnimalIds.slice(-200)));
      }
      const multiContainer = document.getElementById('multi-results');
      const singleContainer = document.getElementById('animal-card-container');
      if (count === 1) {
        singleContainer?.classList.remove('hidden');
        multiContainer?.classList.add('hidden');
        window.displayAnimal?.(animals[0]);
      } else {
        singleContainer?.classList.add('hidden');
        multiContainer?.classList.remove('hidden');
        multiContainer.innerHTML = '';
        animals.forEach((animal, i) => {
          const consLabels = {
            LC: { text: t.cons_lc, color: 'bg-conservation-lc/15 text-conservation-lc border-conservation-lc/30' },
            NT: { text: t.cons_nt, color: 'bg-conservation-nt/15 text-conservation-nt border-conservation-nt/30' },
            VU: { text: t.cons_vu, color: 'bg-conservation-vu/15 text-conservation-vu border-conservation-vu/30' },
            EN: { text: t.cons_en, color: 'bg-conservation-en/15 text-conservation-en border-conservation-en/30' },
            CR: { text: t.cons_cr, color: 'bg-conservation-cr/15 text-conservation-cr border-conservation-cr/30' },
            EW: { text: t.cons_ew, color: 'bg-conservation-ew/15 text-conservation-ew border-conservation-ew/30' },
            EX: { text: t.cons_ex, color: 'bg-conservation-ex/15 text-conservation-ex border-conservation-ex/30' },
            DD: { text: t.cons_dd, color: 'bg-muted/15 text-muted border-muted/30' },
          };
          const cons = consLabels[animal.conservation] || consLabels.LC;
          const card = document.createElement('div');
          card.className = 'rounded-2xl border border-hairline bg-canvas-elevated overflow-hidden animate-fade-in dark:border-[#333] dark:bg-[#1a1a1a]';
          card.style.animationDelay = \`\${i * 50}ms\`;
          card.innerHTML = \`
            <div class="bg-gradient-to-br from-link-soft/50 via-violet-soft/30 to-pink-soft/30 p-5 text-center dark:from-[#1a2744] dark:via-[#2a1a3a] dark:to-[#3a1a2a]">
              <div class="text-5xl mb-2 emoji-icon" style="animation-delay: \${i * 300}ms">\${animal.emoji}</div>
              <h3 class="text-base font-bold text-ink dark:text-[#ededed]">\${animal.name}</h3>
              <span class="mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium \${cons.color}">\${cons.text}</span>
            </div>
            <div class="p-4">
              <p class="text-xs text-body leading-relaxed mb-3 dark:text-[#a1a1a1]">\${animal.description}</p>
              <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                <div class="flex items-center gap-1.5 rounded-md border border-hairline bg-canvas p-2 dark:border-[#333] dark:bg-[#111]"><span>🌍</span><span class="text-faint">\${t.habitat}:</span> \${animal.habitat}</div>
                <div class="flex items-center gap-1.5 rounded-md border border-hairline bg-canvas p-2 dark:border-[#333] dark:bg-[#111]"><span>🍽️</span><span class="text-faint">\${t.diet}:</span> \${animal.diet}</div>
                <div class="flex items-center gap-1.5 rounded-md border border-hairline bg-canvas p-2 dark:border-[#333] dark:bg-[#111]"><span>⏱️</span><span class="text-faint">\${t.lifespan}:</span> \${animal.lifespan}</div>
                <div class="flex items-center gap-1.5 rounded-md border border-hairline bg-canvas p-2 dark:border-[#333] dark:bg-[#111]"><span>⚖️</span><span class="text-faint">\${t.weight}:</span> \${animal.weight}</div>
              </div>
              <div class="rounded-lg border border-link-soft bg-link-soft/30 p-2.5 dark:border-[#1e3a5f] dark:bg-[#0f1f33]">
                <p class="text-[10px] uppercase tracking-wider text-link font-medium mb-0.5 dark:text-link">💡 \${t.fun_fact}</p>
                <p class="text-xs text-body leading-relaxed dark:text-[#a1a1a1]">\${animal.funFact}</p>
              </div>
            </div>
          \`;
          multiContainer.appendChild(card);
        });
      }
    });
  }

  document.getElementById('no-repeat-toggle')?.addEventListener('click', () => {
    noRepeatMode = !noRepeatMode;
    const icon = document.getElementById('no-repeat-icon');
    const btn = document.getElementById('no-repeat-toggle');
    if (noRepeatMode) { icon.textContent = '✅'; btn.classList.add('border-link', 'text-link'); btn.classList.remove('border-hairline', 'text-body'); }
    else { icon.textContent = '🔁'; btn.classList.remove('border-link', 'text-link'); btn.classList.add('border-hairline', 'text-body'); seenAnimalIds = []; localStorage.removeItem('seenAnimals'); }
  });

  document.getElementById('compare-btn')?.addEventListener('click', () => {
    const section = document.getElementById('compare-section');
    section.classList.toggle('hidden');
    if (!section.classList.contains('hidden')) {
      const pool = allAnimals.slice(0, 20);
      const a = pool[Math.floor(Math.random() * pool.length)];
      let b = a;
      while (b === a) b = pool[Math.floor(Math.random() * pool.length)];
      compareList = [a, b];
      renderCompare();
    }
  });

  document.getElementById('compare-close')?.addEventListener('click', () => { document.getElementById('compare-section').classList.add('hidden'); });

  function renderCompare() {
    const container = document.getElementById('compare-content');
    if (!container || compareList.length < 2) return;
    container.innerHTML = compareList.map(animal => \`
      <div class="rounded-xl border border-hairline bg-canvas p-4 dark:border-[#333] dark:bg-[#111]">
        <div class="text-center mb-3">
          <div class="text-4xl emoji-icon mb-1">\${animal.emoji}</div>
          <h3 class="font-bold text-ink dark:text-[#ededed]">\${animal.name}</h3>
        </div>
        <div class="space-y-2 text-xs">
          <div class="flex justify-between"><span class="text-faint">\${t.habitat}</span><span class="font-medium text-ink dark:text-[#ededed]">\${animal.habitat}</span></div>
          <div class="flex justify-between"><span class="text-faint">\${t.diet}</span><span class="font-medium text-ink dark:text-[#ededed]">\${animal.diet}</span></div>
          <div class="flex justify-between"><span class="text-faint">\${t.lifespan}</span><span class="font-medium text-ink dark:text-[#ededed]">\${animal.lifespan}</span></div>
          <div class="flex justify-between"><span class="text-faint">\${t.weight}</span><span class="font-medium text-ink dark:text-[#ededed]">\${animal.weight}</span></div>
          <div class="flex justify-between"><span class="text-faint">\${t.speed}</span><span class="font-medium text-ink dark:text-[#ededed]">\${animal.speed}</span></div>
          <div class="flex justify-between"><span class="text-faint">\${t.length}</span><span class="font-medium text-ink dark:text-[#ededed]">\${animal.length}</span></div>
        </div>
      </div>
    \`).join('');
  }

  document.getElementById('quiz-btn')?.addEventListener('click', () => {
    const section = document.getElementById('quiz-section');
    section.classList.toggle('hidden');
    if (!section.classList.contains('hidden') && !quizState.current) { nextQuizQuestion(); }
  });

  document.getElementById('quiz-next')?.addEventListener('click', nextQuizQuestion);

  function nextQuizQuestion() {
    const pool = allAnimals;
    const correct = pool[Math.floor(Math.random() * pool.length)];
    const wrongAnswers = [];
    while (wrongAnswers.length < 3) {
      const w = pool[Math.floor(Math.random() * pool.length)];
      if (w.id !== correct.id && !wrongAnswers.find(x => x.id === w.id)) wrongAnswers.push(w);
    }
    const options = [correct, ...wrongAnswers].sort(() => Math.random() - 0.5);
    quizState.current = correct;
    const isDiet = Math.random() > 0.5;
    const question = isDiet
      ? (t.quiz_eat || 'What does the {name} eat?').replace('{name}', correct.name)
      : (t.quiz_live || 'Where does the {name} live?').replace('{name}', correct.name);
    const answerKey = isDiet ? 'diet' : 'habitat';
    const container = document.getElementById('quiz-content');
    container.innerHTML = \`
      <p class="text-sm text-body mb-1 dark:text-[#a1a1a1]">\${question}</p>
      <div class="text-center text-3xl mb-3 emoji-icon">\${correct.emoji}</div>
      <div class="grid grid-cols-2 gap-2">
        \${options.map(o => \`<button class="quiz-option rounded-lg border border-hairline bg-canvas p-3 text-xs font-medium text-body text-left dark:border-[#333] dark:bg-[#111] dark:text-[#a1a1a1]" data-value="\${o[answerKey]}" data-correct="\${o[answerKey] === correct[answerKey]}">\${o[answerKey]}</button>\`).join('')}
      </div>
    \`;
    container.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (container.querySelector('.correct, .wrong')) return;
        const isCorrect = btn.dataset.correct === 'true';
        quizState.total++; if (isCorrect) quizState.score++;
        document.getElementById('quiz-score').textContent = quizState.score;
        document.getElementById('quiz-total').textContent = quizState.total;
        btn.classList.add(isCorrect ? 'correct' : 'wrong');
        if (!isCorrect) { container.querySelector('[data-correct="true"]')?.classList.add('correct'); }
      });
    });
  }

  function getDailyAnimal() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return allAnimals[seed % allAnimals.length];
  }

  function showDailyAnimal() {
    const daily = getDailyAnimal();
    const section = document.getElementById('daily-section');
    const card = document.getElementById('daily-card');
    if (!section || !card) return;
    section.classList.remove('hidden');
    card.innerHTML = \`
      <div class="text-4xl sm:text-5xl emoji-icon shrink-0">\${daily.emoji}</div>
      <div class="flex-1 min-w-0">
        <h3 class="font-bold text-ink dark:text-[#ededed]">\${daily.name}</h3>
        <p class="text-xs text-body dark:text-[#a1a1a1] mt-1 line-clamp-2">\${daily.description}</p>
      </div>
      <button class="daily-view-btn shrink-0 rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 dark:bg-[#ededed] dark:text-[#0a0a0a] self-start sm:self-center" data-id="\${daily.id}">\${t.view} →</button>
    \`;
    card.querySelector('.daily-view-btn')?.addEventListener('click', () => {
      window.displayAnimal?.(daily);
      document.getElementById('animal-card-container')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  showDailyAnimal();
  document.getElementById('generate-btn')?.addEventListener('click', generate);
  document.getElementById('mobile-generate-btn')?.addEventListener('click', generate);

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.code === 'Space') { e.preventDefault(); generate(); }
    if (e.key === 'r' || e.key === 'R') { generate(); }
    if (e.key === 'm' || e.key === 'M') {
      soundEnabled = !soundEnabled;
      document.getElementById('sound-on-icon')?.classList.toggle('hidden', !soundEnabled);
      document.getElementById('sound-off-icon')?.classList.toggle('hidden', soundEnabled);
    }
  });

  document.getElementById('sound-toggle')?.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    document.getElementById('sound-on-icon')?.classList.toggle('hidden', !soundEnabled);
    document.getElementById('sound-off-icon')?.classList.toggle('hidden', soundEnabled);
  });

  window.addEventListener('category-change', (e) => { currentCategory = e.detail; });
  window.addEventListener('conservation-change', (e) => { currentConservation = e.detail; });

  const urlParams = new URLSearchParams(window.location.search);
  const animalParam = urlParams.get('animal');
  if (animalParam) { const found = allAnimals.find(a => a.id === animalParam); if (found) { window.displayAnimal?.(found); } }
</script>
`;
}

// ─── 3. Write locale pages ────────────────────────────────────────────────────
const locales = ['es', 'ja', 'fr', 'de', 'pt', 'ko', 'it', 'zh-CN', 'zh-TW', 'ar'];

for (const locale of locales) {
  const dir = path.join(PAGES_DIR, locale);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const content = generateLocalePage(locale);
  fs.writeFileSync(path.join(dir, 'index.astro'), content, 'utf8');
  console.log(`✅ pages/${locale}/index.astro generated`);
}

// ─── 4. Also patch the define:vars line in main index.astro ──────────────────
// The main English index.astro needs translations passed to its script too
const mainIndexPath = path.join(PAGES_DIR, 'index.astro');
let mainIndex = fs.readFileSync(mainIndexPath, 'utf8');

// Add import at top if missing
if (!mainIndex.includes("import { getTranslations }")) {
  mainIndex = mainIndex.replace(
    "import animals from '../data/animals.json';",
    "import animals from '../data/animals.json';\nimport { getTranslations } from '../utils/i18n';\n\nconst locale = 'en';\nconst t = getTranslations(locale);"
  );
}

// Fix define:vars to pass translations
if (!mainIndex.includes('tJson')) {
  mainIndex = mainIndex.replace(
    /define:vars=\{\{(\s*)animals: JSON\.stringify\(animals\)(\s*),(\s*)locale(\s*)\}\}/,
    "define:vars={{ animals: JSON.stringify(animals), locale, tJson: JSON.stringify(t) }}"
  );
  // If simple define:vars without locale
  mainIndex = mainIndex.replace(
    /define:vars=\{\{(\s*)animals: JSON\.stringify\(animals\)(\s*)\}\}/,
    "define:vars={{ animals: JSON.stringify(animals), locale: 'en', tJson: JSON.stringify(t) }}"
  );
}

// Add const t = JSON.parse(tJson) after allAnimals parse if not present
if (!mainIndex.includes('const t = JSON.parse(tJson)')) {
  mainIndex = mainIndex.replace(
    'const allAnimals = JSON.parse(animals);',
    'const allAnimals = JSON.parse(animals);\n  const t = JSON.parse(tJson);'
  );
}

// Fix hardcoded stage texts
mainIndex = mainIndex.replace(
  "{ text: 'Generating...', sub: 'Shuffling through animals', duration: 600 },",
  "{ text: t.generating, sub: t.shuffling, duration: 600 },"
);
mainIndex = mainIndex.replace(
  "{ text: 'Almost there...', sub: 'Picking the perfect one', duration: 500 },",
  "{ text: t.almost_there, sub: t.picking, duration: 500 },"
);
mainIndex = mainIndex.replace(
  "{ text: 'Found it!', sub: 'Revealing your animal', duration: 300 },",
  "{ text: t.found_it, sub: t.revealing, duration: 300 },"
);

// Fix spinner reset
mainIndex = mainIndex.replace(
  "statusEl.textContent = 'Generating...';",
  "statusEl.textContent = t.generating;"
);
mainIndex = mainIndex.replace(
  "subEl.textContent = 'Shuffling through animals';",
  "subEl.textContent = t.shuffling;"
);

// Fix conservation labels in multi-card
mainIndex = mainIndex.replace(
  "LC: { text: 'Least Concern',",
  "LC: { text: t.cons_lc,"
);
mainIndex = mainIndex.replace(
  "NT: { text: 'Near Threatened',",
  "NT: { text: t.cons_nt,"
);
mainIndex = mainIndex.replace(
  "VU: { text: 'Vulnerable',",
  "VU: { text: t.cons_vu,"
);
mainIndex = mainIndex.replace(
  "EN: { text: 'Endangered',",
  "EN: { text: t.cons_en,"
);
mainIndex = mainIndex.replace(
  "CR: { text: 'Critically Endangered',",
  "CR: { text: t.cons_cr,"
);
mainIndex = mainIndex.replace(
  "EW: { text: 'Extinct in Wild',",
  "EW: { text: t.cons_ew,"
);
mainIndex = mainIndex.replace(
  "EX: { text: 'Extinct',",
  "EX: { text: t.cons_ex,"
);
mainIndex = mainIndex.replace(
  "DD: { text: 'Data Deficient',",
  "DD: { text: t.cons_dd,"
);

// Fix card field labels
mainIndex = mainIndex.replace(/\`<span class="text-faint">Habitat:<\/span>`/g, '`<span class="text-faint">${t.habitat}:</span>`');
mainIndex = mainIndex.replace(/\`<span class="text-faint">Diet:<\/span>`/g, '`<span class="text-faint">${t.diet}:</span>`');
mainIndex = mainIndex.replace(/\`<span class="text-faint">Lifespan:<\/span>`/g, '`<span class="text-faint">${t.lifespan}:</span>`');
mainIndex = mainIndex.replace(/\`<span class="text-faint">Weight:<\/span>`/g, '`<span class="text-faint">${t.weight}:</span>`');
mainIndex = mainIndex.replace("💡 Fun Fact", '💡 ${t.fun_fact}');

// Fix compare labels
mainIndex = mainIndex.replace(
  '<span class="text-faint">Habitat</span>',
  '<span class="text-faint">${t.habitat}</span>'
);
mainIndex = mainIndex.replace(
  '<span class="text-faint">Diet</span>',
  '<span class="text-faint">${t.diet}</span>'
);
mainIndex = mainIndex.replace(
  '<span class="text-faint">Lifespan</span>',
  '<span class="text-faint">${t.lifespan}</span>'
);
mainIndex = mainIndex.replace(
  '<span class="text-faint">Weight</span>',
  '<span class="text-faint">${t.weight}</span>'
);
mainIndex = mainIndex.replace(
  '<span class="text-faint">Speed</span>',
  '<span class="text-faint">${t.speed}</span>'
);
mainIndex = mainIndex.replace(
  '<span class="text-faint">Length</span>',
  '<span class="text-faint">${t.length}</span>'
);

// Fix quiz questions
mainIndex = mainIndex.replace(
  "const question = isDiet ? `What does the ${correct.name} eat?` : `Where does the ${correct.name} live?`;",
  "const question = isDiet ? (t.quiz_eat || 'What does the {name} eat?').replace('{name}', correct.name) : (t.quiz_live || 'Where does the {name} live?').replace('{name}', correct.name);"
);

// Fix daily view button
mainIndex = mainIndex.replace(
  ">View →</button>",
  ">${t.view} →</button>"
);

fs.writeFileSync(mainIndexPath, mainIndex, 'utf8');
console.log('✅ pages/index.astro (EN) patched');
console.log('\n🎉 All done! Translation fixes applied.');
