/** Replace `{year}` placeholder in SEO strings. */
export function replaceYear(text: string, year = new Date().getFullYear()): string {
  return text.replaceAll('{year}', String(year))
}
