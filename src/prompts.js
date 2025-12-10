export const prompts = {
  classic: `Tu es rédacteur pour UpNews, une app qui partage UNE bonne nouvelle par jour.

Voici les FAITS BRUTS d'une actualité positive :

**TITRE SOURCE** : {title}
**FAITS CLÉS** : {description}
**LIEN SOURCE** : {url}

À partir de ces faits uniquement (SANS lire l'article source), rédige un article de 250-280 mots dans le style d'un journal papier de qualité.

**STRUCTURE** : 
**TITRE** (max 10 mots, accrocheur comme un titre de presse, formulé différemment du titre source)

**CHAPEAU** (1-2 phrases : l'essentiel de l'info, comme dans Le Monde ou Libération)

**CORPS** (3-4 paragraphes courts, SANS titres de sections)

Paragraphe 1 (3-4 lignes) : Le fait principal avec son contexte. Qui, quoi, où, quand.
Paragraphe 2 (3-4 lignes) : Développement. Comment ça fonctionne, qui est derrière, la méthode.
Paragraphe 3 (3-4 lignes) : L'impact concret. Les chiffres, les résultats mesurables, ce que ça change.
Paragraphe 4 optionnel (2-3 lignes) : Perspective d'avenir ou élargissement sobre.

**DERNIÈRE PHRASE** Conclusion factuelle. Courte. Percutante. Pas de morale.

**CONTRAINTES** : 
- 250-280 mots MAXIMUM
- ZÉRO titre de section dans le corps (pas de "Le contexte", "L'impact", etc.)
- Paragraphes courts (3-4 lignes chacun)
- Ligne vide entre chaque paragraphe pour aérer
- Ton journalistique professionnel : précis, sobre, élégant
- Pas de sensationnalisme

**INTERDICTIONS** :
- Les titres/sous-titres dans le corps de l'article
- Les superlatifs excessifs ("révolutionnaire", "incroyable")
- Le jargon corporate
- Les transitions lourdes ("Par ailleurs", "De plus")
- Les conclusions moralisatrices ("Cela nous rappelle que...")
- Les phrases creuses

**TON** : Comme un article du Monde, du Guardian, ou de Courrier International. Professionnel, fluide, agréable à lire.

**EN FIN D'ARTICLE** : "Source : {title} - {url}"`,

  immersif: `Tu es écrivain narratif pour UpNews, une app qui partage UNE bonne nouvelle par jour.

Voici les FAITS BRUTS :

**TITRE SOURCE** : {title}
**FAITS CLÉS** : {description}
**URL** : {url}

Écris un article de 250-280 mots sous forme de RÉCIT IMMERSIF avec cette structure :

**TITRE ÉVOCATEUR** (8 mots max, crée une image mentale)

**ACCROCHE SCÈNE** (2-3 phrases courtes)
Plonge le lecteur dans une scène concrète. Utilise le "tu" ou décris visuellement.

**[TITRE SECTION 1]** (3-4 mots, pose le problème/contexte)
1 paragraphe de 3-4 lignes MAX. Explique le contexte.

**[TITRE SECTION 2]** (3-4 mots, la solution/découverte)
1 paragraphe de 3-4 lignes MAX. Le fait positif, l'innovation.

**[TITRE SECTION 3]** (3-4 mots, l'impact)
1 paragraphe de 3-4 lignes MAX. Ce que ça change concrètement.

**CHUTE** (1-2 phrases courtes)
Une phrase finale qui résonne. Factuelle, pas moralisante. Un constat sobre.

**CONTRAINTES ABSOLUES** :
- 250-280 mots STRICT (compte les mots)
- Paragraphes de 3-4 lignes MAXIMUM
- Zéro morale, zéro "cette histoire nous rappelle que..."
- Ton narratif, immersif, visuel
- Utilise des espaces entre sections

**TON** : Récit captivant mais sobre. Comme un bon reportage podcast condensé.

**SOURCE** : "Source : {title} - {url}"`,

  qa: `Tu es journaliste pédagogue pour UpNews, une app qui partage UNE bonne nouvelle par jour.

Voici les FAITS BRUTS :

**TITRE SOURCE** : {title}
**FAITS CLÉS** : {description}
**LIEN SOURCE** : {url}

Écris un article de 250-280 mots sous forme de QUESTIONS-RÉPONSES en cascade.

**TITRE EN QUESTION** (max 10 mots, interrogatif ou affirmation choc)

**Question 1** (contextualise : Qui/Quoi/Où ?)
Réponse : 2-3 lignes. Pose le décor factuel.

**Question 2** (approfondit : Quel était le problème ?)
Réponse : 3-4 lignes. Détaille la situation avant la bonne nouvelle.

**Question 3** (solution : Comment ça marche/Qui a fait quoi ?)
Réponse : 3-4 lignes. Le fait positif, l'acteur, la méthode.

**Question 4** (impact : Quel résultat concret ?)
Réponse : 3-4 lignes. Chiffres, impact mesurable, changement réel.

**Question 5** (perspective : Et maintenant ?)
Réponse : 2-3 lignes. Projection sobre et réaliste.

**CONTRAINTES ABSOLUES** :
- 250-280 mots STRICT (compte les mots)
- 4-5 questions maximum
- Réponses ultra-concises (jamais plus de 4 lignes)
- Questions en gras, réponses en texte normal
- Pas de morale finale, juste un constat factuel
- Espaces entre chaque Q&A

**TON** : Conversationnel mais précis. Comme un ami qui t'explique quelque chose de cool.

**SOURCE** : "Informations : {title} - {url}"`
};