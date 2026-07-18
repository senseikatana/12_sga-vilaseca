import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://www.esinsagaskets.com';
const OUTPUT_DIR = './src/data'; // Cambia a la ruta donde quieras los archivos

// Páginas a scrapear (incluyendo las que tienen contenido dinámico)
const PAGES = [
  { slug: 'home', url: '/' },
  { slug: 'juntas', url: '/juntas/' },
  { slug: 'sectores', url: '/sectores/' },
  { slug: 'noticias', url: '/noticias/' },
  { slug: 'aviso-legal', url: '/aviso-legal/' },
  { slug: 'politica-privacidad', url: '/politica-de-privacidad/' },
];

async function scrape() {
  console.log('🔄 Lanzando navegador...');
  const browser = await puppeteer.launch({
    headless: false, // Ponlo en 'true' si no quieres ver el navegador
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Configurar para que parezca un navegador real
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  const results = {};

  for (const item of PAGES) {
    const fullUrl = BASE_URL + item.url;
    console.log(`🌐 Navegando a: ${fullUrl}`);

    try {
      await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 60000 });

      // --- 1. Manejar el banner de cookies (si aparece) ---
      const cookieSelector = '#cookies-eu-wrapper button, .cookie-accept, .btn-cookies, #cookie-popup button';
      try {
        await page.waitForSelector(cookieSelector, { timeout: 3000 });
        await page.click(cookieSelector);
        console.log('   🍪 Cookies aceptadas.');
        await page.waitForTimeout(1000); // Esperar a que desaparezca
      } catch (e) {
        // No hay cookies visibles, seguir
      }

      // --- 2. Hacer scroll para cargar lazy loading (imágenes y más contenido) ---
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 400;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight || totalHeight > 5000) {
              clearInterval(timer);
              resolve();
            }
          }, 200);
        });
      });

      // --- 3. Esperar a que los contenedores principales se llenen (si cargan con JS) ---
      // Buscamos contenedores típicos de Elementor o del tema
      await page.waitForSelector('.entry-content, .elementor-widget-wrap, .post-content, main', { timeout: 5000 }).catch(() => {});

      // --- 4. Extraer el contenido RENDERIZADO ---
      const data = await page.evaluate(() => {
        // Obtener el título de la pestaña
        const title = document.title;

        // Obtener el HTML del body completo o del contenido principal
        const mainContent = document.querySelector('main') || document.querySelector('.site-main') || document.querySelector('article') || document.body;
        const htmlContent = mainContent.innerHTML;

        // Extraer texto plano limpio (sin etiquetas)
        const textContent = mainContent.innerText || mainContent.textContent;
        
        // Extraer todos los enlaces
        const links = Array.from(document.querySelectorAll('a')).map(a => ({
          text: a.innerText.trim(),
          href: a.href,
        })).filter(link => link.text && link.href);

        // Extraer todas las imágenes con su src y alt
        const images = Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.src,
          alt: img.alt || 'Sin alt',
          width: img.width,
          height: img.height,
        })).filter(img => img.src && !img.src.includes('data:image'));

        return {
          title,
          html: htmlContent,
          text: textContent.replace(/\s+/g, ' ').trim(), // Limpiar espacios
          links,
          images,
          url: window.location.href,
        };
      });

      results[item.slug] = data;
      console.log(`   ✅ Extraído: ${data.title} (${data.links.length} enlaces, ${data.images.length} imágenes)`);

    } catch (error) {
      console.error(`   ❌ Error en ${item.slug}:`, error.message);
      results[item.slug] = { error: error.message, url: fullUrl };
    }
  }

  await browser.close();
  console.log('🛑 Navegador cerrado.');

  // --- 5. Guardar archivos ---
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Guardar JSON completo
  const jsonPath = path.join(OUTPUT_DIR, 'esinsa-dynamic-full.json');
  await fs.writeFile(jsonPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`📁 JSON guardado en: ${jsonPath}`);

  // --- 6. Generar un Markdown legible ---
  let md = `# Esinsa Gaskets - Contenido Dinámico Extraído (con Puppeteer)\n\n`;
  md += `*Extraído el: ${new Date().toLocaleString()}*\n\n`;

  for (const [slug, data] of Object.entries(results)) {
    if (data.error) {
      md += `## ❌ ${slug.toUpperCase()}\n- Error: ${data.error}\n\n`;
      continue;
    }
    md += `## 📄 ${slug.toUpperCase()} - ${data.title}\n\n`;
    md += `**URL:** ${data.url}\n\n`;
    md += `**Texto extraído:**\n> ${data.text.substring(0, 500)}...\n\n`;
    
    if (data.images.length > 0) {
      md += `**Imágenes destacadas:**\n`;
      data.images.slice(0, 5).forEach(img => {
        md += `- ![${img.alt}](${img.src}) (${img.width}x${img.height})\n`;
      });
      md += `\n`;
    }

    if (data.links.length > 0) {
      md += `**Enlaces internos/externos (primeros 10):**\n`;
      data.links.slice(0, 10).forEach(link => {
        md += `- [${link.text}](${link.href})\n`;
      });
      md += `\n`;
    }
    md += `---\n\n`;
  }

  const mdPath = path.join(OUTPUT_DIR, 'esinsa-dynamic-summary.md');
  await fs.writeFile(mdPath, md, 'utf-8');
  console.log(`📁 Markdown guardado en: ${mdPath}`);
}

scrape().catch(console.error);