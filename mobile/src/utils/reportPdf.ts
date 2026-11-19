import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import type { SchoolBrand } from '../schoolBranding';
import { renderSessionReportHtml, renderTermReportHtml } from './reportTemplate';

// This module has no role check. MyResultsScreen and SessionReportScreen
// expose print/export to admins, parents, and teachers. Teacher report access
// is independently restricted by the backend to the teacher's assigned class.

async function logoDataUri(brand: SchoolBrand | null): Promise<string> {
  if (!brand) return '';
  try {
    const asset = Asset.fromModule(brand.logo);
    await asset.downloadAsync();
    // Native: localUri is a file:// path the print WebView can load directly.
    // Web: require() already resolves to a static URL, so uri works as-is.
    return asset.localUri ?? asset.uri ?? '';
  } catch {
    return ''; // Missing/undownloadable logo shouldn't block the report — just omit it.
  }
}

// ── Term report card — mirrors the supplied Nursery/Primary and Secondary sheets.
export async function buildTermReportHtml(report: any, brand: SchoolBrand | null): Promise<string> {
  const logo = await logoDataUri(brand);
  return renderTermReportHtml(report, brand, logo);
}

// ── Session report uses the same pure, regression-tested renderer.
export async function buildSessionReportHtml(report: any, brand: SchoolBrand | null): Promise<string> {
  const logo = await logoDataUri(brand);
  return renderSessionReportHtml(report, brand, logo);
}

// ── Print (opens the OS/browser print dialog directly, no file produced) ────
export async function printReportHtml(html: string): Promise<void> {
  if (Platform.OS === 'web') {
    // expo-print's printToFileAsync isn't available on web, and printAsync's
    // web support varies by SDK version — the one thing every browser
    // reliably supports is opening a fresh tab with the document and calling
    // window.print() on it, which is exactly the ExportExcelScreen.tsx
    // precedent of branching web onto a plain-web-API path rather than
    // trusting an Expo module's web shim.
    const win = window.open('', '_blank');
    if (!win) throw new Error('Pop-up blocked — allow pop-ups for this site to print.');
    win.document.open();
    win.document.write(html);
    win.document.close();
    // Some browsers fire `onload` before the write above has finished
    // painting; the fallback timer covers those without double-printing on
    // the browsers where onload already fired correctly (repeat
    // window.print() calls on an already-open print dialog are a no-op).
    win.onload = () => win.print();
    setTimeout(() => win.print(), 300);
    return;
  }
  await Print.printAsync({ html });
}

// ── Export (produces an actual file to save/share — Drive, WhatsApp, etc.) ──
export async function exportReportHtml(html: string, filenameBase: string): Promise<void> {
  if (Platform.OS === 'web') {
    // No native filesystem/share sheet on web — the print dialog's own
    // "Save as PDF" destination is the export path there, same document the
    // user already sees for Print. Route Export to the same flow rather
    // than silently no-op-ing on web.
    return printReportHtml(html);
  }
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) throw new Error('Sharing is not available on this device.');
  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: `${filenameBase}.pdf`,
    UTI: 'com.adobe.pdf',
  });
}
