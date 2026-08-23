function drawMag(album, artist, year, score, caption) {
  const bg = ctx.createLinearGradient(0, 0, 1600, 1600);
  bg.addColorStop(0, '#0a0d14');
  bg.addColorStop(1, '#171d2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1600, 1600);

  ctx.fillStyle = 'rgba(255,255,255,.06)';
  roundedRect(ctx, 80, 80, 1440, 1440, 48);
  ctx.fill();

  drawCover(coverImage, 130, 130, 680, 42);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#f8fbff';
  ctx.font = '800 64px -apple-system,BlinkMacSystemFont,sans-serif';
  ctx.fillText('ALBUM REVIEW', 885, 182);

  ctx.fillStyle = 'rgba(255,255,255,.68)';
  ctx.font = '700 26px -apple-system,BlinkMacSystemFont,sans-serif';
  ctx.fillText('SCORE', 895, 290);

  ctx.fillStyle = '#fff';
  ctx.font = '800 250px -apple-system,BlinkMacSystemFont,sans-serif';
  ctx.fillText(score, 885, 505);

  const albumSize = fitText(album.toUpperCase(), 1240, 72, '800');
  ctx.fillStyle = '#fff';
  ctx.font = `800 ${albumSize}px -apple-system,BlinkMacSystemFont,sans-serif`;
  wrapText(album.toUpperCase(), 130, 950, 1320, albumSize + 8, 2);

  ctx.fillStyle = 'rgba(255,255,255,.74)';
  ctx.font = '700 42px -apple-system,BlinkMacSystemFont,sans-serif';
  ctx.fillText([year, artist].filter(Boolean).join('  '), 130, 1090);

  if (caption.trim()) {
    ctx.fillStyle = 'rgba(255,255,255,.92)';
    ctx.font = '500 38px -apple-system,BlinkMacSystemFont,sans-serif';
    wrapText(caption, 130, 1185, 1260, 54, 4);
  }

  ctx.strokeStyle = 'rgba(255,255,255,.14)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(130, 1430);
  ctx.lineTo(1470, 1430);
  ctx.stroke();
}

function drawMinimal(album, artist, year, score, caption) {
  ctx.fillStyle = '#f5f5f0';
  ctx.fillRect(0, 0, 1600, 1600);
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, 1600, 170);
  ctx.fillStyle = '#fff';
  ctx.font = '800 54px -apple-system,BlinkMacSystemFont,sans-serif';
  ctx.fillText('REVIEW', 94, 108);

  drawCover(coverImage, 96, 260, 620, 18);

  ctx.fillStyle = '#111';
  ctx.font = '800 340px -apple-system,BlinkMacSystemFont,sans-serif';
  ctx.fillText(score, 820, 560);

  ctx.strokeStyle = '#111';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(820, 620);
  ctx.lineTo(1460, 620);
  ctx.stroke();

  const albumSize = fitText(album, 1360, 82, '800');
  ctx.font = `800 ${albumSize}px -apple-system,BlinkMacSystemFont,sans-serif`;
  wrapText(album, 96, 980, 1360, albumSize + 12, 2);

  ctx.fillStyle = '#333';
  ctx.font = '700 44px -apple-system,BlinkMacSystemFont,sans-serif';
  ctx.fillText([year, artist].filter(Boolean).join('  '), 96, 1110);

  if (caption.trim()) {
    ctx.fillStyle = '#222';
    ctx.font = '500 38px -apple-system,BlinkMacSystemFont,sans-serif';
    wrapText(caption, 96, 1210, 1360, 54, 4);
  }
}

