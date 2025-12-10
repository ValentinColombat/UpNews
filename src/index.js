import { fetchLatestNews, categorizeAndGroupNews } from './rss-parser.js';
import { generateArticle } from './article-generator.js';
import { selectRandomArticlePerCategory } from './category-mapper.js';
import { supabase } from './supabase-client.js';

async function generateDailyArticles() {
  console.log('Génération des articles du jour...');
  console.log('Date:', new Date().toISOString().split('T')[0]);
  const today = new Date().toISOString().split('T')[0];

  try {
    // 1. Récupérer toutes les actualités des flux RSS
    const allNews = await fetchLatestNews();

    if (allNews.length === 0) {
      console.error('Aucune actualité récupérée');
      return;
    }

    // 2. Catégoriser et grouper par thème via mapping statique
    const groupedNews = await categorizeAndGroupNews(allNews);

    // 3. Sélectionner aléatoirement 1 article par catégorie
    const selectedArticles = selectRandomArticlePerCategory(groupedNews);

    console.log(`\nArticles sélectionnés: ${Object.keys(selectedArticles).length} catégories`);

    // 4. Générer un article pour chaque catégorie
    const promptTypes = ['classic', 'immersif', 'qa'];
    let generatedCount = 0;
    let skippedCount = 0;

    for (const [category, newsItem] of Object.entries(selectedArticles)) {
      console.log(`\n--- Traitement: ${category} ---`);
      console.log(`Article: ${newsItem.title.substring(0, 60)}...`);
      console.log(`Source: ${newsItem.source}`);
      console.log(`Catégorie initiale (RSS): ${newsItem.category || 'non définie'}`);
      console.log(`Catégorie assignée (app): ${category}`);
      if (newsItem.appCategory) {
        console.log(`Catégorie dans l'objet: ${newsItem.appCategory}`);
      }

      // Vérifier si un article existe déjà pour aujourd'hui dans cette catégorie
      const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('published_date', today)
        .eq('language', 'fr')
        .eq('category', category)
        .single();

      if (existing) {
        console.log(`Un article existe déjà pour ${category} aujourd'hui`);
        skippedCount++;
        continue;
      }

      // Choisir un prompt aléatoire
      const randomPrompt = promptTypes[Math.floor(Math.random() * promptTypes.length)];
      console.log(`Génération avec prompt: ${randomPrompt}`);

      // Générer l'article avec Claude
      const articleContent = await generateArticle(newsItem, randomPrompt);

      // Extraire le titre de l'article généré
      const titleMatch = articleContent.match(/\*\*(.+?)\*\*/);
      const title = titleMatch ? titleMatch[1] : newsItem.title;

      console.log(`Article généré: ${title.substring(0, 50)}...`);

      // Insérer dans Supabase
      const { data, error } = await supabase
        .from('articles')
        .insert({
          published_date: today,
          language: 'fr',
          title: title,
          summary: newsItem.description.substring(0, 200),
          content: articleContent,
          category: category,
          source_url: newsItem.url
        })
        .select();

      if (error) {
        console.error(`Erreur insertion Supabase pour ${category}:`, error);
        continue;
      }

      console.log(`Sauvegardé (ID: ${data[0].id})`);
      generatedCount++;
    }

    // Résumé final
    console.log('\n' + '='.repeat(50));
    console.log('RÉSUMÉ DE LA GÉNÉRATION');
    console.log('='.repeat(50));
    console.log(`Articles générés: ${generatedCount}`);
    console.log(`Articles ignorés (déjà existants): ${skippedCount}`);
    console.log(`Total articles traités: ${generatedCount + skippedCount}`);
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('Erreur globale:', error);
  }
}

generateDailyArticles();