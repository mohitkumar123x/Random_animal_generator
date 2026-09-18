export interface DownloadCardAnimal {
  name: string;
  emoji: string;
  scientificName?: string;
  description: string;
  funFact: string;
  habitat: string;
  diet: string;
  lifespan: string;
  weight: string;
  speed?: string;
  length?: string;
  region?: string;
  conservation?: string;
  class?: string;
  order?: string;
  family?: string;
}

export interface DownloadCardLabels {
  habitat: string;
  diet: string;
  lifespan: string;
  weight: string;
  speed: string;
  length: string;
  region: string;
  taxonomy: string;
  taxClass: string;
  taxOrder: string;
  taxFamily: string;
  funFact: string;
  download: string;
  saving: string;
  saved: string;
  years: string;
  conservation: Record<string, { text: string }>;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxW) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function downloadAnimalCard(
  animal: DownloadCardAnimal,
  labels: DownloadCardLabels,
  translatedName: string,
  translateFn: (value: string, field: string) => string,
  btn: HTMLElement
) {
  btn.innerHTML = `<span>⏳</span> ${labels.saving}`;
  try {
    const W = 600, H = 1060;
    const canvas = document.createElement('canvas');
    canvas.width = W * 2;
    canvas.height = H * 2;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(2, 2);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#eef2ff');
    grad.addColorStop(0.5, '#f3e8ff');
    grad.addColorStop(1, '#fce7f3');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 24);
    ctx.fill();

    let y = 28;

    const img = await new Promise<HTMLImageElement | null>((resolve) => {
      const cache = JSON.parse(localStorage.getItem('pexelsImageCache') || '{}');
      const entry = cache[animal.name.toLowerCase().trim()];
      const url = typeof entry === 'string' ? entry : entry?.url;
      if (!url) return resolve(null);
      const el = new Image();
      el.crossOrigin = 'anonymous';
      el.onload = () => resolve(el);
      el.onerror = () => resolve(null);
      el.src = url;
    });

    if (img) {
      const imgW = W - 56, imgH = 200;
      const imgX = 28, imgY = y;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, 16);
      ctx.clip();
      const s = Math.max(imgW / img.width, imgH / img.height);
      const sw = img.width * s, sh = img.height * s;
      ctx.drawImage(img, imgX + (imgW - sw) / 2, imgY + (imgH - sh) / 2, sw, sh);
      ctx.restore();
      y += imgH + 20;
    } else {
      ctx.font = '64px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(animal.emoji, W / 2, y + 64);
      y += 84;
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
    ctx.fillText(translatedName, W / 2, y + 28);
    y += 36;

    if (animal.scientificName) {
      ctx.fillStyle = '#6b7280';
      ctx.font = 'italic 13px system-ui, -apple-system, sans-serif';
      ctx.fillText(animal.scientificName, W / 2, y + 14);
      y += 20;
    }

    const consColorMap: Record<string, string> = { LC:'#16a34a', NT:'#65a30d', VU:'#d97706', EN:'#ea580c', CR:'#dc2626', EW:'#7c3aed', EX:'#6b7280', DD:'#9ca3af' };
    const consBgMap: Record<string, string> = { LC:'#dcfce7', NT:'#ecfccb', VU:'#fef3c7', EN:'#ffedd5', CR:'#fee2e2', EW:'#ede9fe', EX:'#f3f4f6', DD:'#f3f4f6' };
    const consKey = animal.conservation || 'LC';
    const consBadge = labels.conservation[consKey] || labels.conservation.LC;
    const badgeColor = consColorMap[consKey] || '#16a34a';
    const badgeBg = consBgMap[consKey] || '#dcfce7';
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    const badgeText = consBadge.text;
    const bw = ctx.measureText(badgeText).width + 20;
    const bx = (W - bw) / 2, by = y + 4;
    ctx.fillStyle = badgeBg;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, 22, 11);
    ctx.fill();
    ctx.fillStyle = badgeColor;
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, W / 2, by + 15);
    y += 34;

    ctx.textAlign = 'left';
    ctx.fillStyle = '#374151';
    ctx.font = '13px system-ui, -apple-system, sans-serif';
    const lines = wrapText(ctx, animal.description, W - 56);
    lines.slice(0, 4).forEach((line, i) => {
      ctx.fillText(line, 28, y + 14 + i * 18);
    });
    y += Math.min(lines.length, 4) * 18 + 20;

    const statGrid = [
      { icon: '🌍', label: labels.habitat, value: translateFn(animal.habitat, 'habitat') },
      { icon: '🍽️', label: labels.diet, value: translateFn(animal.diet, 'diet') },
      { icon: '⏱️', label: labels.lifespan, value: animal.lifespan },
      { icon: '⚖️', label: labels.weight, value: animal.weight },
    ];
    const colW = (W - 56 - 12) / 2;
    statGrid.forEach((s, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const sx = 28 + col * (colW + 12), sy = y + row * 48;
      ctx.fillStyle = '#f9fafb';
      ctx.beginPath();
      ctx.roundRect(sx, sy, colW, 42, 8);
      ctx.fill();
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(sx, sy, colW, 42, 8);
      ctx.stroke();
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(s.icon + ' ' + s.label, sx + 10, sy + 16);
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.fillText(s.value, sx + 10, sy + 32);
    });
    y += 100;

    const extraStats = [
      { icon: '⚡', label: labels.speed, value: animal.speed || '—' },
      { icon: '📏', label: labels.length, value: animal.length || '—' },
      { icon: '🌐', label: labels.region, value: translateFn(animal.region || '', 'region') },
    ];
    const extraColW = (W - 56 - 16) / 3;
    extraStats.forEach((s, i) => {
      const sx = 28 + i * (extraColW + 8), sy = y;
      ctx.fillStyle = '#f0fdf4';
      ctx.beginPath();
      ctx.roundRect(sx, sy, extraColW, 42, 8);
      ctx.fill();
      ctx.strokeStyle = '#bbf7d0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(sx, sy, extraColW, 42, 8);
      ctx.stroke();
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(s.icon + ' ' + s.label, sx + extraColW / 2, sy + 16);
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.fillText(s.value, sx + extraColW / 2, sy + 32);
    });
    y += 56;

    if (animal.class || animal.order || animal.family) {
      ctx.fillStyle = '#f9fafb';
      ctx.beginPath();
      ctx.roundRect(28, y, W - 56, 64, 10);
      ctx.fill();
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(28, y, W - 56, 64, 10);
      ctx.stroke();
      ctx.fillStyle = '#6b7280';
      ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🧬 ' + labels.taxonomy, 40, y + 18);
      const taxItems = [
        { label: labels.taxClass, value: animal.class },
        { label: labels.taxOrder, value: animal.order },
        { label: labels.taxFamily, value: animal.family },
      ].filter(x => x.value);
      const taxColW = (W - 80) / Math.max(taxItems.length, 1);
      taxItems.forEach((item, i) => {
        ctx.fillStyle = '#6b7280';
        ctx.font = '11px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(item.label, 40 + i * taxColW, y + 36);
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
        ctx.fillText(item.value || '—', 40 + i * taxColW, y + 52);
      });
      y += 76;
    }

    ctx.fillStyle = '#eff6ff';
    ctx.beginPath();
    ctx.roundRect(28, y, W - 56, 56, 10);
    ctx.fill();
    ctx.strokeStyle = '#bfdbfe';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(28, y, W - 56, 56, 10);
    ctx.stroke();
    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('💡 ' + labels.funFact, 40, y + 18);
    ctx.fillStyle = '#374151';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    const factLines = wrapText(ctx, animal.funFact, W - 80);
    factLines.slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, 40, y + 34 + i * 16);
    });
    y += 72;

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(28, y);
    ctx.lineTo(W - 28, y);
    ctx.stroke();
    y += 14;

    ctx.textAlign = 'center';
    ctx.fillStyle = '#9ca3af';
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.fillText('bestrandomanimalgenerator.com', W / 2, y + 10);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob!);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${animal.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      a.click();
      URL.revokeObjectURL(url);
      btn.innerHTML = `<span>✓</span> ${labels.saved}`;
      setTimeout(() => { btn.innerHTML = `<span>📥</span> ${labels.download}`; }, 2000);
    }, 'image/png');
  } catch (e) {
    console.error('Download error:', e);
    btn.innerHTML = `<span>📥</span> ${labels.download}`;
  }
}
