let pipVideo: HTMLVideoElement | null = null;
let pipCanvas: HTMLCanvasElement | null = null;
let canvasCtx: CanvasRenderingContext2D | null = null;

export function isPipSupported(): boolean {
  if (typeof document === 'undefined') return false;
  return 'pictureInPictureEnabled' in document && document.pictureInPictureEnabled;
}

export function isPipActive(): boolean {
  if (typeof document === 'undefined') return false;
  return Boolean(document.pictureInPictureElement);
}

export async function togglePictureInPicture(
  stageName: string,
  timeFormatted: string,
  stageIndex: number,
  totalStages: number,
  totalElapsedFormatted: string,
  colorHex: string = '#10b981'
): Promise<boolean> {
  if (!isPipSupported()) return false;

  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      return false;
    }

    if (!pipCanvas) {
      pipCanvas = document.createElement('canvas');
      pipCanvas.width = 440;
      pipCanvas.height = 240;
      canvasCtx = pipCanvas.getContext('2d');
    }

    updatePipCanvas(stageName, timeFormatted, stageIndex, totalStages, totalElapsedFormatted, colorHex);

    if (!pipVideo) {
      pipVideo = document.createElement('video');
      pipVideo.muted = true;
      pipVideo.playsInline = true;
      // @ts-ignore
      pipVideo.srcObject = pipCanvas.captureStream(15);
      await pipVideo.play();
    }

    await pipVideo.requestPictureInPicture();
    return true;
  } catch (err) {
    console.warn('PiP initiation failed:', err);
    return false;
  }
}

export function updatePipCanvas(
  stageName: string,
  timeFormatted: string,
  stageIndex: number,
  totalStages: number,
  totalElapsedFormatted: string,
  colorHex: string = '#10b981'
) {
  if (!pipCanvas || !canvasCtx) return;
  const ctx = canvasCtx;
  const w = pipCanvas.width;
  const h = pipCanvas.height;

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // Top header bar
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, w, 44);

  // Brand / Category
  ctx.fillStyle = colorHex;
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`TAHAP ${stageIndex + 1} / ${totalStages}`, 20, 28);

  // Total time on right
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`Total: ${totalElapsedFormatted}`, w - 20, 28);
  ctx.textAlign = 'left';

  // Stage Title
  ctx.fillStyle = '#f8fafc';
  ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  // truncate if needed
  let displayTitle = stageName;
  if (displayTitle.length > 28) {
    displayTitle = displayTitle.substring(0, 26) + '...';
  }
  ctx.fillText(displayTitle, 20, 78);

  // Giant Countdown Clock
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px "JetBrains Mono", monospace';
  ctx.fillText(timeFormatted, 20, 150);

  // Bottom Accent Bar
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, h - 8, w, 8);
}
