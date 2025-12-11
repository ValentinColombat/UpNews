import { fetchLatestNews, categorizeAndGroupNews } from './rss-parser.js';
import { generateArticle } from './article-generator.js';
import { selectRandomArticlePerCategory } from './category-mapper.js';
import { supabase } from './supabase-client.js';

async function generateDailyArticles() {
  // Générer les articles pour le lendemain
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const targetDate = tomorrow.toISOString().split('T')[0];

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

      // Récupérer toutes les URLs déjà traitées dans les 15 derniers jours
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
      const fifteenDaysAgoStr = fifteenDaysAgo.toISOString().split('T')[0];

      const { data: recentArticles } = await supabase
        .from('articles')
        .select('source_url')
        .gte('published_date', fifteenDaysAgoStr);

      const usedUrls = new Set(recentArticles?.map(a => a.source_url) || []);
      console.log(`URLs déjà utilisées dans les 15 derniers jours: ${usedUrls.size}`);

    for (const [category] of Object.entries(selectedArticles)) {
      console.log(`\n--- Traitement: ${category} ---`);

      // Vérifier si un article existe déjà pour demain dans cette catégorie
      const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('published_date', targetDate)
        .eq('language', 'fr')
        .eq('category', category)
        .single();

      if (existing) {
        console.log(`Un article existe déjà pour ${category} pour la date ${targetDate}`);
        skippedCount++;
        continue;
      }

      // Récupérer tous les articles de qualité pour cette catégorie
      const categoryArticles = groupedNews[category] || [];
      const qualityArticles = categoryArticles.filter(article =>
        article.categoryConfidence === 'medium' || article.categoryConfidence === 'high'
      );

      // Filtrer les articles dont l'URL n'a pas déjà été traitée
      const availableArticles = qualityArticles.filter(article => !usedUrls.has(article.url));

      console.log(`Articles disponibles: ${availableArticles.length}/${qualityArticles.length}`);

      if (availableArticles.length === 0) {
        console.log(`Aucun article non traité disponible pour ${category}`);
        skippedCount++;
        continue;
      }

      // Sélectionner un article aléatoire parmi les articles disponibles
      const randomIndex = Math.floor(Math.random() * availableArticles.length);
      const newsItem = availableArticles[randomIndex];

      console.log(`Article sélectionné: ${newsItem.title.substring(0, 60)}...`);
      console.log(`Source: ${newsItem.source}`);
      console.log(`Catégorie initiale (RSS): ${newsItem.category || 'non définie'}`);
      console.log(`Catégorie assignée (app): ${category}`);
      if (newsItem.appCategory) {
        console.log(`Catégorie dans l'objet: ${newsItem.appCategory}`);
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

      // Insérer dans Supabase avec la date de demain
      const { data, error } = await supabase
        .from('articles')
        .insert({
          published_date: targetDate,
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