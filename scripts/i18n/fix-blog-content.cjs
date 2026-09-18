const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'blog-content.json');
const rawContent = fs.readFileSync(filePath, 'utf8');
const lines = rawContent.split('\n');
const validLines = lines.slice(0, 4299);
const ptBlockEnd = validLines.length - 1;
validLines[ptBlockEnd] = validLines[ptBlockEnd].replace(/\s*\}$/, '  },');

const buildValidJSON = validLines.join('\n') + '\n  "_PLACEHOLDER_": true\n}';
const parsed = JSON.parse(buildValidJSON);
delete parsed._PLACEHOLDER_;

const itLocale = {
  "badge": "Hub di Conoscenze sulla Fauna Selvatica",
  "title": "Blog Generatore di Animali Casuali",
  "description": "Esplora la fauna selvatica attraverso infografiche, tabelle di dati e guide educative. Scopri la conservazione, la classificazione degli animali e l'incredibile diversità della vita sulla Terra.",
  "tocTitle": "Sommario",
  "tocItems": [
    {"text": "1. Guida Completa allo Stato di Conservazione", "anchor": "conservation-guide"},
    {"text": "2. Grafico di Classificazione del Regno Animale", "anchor": "classification-chart"},
    {"text": "3. Analisi delle Categorie Animali con Dati", "anchor": "category-breakdown"},
    {"text": "4. Distribuzione Globale degli Habitat Animali", "anchor": "habitat-map"},
    {"text": "5. Diagramma di Flusso Specie Minacciate", "anchor": "endangered-flowchart"},
    {"text": "6. Tabella dei Record Animali", "anchor": "record-holders"},
    {"text": "7. Come Funziona il Generatore di Animali Casuali", "anchor": "generator-workflow"},
    {"text": "8. Griglia di Fatti Animali Stupefacenti", "anchor": "fun-facts-grid"},
    {"text": "9. Uso dei Generatori di Animali nell'Educazione", "anchor": "education-guide"},
    {"text": "10. Cronologia degli Animali Estinti", "anchor": "extinction-timeline"}
  ],
  "conservationGuide": {
    "title": "Guida Completa allo Stato di Conservazione Animale",
    "desc": "La Lista Rossa dell'Unione Internazionale per la Conservazione della Natura (IUCN) è l'inventario più completo al mondo sullo stato di conservazione delle specie. Il nostro generatore di animali casuali include animali di tutte le categorie IUCN, aiutando gli utenti a conoscere la preservazione della fauna selvatica mentre scoprono nuove specie.",
    "headers": ["Codice Stato", "Nome Completo", "Definizione", "Animali nel DB"],
    "statuses": [
      {"code": "LC", "name": "Preoccupazione Minore", "desc": "Specie diffuse e abbondanti con popolazioni stabili", "color": "conservation-lc"},
      {"code": "NT", "name": "Prossimo alla Minaccia", "desc": "Specie che potrebbero diventare minacciate nel prossimo futuro", "color": "conservation-nt"},
      {"code": "VU", "name": "Vulnerabile", "desc": "Specie ad alto rischio di estinzione in natura", "color": "conservation-vu"},
      {"code": "EN", "name": "In Pericolo", "desc": "Specie a rischio molto alto di estinzione in natura", "color": "conservation-en"},
      {"code": "CR", "name": "Criticamente in Pericolo", "desc": "Specie a rischio estremamente alto di estinzione", "color": "conservation-cr"},
      {"code": "EW", "name": "Estinto in Natura", "desc": "Noto solo per sopravvivere in cattività o coltivazione", "color": "gray-400"},
      {"code": "EX", "name": "Estinto", "desc": "Nessun dubbio ragionevole che l'ultimo individuo sia morto", "color": "gray-500"}
    ],
    "chartTitle": "Distribuzione dello Stato di Conservazione"
  },
  "classification": {
    "title": "Grafico di Classificazione del Regno Animale",
    "desc": "Il sistema di classificazione biologica organizza tutti gli organismi viventi in una struttura gerarchica. Il nostro generatore di animali casuali utilizza questa tassonomia per classificare le specie, fornendo informazioni su classe, ordine e famiglia per ogni animale nel database.",
    "chartTitle": "Classificazione Tassonomica degli Animali",
    "levels": [
      {"type": "node", "label": "Regno", "value": "Animalia", "color": "link"},
      {"type": "node", "label": "Phylum", "value": "Chordata, Arthropoda, Mollusca, ecc.", "color": "violet"},
      {"type": "row", "label": "Classe", "items": [
        {"emoji": "🦁", "name": "Mammalia", "desc": "Mammiferi"},
        {"emoji": "🦅", "name": "Aves", "desc": "Uccelli"},
        {"emoji": "🐊", "name": "Reptilia", "desc": "Rettili"},
        {"emoji": "🐸", "name": "Amphibia", "desc": "Anfibi"},
        {"emoji": "🐟", "name": "Actinopterygii", "desc": "Pesci Ossei"},
        {"emoji": "🦈", "name": "Chondrichthyes", "desc": "Pesci Cartilaginei"},
        {"emoji": "🐙", "name": "Insecta", "desc": "Insetti"},
        {"emoji": "🐋", "name": "Mammalia", "desc": "Cetacei"}
      ]},
      {"type": "node", "label": "Ordine", "value": "Carnivora, Primates, Rodentia, ecc.", "color": "pink"},
      {"type": "node", "label": "Famiglia", "value": "Felidae, Canidae, Ursidae, ecc.", "color": "conservation-lc"},
      {"type": "node", "label": "Genere", "value": "Panthera, Canis, ecc.", "color": "conservation-nt"},
      {"type": "node", "label": "Specie", "value": "P. leo, C. lupus, ecc.", "color": "conservation-vu"}
    ]
  },
  "categories": {
    "title": "Analisi delle Categorie Animali",
    "desc": "Il nostro generatore di animali casuali copre oltre {totalAnimals} animali in {categoriesCount} categorie principali. Ogni categoria rappresenta un gruppo distinto di animali con caratteristiche, habitat e adattamenti unici. Ecco una analisi dettagliata del nostro database.",
    "label": "animali",
    "items": [
      {"key": "Mammal", "label": "Mammifero", "icon": "🦁", "desc": "Sangue caldo, peli/pelo, produzione di latte"},
      {"key": "Bird", "label": "Uccello", "icon": "🦅", "desc": "Pennuto, sangue caldo, oviparo"},
      {"key": "Fish", "label": "Pesce", "icon": "🐟", "desc": "Acquatico, branchie, sangue freddo"},
      {"key": "Reptile", "label": "Rettile", "icon": "🐊", "desc": "Squamoso, sangue freddo, oviparo"},
      {"key": "Amphibian", "label": "Anfibio", "icon": "🐸", "desc": "Pelle umida, doppia vita, sangue freddo"},
      {"key": "Insect", "label": "Insetto", "icon": "🦋", "desc": "Esoscheletro, sei zampe, ali"},
      {"key": "Marine", "label": "Marino", "icon": "🐙", "desc": "Abissale, specie diverse"},
      {"key": "Extinct", "label": "Estinto", "icon": "🦤", "desc": "Non più vivente, documenti storici"}
    ]
  },
  "habitatDistribution": {
    "title": "Distribuzione Globale degli Habitat Animali",
    "desc": "Gli animali si sono adattati a praticamente tutti gli ambienti sulla Terra. Il nostro database del generatore di animali casuali include specie di habitat diversi, ognuno con sfide e adattamenti evolutivi unici.",
    "headers": ["Tipo Habitat", "Clima", "Adattamenti Chiave", "Specie Esempio"],
    "rows": [
      {"emoji": "🌲", "type": "Foresta Tropicale", "climate": "Caldo, umido, piovoso", "adaptations": "Mimetismo, arrampicata baldacchino, colori vivaci", "species": "Tucano, Giaguaro, Rana Freccetta Velenosa"},
      {"emoji": "🏔️", "type": "Montagna", "climate": "Freddo, basso ossigeno", "adaptations": "Pelo spesso, polmoni grandi, artigli forti", "species": "Leopardo delle Nevi, Capra di Montagna, Aquila Reale"},
      {"emoji": "🌊", "type": "Oceano", "climate": "Acqua salata, pressione profonda", "adaptations": "Corpo affusolato, sonar, bioluminescenza", "species": "Balena Blu, Polpo, Squalo Bianco"},
      {"emoji": "🏜️", "type": "Deserto", "climate": "Caldo estremo, arido", "adaptations": "Conservazione acqua, scavatori, notturni", "species": "Cammello, Volpe Fennec, Diavolo Spinoso"},
      {"emoji": "🧊", "type": "Artico", "climate": "Gelido, oscurità stagionale", "adaptations": "Grasso, mimetismo bianco, letargo", "species": "Orso Polare, Volpe Artica, Gufo delle Nevi"},
      {"emoji": "🌿", "type": "Prateria", "climate": "Pioggia moderata, pianure aperte", "adaptations": "Velocità, gregge, mimetismo", "species": "Zebra, Ghepardo, Elefante Africano"},
      {"emoji": "🌿", "type": "Acqua Dolce", "climate": "Laghi, fiumi, stagni", "adaptations": "Branchie, pinne, mimetismo", "species": "Coccodrillo del Nilo, Piranha, Axolotl"}
    ]
  },
  "endangeredFlowchart": {
    "title": "Diagramma di Flusso Specie Minacciate",
    "desc": "Capire come le specie diventano minacciate coinvolge una complessa interazione di fattori. Questo diagramma illustra le principali minacce che spingono le specie verso l'estinzione e le azioni di conservazione che possono aiutare a invertire il loro declino.",
    "chartTitle": "Minacce alla Fauna Selvatica e Azioni di Conservazione",
    "rootCause": "Attività Umana",
    "threats": [
      {"emoji": "🏗️", "title": "Perdita Habitat", "desc": "Deforestazione, urbanizzazione"},
      {"emoji": "🎯", "title": "Sovrasfruttamento", "desc": "Caccia, bracconaggio, pesca"},
      {"emoji": "🌡️", "title": "Cambiamento Climatico", "desc": "Sbalzi temperatura, livello del mare"},
      {"emoji": "🦠", "title": "Inquinamento e Malattie", "desc": "Pesticidi, specie invasive"}
    ],
    "impact": {"title": "Declino della Popolazione", "desc": "Numeri ridotti, perdita diversità genetica"},
    "assessment": {"title": "Valutazione Lista Rossa IUCN", "desc": "Gli scienziati valutano il rischio di estinzione"},
    "actions": [
      {"emoji": "🏞️", "title": "Aree Protette", "desc": "Parchi nazionali, riserve"},
      {"emoji": "🔬", "title": "Ricerca e Monitoraggio", "desc": "Tracciamento, studi popolazione"},
      {"emoji": "📜", "title": "Protezione Legale", "desc": "Divieti di caccia, leggi commercio"},
      {"emoji": "🌱", "title": "Ripristino Habitat", "desc": "Riforestazione, pulizia"}
    ],
    "outcome": {"title": "Recupero Specie", "desc": "Stabilizzazione e crescita popolazione"}
  },
  "recordHolders": {
    "title": "Record Animali",
    "desc": "Il regno animale è pieno di estremi. Dall'animale terrestre più veloce alla più grande creatura mai vissuta, questi detentori di record mostrano l'incredibile diversità della vita sulla Terra.",
    "headers": ["Record", "Animale", "Misura", "Fatto Curioso"],
    "records": [
      {"emoji": "🏃", "record": "Animale Terrestre Più Veloce", "animal": "Ghepardo", "measurement": "112 km/h (70 mph)", "fact": "Può accelerare da 0 a 100 km/h in 3 secondi"},
      {"emoji": "🐋", "record": "Animale Più Grande di Sempre", "animal": "Balena Blu", "measurement": "30 m (98 ft) lunghezza", "fact": "Il cuore è grande come una piccola auto"},
      {"emoji": "🦅", "record": "Uccello Più Veloce (Immersione)", "animal": "Falco Pellegrino", "measurement": "389 km/h (242 mph)", "fact": "Piega le ali per raggiungere la velocità massima"},
      {"emoji": "🐢", "record": "Più Longevo", "animal": "Tartaruga delle Galápagos", "measurement": "175+ anni", "fact": "Jonathan, tartaruga Seychelles, ha vissuto 190 anni"},
      {"emoji": "🐧", "record": "Immersione Più Profonda", "animal": "Pinguino Imperatore", "measurement": "565 m (1.854 ft)", "fact": "Trattiene il respiro per oltre 20 minuti"},
      {"emoji": "🐘", "record": "Animale Terrestre Più Grande", "animal": "Elefante Africano", "measurement": "6.000 kg (13.200 lbs)", "fact": "Può rilevare sorgenti d'acqua a 12 miglia di distanza"},
      {"emoji": "🧠", "record": "Mammifero Più Piccolo", "animal": "Pipistrello Calabrone", "measurement": "2 g (0.07 oz)", "fact": "Entra su un pollice umano"}
    ]
  },
  "workflow": {
    "title": "Come Funziona il Generatore di Animali Casuali",
    "desc": "Il nostro generatore di animali casuali utilizza un algoritmo sofisticato per fornire selezioni eque e imparziali dal nostro database di {totalAnimals} animali. Ecco il flusso di lavoro passo passo dietro ogni generazione.",
    "chartTitle": "Diagramma Flusso Processo Generazione",
    "steps": [
      {"label": "Passo 1", "title": "Utente Clicca Genera", "desc": "Pressione pulsante, barra spaziatrice o FAB mobile", "color": "link"},
      {"label": "Passo 2", "title": "Applica Filtri", "desc": "Filtri categoria + stato conservazione", "color": "violet"},
      {"label": "Passo 3", "title": "Controllo Non Ripetere", "desc": "Rimuove animali già mostrati se abilitato", "color": "pink"},
      {"label": "Passo 4", "title": "Selezione Casuale", "desc": "Math.random() sceglie dal pool filtrato", "color": "conservation-lc"},
      {"label": "Passo 5", "title": "Animazione e Visualizzazione", "desc": "Mescolamento emoji, barra progresso, rivelazione carta", "color": "conservation-nt"},
      {"label": "Passo 6", "title": "Carta Animale Renderizzata", "desc": "Dettagli completi con emoji, statistiche, fatti", "color": "conservation-vu"}
    ]
  },
  "funFacts": {
    "title": "Fatti Animali Stupefacenti",
    "desc": "Il nostro generatore di animali casuali è ricco di fatti affascinanti su ogni specie. Ecco alcuni dei fatti più sorprendenti dal nostro database di {totalAnimals} animali.",
    "items": [
      {"emoji": "🐙", "title": "Tre Cuori", "text": "I polpi hanno tre cuori. Due pompano sangue alle branchie, mentre il terzo pompa sangue al resto del corpo."},
      {"emoji": "🐘", "title": "Non Possono Saltare", "text": "Gli elefanti sono gli unici mammiferi che non possono saltare. Le loro zampe sono progettate per supportare il peso, non per saltare."},
      {"emoji": "🦩", "title": "Fiammeggiante", "text": "Un gruppo di fenicotteri si chiama collettivamente fiammeggiante. Ottengono il colore rosa mangiando gamberetti e alghe."},
      {"emoji": "🦈", "title": "Più Antichi degli Alberi", "text": "Gli squali esistono da oltre 400 milioni di anni, cioè 200 milioni di anni prima che gli alberi apparissero sulla Terra."},
      {"emoji": "🐊", "title": "Lacrime", "text": "I coccodrilli sembrano piangere mentre mangiano, ma in realtà sono lacrime lubrificanti prodotte da ghiandole vicino ai loro occhi."},
      {"emoji": "🐳", "title": "Cuore Blu", "text": "Il cuore di una balena blu pesa circa 180 kg e batte circa una volta ogni 10 secondi."},
      {"emoji": "🦔", "title": "Immuni al Veleno", "text": "I ricci sono immuni a molti veleni, incluso il veleno della vipera. Possono anche mangiare serpenti velenosi."},
      {"emoji": "🐦", "title": "Senza Denti", "text": "Gli uccelli non hanno denti. Invece, ingoiano pietre che macinano il cibo nel loro gozzo, fungendo da sostituto."},
      {"emoji": "🐢", "title": "Respirazione", "text": "Le tartarughe possono respirare attraverso la parte posteriore. Questo adattamento le aiuta a sopravvivere durante lunghi letarghi sott'acqua."}
    ]
  },
  "education": {
    "title": "Uso dei Generatori di Animali nell'Educazione",
    "desc": "I generatori di animali casuali sono diventati potenti strumenti educativi per insegnanti, genitori e studenti. Rendono l'apprendimento sulla fauna selvatica interattivo e coinvolgente coprendo concetti chiave di biologia.",
    "headers": ["Attività", "Materia", "Fascia Età", "Risultato Apprendimento"],
    "rows": [
      {"activity": "Carta Animale Giornaliera", "subject": "Biologia, Geografia", "age": "6-12 anni", "outcome": "Identificazione animali, consapevolezza habitat"},
      {"activity": "Sfida di Disegno", "subject": "Arte, Biologia", "age": "8-16 anni", "outcome": "Capacità osservazione, comprensione anatomia"},
      {"activity": "Dibattito Conservazione", "subject": "Scienze Ambientali", "age": "12-18 anni", "outcome": "Pensiero critico, consapevolezza ambientale"},
      {"activity": "Scrittura Creativa", "subject": "Arti Linguistiche", "age": "Tutte le età", "outcome": "Narrazione, costruzione vocabolario"},
      {"activity": "Gioco Quiz Animali", "subject": "Biologia, Cultura Generale", "age": "Tutte le età", "outcome": "Memoria, richiamo, apprendimento divertente"}
    ]
  },
  "timeline": {
    "title": "Cronologia Animali Estinti",
    "desc": "L'estinzione è una parte naturale dell'evoluzione, ma l'attività umana ha accelerato il processo drasticamente. Il nostro generatore di animali casuali include {extinctCount} specie estinte per aiutare a educare gli utenti sull'importanza della conservazione.",
    "items": [
      {"year": "1681", "animal": "🦤 Dodo", "event": "Ultimo dodo ucciso a Mauritius per caccia e specie invasive"},
      {"year": "1768", "animal": "🐦 Vacca Marina di Steller", "event": "Cacciata fino all'estinzione entro 27 anni dalla sua scoperta"},
      {"year": "1883", "animal": "🦓 Quagga", "event": "Ultima quagga morta allo Zoo di Amsterdam; rimangono solo 1.000 ossa"},
      {"year": "1914", "animal": "🕊️ Colomba Viaggiatrice", "event": "Martha, l'ultima colomba viaggiatrice, morta allo Zoo di Cincinnati"},
      {"year": "1936", "animal": "🐯 Tigre della Tasmania", "event": "Ultimo tilacino morto allo Zoo di Hobart; estinto da quasi un secolo"},
      {"year": "2011", "animal": "🦏 Rinoceronte Nero Occidentale", "event": "Dichiarato estinto; ultimo avvistato in Camerun nel 2006"}
    ]
  },
  "cta": {
    "title": "Inizia a Scoprire Animali",
    "desc": "Genera animali casuali con immagini, fatti divertenti e stato di conservazione. Gratuito e istantaneo.",
    "btn": "🎲 Prova il Generatore di Animali Casuali"
  },
  "stats": {
    "animals": "Animali",
    "categories": "Categorie",
    "conservationLevels": "Livelli di Conservazione",
    "free": "Gratis"
  }
};

