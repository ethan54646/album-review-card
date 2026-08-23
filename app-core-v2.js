const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d');
const coverInput = document.getElementById('coverInput');
const albumInput = document.getElementById('album');
const artistInput = document.getElementById('artist');
const yearInput = document.getElementById('year');
const scoreInput = document.getElementById('score');
const templateInput = document.getElementById('template');
const captionInput = document.getElementById('caption');
const shareBtn = document.getElementById('shareBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

let coverImage = null;
let palette = ['#737373', '#d4d4d4', '#262626', '#78716c'];

function roundedRect(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function drawCover(image, x, y, size, radius = 36) {
  ctx.save();
  roundedRect(ctx, x, y, size, size, radius);
  ctx.clip();
  if (image) {
    const scale = Math.max(size / image.width, size / image.height);
    const dw = image.width * scale;
    const dh = image.height * scale;
    ctx.drawImage(image, x + (size - dw) / 2, y + (size - dh) / 2, dw, dh);
  } else {
    const g = ctx.createLinearGradient(x, y, x + size, y + size);
    g.addColorStop(0, '#2e3a59');
    g.addColorStop(1, '#101826');
    ctx.fillStyle = g;
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = 'rgba(255,255,255,.12)';
    ctx.font = '700 72px -apple-system,BlinkMacSystemFont,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NO COVER', x + size / 2, y + size / 2 + 20);
  }
  ctx.restore();
}

function fitText(text, maxWidth, startSize, weight = '700') {
  let size = startSize;
  while (size > 24) {
    ctx.font = `${weight} ${size}px -apple-system,BlinkMacSystemFont,sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= 2;
  }
  return size;
}

function getWrappedLines(text, maxWidth) {
  if (!text.trim()) return [];
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function wrapText(text, x, y, maxWidth, lineHeight, maxLines, align = 'left') {
  const lines = getWrappedLines(text, maxWidth);
  const final = lines.slice(0, maxLines);
  if (lines.length > maxLines && final.length) {
    let last = final[final.length - 1];
    while (ctx.measureText(last + '…').width > maxWidth && last.length) {
      last = last.slice(0, -1);
    }
    final[final.length - 1] = last + '…';
  }
  ctx.textAlign = align;
  final.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
}

function drawFittedReview(text, x, top, maxWidth, bottom) {
  let fontSize = 38;
  const minFontSize = 28;
  let lines = [];
  let lineHeight = 52;
  let maxLines = 1;

  while (fontSize >= minFontSize) {
    ctx.font = `500 ${fontSize}px -apple-system,BlinkMacSystemFont,sans-serif`;
    lineHeight = Math.round(fontSize * 1.38);
    lines = getWrappedLines(text, maxWidth);
    maxLines = Math.max(1, Math.floor((bottom - top) / lineHeight) + 1);
    if (lines.length <= maxLines) break;
    fontSize -= 2;
  }

  ctx.font = `500 ${Math.max(fontSize, minFontSize)}px -apple-system,BlinkMacSystemFont,sans-serif`;
  lineHeight = Math.round(Math.max(fontSize, minFontSize) * 1.38);
  lines = getWrappedLines(text, maxWidth);
  maxLines = Math.max(1, Math.floor((bottom - top) / lineHeight) + 1);

  const final = lines.slice(0, maxLines);
  if (lines.length > maxLines && final.length) {
    let last = final[final.length - 1];
    while (ctx.measureText(last + '…').width > maxWidth && last.length) {
      last = last.slice(0, -1);
    }
    final[final.length - 1] = last + '…';
  }

  ctx.textAlign = 'left';
  final.forEach((line, i) => ctx.fillText(line, x, top + i * lineHeight));
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex) {
  const s = hex.replace('#', '');
  return {
    r: parseInt(s.substring(0, 2), 16),
    g: parseInt(s.substring(2, 4), 16),
    b: parseInt(s.substring(4, 6), 16)
  };
}

function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function mix(hexA, hexB, t) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return rgbToHex(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t);
}

function withAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

function extractPalette(image) {
  if (!image) return ['#737373', '#d4d4d4', '#262626', '#78716c'];

  const sample = document.createElement('canvas');
  const sctx = sample.getContext('2d', { willReadFrequently: true });
  sample.width = 96;
  sample.height = 96;
  sctx.drawImage(image, 0, 0, sample.width, sample.height);

  const { data } = sctx.getImageData(0, 0, sample.width, sample.height);
  const pixels = [];
  const coarse = new Map();
  const coarseStep = 24;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 120) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    pixels.push([r, g, b]);

    const qr = clamp(Math.round(r / coarseStep) * coarseStep, 0, 255);
    const qg = clamp(Math.round(g / coarseStep) * coarseStep, 0, 255);
    const qb = clamp(Math.round(b / coarseStep) * coarseStep, 0, 255);
    const key = `${qr},${qg},${qb}`;
    coarse.set(key, (coarse.get(key) || 0) + 1);
  }

  if (!pixels.length) return ['#737373', '#d4d4d4', '#262626', '#78716c'];

  const seedBins = Array.from(coarse.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([key, count]) => ({ rgb: key.split(',').map(Number), count }));

  const colorDistance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const k = Math.min(10, seedBins.length);
  const centroids = [];
  if (seedBins.length) centroids.push(seedBins[0].rgb.slice());

  while (centroids.length < k) {
    let best = null;
    let bestScore = -1;
    for (const seed of seedBins) {
      if (centroids.some(c => colorDistance(c, seed.rgb) < 1)) continue;
      const minDistance = Math.min(...centroids.map(c => colorDistance(c, seed.rgb)));
      const score = minDistance * Math.pow(seed.count, 0.45);
      if (score > bestScore) {
        bestScore = score;
        best = seed.rgb;
      }
    }
    if (!best) break;
    centroids.push(best.slice());
  }

  for (let iteration = 0; iteration < 12; iteration++) {
    const sums = centroids.map(() => [0, 0, 0, 0]);
    for (const pixel of pixels) {
      let bestIndex = 0;
      let bestDistance = Infinity;
      for (let j = 0; j < centroids.length; j++) {
        const dr = pixel[0] - centroids[j][0];
        const dg = pixel[1] - centroids[j][1];
        const db = pixel[2] - centroids[j][2];
        const distance = dr * dr + dg * dg + db * db;
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = j;
        }
      }
      sums[bestIndex][0] += pixel[0];
      sums[bestIndex][1] += pixel[1];
      sums[bestIndex][2] += pixel[2];
      sums[bestIndex][3] += 1;
    }

    let maxShift = 0;
    for (let j = 0; j < centroids.length; j++) {
      const count = sums[j][3];
      if (!count) continue;
      const next = [sums[j][0] / count, sums[j][1] / count, sums[j][2] / count];
      maxShift = Math.max(maxShift, colorDistance(centroids[j], next));
      centroids[j] = next;
    }
    if (maxShift < 0.6) break;
  }

  const finalCounts = centroids.map(() => 0);
  for (const pixel of pixels) {
    let bestIndex = 0;
    let bestDistance = Infinity;
    for (let j = 0; j < centroids.length; j++) {
      const dr = pixel[0] - centroids[j][0];
      const dg = pixel[1] - centroids[j][1];
      const db = pixel[2] - centroids[j][2];
      const distance = dr * dr + dg * dg + db * db;
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = j;
      }
    }
    finalCounts[bestIndex]++;
  }

  const clusters = centroids
    .map((rgb, i) => ({
      rgb,
      color: rgbToHex(rgb[0], rgb[1], rgb[2]),
      count: finalCounts[i],
      coverage: finalCounts[i] / pixels.length
    }))
    .filter(cluster => cluster.count > 0)
    .sort((a, b) => b.count - a.count);

  if (!clusters.length) return ['#737373', '#d4d4d4', '#262626', '#78716c'];

  const isNeutral = cluster => {
    const [r, g, b] = cluster.rgb;
    return Math.max(r, g, b) - Math.min(r, g, b) < 14;
  };

  const picked = [clusters[0]];
  const remaining = clusters.slice(1);

  while (picked.length < 4 && remaining.length) {
    const neutralCount = picked.filter(isNeutral).length;
    const hasNonNeutralAlternative = remaining.some(c => !isNeutral(c) && c.coverage >= 0.015);
    let bestIndex = -1;
    let bestScore = -1;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      if (neutralCount >= 2 && hasNonNeutralAlternative && isNeutral(candidate)) continue;
      const minDistance = Math.min(...picked.map(existing => colorDistance(candidate.rgb, existing.rgb)));
      const distanceScore = Math.min(1, minDistance / 441.7);
      const score = Math.pow(candidate.coverage, 0.55) * (0.38 + 0.62 * distanceScore);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    if (bestIndex < 0) bestIndex = 0;
    picked.push(remaining.splice(bestIndex, 1)[0]);
  }

  const darkCandidate = clusters.find(c => luminance(c.color) < 70 && c.coverage >= 0.04);
  if (darkCandidate && !picked.some(c => luminance(c.color) < 80)) {
    picked[picked.length - 1] = darkCandidate;
  }

  const result = [];
  for (const cluster of picked) {
    if (!result.some(color => colorDistance(hexToRgbArray(color), cluster.rgb) < 18)) {
      result.push(cluster.color);
    }
  }

  while (result.length < 4) {
    if (result.length === 0) result.push('#737373');
    else if (result.length === 1) result.push(mix(result[0], '#ffffff', 0.38));
    else if (result.length === 2) result.push(mix(result[0], '#000000', 0.38));
    else result.push(mix(result[0], result[1], 0.5));
  }

  return result.slice(0, 4);
}

function hexToRgbArray(hex) {
  const { r, g, b } = hexToRgb(hex);
  return [r, g, b];
}