function drawAurora(album, artist, year, score, caption) {
  const c1 = palette[0] || '#737373';
  const c2 = palette[1] || '#d4d4d4';
  const c3 = palette[2] || '#262626';
  const c4 = palette[3] || '#78716c';
  const neutralDark = '#08090c';

  const bg = ctx.createLinearGradient(0, 0, 1600, 1600);
  bg.addColorStop(0, mix(c1, neutralDark, 0.48));
  bg.addColorStop(0.34, mix(c2, neutralDark, 0.62));
  bg.addColorStop(0.68, mix(c3, neutralDark, 0.50));
  bg.addColorStop(1, mix(c4, neutralDark, 0.50));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1600, 1600);

  const orbs = [
    { x: 250, y: 210, r: 520, color: c1, alpha: 0.54 },
    { x: 1320, y: 350, r: 430, color: c2, alpha: 0.48 },
    { x: 1120, y: 1280, r: 540, color: c3, alpha: 0.52 },
    { x: 410, y: 1190, r: 420, color: c4, alpha: 0.48 },
    { x: 800, y: 900, r: 360, color: mix(c3, c4, 0.5), alpha: 0.20 }
  ];
  orbs.forEach(o => {
    const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
    g.addColorStop(0, withAlpha(o.color, o.alpha));
    g.addColorStop(1, withAlpha(o.color, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1600, 1600);
  });

  ctx.fillStyle = 'rgba(255,255,255,.08)';
  roundedRect(ctx, 90, 90, 1420, 1420, 56);
  ctx.fill();

  drawCover(coverImage, 120, 120, 500, 38);

  const circleX = 1180;
  const circleY = 380;
  const circleR = 215;
  const ring = ctx.createLinearGradient(circleX - circleR, circleY - circleR, circleX + circleR, circleY + circleR);
  ring.addColorStop(0, withAlpha(mix(c3, '#ffffff', 0.18), 0.9));
  ring.addColorStop(1, withAlpha(mix(c4, '#ffffff', 0.22), 0.95));
  ctx.strokeStyle = ring;
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleR - 12, 0, Math.PI * 2);
  ctx.fill();

  const scoreSize = fitText(score, 260, 138, '800');
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `800 ${scoreSize}px -apple-system,BlinkMacSystemFont,sans-serif`;
  ctx.fillText(score, circleX, circleY - 10);
  ctx.textBaseline = 'alphabetic';

  const titleSize = fitText(album, 1240, 72, '800');
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${titleSize}px -apple-system,BlinkMacSystemFont,sans-serif`;
  wrapText(album, 120, 770, 1280, titleSize + 10, 2);

  const titleLines = Math.min(2, (() => {
    const words = album.split(/\s+/); let line=''; let count=0;
    ctx.font = `800 ${titleSize}px -apple-system,BlinkMacSystemFont,sans-serif`;
    for (const word of words) {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > 1280 && line) { count++; line = word; }
      else { line = test; }
    }
    if (line) count++;
    return count;
  })());

  const artistY = 770 + titleLines * (titleSize + 10) - 6;
  ctx.fillStyle = 'rgba(255,255,255,.82)';
  ctx.font = '700 40px -apple-system,BlinkMacSystemFont,sans-serif';
  ctx.fillText([year, artist].filter(Boolean).join('          '), 120, artistY + 18);

  if (caption.trim()) {
    ctx.fillStyle = 'rgba(255,255,255,.94)';
    const captionTop = artistY + 92;
    const captionBottom = 1435;
    drawFittedReview(caption, 120, captionTop, 1280, captionBottom);
  }
}

function draw() {
  const album = (albumInput.value || 'Album Title').trim();
  const artist = (artistInput.value || 'Artist Name').trim();
  const year = (yearInput.value || '').trim();
  const score = (scoreInput.value || '8.0').trim().replace(/\s*\/\s*10$/i, '');
  const caption = (captionInput.value || '').trim();
  const tpl = templateInput.value;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (tpl === 'minimal') drawMinimal(album, artist, year, score, caption);
  else if (tpl === 'aurora') drawAurora(album, artist, year, score, caption);
  else drawMag(album, artist, year, score, caption);
}

function fileNameBase() {
  return (albumInput.value || 'album-review').trim().replace(/[\\/:*?"<>|]+/g, '-');
}

function canvasBlob() {
  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}

coverInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) {
    coverImage = null;
    palette = ['#737373', '#d4d4d4', '#262626', '#78716c'];
    draw();
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      coverImage = img;
      palette = extractPalette(img);
      draw();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

[albumInput, artistInput, yearInput, scoreInput, templateInput, captionInput].forEach(el => {
  el.addEventListener('input', draw);
  el.addEventListener('change', draw);
});

shareBtn.addEventListener('click', async () => {
  draw();
  const blob = await canvasBlob();
  const name = `${fileNameBase() || 'album-review'}.png`;
  const file = new File([blob], name, { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
    try {
      await navigator.share({ files: [file], title: name });
      return;
    } catch (e) {}
  }
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 5000);
});

downloadBtn.addEventListener('click', () => {
  draw();
  const link = document.createElement('a');
  link.download = `${fileNameBase() || 'album-review'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

resetBtn.addEventListener('click', () => {
  albumInput.value = 'The Life of a Showgirl';
  artistInput.value = 'Taylor Swift';
  yearInput.value = '2025';
  scoreInput.value = '8.2';
  templateInput.value = 'aurora';
  captionInput.value = 'A mischievous, flirty, surprisingly cohesive pop record.';
  coverInput.value = '';
  coverImage = null;
  palette = ['#737373', '#d4d4d4', '#262626', '#78716c'];
  draw();
});

templateInput.value = 'aurora';
draw();
