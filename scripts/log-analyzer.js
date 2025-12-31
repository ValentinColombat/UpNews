import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

//=== Analyser les logs de catégorisation ===//

export async function analyzeCategoryLogs() {
  const logFile = './logs/categorization.log';

  if (!existsSync(logFile)) {
    console.log('Aucun fichier de log trouvé');
    return;
  }

  const content = await readFile(logFile, 'utf-8');
  const lines = content.trim().split('\n').filter(line => line.length > 0);

  if (lines.length === 0) {
    console.log('Aucune entrée de log');
    return;
  }

  const logs = lines.map(line => JSON.parse(line));

  console.log('\n=== ANALYSE DES CATÉGORISATIONS ===\n');
  console.log(`Total d'articles catégorisés: ${logs.length}`);

  // Stats par méthode
  const methodStats = {};
  const confidenceStats = {};
  const categoryStats = {};
  const lowConfidenceArticles = [];

  for (const log of logs) {
    // Méthodes
    methodStats[log.method] = (methodStats[log.method] || 0) + 1;

    // Confiance
    confidenceStats[log.confidence] = (confidenceStats[log.confidence] || 0) + 1;

    // Catégories
    categoryStats[log.assignedCategory] = (categoryStats[log.assignedCategory] || 0) + 1;

    // Articles à faible confiance
    if (log.confidence === 'low' || log.method === 'fallback') {
      lowConfidenceArticles.push(log);
    }
  }

  console.log('\n--- Méthodes de catégorisation ---');
  for (const [method, count] of Object.entries(methodStats)) {
    const percentage = ((count / logs.length) * 100).toFixed(1);
    console.log(`  ${method}: ${count} (${percentage}%)`);
  }

  console.log('\n--- Niveau de confiance ---');
  for (const [confidence, count] of Object.entries(confidenceStats)) {
    const percentage = ((count / logs.length) * 100).toFixed(1);
    console.log(`  ${confidence}: ${count} (${percentage}%)`);
  }

  console.log('\n--- Répartition par catégorie ---');
  for (const [category, count] of Object.entries(categoryStats)) {
    const percentage = ((count / logs.length) * 100).toFixed(1);
    console.log(`  ${category}: ${count} (${percentage}%)`);
  }

  // Articles à améliorer
  if (lowConfidenceArticles.length > 0) {
    console.log('\n--- Articles nécessitant des mots-clés supplémentaires ---');
    console.log(`Total: ${lowConfidenceArticles.length} articles\n`);

    // Grouper par catégorie assignée
    const groupedByCategory = {};
    for (const article of lowConfidenceArticles) {
      if (!groupedByCategory[article.assignedCategory]) {
        groupedByCategory[article.assignedCategory] = [];
      }
      groupedByCategory[article.assignedCategory].push(article);
    }

    for (const [category, articles] of Object.entries(groupedByCategory)) {
      console.log(`\n  Catégorie: ${category} (${articles.length} articles)`);

      // Afficher max 5 exemples par catégorie
      const examples = articles.slice(0, 5);
      for (const article of examples) {
        console.log(`    - "${article.title.substring(0, 80)}..."`);
        console.log(`      Source: ${article.source} (${article.sourceCategory})`);
        console.log(`      Méthode: ${article.method} | Confiance: ${article.confidence}`);
      }

      if (articles.length > 5) {
        console.log(`    ... et ${articles.length - 5} autres articles`);
      }
    }
  }

  console.log('\n=== FIN DE L\'ANALYSE ===\n');
}

analyzeCategoryLogs();