const zhCNLocale = {
  "badge": "野生动物知识中心",
  "title": "随机动物生成器博客",
  "description": "通过信息图表、数据表和教育指南探索野生动物。了解动物保护、动物分类以及地球上令人惊叹的生命多样性。",
  "tocTitle": "目录",
  "tocItems": [
    {"text": "1. 动物保护状态完整指南", "anchor": "conservation-guide"},
    {"text": "2. 动物界分类图表", "anchor": "classification-chart"},
    {"text": "3. 动物类别数据明细", "anchor": "category-breakdown"},
    {"text": "4. 全球动物栖息地分布", "anchor": "habitat-map"},
    {"text": "5. 濒危物种决策流程图", "anchor": "endangered-flowchart"},
    {"text": "6. 动物纪录保持者表", "anchor": "record-holders"},
    {"text": "7. 随机动物生成器工作原理", "anchor": "generator-workflow"},
    {"text": "8. 令人惊叹的动物趣闻网格", "anchor": "fun-facts-grid"},
    {"text": "9. 在教育中使用随机动物生成器", "anchor": "education-guide"},
    {"text": "10. 已灭绝动物时间线", "anchor": "extinction-timeline"}
  ],
  "conservationGuide": {
    "title": "动物保护状态完整指南",
    "desc": "国际自然保护联盟（IUCN）红色名录是世界上关于物种保护状态最全面的目录。我们的随机动物生成器包含所有IUCN类别的动物，帮助用户在发现新物种的同时了解野生动物保护知识。",
    "headers": ["状态代码", "完整名称", "定义", "数据库内动物"],
    "statuses": [
      {"code": "LC", "name": "无危", "desc": "分布广泛且数量丰富、种群稳定的物种", "color": "conservation-lc"},
      {"code": "NT", "name": "近危", "desc": "在不久的将来可能成为受威胁的物种", "color": "conservation-nt"},
      {"code": "VU", "name": "易危", "desc": "面临野外灭绝高风险的物种", "color": "conservation-vu"},
      {"code": "EN", "name": "濒危", "desc": "面临野外灭绝极高风险的物种", "color": "conservation-en"},
      {"code": "CR", "name": "极危", "desc": "面临野外灭绝极高风险的物种", "color": "conservation-cr"},
      {"code": "EW", "name": "野外灭绝", "desc": "已知仅在圈养或栽培条件下存活", "color": "gray-400"},
      {"code": "EX", "name": "灭绝", "desc": "毫无疑问最后一个个体已死亡", "color": "gray-500"}
    ],
    "chartTitle": "保护状态分布"
  },
  "classification": {
    "title": "动物界分类图表",
    "desc": "生物分类系统将所有生物组织成层次结构。我们的随机动物生成器使用此分类法对物种进行分类，为数据库中的每种动物提供纲、目和科的信息。",
    "chartTitle": "动物分类学分类",
    "levels": [
      {"type": "node", "label": "界", "value": "动物界", "color": "link"},
      {"type": "node", "label": "门", "value": "脊索动物门、节肢动物门、软体动物门等", "color": "violet"},
      {"type": "row", "label": "纲", "items": [
        {"emoji": "🦁", "name": "哺乳纲", "desc": "哺乳动物"},
        {"emoji": "🦅", "name": "鸟纲", "desc": "鸟类"},
        {"emoji": "🐊", "name": "爬行纲", "desc": "爬行动物"},
        {"emoji": "🐸", "name": "两栖纲", "desc": "两栖动物"},
        {"emoji": "🐟", "name": "辐鳍鱼纲", "desc": "硬骨鱼"},
        {"emoji": "🦈", "name": "软骨鱼纲", "desc": "软骨鱼"},
        {"emoji": "🐙", "name": "昆虫纲", "desc": "昆虫"},
        {"emoji": "🐋", "name": "哺乳纲", "desc": "鲸目动物"}
      ]},
      {"type": "node", "label": "目", "value": "食肉目、灵长目、啮齿目等", "color": "pink"},
      {"type": "node", "label": "科", "value": "猫科、犬科、熊科等", "color": "conservation-lc"},
      {"type": "node", "label": "属", "value": "豹属、犬属等", "color": "conservation-nt"},
      {"type": "node", "label": "种", "value": "狮、灰狼等", "color": "conservation-vu"}
    ]
  },
  "categories": {
    "title": "动物类别明细",
    "desc": "我们的随机动物生成器涵盖{totalAnimals}多种动物，分为{categoriesCount}个主要类别。每个类别代表具有独特特征、栖息地和适应性的不同动物群。以下是我们数据库的详细分类。",
    "label": "只动物",
    "items": [
      {"key": "Mammal", "label": "哺乳动物", "icon": "🦁", "desc": "温血、有毛发、产奶"},
      {"key": "Bird", "label": "鸟类", "icon": "🦅", "desc": "有羽毛、温血、卵生"},
      {"key": "Fish", "label": "鱼类", "icon": "🐟", "desc": "水生、有鳃、冷血"},
      {"key": "Reptile", "label": "爬行动物", "icon": "🐊", "desc": "有鳞片、冷血、卵生"},
      {"key": "Amphibian", "label": "两栖动物", "icon": "🐸", "desc": "皮肤湿润、双重生活、冷血"},
      {"key": "Insect", "label": "昆虫", "icon": "🦋", "desc": "外骨骼、六条腿、有翅膀"},
      {"key": "Marine", "label": "海洋动物", "icon": "🐙", "desc": "栖息海洋、物种多样"},
      {"key": "Extinct", "label": "已灭绝", "icon": "🦤", "desc": "已不复存在、有历史记录"}
    ]
  },
  "habitatDistribution": {
    "title": "全球动物栖息地分布",
    "desc": "动物已经适应了地球上几乎所有的环境。我们的随机动物生成器数据库包含来自不同栖息地的物种，每个栖息地都呈现出独特的挑战和进化适应。",
    "headers": ["栖息地类型", "气候", "主要适应特征", "示例物种"],
    "rows": [
      {"emoji": "🌲", "type": "热带雨林", "climate": "炎热、潮湿、多雨", "adaptations": "伪装、树冠攀爬、色彩鲜艳", "species": "巨嘴鸟、美洲豹、箭毒蛙"},
      {"emoji": "🏔️", "type": "山脉", "climate": "寒冷、低氧", "adaptations": "厚毛皮、大肺活量、强壮爪子", "species": "雪豹、山羊、金雕"},
      {"emoji": "🌊", "type": "海洋", "climate": "咸水、深压力", "adaptations": "流线型身体、声纳、生物发光", "species": "蓝鲸、章鱼、大白鲨"},
      {"emoji": "🏜️", "type": "沙漠", "climate": "极端高温、干旱", "adaptations": "节水、穴居、夜行", "species": "骆驼、耳廓狐、魔蜥"},
      {"emoji": "🧊", "type": "北极", "climate": "极寒、季节性黑暗", "adaptations": "鲸脂、白色伪装、冬眠", "species": "北极熊、北极狐、雪鸮"},
      {"emoji": "🌿", "type": "草原", "climate": "雨量适中、开阔平原", "adaptations": "速度、群居、伪装", "species": "斑马、猎豹、非洲象"},
      {"emoji": "🌿", "type": "淡水", "climate": "湖泊、河流、池塘", "adaptations": "鳃、鳍、伪装", "species": "尼罗鳄、食人鱼、美西螈"}
    ]
  },
  "endangeredFlowchart": {
    "title": "濒危物种决策流程图",
    "desc": "了解物种如何成为濒危物种涉及多种因素的复杂相互作用。此流程图说明了将物种推向灭绝的主要威胁以及有助于扭转其衰退的保护行动。",
    "chartTitle": "野生动物威胁与保护行动",
    "rootCause": "人类活动",
    "threats": [
      {"emoji": "🏗️", "title": "栖息地丧失", "desc": "森林砍伐、城市化"},
      {"emoji": "🎯", "title": "过度开发", "desc": "狩猎、偷猎、捕鱼"},
      {"emoji": "🌡️", "title": "气候变化", "desc": "温度变化、海平面上升"},
      {"emoji": "🦠", "title": "污染与疾病", "desc": "农药、入侵物种"}
    ],
    "impact": {"title": "种群下降", "desc": "数量减少、遗传多样性丧失"},
    "assessment": {"title": "IUCN红色名录评估", "desc": "科学家评估灭绝风险"},
    "actions": [
      {"emoji": "🏞️", "title": "保护区", "desc": "国家公园、自然保护区"},
      {"emoji": "🔬", "title": "研究与监测", "desc": "追踪、种群研究"},
      {"emoji": "📜", "title": "法律保护", "desc": "狩猎禁令、贸易法"},
      {"emoji": "🌱", "title": "栖息地恢复", "desc": "重新造林、清理"}
    ],
    "outcome": {"title": "物种恢复", "desc": "种群稳定与增长"}
  },
  "recordHolders": {
    "title": "动物纪录保持者",
    "desc": "动物界充满了极端记录。从最快的陆地动物到有史以来最大的生物，这些纪录保持者展示了地球上令人难以置信的生命多样性。",
    "headers": ["纪录", "动物", "测量数据", "趣闻"],
    "records": [
      {"emoji": "🏃", "record": "最快陆地动物", "animal": "猎豹", "measurement": "112公里/小时 (70英里/小时)", "fact": "可在3秒内从0加速到100公里/小时"},
      {"emoji": "🐋", "record": "有史以来最大动物", "animal": "蓝鲸", "measurement": "30米 (98英尺) 长", "fact": "心脏大小相当于一辆小汽车"},
      {"emoji": "🦅", "record": "最快鸟类 (俯冲)", "animal": "游隼", "measurement": "389公里/小时 (242英里/小时)", "fact": "折叠翅膀以达到最大速度"},
      {"emoji": "🐢", "record": "最长寿", "animal": "加拉帕戈斯象龟", "measurement": "175+年", "fact": "一只名叫乔纳森的塞舌尔龟活了190岁"},
      {"emoji": "🐧", "record": "最深潜水", "animal": "帝企鹅", "measurement": "565米 (1,854英尺)", "fact": "可屏住呼吸超过20分钟"},
      {"emoji": "🐘", "record": "最大陆地动物", "animal": "非洲象", "measurement": "6,000公斤 (13,200磅)", "fact": "可探测到12英里外的水源"},
      {"emoji": "🧠", "record": "最小哺乳动物", "animal": "大黄蜂蝙蝠", "measurement": "2克 (0.07盎司)", "fact": "可放在人类拇指指甲上"}
    ]
  },
  "workflow": {
    "title": "随机动物生成器工作原理",
    "desc": "我们的随机动物生成器使用先进的算法从{totalAnimals}只动物的数据库中提供公平、无偏见的选择。以下是每次生成背后的分步工作流程。",
    "chartTitle": "生成过程流程图",
    "steps": [
      {"label": "步骤1", "title": "用户点击生成", "desc": "按钮点击、空格键或移动端浮动按钮", "color": "link"},
      {"label": "步骤2", "title": "应用筛选条件", "desc": "类别 + 保护状态筛选", "color": "violet"},
      {"label": "步骤3", "title": "不重复检查", "desc": "如启用，移除先前显示的动物", "color": "pink"},
      {"label": "步骤4", "title": "随机选择", "desc": "Math.random()从筛选池中选择", "color": "conservation-lc"},
      {"label": "步骤5", "title": "动画与显示", "desc": "表情动画、进度条、卡片展示", "color": "conservation-nt"},
      {"label": "步骤6", "title": "动物卡片渲染完成", "desc": "完整详细信息含表情、统计数据、趣闻", "color": "conservation-vu"}
    ]
  },
  "funFacts": {
    "title": "令人惊叹的动物趣闻",
    "desc": "我们的随机动物生成器充满了关于每个物种的迷人事实。以下是我们{totalAnimals}只动物数据库中一些最令人惊讶的事实。",
    "items": [
      {"emoji": "🐙", "title": "三颗心脏", "text": "章鱼有三颗心脏。两颗将血液泵送到鳃，而第三颗将血液泵送到身体其他部位。"},
      {"emoji": "🐘", "title": "不会跳跃", "text": "大象是唯一不会跳跃的哺乳动物。它们的腿是为支撑体重而设计的，不适合跳跃。"},
      {"emoji": "🦩", "title": "华丽群", "text": "一群火烈鸟被统称为华丽群。它们吃虾和藻类获得粉红色。"},
      {"emoji": "🦈", "title": "比树古老", "text": "鲨鱼已经存在了4亿多年——比地球上树木出现还早2亿年。"},
      {"emoji": "🐊", "title": "鳄鱼的眼泪", "text": "鳄鱼进食时看起来像在哭泣，但这些实际上是眼睛附近腺体产生的润滑泪液。"},
      {"emoji": "🐳", "title": "蓝色心脏", "text": "蓝鲸的心脏重约400磅（180公斤），大约每10秒跳动一次。"},
      {"emoji": "🦔", "title": "对毒液免疫", "text": "刺猬对许多毒液免疫，包括蝰蛇毒液。它们甚至可以吃毒蛇。"},
      {"emoji": "🐦", "title": "没有牙齿", "text": "鸟类没有牙齿。相反，它们吞下石头在砂囊中研磨食物，起到牙齿的替代作用。"},
      {"emoji": "🐢", "title": "泄殖腔呼吸", "text": "乌龟可以通过臀部呼吸。这种适应帮助它们在水下长时间冬眠期间生存。"}
    ]
  },
  "education": {
    "title": "在教育中使用随机动物生成器",
    "desc": "随机动物生成器已成为教师、家长和学生的强大教育工具。它们使关于野生动物的学习互动且引人入胜，同时涵盖关键生物学概念。",
    "headers": ["活动", "科目", "年龄组", "学习成果"],
    "rows": [
      {"activity": "每日动物卡片", "subject": "生物学、地理", "age": "6-12岁", "outcome": "动物识别、栖息地意识"},
      {"activity": "绘画挑战", "subject": "美术、生物学", "age": "8-16岁", "outcome": "观察能力、解剖学理解"},
      {"activity": "保护辩论", "subject": "环境科学", "age": "12-18岁", "outcome": "批判性思维、环境意识"},
      {"activity": "创意写作", "subject": "语文", "age": "所有年龄", "outcome": "讲故事、词汇构建"},
      {"activity": "动物问答游戏", "subject": "生物学、常识", "age": "所有年龄", "outcome": "记忆、回忆、趣味学习"}
    ]
  },
  "timeline": {
    "title": "已灭绝动物时间线",
    "desc": "灭绝是进化的自然组成部分，但人类活动大大加速了这一进程。我们的随机动物生成器包含{extinctCount}种已灭绝物种，帮助教育用户了解保护的重要性。",
    "items": [
      {"year": "1681", "animal": "🦤 渡渡鸟", "event": "由于狩猎和入侵物种，最后一只渡渡鸟在毛里求斯被杀"},
      {"year": "1768", "animal": "🐦 斯特拉大海牛", "event": "在被发现后27年内被猎杀至灭绝"},
      {"year": "1883", "animal": "🦓 斑驴", "event": "最后一只斑驴死于阿姆斯特丹动物园；仅存1000块骨头"},
      {"year": "1914", "animal": "🕊️ 旅鸽", "event": "最后一只旅鸽玛莎死于辛辛那提动物园"},
      {"year": "1936", "animal": "🐯 袋狼", "event": "最后一只袋狼死于霍巴特动物园；现已灭绝近一个世纪"},
      {"year": "2011", "animal": "🦏 西部黑犀牛", "event": "宣布灭绝；2006年在喀麦隆最后一次被发现"}
    ]
  },
  "cta": {
    "title": "开始探索动物",
    "desc": "生成带有图片、趣闻和保护状态的随机动物。免费即时使用。",
    "btn": "🎲 试用随机动物生成器"
  },
  "stats": {
    "animals": "只动物",
    "categories": "个类别",
    "conservationLevels": "个保护等级",
    "free": "免费"
  }
};

