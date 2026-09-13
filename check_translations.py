import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('src/data/animal-translations.json', 'r', encoding='utf-8') as f:
    trans = json.load(f)
with open('src/data/animals.json', 'r', encoding='utf-8') as f:
    animals = json.load(f)
en_facts = {a['id']: a['funFact'] for a in animals}

for locale in ['zh-CN', 'zh-TW', 'ar', 'fr']:
    locale_data = trans.get(locale, {})
    translated = []
    still_english = []
    for aid, entry in locale_data.items():
        if isinstance(entry, dict):
            ff = entry.get('funFact', '')
            if ff and aid in en_facts:
                if ff == en_facts[aid]:
                    still_english.append(aid)
                else:
                    translated.append(aid)

    print(f'{locale}: Properly translated: {len(translated)}, Still English: {len(still_english)}')
    print(f'  Sample translated:')
    for aid in translated[:3]:
        val = locale_data[aid].get('funFact', '')[:70]
        print(f'    {aid}: {val}')
    print(f'  Sample English:')
    for aid in still_english[:3]:
        val = en_facts[aid][:70]
        print(f'    {aid}: {val}')
    print()