const zhTWLocale = {
  "badge": "野生動物知識中心",
  "title": "隨機動物產生器部落格",
  "description": "透過資訊圖表、資料表和教育指南探索野生動物。了解動物保育、動物分類以及地球上令人驚嘆的生命多樣性。",
  "tocTitle": "目錄",
  "tocItems": [
    {"text": "1. 動物保育狀態完整指南", "anchor": "conservation-guide"},
    {"text": "2. 動物界分類圖表", "anchor": "classification-chart"},
    {"text": "3. 動物類別資料明細", "anchor": "category-breakdown"},
    {"text": "4. 全球動物棲息地分佈", "anchor": "habitat-map"},
    {"text": "5. 瀕危物種決策流程圖", "anchor": "endangered-flowchart"},
    {"text": "6. 動物紀錄保持者表", "anchor": "record-holders"},
    {"text": "7. 隨機動物產生器工作原理", "anchor": "generator-workflow"},
    {"text": "8. 令人驚嘆的動物趣聞網格", "anchor": "fun-facts-grid"},
    {"text": "9. 在教育中使用隨機動物產生器", "anchor": "education-guide"},
    {"text": "10. 已滅絕動物時間軸", "anchor": "extinction-timeline"}
  ],
  "conservationGuide": {
    "title": "動物保育狀態完整指南",
    "desc": "國際自然保護聯盟（IUCN）紅色名錄是世界上關於物種保育狀態最全面的目錄。我們的隨機動物產生器包含所有IUCN類別的動物，幫助使用者在發現新物種的同時了解野生動物保育知識。",
    "headers": ["狀態代碼", "完整名稱", "定義", "資料庫內動物"],
    "statuses": [
      {"code": "LC", "name": "無危", "desc": "分佈廣泛且數量豐富、族群穩定的物種", "color": "conservation-lc"},
      {"code": "NT", "name": "近危", "desc": "在不久的將來可能成為受威脅的物種", "color": "conservation-nt"},
      {"code": "VU", "name": "易危", "desc": "面臨野外滅絕高風險的物種", "color": "conservation-vu"},
      {"code": "EN", "name": "瀕危", "desc": "面臨野外滅絕極高風險的物種", "color": "conservation-en"},
      {"code": "CR", "name": "極危", "desc": "面臨野外滅絕極高風險的物種", "color": "conservation-cr"},
      {"code": "EW", "name": "野外滅絕", "desc": "已知僅在圈養或栽培條件下存活", "color": "gray-400"},
      {"code": "EX", "name": "滅絕", "desc": "毫無疑問最後一個個體已死亡", "color": "gray-500"}
    ],
    "chartTitle": "保育狀態分佈"
  },
  "classification": {
    "title": "動物界分類圖表",
    "desc": "生物分類系統將所有生物組織成層次結構。我們的隨機動物產生器使用此分類法對物種進行分類，為資料庫中的每種動物提供綱、目和科的資訊。",
    "chartTitle": "動物分類學分類",
    "levels": [
      {"type": "node", "label": "界", "value": "動物界", "color": "link"},
      {"type": "node", "label": "門", "value": "脊索動物門、節肢動物門、軟體動物門等", "color": "violet"},
      {"type": "row", "label": "綱", "items": [
        {"emoji": "🦁", "name": "哺乳綱", "desc": "哺乳動物"},
        {"emoji": "🦅", "name": "鳥綱", "desc": "鳥類"},
        {"emoji": "🐊", "name": "爬蟲綱", "desc": "爬蟲類"},
        {"emoji": "🐸", "name": "兩棲綱", "desc": "兩棲類"},
        {"emoji": "🐟", "name": "輻鰭魚綱", "desc": "硬骨魚"},
        {"emoji": "🦈", "name": "軟骨魚綱", "desc": "軟骨魚"},
        {"emoji": "🐙", "name": "昆蟲綱", "desc": "昆蟲"},
        {"emoji": "🐋", "name": "哺乳綱", "desc": "鯨目動物"}
      ]},
      {"type": "node", "label": "目", "value": "食肉目、靈長目、嚙齒目等", "color": "pink"},
      {"type": "node", "label": "科", "value": "貓科、犬科、熊科等", "color": "conservation-lc"},
      {"type": "node", "label": "屬", "value": "豹屬、犬屬等", "color": "conservation-nt"},
      {"type": "node", "label": "種", "value": "獅、灰狼等", "color": "conservation-vu"}
    ]
  },
  "categories": {
    "title": "動物類別明細",
    "desc": "我們的隨機動物產生器涵蓋{totalAnimals}多種動物，分為{categoriesCount}個主要類別。每個類別代表具有獨特特徵、栖息地和適應性的不同動物群。以下是我們資料庫的詳細分類。",
    "label": "隻動物",
    "items": [
      {"key": "Mammal", "label": "哺乳動物", "icon": "🦁", "desc": "溫血、有毛髮、產奶"},
      {"key": "Bird", "label": "鳥類", "icon": "🦅", "desc": "有羽毛、溫血、卵生"},
      {"key": "Fish", "label": "魚類", "icon": "🐟", "desc": "水生、有鰓、冷血"},
      {"key": "Reptile", "label": "爬蟲類", "icon": "🐊", "desc": "有鱗片、冷血、卵生"},
      {"key": "Amphibian", "label": "兩棲類", "icon": "🐸", "desc": "皮膚濕潤、雙重生活、冷血"},
      {"key": "Insect", "label": "昆蟲", "icon": "🦋", "desc": "外骨骼、六條腿、有翅膀"},
      {"key": "Marine", "label": "海洋動物", "icon": "🐙", "desc": "棲息海洋、物種多樣"},
      {"key": "Extinct", "label": "已滅絕", "icon": "🦤", "desc": "已不復存在、有歷史記錄"}
    ]
  },
  "habitatDistribution": {
    "title": "全球動物棲息地分佈",
    "desc": "動物已經適應了地球上幾乎所有的環境。我們的隨機動物產生器資料庫包含來自不同栖息地的物種，每個栖息地都呈現出獨特的挑戰和進化適應。",
    "headers": ["栖息地類型", "氣候", "主要適應特徵", "範例物種"],
    "rows": [
      {"emoji": "🌲", "type": "熱帶雨林", "climate": "炎熱、潮濕、多雨", "adaptations": "偽裝、樹冠攀爬、色彩鮮豔", "species": "巨嘴鳥、美洲豹、箭毒蛙"},
      {"emoji": "🏔️", "type": "山脈", "climate": "寒冷、低氧", "adaptations": "厚毛皮、大肺活量、強壯爪子", "species": "雪豹、山羊、金雕"},
      {"emoji": "🌊", "type": "海洋", "climate": "鹹水、深壓力", "adaptations": "流線型身體、聲納、生物發光", "species": "藍鯨、章魚、大白鯊"},
      {"emoji": "🏜️", "type": "沙漠", "climate": "極端高溫、乾旱", "adaptations": "節水、穴居、夜行", "species": "駱駝、耳廓狐、魔蜥"},
      {"emoji": "🧊", "type": "北極", "climate": "極寒、季節性黑暗", "adaptations": "鯨脂、白色偽裝、冬眠", "species": "北極熊、北極狐、雪鴞"},
      {"emoji": "🌿", "type": "草原", "climate": "雨量適中、開闊平原", "adaptations": "速度、群居、偽裝", "species": "斑馬、獵豹、非洲象"},
      {"emoji": "🌿", "type": "淡水", "climate": "湖泊、河流、池塘", "adaptations": "鰓、鰭、偽裝", "species": "尼羅鱷、食人魚、美西螈"}
    ]
  },
  "endangeredFlowchart": {
    "title": "瀕危物種決策流程圖",
    "desc": "了解物種如何成為瀕危物種涉及多種因素的複雜相互作用。此流程圖說明了將物種推向滅絕的主要威脅以及有助於扭轉其衰退的保育行動。",
    "chartTitle": "野生動物威脅與保育行動",
    "rootCause": "人類活動",
    "threats": [
      {"emoji": "🏗️", "title": "栖息地喪失", "desc": "森林砍伐、城市化"},
      {"emoji": "🎯", "title": "過度開發", "desc": "狩獵、偷獵、捕魚"},
      {"emoji": "🌡️", "title": "氣候變化", "desc": "溫度變化、海平面上升"},
      {"emoji": "🦠", "title": "污染與疾病", "desc": "農藥、入侵物種"}
    ],
    "impact": {"title": "族群下降", "desc": "數量減少、遺傳多樣性喪失"},
    "assessment": {"title": "IUCN紅色名錄評估", "desc": "科學家評估滅絕風險"},
    "actions": [
      {"emoji": "🏞️", "title": "保護區", "desc": "國家公園、自然保護區"},
      {"emoji": "🔬", "title": "研究與監測", "desc": "追蹤、族群研究"},
      {"emoji": "📜", "title": "法律保護", "desc": "狩獵禁令、貿易法"},
      {"emoji": "🌱", "title": "栖息地恢復", "desc": "重新造林、清理"}
    ],
    "outcome": {"title": "物種恢復", "desc": "族群穩定與增長"}
  },
  "recordHolders": {
    "title": "動物紀錄保持者",
    "desc": "動物界充滿了極端記錄。從最快的陸地動物到有史以來最大的生物，這些紀錄保持者展示了地球上令人難以置信的生命多樣性。",
    "headers": ["紀錄", "動物", "測量數據", "趣聞"],
    "records": [
      {"emoji": "🏃", "record": "最快陸地動物", "animal": "獵豹", "measurement": "112公里/小時 (70英里/小時)", "fact": "可在3秒內從0加速到100公里/小時"},
      {"emoji": "🐋", "record": "有史以來最大動物", "animal": "藍鯨", "measurement": "30米 (98英尺) 長", "fact": "心臟大小相當於一輛小汽車"},
      {"emoji": "🦅", "record": "最快鳥類 (俯衝)", "animal": "遊隼", "measurement": "389公里/小時 (242英里/小時)", "fact": "折疊翅膀以達到最大速度"},
      {"emoji": "🐢", "record": "最長壽", "animal": "加拉巴哥象龜", "measurement": "175+年", "fact": "一隻名叫強納森的塞席爾龜活了190歲"},
      {"emoji": "🐧", "record": "最深潛水", "animal": "國王企鵝", "measurement": "565米 (1,854英尺)", "fact": "可屏住呼吸超過20分鐘"},
      {"emoji": "🐘", "record": "最大陸地動物", "animal": "非洲象", "measurement": "6,000公斤 (13,200磅)", "fact": "可偵測到12英里外的水源"},
      {"emoji": "🧠", "record": "最小哺乳動物", "animal": "大黃蜂蝙蝠", "measurement": "2克 (0.07盎司)", "fact": "可放在人類拇指指甲上"}
    ]
  },
  "workflow": {
    "title": "隨機動物產生器工作原理",
    "desc": "我們的隨機動物產生器使用先進的演算法從{totalAnimals}隻動物的資料庫中提供公平、無偏見的選擇。以下是每次生成背後的分步工作流程。",
    "chartTitle": "生成過程流程圖",
    "steps": [
      {"label": "步驟1", "title": "使用者點擊生成", "desc": "按鈕點擊、空白鍵或移動端浮動按鈕", "color": "link"},
      {"label": "步驟2", "title": "應用篩選條件", "desc": "類別 + 保育狀態篩選", "color": "violet"},
      {"label": "步驟3", "title": "不重複檢查", "desc": "如啟用，移除先前顯示的動物", "color": "pink"},
      {"label": "步驟4", "title": "隨機選擇", "desc": "Math.random()從篩選池中選擇", "color": "conservation-lc"},
      {"label": "步驟5", "title": "動畫與顯示", "desc": "表情動畫、進度條、卡片展示", "color": "conservation-nt"},
      {"label": "步驟6", "title": "動物卡片渲染完成", "desc": "完整詳細資訊含表情、統計數據、趣聞", "color": "conservation-vu"}
    ]
  },
  "funFacts": {
    "title": "令人驚嘆的動物趣聞",
    "desc": "我們的隨機動物產生器充滿了關於每個物種的迷人事實。以下是我們{totalAnimals}隻動物資料庫中一些最令人驚訝的事實。",
    "items": [
      {"emoji": "🐙", "title": "三顆心臟", "text": "章魚有三顆心臟。兩顆將血液泵送到鰓，而第三顆將血液泵送到身體其他部位。"},
      {"emoji": "🐘", "title": "不會跳躍", "text": "大象是唯一不會跳躍的哺乳動物。它們的腿是為支撐體重而設計的，不適合跳躍。"},
      {"emoji": "🦩", "title": "華麗群", "text": "一群紅鶴被統稱為華麗群。它們吃蝦和藻類獲得粉紅色。"},
      {"emoji": "🦈", "title": "比樹古老", "text": "鯊魚已經存在了4億多年——比地球上樹木出現還早2億年。"},
      {"emoji": "🐊", "title": "鱷魚的眼淚", "text": "鱷魚進食時看起來像在哭泣，但這些實際上是眼睛附近腺體產生的潤滑淚液。"},
      {"emoji": "🐳", "title": "藍色心臟", "text": "藍鯨的心臟重約400磅（180公斤），大約每10秒跳動一次。"},
      {"emoji": "🦔", "title": "對毒液免疫", "text": "刺蝟對許多毒液免疫，包括蝰蛇毒液。它們甚至可以吃毒蛇。"},
      {"emoji": "🐦", "title": "沒有牙齒", "text": "鳥類沒有牙齒。相反，它們吞下石頭在砂囊中研磨食物，起到牙齒的替代作用。"},
      {"emoji": "🐢", "title": "洩殖腔呼吸", "text": "烏龜可以通過臀部呼吸。這種適應幫助它們在水下長時間冬眠期間生存。"}
    ]
  },
  "education": {
    "title": "在教育中使用隨機動物產生器",
    "desc": "隨機動物產生器已成為教師、家長和學生的強大教育工具。它們使關於野生動物的學習互動且引人入勝，同時涵蓋關鍵生物學概念。",
    "headers": ["活動", "科目", "年齡組", "學習成果"],
    "rows": [
      {"activity": "每日動物卡片", "subject": "生物學、地理", "age": "6-12歲", "outcome": "動物識別、栖息地意識"},
      {"activity": "繪畫挑戰", "subject": "美術、生物學", "age": "8-16歲", "outcome": "觀察能力、解剖學理解"},
      {"activity": "保育辯論", "subject": "環境科學", "age": "12-18歲", "outcome": "批判性思維、環境意識"},
      {"activity": "創意寫作", "subject": "國語文", "age": "所有年齡", "outcome": "說故事、詞彙構建"},
      {"activity": "動物問答遊戲", "subject": "生物學、常識", "age": "所有年齡", "outcome": "記憶、回憶、趣味學習"}
    ]
  },
  "timeline": {
    "title": "已滅絕動物時間軸",
    "desc": "滅絕是進化的自然組成部分，但人類活動大大加速了這一進程。我們的隨機動物產生器包含{extinctCount}種已滅絕物種，幫助教育使用者了解保育的重要性。",
    "items": [
      {"year": "1681", "animal": "🦤 渡渡鳥", "event": "由於狩獵和入侵物種，最後一隻渡渡鳥在模里西斯被殺"},
      {"year": "1768", "animal": "🐦 斯特拉大海牛", "event": "在被發現後27年內被獵殺至滅絕"},
      {"year": "1883", "animal": "🦓 斑驢", "event": "最後一隻斑驢死於阿姆斯特丹動物園；僅存1000塊骨頭"},
      {"year": "1914", "animal": "🕊️ 旅鴿", "event": "最後一隻旅鴿瑪莎死於辛辛那提動物園"},
      {"year": "1936", "animal": "🐯 袋狼", "event": "最後一隻袋狼死於霍巴特動物園；現已滅絕近一個世紀"},
      {"year": "2011", "animal": "🦏 西部黑犀牛", "event": "宣布滅絕；2006年在喀麥隆最後一次被發現"}
    ]
  },
  "cta": {
    "title": "開始探索動物",
    "desc": "生成帶有圖片、趣聞和保育狀態的隨機動物。免費即時使用。",
    "btn": "🎲 試用隨機動物產生器"
  },
  "stats": {
    "animals": "隻動物",
    "categories": "個類別",
    "conservationLevels": "個保育等級",
    "free": "免費"
  }
};

const arLocale = {
  "badge": "مركز معرفة الحياة البرية",
  "title": "مدونة مولد الحيوانات العشوائي",
  "description": "استكشف الحياة البرية من خلال الرسوم البيانية وجداول البيانات والأدلة التعليمية. تعرف على الحفظ وتصنيف الحيوانات والتنوع المذهل للحياة على الأرض.",
  "tocTitle": "جدول المحتويات",
  "tocItems": [
    {"text": "١. الدليل الكامل لحالة حفظ الحيوانات", "anchor": "conservation-guide"},
    {"text": "٢. مخطط تصنيف المملكة الحيوانية", "anchor": "classification-chart"},
    {"text": "٣. تفصيل فئات الحيوانات مع البيانات", "anchor": "category-breakdown"},
    {"text": "٤. التوزيع العالمي لموائل الحيوانات", "anchor": "habitat-map"},
    {"text": "٥. مخطط تدفق قرارات الأنواع المهددة", "anchor": "endangered-flowchart"},
    {"text": "٦. جدول أصحاب الأرقام القياسية للحيوانات", "anchor": "record-holders"},
    {"text": "٧. كيف يعمل مولد الحيوانات العشوائي", "anchor": "generator-workflow"},
    {"text": "٨. شبكة حقائق مذهلة عن الحيوانات", "anchor": "fun-facts-grid"},
    {"text": "٩. استخدام مولدات الحيوانات العشوائية في التعليم", "anchor": "education-guide"},
    {"text": "١٠. الخط الزمني للحيوانات المنقرضة", "anchor": "extinction-timeline"}
  ],
  "conservationGuide": {
    "title": "الدليل الكامل لحالة حفظ الحيوانات",
    "desc": "القائمة الحمراء للاتحاد الدولي لحفظ الطبيعة (IUCN) هي أكثر قائمة شاملة في العالم لحالة حفظ الأنواع. يتضمن مولد الحيوانات العشوائي الخاص بنا حيوانات عبر جميع فئات IUCN، مما يساعد المستخدمين على التعرف على الحفاظ على الحياة البرية أثناء اكتشاف أنواع جديدة.",
    "headers": ["رمز الحالة", "الاسم الكامل", "التعريف", "حيوانات في قاعدة البيانات"],
    "statuses": [
      {"code": "LC", "name": "أقل قلقًا", "desc": "أنواع واسعة الانتشار ووفيرة مع مجموعات سكانية مستقرة", "color": "conservation-lc"},
      {"code": "NT", "name": "قريب من التهديد", "desc": "أنواع من المرجح أن تصبح مهددة في المستقبل القريب", "color": "conservation-nt"},
      {"code": "VU", "name": "عرضة للخطر", "desc": "أنواع تواجه خطرًا عاليًا بالانقراض في البرية", "color": "conservation-vu"},
      {"code": "EN", "name": "مهدد بالانقراض", "desc": "أنواع تواجه خطرًا عاليًا جدًا بالانقراض في البرية", "color": "conservation-en"},
      {"code": "CR", "name": "معرض للانقراض بشدة", "desc": "أنواع تواجه خطرًا مرتفعًا جدًا بالانقراض", "color": "conservation-cr"},
      {"code": "EW", "name": "منقرض في البرية", "desc": "يُعرف فقط بأنه ينجو في الأسر أو الزراعة", "color": "gray-400"},
      {"code": "EX", "name": "منقرض", "desc": "لا يوجد شك معقول في وفاة آخر فرد منه", "color": "gray-500"}
    ],
    "chartTitle": "توزيع حالة الحفظ"
  },
  "classification": {
    "title": "مخطط تصنيف المملكة الحيوانية",
    "desc": "ينظم نظام التصنيف البيولوجي جميع الكائنات الحية في هيكل هرمي. يستخدم مولد الحيوانات العشوائي الخاص بنا هذا التصنيف لتصنيف الأنواع، مما يوفر معلومات الطبقة والرتبة والعائلة لكل حيوان في قاعدة البيانات.",
    "chartTitle": "التصنيف التصنيفي للحيوانات",
    "levels": [
      {"type": "node", "label": "المملكة", "value": "الحيوانات", "color": "link"},
      {"type": "node", "label": "الشعبة", "value": "الحبليات، المفصليات، الرخويات، إلخ", "color": "violet"},
      {"type": "row", "label": "الطبقة", "items": [
        {"emoji": "🦁", "name": "الثدييات", "desc": "ثدييات"},
        {"emoji": "🦅", "name": "الطيور", "desc": "طيور"},
        {"emoji": "🐊", "name": "الزواحف", "desc": "زواحف"},
        {"emoji": "🐸", "name": "برمائيات", "desc": "برمائيات"},
        {"emoji": "🐟", "name": "شعاعيات الزعانف", "desc": "أسماك عظمية"},
        {"emoji": "🦈", "name": "غضاريفات", "desc": "أسماك غضروفية"},
        {"emoji": "🐙", "name": "الحشرات", "desc": "حشرات"},
        {"emoji": "🐋", "name": "الثدييات", "desc": "حيتانيات"}
      ]},
      {"type": "node", "label": "الرتبة", "value": "اللاحمات، الرئيسيات، القوارض، إلخ", "color": "pink"},
      {"type": "node", "label": "العائلة", "value": "السنورية، الكلبيات، الدببة، إلخ", "color": "conservation-lc"},
      {"type": "node", "label": "الجنس", "value": "الفهد، الكلب، إلخ", "color": "conservation-nt"},
      {"type": "node", "label": "النوع", "value": "أسد، ذئب رمادي، إلخ", "color": "conservation-vu"}
    ]
  },
  "categories": {
    "title": "تفصيل فئات الحيوانات",
    "desc": "يغطي مولد الحيوانات العشوائي الخاص بنا أكثر من {totalAnimals} حيوان عبر {categoriesCount} فئات رئيسية. تمثل كل فئة مجموعة متميزة من الحيوانات ذات خصائص وموائل وتكيفات فريدة. إليك تفصيل مفصل لقاعدة بياناتنا.",
    "label": "حيوانات",
    "items": [
      {"key": "Mammal", "label": "ثديي", "icon": "🦁", "desc": "دم دافئ، شعر/فرو، ينتج الحليب"},
      {"key": "Bird", "label": "طائر", "icon": "🦅", "desc": "ريش، دم دافئ، بيض"},
      {"key": "Fish", "label": "سمكة", "icon": "🐟", "desc": "مائي، خياشيم، دم بارد"},
      {"key": "Reptile", "label": "زاحف", "icon": "🐊", "desc": "قشور، دم بارد، بيض"},
      {"key": "Amphibian", "label": "برمائي", "icon": "🐸", "desc": "جلد رطب، حياة مزدوجة، دم بارد"},
      {"key": "Insect", "label": "حشرة", "icon": "🦋", "desc": "هيكل خارجي، ستة أرجل، أجنحة"},
      {"key": "Marine", "label": "بحري", "icon": "🐙", "desc": "يعيش في المحيطات، أنواع متنوعة"},
      {"key": "Extinct", "label": "منقرض", "icon": "🦤", "desc": "لم يعد موجودًا، سجلات تاريخية"}
    ]
  },
  "habitatDistribution": {
    "title": "التوزيع العالمي لموائل الحيوانات",
    "desc": "تكيفت الحيوانات مع تقريبًا كل البيئة على الأرض. تتضمن قاعدة بيانات مولد الحيوانات العشوائي أنواعًا من موائل متنوعة، لكل منها تحديات وتكيفات تطورية فريدة.",
    "headers": ["نوع الموطن", "المناخ", "التكيفات الرئيسية", "أنواع مثالية"],
    "rows": [
      {"emoji": "🌲", "type": "غابة استوائية", "climate": "حار، رطب، ماطر", "adaptations": "تمويه، تسلق المظلة، ألوان زاهية", "species": "توكو، جاغوار، ضفدع السمام"},
      {"emoji": "🏔️", "type": "جبل", "climate": "بارد، أكسجين منخفض", "adaptations": "فرو سميك، رئات كبيرة، مخالب قوية", "species": "فهد الثلج، ماعز جبلي، نسر ذهبي"},
      {"emoji": "🌊", "type": "محيط", "climate": "مالح، ضغط عميق", "adaptations": "جسم انسيابي، سونار، توهج حيوي", "species": "حوت أزرق، أخطبوط، قرش أبيض كبير"},
      {"emoji": "🏜️", "type": "صحراء", "climate": "حرارة شديدة، جاف", "adaptations": "حفظ الماء، حفار، ليلي", "species": "جمل، ثعلب فنك، شائك شيطاني"},
      {"emoji": "🧊", "type": "قطب شمالي", "climate": "متجمد، ظلام موسمي", "adaptations": "دهن جسمي، تمويه أبيض، سبات", "species": "دب قطبي، ثعلب قطبي، بومة ثلجية"},
      {"emoji": "🌿", "type": "مرج", "climate": "مطر معتدل، سهول مفتوحة", "adaptations": "سرعة، قطعان، تمويه", "species": "زبرة، فهد صحراوي، فيل أفريقي"},
      {"emoji": "🌿", "type": "مياه عذبة", "climate": "بحيرات، أنهار، برك", "adaptations": "خياشيم، زعانف، تمويه", "species": "تمساح النيل، بيرانا، أكسولوتل"}
    ]
  },
  "endangeredFlowchart": {
    "title": "مخطط تدفق قرارات الأنواع المهددة",
    "desc": "إن فهم كيف تصبح الأنواع مهددة يتضمن تفاعلًا معقدًا من العوامل. يوضح هذا المخطط التهديدات الرئيسية التي تدفع الأنواع نحو الانقراض وإجراءات الحفظ التي يمكن أن تساعد في عكس تراجعها.",
    "chartTitle": "التهديدات للحياة البرية وإجراءات الحفظ",
    "rootCause": "النشاط البشري",
    "threats": [
      {"emoji": "🏗️", "title": "فقدان الموطن", "desc": "إزالة الغابات، التحضر"},
      {"emoji": "🎯", "title": "الاستغلال المفرط", "desc": "صيد، صيد غير قانوني، صيد سمك"},
      {"emoji": "🌡️", "title": "تغير المناخ", "desc": "تحولات درجة الحرارة، مستوى البحر"},
      {"emoji": "🦠", "title": "التلوث والأمراض", "desc": "مبيدات آفات، أنواع غازية"}
    ],
    "impact": {"title": "انخفاض السكان", "desc": "أعداد منخفضة، فقدان تنوع جيني"},
    "assessment": {"title": "تقييم القائمة الحمراء IUCN", "desc": "يقيم العلماء خطر الانقراض"},
    "actions": [
      {"emoji": "🏞️", "title": "مناطق محمية", "desc": "حدائق وطنية، محميات"},
      {"emoji": "🔬", "title": "البحث والمراقبة", "desc": "تتبع، دراسات سكانية"},
      {"emoji": "📜", "title": "حماية قانونية", "desc": "حظر الصيد، قوانين التجارة"},
      {"emoji": "🌱", "title": "استعادة الموطن", "desc": "إعادة تشجير، تنظيف"}
    ],
    "outcome": {"title": "استعادة الأنواع", "desc": "استقرار ونمو السكان"}
  },
  "recordHolders": {
    "title": "أصحاب الأرقام القياسية للحيوانات",
    "desc": "المملكة الحيوانية مليئة بالحدود القصوى. من أسرع حيوان بري إلى أكبر كائن حي عاش على الإطلاق، يُظهر أصحاب هذه الأرقام القياسية التنوع المذهل للحياة على الأرض.",
    "headers": ["الرقم القياسي", "الحيوان", "القياس", "حقيقة ممتعة"],
    "records": [
      {"emoji": "🏃", "record": "أسرع حيوان بري", "animal": "الفهد الصحراوي", "measurement": "١١٢ كم/ساعة (٧٠ ميل/ساعة)", "fact": "يمكنه التسارع من ٠ إلى ١٠٠ كم/ساعة في ٣ ثوانٍ"},
      {"emoji": "🐋", "record": "أكبر حيوان على الإطلاق", "animal": "الحوت الأزرق", "measurement": "٣٠ مترًا (٩٨ قدمًا) طولًا", "fact": "قلبه بحجم سيارة صغيرة"},
      {"emoji": "🦅", "record": "أسرع طائر (هبوط)", "animal": "الصقر الشاهين", "measurement": "٣٨٩ كم/ساعة (٢٤٢ ميل/ساعة)", "fact": "يضعف أجنحته لتحقيق أقصى سرعة"},
      {"emoji": "🐢", "record": "الأطول عمرًا", "animal": "سلحفاة غالاباغوس", "measurement": "١٧٥+ عامًا", "fact": "عاشت جوناثان، سلحفاة سيشيل، ١٩٠ عامًا"},
      {"emoji": "🐧", "record": "أعمق غطسة", "animal": "بطريق الإمبراطور", "measurement": "٥٦٥ مترًا (١,٨٥٤ قدمًا)", "fact": "يحتفظ بأنفاسه لأكثر من ٢٠ دقيقة"},
      {"emoji": "🐘", "record": "أكبر حيوان بري", "animal": "الفيل الأفريقي", "measurement": "٦,٠٠٠ كجم (١٣,٢٠٠ رطلاً)", "fact": "يمكنه اكتشاف مصادر المياه على بعد ١٢ ميلًا"},
      {"emoji": "🧠", "record": "أصغر ثديي", "animal": "خفش النحل الطنان", "measurement": "٢ جرامًا (٠,٠٧ أونصة)", "fact": "يناسب على ظفر إصبع الإنسان"}
    ]
  },
  "workflow": {
    "title": "كيف يعمل مولد الحيوانات العشوائي",
    "desc": "يستخدم مولد الحيوانات العشوائي الخاص بنا خوارزمية متطورة لتقديم خيارات عادلة وغير متحيزة من قاعدة بياناتنا التي تضم {totalAnimals} حيوانًا. إليك سير العمل خطوة بخطوة وراء كل توليد.",
    "chartTitle": "مخطط تدفق عملية التوليد",
    "steps": [
      {"label": "الخطوة ١", "title": "ينقر المستخدم توليد", "desc": "ضغط زر، مسافة، أو زر عائم محمول", "color": "link"},
      {"label": "الخطوة ٢", "title": "تطبيق عوامل التصفية", "desc": "عوامل تصفية الفئة + حالة الحفظ", "color": "violet"},
      {"label": "الخطوة ٣", "title": "فحص عدم التكرار", "desc": "إزالة الحيوانات المعروضة سابقًا إذا تم تمكينه", "color": "pink"},
      {"label": "الخطوة ٤", "title": "اختيار عشوائي", "desc": "Math.random() يختار من المجموعة المصفاة", "color": "conservation-lc"},
      {"label": "الخطوة ٥", "title": "الرسوم المتحركة والعرض", "desc": "خلط رموز تعبيرية، شريط تقدم، كشف البطاقة", "color": "conservation-nt"},
      {"label": "الخطوة ٦", "title": "تم عرض بطاقة الحيوان", "desc": "تفاصيل كاملة مع رموز تعبيرية، إحصائيات، حقائق", "color": "conservation-vu"}
    ]
  },
  "funFacts": {
    "title": "حقائق مذهلة عن الحيوانات",
    "desc": "مولد الحيوانات العشوائي الخاص بنا مليء بالحقائق الرائعة عن كل نوع. إليك بعض الحقائق الأكثر إثارة للدهشة من قاعدة بياناتنا التي تضم {totalAnimals} حيوانًا.",
    "items": [
      {"emoji": "🐙", "title": "ثلاثة قلوب", "text": "للأخطبوط ثلاثة قلوب. يضخ اثنان الدم إلى الخياشيم، بينما يضخ الثالث الدم إلى بقية الجسم."},
      {"emoji": "🐘", "title": "لا يستطيع القفز", "text": "الفيلة هي الثدييات الوحيدة التي لا تستطيع القفز. أرجلها مصممة لدعم الوزن، وليس للقفز."},
      {"emoji": "🦩", "title": "مجموعة متوهجة", "text": "تسمى مجموعة الفلامنغو مجموعة متوهجة. يحصلون على لونهم الوردي من أكل الجمبري والطحالب."},
      {"emoji": "🦈", "title": "أقدم من الأشجار", "text": "لقد وجدت أسماك القرش منذ أكثر من ٤٠٠ مليون سنة — أي قبل ظهور الأشجار على الأرض بـ ٢٠٠ مليون سنة."},
      {"emoji": "🐊", "title": "دموع التمساح", "text": "يبدو أن التماسيح تبكي أثناء الأكل، لكن هذه في الواقع دموع تزييت تنتجها الغدد بالقرب من أعينها."},
      {"emoji": "🐳", "title": "قلب أزرق", "text": "يزن قلب الحوت الأزرق حوالي ٤٠٠ رطلاً (١٨٠ كجم) وينبض مرة واحدة كل ١٠ ثوانٍ تقريبًا."},
      {"emoji": "🦔", "title": "مناعم من السموم", "text": "القنفذ مناعم من العديد من السموم، بما في ذلك سم الأفعى. يمكنه حتى أكل الثعابين السامة."},
      {"emoji": "🐦", "title": "لا أسنان", "text": "الطيور ليس لديها أسنان. بدلاً من ذلك، تبتلع الحجارة التي تطحن الطعام في معدة الحصى، مما يعمل كبديل."},
      {"emoji": "🐢", "title": "التنفس من الخلف", "text": "يمكن للسلاحف أن تتنفس من خلال مؤخرتها. يساعد هذا التكيفها على البقاء خلال فترات السبات الطويلة تحت الماء."}
    ]
  },
  "education": {
    "title": "استخدام مولدات الحيوانات العشوائية في التعليم",
    "desc": "أصبحت مولدات الحيوانات العشوائية أدوات تعليمية قوية للمعلمين والآباء والطلاب. إنها تجعل التعلم عن الحياة البرية تفاعليًا وجذابًا مع تغطية مفاهيم البيولوجيا الأساسية.",
    "headers": ["النشاط", "المادة", "الفئة العمرية", "نتيجة التعلم"],
    "rows": [
      {"activity": "بطاقة حيوان يومية", "subject": "البيولوجيا، الجغرافيا", "age": "٦-١٢ سنة", "outcome": "تعرف على الحيوانات، وعي بالموطن"},
      {"activity": "تحدي الرسم", "subject": "الفن، البيولوجيا", "age": "٨-١٦ سنة", "outcome": "مهارات الملاحظة، فهم التشريح"},
      {"activity": "مناظرة الحفظ", "subject": "العلوم البيئية", "age": "١٢-١٨ سنة", "outcome": "تفكير نقدي، وعي بيئي"},
      {"activity": "الكتابة الإبداعية", "subject": "الفنون اللغوية", "age": "كل الأعمار", "outcome": "سرد القصص، بناء المفردات"},
      {"activity": "لعبة مسابقة الحيوانات", "subject": "البيولوجيا، معرفة عامة", "age": "كل الأعمار", "outcome": "ذاكرة، استرجاع، تعلم ممتع"}
    ]
  },
  "timeline": {
    "title": "الخط الزمني للحيوانات المنقرضة",
    "desc": "الانقراض جزء طبيعي من التطور، لكن النشاط البشري قد سرع العملية بشكل كبير. يتضمن مولد الحيوانات العشوائي الخاص بنا {extinctCount} أنواعًا منقرضة للمساعدة في توعية المستخدمين بأهمية الحفظ.",
    "items": [
      {"year": "١٦٨١", "animal": "🦤 دودو", "event": "تم قتل آخر دودو في موريشيوس بسبب الصيد والأنواع الغازية"},
      {"year": "١٧٦٨", "animal": "🐦 بقعة ستيلر البحرية", "event": "تم صيدها حتى الانقراض خلال ٢٧ عامًا من اكتشافها"},
      {"year": "١٨٨٣", "animal": "🦓 كواغا", "event": "توفيت آخر كواغا في حديقة حيوانات أمستردام؛ بقيت فقط ١,٠٠٠ عظمة"},
      {"year": "١٩١٤", "animal": "🕊️ حمام المسافر", "event": "توفيت مارثا، آخر حمام مسافر، في حديقة حيوانات سينسيناتي"},
      {"year": "١٩٣٦", "animal": "🐯 نمر تسمانيا", "event": "توفي آخر ثيلاسين في حديقة حيوانات هوبارت؛ الآن منقرض منذ ما يقرب من قرن"},
      {"year": "٢٠١١", "animal": "🦏 وحيد القرن الأسود الغربي", "event": "أُعلن منقرضًا؛ شوهد آخر مرة في الكاميرون عام ٢٠٠٦"}
    ]
  },
  "cta": {
    "title": "ابدأ باكتشاف الحيوانات",
    "desc": "أنشئ حيوانات عشوائية مع صور وحقائق ممتعة وحالة حفظ. مجاني وفوري.",
    "btn": "🎲 جرب مولد الحيوانات العشوائي"
  },
  "stats": {
    "animals": "حيوانات",
    "categories": "فئات",
    "conservationLevels": "مستويات حفظ",
    "free": "مجاني"
  }
};

parsed.it = itLocale;
parsed['zh-CN'] = zhCNLocale;
parsed['zh-TW'] = zhTWLocale;
parsed.ar = arLocale;

const finalData = {};
const expectedOrder = ['en', 'es', 'ja', 'fr', 'de', 'pt', 'ko', 'it', 'zh-CN', 'zh-TW', 'ar'];
for (const key of expectedOrder) {
  if (parsed[key]) finalData[key] = parsed[key];
}

const finalJson = JSON.stringify(finalData, null, 2);
try {
  JSON.parse(finalJson);
  console.log('JSON VALIDATION: PASS');
} catch(e) {
  console.log('JSON VALIDATION: FAIL -', e.message);
  process.exit(1);
}

fs.writeFileSync(filePath, finalJson, 'utf8');

const verify = JSON.parse(fs.readFileSync(filePath, 'utf8'));
console.log('Total locales:', Object.keys(verify).length);
console.log('Locales:', Object.keys(verify));
console.log('File rewrite SUCCESS!');
