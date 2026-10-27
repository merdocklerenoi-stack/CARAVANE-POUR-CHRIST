/**
 * CARAVANE POUR CHRIST — Programme des 365 Jours avec Dieu
 * Méditations bibliques quotidiennes, structurées et fidèles aux Saintes Écritures.
 */

import { Meditation, SpiritualTheme } from '../types';

export const ALL_SPIRITUAL_THEMES: SpiritualTheme[] = [
  'La foi',
  'La prière',
  'L’amour',
  'Le pardon',
  'La gratitude',
  'L’espérance',
  'L’obéissance',
  'La sagesse',
  'La paix intérieure',
  'La persévérance',
  'Le service',
  'La famille',
  'La vie avec le Saint-Esprit',
  'Le caractère chrétien',
  'La connaissance de Jésus-Christ'
];

/**
 * Collection initiale de méditations complètes et profondes.
 * Chaque méditation comprend passage biblique, réflexion théologique et pratique,
 * questions de cœur, prière et action concrète.
 */
export const INITIAL_CURATED_MEDITATIONS: Meditation[] = [
  {
    id: 'cpc-day-1',
    day_number: 1,
    title: 'Prendre la route avec confiance',
    theme: 'La foi',
    scripture_reference: 'Proverbes 3:5-6',
    scripture_text: 'Confie-toi en l’Éternel de tout ton cœur, et ne t’appuie pas sur ta sagesse ; reconnais-le dans toutes tes voies, et il aplanira tes sentiers.',
    scripture_translation: 'Louis Segond 1910',
    reflection: `Commencer une nouvelle étape avec Dieu ne consiste pas à avoir toutes les réponses à l'avance, mais à choisir consciemment de placer sa main dans la Sienne. La caravane de notre vie traverse des déserts arides, des oasis bienfaisantes et des montées abruptes. Mais Celui qui marche en tête ne sommeille ni ne dort.\n\nS'appuyer sur sa propre sagesse est la tentation humaine par excellence : nous voulons contrôler, prévoir, sécuriser chaque mètre du chemin. Pourtant, la paix véritable naît au moment exact où nous disons : « Seigneur, je ne vois pas tout le tracé, mais je te fais confiance ». Lorsque nous reconnaissons Dieu dans nos décisions de travail, de foyer et de relations, Il n'enlève pas toujours tous les obstacles, mais Il aplanit le sentier intérieur de notre cœur.`,
    reflection_questions: [
      'Dans quel domaine de ma vie ai-je encore du mal à lâcher le contrôle entre les mains de Dieu ?',
      'Quelle décision concrète puis-je soumettre au Seigneur aujourd’hui avant d’agir ?'
    ],
    prayer: `Père céleste, en ce jour où je commence ou reprends cette marche spirituelle, je choisis de déposer mes inquiétudes à tes pieds. Pardonne-moi d'avoir souvent cherché à diriger ma vie par mes seules forces. Sois le guide de ma caravane, le rocher sous mes pas et la lumière sur mon chemin. Au nom de Jésus, Amen.`,
    practical_action: 'Prenez 5 minutes de silence ce matin pour confier nommément à Dieu vos trois principales priorités ou soucis de la journée.',
    estimated_reading_minutes: 4,
    status: 'published',
    published_at: '2026-01-01'
  },
  {
    id: 'cpc-day-2',
    day_number: 2,
    title: 'Le secret de la prière intime',
    theme: 'La prière',
    scripture_reference: 'Matthieu 6:6',
    scripture_text: 'Mais quand tu pries, entre dans ta chambre, ferme ta porte, et prie ton Père qui est là dans le lieu secret ; et ton Père, qui voit dans le secret, te le rendra.',
    scripture_translation: 'Louis Segond 1910',
    reflection: `La prière chrétienne n'est pas une récitation théâtrale destinée à impressionner autrui, ni une technique pour marchander avec le Créateur. Jésus nous invite dans un espace intime : la chambre fermée, le sanctuaire secret de l'âme où tombent tous les masques.\n\nDans le silence de cette rencontre, Dieu ne cherche pas l'éloquence de nos phrases, mais la vérité de notre être. Il voit nos fardeaux cachés, nos larmes secrètes et nos espérances les plus pures. Prendre ce rendez-vous quotidien avec le Père transforme profondément notre regard sur le monde.`,
    reflection_questions: [
      'Quel est mon « lieu secret » pour rencontrer Dieu au milieu du bruit du quotidien ?',
      'Mes prières sont-elles devenues machinales ou demeurent-elles un dialogue filial et sincère ?'
    ],
    prayer: `Seigneur Jésus, enseigne-moi à prier avec vérité. Je ferme la porte aux distractions, aux bruits vains et aux inquiétudes de ce siècle pour écouter la voix de ton Esprit. Tu connais mes besoins avant même que je ne les exprime. Fais de mon cœur ta demeure. Amen.`,
    practical_action: 'Isolez-vous dans un endroit calme pendant 10 minutes, sans téléphone ni écran, simplement pour dialoguer avec Dieu en toute sincérité.',
    estimated_reading_minutes: 4,
    status: 'published',
    published_at: '2026-01-02'
  },
  {
    id: 'cpc-day-3',
    day_number: 3,
    title: 'Aimer comme Il nous a aimés',
    theme: 'L’amour',
    scripture_reference: '1 Jean 4:19',
    scripture_text: 'Pour nous, nous l’aimons, parce qu’il nous a aimés le premier.',
    scripture_translation: 'Louis Segond 1910',
    reflection: `L'amour chrétien n'est pas une simple émotion passagère, mais une réponse vivante à l'amour inconditionnel dont Dieu nous a comblés. Avant même que nous ne nous tournions vers Lui, Christ a donné Sa vie pour nous à la croix.\n\nLorsque nous comprenons à quel point nous sommes aimés et acceptés en Jésus, notre capacité d'aimer notre prochain se libère de l'égoïsme et de la peur du rejet. Nous n'aimons plus pour obtenir en retour, mais parce que notre coupe déborde de Sa grâce.`,
    reflection_questions: [
      'Quelle personne autour de moi a particulièrement besoin de recevoir une marque d’amour bienveillant aujourd’hui ?',
      'Est-ce que je me sens pleinement aimé et accueilli par Dieu, ou ai-je encore le sentiment de devoir mériter Sa grâce ?'
    ],
    prayer: `Seigneur, merci pour ton amour infini qui m'a cherché et racheté. Remplis mon cœur de ta compassion afin que je sois un canal de bénédiction pour les personnes que je croiserai aujourd'hui. Amen.`,
    practical_action: 'Envoyez un message d’encouragement sincère ou rendez un service désintéressé à une personne de votre entourage.',
    estimated_reading_minutes: 3,
    status: 'published',
    published_at: '2026-01-03'
  },
  {
    id: 'cpc-day-4',
    day_number: 4,
    title: 'La délivrance par le pardon',
    theme: 'Le pardon',
    scripture_reference: 'Colossiens 3:13',
    scripture_text: 'Supportez-vous les uns les autres, et, si l’un a sujet de se plaindre de l’autre, pardonnez-vous réciproquement. De même que Christ vous a pardonné, pardonnez-vous aussi.',
    scripture_translation: 'Louis Segond 1910',
    reflection: `Garder rancune, c'est boire un poison amer en espérant que l'autre en souffre. L'amertume enchaîne le cœur et dresse une barrière dans notre communion avec Dieu. Le pardon n'est ni l'oubli naïf, ni la justification de l'offense ; c'est un acte de foi et d'obéissance où nous remettons la justice entre les mains de Dieu.\n\nEn regardant à la croix, où Christ a porté nos propres péchés sans nous accabler, nous recevons la force surnaturelle de relâcher ceux qui nous ont blessés. Le pardon libère d'abord celui qui pardonne.`,
    reflection_questions: [
      'Y a-t-il une blessure du passé ou une rancœur récente que je retiens encore dans mon cœur ?',
      'Suis-je prêt à prier aujourd’hui pour le bien de celui ou celle qui m’a offensé ?'
    ],
    prayer: `Seigneur Jésus, toi qui as prié sur la croix : « Père, pardonne-leur car ils ne savent ce qu'ils font », accorde-moi un cœur capable de pardonner. Je choisis de relâcher toute amertume et de bénir ceux qui m'ont fait du tort. Guéris mes plaies intérieures. Amen.`,
    practical_action: 'Dans votre prière personnelle, nommez la personne envers qui vous ressentez de l’amertume et déclarez solennellement devant Dieu que vous lui pardonnez.',
    estimated_reading_minutes: 4,
    status: 'published',
    published_at: '2026-01-04'
  },
  {
    id: 'cpc-day-5',
    day_number: 5,
    title: 'Un cœur débordant de reconnaissance',
    theme: 'La gratitude',
    scripture_reference: '1 Thessaloniciens 5:18',
    scripture_text: 'Rendez grâces en toutes choses, car c’est à votre égard la volonté de Dieu en Jésus-Christ.',
    scripture_translation: 'Louis Segond 1910',
    reflection: `La gratitude n'est pas dépendante des circonstances extérieures, mais de l'état de notre cœur tourné vers la bonté fidèle de Dieu. Dans les saisons d'abondance comme dans les temps de sécheresse, Dieu reste souverain et bon.\n\nPratiquer la reconnaissance quotidienne déplace notre attention de ce qui nous manque vers tout ce que la grâce divine nous accorde : le souffle de vie, le pardon en Christ, une parole de réconfort, un repas partagé. Un chrétien reconnaissant rayonne d'une joie contagieuse.`,
    reflection_questions: [
      'Quels sont les trois bienfaits de Dieu pour lesquels je n’ai pas encore dit merci aujourd’hui ?',
      'Comment puis-je transformer une plainte récurrente en une prière d’action de grâce ?'
    ],
    prayer: `Seigneur, ouvre mes yeux pour voir tes merveilles quotidiennes. Merci pour la vie, pour la santé, pour ton pardon et pour ton Esprit qui m'accompagne. Que ma bouche soit remplie de louanges plutôt que de murmures. Amen.`,
    practical_action: 'Notez dans votre Journal spirituel cinq grâces précises reçues au cours des dernières 24 heures.',
    estimated_reading_minutes: 3,
    status: 'published',
    published_at: '2026-01-05'
  },
  {
    id: 'cpc-day-6',
    day_number: 6,
    title: 'Une ancre inébranlable pour l’âme',
    theme: 'L’espérance',
    scripture_reference: 'Hébreux 6:19',
    scripture_text: 'Cette espérance, nous la possédons comme une ancre de l’âme, sûre et solide ; elle pénètre au-delà du voile.',
    scripture_translation: 'Louis Segond 1910',
    reflection: `Les tempêtes de la vie secouent violemment nos barques : incertitudes économiques, soucis de santé, bouleversements relationnels. Lorsque le vent souffle, un navire a besoin d'une ancre plantée non dans l'écume mouvante, mais dans le fond rocheux.\n\nNotre espérance en Christ n'est pas un vœu pieux ou un optimisme superficiel. Elle est solidement amarrée dans la résurrection de Jésus et dans les promesses éternelles de Dieu. Rien ne peut couper ce câble divin.`,
    reflection_questions: [
      'Quels sont les vents contraires qui menacent actuellement ma tranquillité d’esprit ?',
      'Comment puis-je rappeler à mon âme la fidélité passée de Dieu pour fortifier mon espérance ?'
    ],
    prayer: `Seigneur, lorsque les vagues se lèvent et que le doute m'assaille, rappelle-moi que mon espérance est scellée en toi. Tu es mon ancre et mon refuge. Je choisis de me tenir ferme dans ta vérité. Amen.`,
    practical_action: 'Méditez et apprenez par cœur le verset d’Hébreux 6:19 afin de vous le remémorer lorsque l’inquiétude frappe à votre porte.',
    estimated_reading_minutes: 4,
    status: 'published',
    published_at: '2026-01-06'
  },
  {
    id: 'cpc-day-7',
    day_number: 7,
    title: 'La paix qui surpasse toute intelligence',
    theme: 'La paix intérieure',
    scripture_reference: 'Philippiens 4:6-7',
    scripture_text: 'Ne vous inquiétez de rien ; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces. Et la paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs et vos pensées en Jésus-Christ.',
    scripture_translation: 'Louis Segond 1910',
    reflection: `L'anxiété est l'un des plus grands voleurs de vitalité spirituelle de notre époque. Elle consume notre énergie sur des lendemains incertains que nous ne pouvons pas contrôler. L'apôtre Paul, écrivant depuis une cellule de prison, nous donne l'antidote divin : décharger nos soucis dans la prière avec action de grâce.\n\nLa paix promise ici ne découle pas de l'absence de problèmes, mais de la présence du Prince de la paix. C'est une paix qui défie la logique humaine, une sentinelle céleste qui monte la garde autour de nos pensées.`,
    reflection_questions: [
      'Quelle est la pensée anxieuse qui revient le plus souvent dans mon esprit ces temps-ci ?',
      'Suis-je prêt à échanger ce fardeau contre la paix de Dieu en Lui confiant le résultat ?'
    ],
    prayer: `Prince de la paix, je te dépose mes inquiétudes, mes calculs et mes frayeurs. Viens saturer mes pensées de ton calme divin. Garde mon cœur des agitations du monde et apprends-moi à me reposer dans ta souveraineté. Amen.`,
    practical_action: 'Chaque fois qu’une pensée anxieuse surgit aujourd’hui, arrêtez-vous 10 secondes pour réciter : « Seigneur, je te confie cela, ta paix garde mon cœur ».',
    estimated_reading_minutes: 4,
    status: 'published',
    published_at: '2026-01-07'
  },
  {
    id: 'cpc-day-8',
    day_number: 8,
    title: 'Marcher sous la conduite du Saint-Esprit',
    theme: 'La vie avec le Saint-Esprit',
    scripture_reference: 'Galates 5:22-23',
    scripture_text: 'Mais le fruit de l’Esprit, c’est l’amour, la joie, la paix, la patience, la bonté, la bénignité, la fidélité, la douceur, la tempérance ; la loi n’est pas contre ces choses.',
    scripture_translation: 'Louis Segond 1910',
    reflection: `La vie chrétienne victorieuse ne se produit pas par un effort légaliste surhumain, mais par la sève divine qui coule en nous lorsque nous demeurons attachés au cep divin. Le Saint-Esprit n'est pas une simple force impersonnelle, mais la troisième personne de la Trinité, notre Consolateur et Conseiller.\n\nLe fruit de l'Esprit est un tout harmonieux. Là où nous manquons naturellement de patience ou de douceur, l'Esprit produit en nous Son caractère à mesure que nous Lui cédons la place.`,
    reflection_questions: [
      'Quel aspect du fruit de l’Esprit me semble le plus éprouvé dans mes relations quotidiennes ?',
      'Comment puis-je être plus attentif aux doux avertissements du Saint-Esprit dans mes choix ?'
    ],
    prayer: `Saint-Esprit de Dieu, souffle sur ma vie. Viens produire en moi ce fruit divin que mes seules forces ne peuvent engendrer. Fais grandir en moi la patience, l'amour véritable et la maîtrise de soi. Amen.`,
    practical_action: 'Dans une situation tendue aujourd’hui, demandez au Saint-Esprit de vous donner Sa patience avant de répondre.',
    estimated_reading_minutes: 4,
    status: 'published',
    published_at: '2026-01-08'
  },
  {
    id: 'cpc-day-9',
    day_number: 9,
    title: 'La persévérance dans la course',
    theme: 'La persévérance',
    scripture_reference: 'Hébreux 12:1-2',
    scripture_text: 'Rejetons tout fardeau, et le péché qui nous enveloppe si facilement, et courons avec persévérance dans la carrière qui nous est ouverte, ayant les regards sur Jésus, le chef et le consommateur de la foi.',
    scripture_translation: 'Louis Segond 1910',
    reflection: `La vie avec Dieu n'est pas un sprint de cent mètres, mais un marathon de foi. Il y a des kilomètres où le souffle est aisé et le paysage magnifique, et d'autres où les muscles brûlent et où le découragement murmure d'abandonner.\n\nLe secret du marathonien chrétien réside dans la direction de son regard. Si nous regardons nos faiblesses, nous faiblissons ; si nous regardons les autres coureurs, nous nous comparons ; mais si nous fixons les yeux sur Jésus, Sa fidélité renouvelle nos forces.`,
    reflection_questions: [
      'Quel fardeau inutile ou habitude toxique alourdit ma marche spirituelle ?',
      'Quelle promesse de Jésus peut me motiver à persévérer malgré la fatigue actuelle ?'
    ],
    prayer: `Seigneur Jésus, toi qui as persévéré jusqu’au bout pour notre salut, relève mes bras fatigués et fortifie mes genoux chancelants. Je détourne mon regard des obstacles pour le fixer sur toi. Donne-moi la grâce d'achever ma course avec joie. Amen.`,
    practical_action: 'Identifiez une sainte habitude (méditation quotidienne, lecture de la Bible, prière) que vous aviez délaissée et reprenez-la aujourd’hui.',
    estimated_reading_minutes: 4,
    status: 'published',
    published_at: '2026-01-09'
  },
  {
    id: 'cpc-day-10',
    day_number: 10,
    title: 'La sagesse d’en haut',
    theme: 'La sagesse',
    scripture_reference: 'Jacques 1:5',
    scripture_text: 'Si quelqu’un d’entre vous manque de sagesse, qu’il la demande à Dieu, qui donne à tous simplement et sans reproche, et elle lui sera donnée.',
    scripture_translation: 'Louis Segond 1910',
    reflection: `Le monde est saturé d'informations, mais cruellement démuni de sagesse. L'information concerne ce qui est ; la sagesse concerne la façon de vivre selon le dessein de Dieu.\n\nJacques nous encourage avec une merveilleuse assurance : Dieu ne méprise jamais celui qui reconnaît ses limites et demande Son discernement. Il donne avec générosité. Devant un dilemme familial, professionnel ou personnel, ne nous précipitons pas : demandons la sagesse d'en haut, qui est pure, pacifique, modérée et pleine de miséricorde.`,
    reflection_questions: [
      'Pour quelle décision actuelle ai-je le plus grand besoin du discernement divin ?',
      'Ai-je pris le temps de consulter la Parole de Dieu et de prier avant de trancher ?'
    ],
    prayer: `Dieu de toute sagesse, je confesse que mes pensées sont limitées. Accorde-moi l'intelligence spirituelle pour discerner ce qui est agréable à tes yeux. Dirige mes pas, mes paroles et mes choix en ce jour. Au nom de Jésus, Amen.`,
    practical_action: 'Avant de signer un accord, d’envoyer un courriel important ou de prendre une décision, faites une pause de prière pour solliciter la sagesse divine.',
    estimated_reading_minutes: 4,
    status: 'published',
    published_at: '2026-01-10'
  },
  {
    id: 'cpc-day-11',
    day_number: 11,
    title: 'La beauté du service humble',
    theme: 'Le service',
    scripture_reference: 'Marc 10:45',
    scripture_text: 'Car le Fils de l’homme est venu, non pour être servi, mais pour servir et donner sa vie comme la rançon de plusieurs.',
    scripture_translation: 'Louis Segond 1910',
    reflection: `Dans le royaume de Dieu, la grandeur ne se mesure pas au nombre de serviteurs que l'on possède, mais au nombre de personnes que l'on sert avec amour. Jésus a lavé les pieds poussiéreux de ses disciples, renversant pour toujours les hiérarchies d'orgueil de ce monde.\n\nServir avec joie dans l'ombre est le test suprême de notre ressemblance avec Christ. Chaque geste de bonté discret, chaque écoute accordée à une personne isolée, chaque fardeau partagé est vu et récompensé par notre Père céleste.`,
    reflection_questions: [
      'Quel service discret et sans gloire humaine puis-je accomplir aujourd’hui ?',
      'Est-ce que je cherche la reconnaissance des hommes ou l’approbation de Dieu dans mes actions ?'
    ],
    prayer: `Seigneur Jésus, brise en moi tout esprit d'orgueil et de supériorité. Rends-moi disponible pour servir mon prochain avec ton humilité et ton cœur généreux. Que ma vie reflète ton amour serviteur. Amen.`,
    practical_action: 'Accomplissez une tâche ménagère ou un service sans que personne d’autre ne le sache, comme une offrande secrète au Seigneur.',
    estimated_reading_minutes: 4,
    status: 'published',
    published_at: '2026-01-11'
  },
  {
    id: 'cpc-day-12',
    day_number: 12,
    title: 'Bâtir une maison fondée sur le roc',
    theme: 'La famille',
    scripture_reference: 'Josué 24:15',
    scripture_text: 'Moi et ma maison, nous servirons l’Éternel.',
    scripture_translation: 'Louis Segond 1910',
    reflection: `La famille est le premier champ de mission et le sanctuaire d'apprentissage de la grâce. C'est dans le cadre du foyer que la foi est mise à l'épreuve dans la réalité quotidienne : les humeurs, les tensions, les partages et les pardons nécessaires.\n\nLa déclaration de Josué n'est pas un slogan passager, mais un engagement solennel de fidélité. Bâtir son couple, ses relations filiales et sa maison sur la Parole de Dieu offre un abri solide capable de résister aux vents changeants de notre société.`,
    reflection_questions: [
      'Quelle atmosphère règne dans mon foyer : paix, prière et écoute, ou disputes et critiques ?',
      'Comment puis-je bénir intentionnellement les membres de ma famille aujourd’hui ?'
    ],
    prayer: `Seigneur, je te consacre ma famille, mon foyer et mes proches. Viens régner dans nos cœurs. Guéris les incompréhensions, renouvelle l'amour et fais de notre maison un havre de paix où ton nom est glorifié. Amen.`,
    practical_action: 'Priez nommément pour chaque membre de votre famille aujourd’hui et dites à l’un d’entre eux combien vous l’appréciez.',
    estimated_reading_minutes: 4,
    status: 'published',
    published_at: '2026-01-12'
  },
  {
    id: 'cpc-day-13',
    day_number: 13,
    title: 'L’obéissance qui honore Dieu',
    theme: 'L’obéissance',
    scripture_reference: 'Jean 14:15',
    scripture_text: 'Si vous m’aimez, gardez mes commandements.',
    scripture_translation: 'Louis Segond 1910',
    reflection: `L'obéissance biblique n'est pas une soumission servile née de la peur du châtiment, mais le langage naturel de l'amour envers Christ. Quand nous aimons véritablement quelqu'un, notre plus grand désir est de lui plaire.\n\nLes commandements de Dieu ne sont pas des fardeaux destinés à nous brider, mais des barrières de sécurité divines conçues pour nous protéger et nous conduire à la plénitude de vie. L'obéissance immédiate et joyeuse ouvre les portes de bénédictions spirituelles insoupçonnées.`,
    reflection_questions: [
      'Y a-t-il un ordre clair de la Parole de Dieu sur lequel j’hésite encore à obéir ?',
      'Mon obéissance est-elle motivée par l’amour ou par le devoir religieux ?'
    ],
    prayer: `Seigneur Jésus, je t'aime de tout mon cœur. Donne-moi la force et la joie d'obéir à ta Parole, même quand cela contredit mes désirs charnels ou l'opinion dominante du monde. Amen.`,
    practical_action: 'Mettez en pratique dès aujourd’hui une recommandation biblique que vous avez eu tendance à reporter (réconciliation, intégrité financière, fidélité).',
    estimated_reading_minutes: 3,
    status: 'published',
    published_at: '2026-01-13'
  },
  {
    id: 'cpc-day-14',
    day_number: 14,
    title: 'Le caractère forgé par l’épreuve',
    theme: 'Le caractère chrétien',
    scripture_reference: 'Romains 5:3-4',
    scripture_text: 'Bien plus, nous nous glorifions même des afflictions, sachant que l’affliction produit la persévérance, la persévérance la victoire dans l’épreuve, et cette victoire l’espérance.',
    scripture_translation: 'Louis Segond 1910',
    reflection: `L'or le plus pur est éprouvé par le feu. Dieu ne gaspille aucune de nos souffrances : Il utilise les défis de la vie pour purifier notre caractère, briser nos orgueils et façonner en nous les traits du Christ.\n\nQuand l'épreuve survient, demandons-nous non pas seulement : « Pourquoi cela m'arrive-t-il ? », mais surtout : « Seigneur, que veux-tu façonner en moi à travers cette saison ? ». La patience et la maturité qui en émergent ont une valeur éternelle.`,
    reflection_questions: [
      'Quelle difficulté présente puis-je regarder comme une opportunité de croissance spirituelle ?',
      'Comment ma réaction face aux contrariétés témoigne-t-elle de ma foi devant ceux qui m’entourent ?'
    ],
    prayer: `Père tout-puissant, dans les moments de tension ou d'adversité, garde-moi de murmurer. Façonne en moi un cœur humble, persévérant et digne de ton Évangile. Que ta grâce me suffise en toute circonstance. Amen.`,
    practical_action: 'Face à un contretemps imprévu aujourd’hui, refusez de vous plaindre et remerciez Dieu pour Sa présence fidèle au cœur de la situation.',
    estimated_reading_minutes: 4,
    status: 'published',
    published_at: '2026-01-14'
  },
  {
    id: 'cpc-day-15',
    day_number: 15,
    title: 'Connaître Jésus au-delà des mots',
    theme: 'La connaissance de Jésus-Christ',
    scripture_reference: 'Jean 17:3',
    scripture_text: 'Or, la vie éternelle, c’est qu’ils te connaissent, toi, le seul vrai Dieu, et celui que tu as envoyé, Jésus-Christ.',
    scripture_translation: 'Louis Segond 1910',
    reflection: `Connaître le Christ ne se résume pas à savoir des choses intellectuelles à Son sujet, mais à entretenir une communion intime, vibrante et personnelle avec Lui. La vie éternelle ne commence pas au tombeau : elle débute dès aujourd'hui dans cette relation filiale.\n\nChaque jour passé dans Sa caravane est une opportunité de contempler Sa gloire, de sonder Sa grâce et d'être transformé de gloire en gloire à Son image. Il est le chemin, la vérité et la vie.`,
    reflection_questions: [
      'Est-ce que je connais Jésus personnellement ou seulement par oui-dire ?',
      'Quelle place centrale le Christ occupe-t-il dans mes priorités quotidiennes ?'
    ],
    prayer: `Jésus, mon Seigneur et mon Sauveur, connaître ton cœur est le plus grand privilège de mon existence. Attire-moi à toi. Révèle-toi à mon âme chaque jour davantage et fais grandir mon amour pour toi. Amen.`,
    practical_action: 'Terminez votre journée en relisant un chapitre des Évangiles (ex: Jean 14 ou Jean 15) pour contempler la personne de Jésus.',
    estimated_reading_minutes: 4,
    status: 'published',
    published_at: '2026-01-15'
  }
];

/**
 * Bibliothèque biblique thématique permettant de générer les 365 fiches de méditation
 * avec des passages bibliques réels et vérifiés (Segond) pour l'ensemble de l'année.
 */
interface ScripturalSeed {
  theme: SpiritualTheme;
  title: string;
  reference: string;
  text: string;
  keyThought: string;
}

const SCRIPTURAL_SEEDS: ScripturalSeed[] = [
  {
    theme: 'La foi',
    title: 'La victoire qui triomphe du monde',
    reference: '1 Jean 5:4',
    text: 'Parce que tout ce qui est né de Dieu triomphe du monde ; et la victoire qui triomphe du monde, c’est notre foi.',
    keyThought: 'La foi n’est pas une illusion passive, mais la ferme assurance dans les promesses immuables de Dieu.'
  },
  {
    theme: 'La prière',
    title: 'Prier sans jamais se lasser',
    reference: 'Luc 18:1',
    text: 'Jésus leur adressa une parabole, pour montrer qu’il faut toujours prier, et ne point se relâcher.',
    keyThought: 'La persévérance dans la prière démontre notre dépendance totale envers la grâce souveraine du Père.'
  },
  {
    theme: 'L’amour',
    title: 'Le lien de la perfection',
    reference: 'Colossiens 3:14',
    text: 'Mais par-dessus toutes ces choses revêtez-vous de la charité, qui est le lien de la perfection.',
    keyThought: 'L’amour véritable couronne toutes les vertus et unit les cœurs dans la paix de Christ.'
  },
  {
    theme: 'La paix intérieure',
    title: 'Le repos sous l’ombre du Tout-Puissant',
    reference: 'Psaume 91:1-2',
    text: 'Celui qui demeure sous l’abri du Très-Haut repose à l’ombre du Tout-Puissant. Je dis à l’Éternel : Mon refuge et ma forteresse, mon Dieu en qui je me confie !',
    keyThought: 'Sous les ailes du Seigneur, aucune frayeur de la nuit ne peut ébranler l’âme confiante.'
  },
  {
    theme: 'La sagesse',
    title: 'Le trésor d’un cœur instruit',
    reference: 'Proverbes 4:7',
    text: 'Voici le commencement de la sagesse : Acquiers la sagesse, et avec tout ce que tu possèdes acquiers l’intelligence.',
    keyThought: 'La sagesse divine est plus précieuse que les perles et guide nos pas sur la voie de la vie.'
  },
  {
    theme: 'La gratitude',
    title: 'Bénis l’Éternel, ô mon âme',
    reference: 'Psaume 103:2',
    text: 'Mon âme, bénis l’Éternel, et n’oublie aucun de ses bienfaits !',
    keyThought: 'Se souvenir des bontés passées de Dieu dissipe les nuages sombres du découragement.'
  },
  {
    theme: 'L’espérance',
    title: 'Des projets de paix et non de malheur',
    reference: 'Jérémie 29:11',
    text: 'Car je connais les projets que j’ai formés sur vous, dit l’Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l’espérance.',
    keyThought: 'Dieu détient notre lendemain entre ses mains bienveillantes ; Son dessein s’accomplira.'
  },
  {
    theme: 'L’obéissance',
    title: 'La lampe sur notre sentier',
    reference: 'Psaume 119:105',
    text: 'Ta parole est une lampe à mes pieds, et une lumière sur mon sentier.',
    keyThought: 'Mettre en pratique la Parole de Dieu éclaire chaque pas incertain dans la nuit du monde.'
  },
  {
    theme: 'La persévérance',
    title: 'Ceux qui s’attendent à l’Éternel',
    reference: 'Ésaïe 40:31',
    text: 'Mais ceux qui se confient en l’Éternel renouvellent leur force. Ils prennent le vol comme les aigles ; ils courent, et ne se lassent point ; ils marchent, et ne se fatiguent point.',
    keyThought: 'L’attente patiente devant Dieu renouvelle nos ressources intérieures au-delà de toute limite humaine.'
  },
  {
    theme: 'Le service',
    title: 'Servir avec fidélité',
    reference: 'Galates 6:9-10',
    text: 'Ne nous lassons pas de faire le bien ; car nous moissonnerons au temps convenable, si nous ne nous relâchons pas.',
    keyThought: 'Chaque graine de bonté semée pour Christ portera son fruit en sa saison.'
  },
  {
    theme: 'La vie avec le Saint-Esprit',
    title: 'Le temple de Dieu vivant',
    reference: '1 Corinthiens 6:19',
    text: 'Ne savez-vous pas que votre corps est le temple du Saint-Esprit qui est en vous, que vous avez reçu de Dieu, et que vous ne vous appartenez point à vous-mêmes ?',
    keyThought: 'L’Esprit de Dieu habite en nous pour nous sanctifier, nous guider et nous consoler chaque jour.'
  },
  {
    theme: 'Le pardon',
    title: 'Miséricorde et vérité',
    reference: 'Michée 7:18',
    text: 'Quel Dieu est semblable à toi, qui pardonnes l’iniquité, qui oublies les péchés du reste de ton héritage ? Il ne garde pas sa colère à toujours, car il prend plaisir à la miséricorde.',
    keyThought: 'Pardonner autrui est le reflet terrestre de la miséricorde infinie dont nous avons été couverts.'
  },
  {
    theme: 'Le caractère chrétien',
    title: 'La lumière du monde',
    reference: 'Matthieu 5:16',
    text: 'Que votre lumière luise ainsi devant les hommes, afin qu’ils voient vos bonnes œuvres, et qu’ils glorifient votre Père qui est dans les cieux.',
    keyThought: 'Notre intégrité et notre douceur rendent témoignage de l’Évangile avec plus d’impact que de longs discours.'
  },
  {
    theme: 'La famille',
    title: 'L’héritage de la foi',
    reference: 'Proverbes 22:6',
    text: 'Instruis l’enfant selon la voie qu’il doit suivre ; et quand il sera vieux, il ne s’en détournera pas.',
    keyThought: 'Transmettre la lumière de l’Évangile à la génération future est notre plus noble mission.'
  },
  {
    theme: 'La connaissance de Jésus-Christ',
    title: 'Le bon Berger',
    reference: 'Jean 10:11',
    text: 'Je suis le bon berger. Le bon berger donne sa vie pour ses brebis.',
    keyThought: 'Jésus nous connaît par notre nom et marche devant nous pour nous garder de tout mal.'
  }
];

/**
 * Génère l'ensemble structuré des 365 méditations.
 * Les jours 1 à 15 utilisent les méditations riches rédigées en détail.
 * Les jours 16 à 365 sont bâtis sur les graines scripturaires et les thèmes du programme,
 * avec un contenu complet et éditable depuis l'administration.
 */
export function generateFull365Meditations(): Meditation[] {
  const list: Meditation[] = [...INITIAL_CURATED_MEDITATIONS];

  for (let day = 16; day <= 365; day++) {
    const seedIndex = (day - 1) % SCRIPTURAL_SEEDS.length;
    const seed = SCRIPTURAL_SEEDS[seedIndex];
    const theme = seed.theme;

    list.push({
      id: `cpc-day-${day}`,
      day_number: day,
      title: `${seed.title} (Jour ${day})`,
      theme: theme,
      scripture_reference: seed.reference,
      scripture_text: seed.text,
      scripture_translation: 'Louis Segond 1910',
      reflection: `En ce jour ${day} de notre marche « 365 jours avec Dieu », le Seigneur nous interpelle à travers ce passage : « ${seed.reference} ».\n\n${seed.keyThought} Dans la marche spirituelle de la Caravane Pour Christ, chaque journée apporte son lot de choix et de défis. S'arrêter pour méditer la Parole de Dieu, c'est puiser une eau vive au milieu du désert.\n\nLorsque nous laissons cette vérité biblique pénétrer nos pensées, elle transforme notre vision de nos épreuves et affermit notre foi en Jésus-Christ. Marchons aujourd'hui avec l'assurance que Dieu est à nos côtés à chaque étape du voyage.`,
      reflection_questions: [
        `Comment cette vérité biblique s'applique-t-elle à ma situation présente aujourd'hui ?`,
        `Quelle action concrète puis-je poser pour vivre cette parole dans mes relations ?`
      ],
      prayer: `Seigneur mon Dieu, en ce jour ${day}, je reçois ta Parole avec foi et humilité. Merci pour ta promesse dans ${seed.reference}. Viens éclairer mes pas et guide mes paroles. Que ma vie honore ton saint nom. Au nom de Jésus, Amen.`,
      practical_action: `Gardez ce verset en mémoire tout au long de la journée et partagez une parole bienveillante avec quelqu'un qui en a besoin.`,
      estimated_reading_minutes: 3,
      status: 'published',
      published_at: `2026-${String(Math.min(12, Math.ceil(day / 30.5))).padStart(2, '0')}-${String(((day - 1) % 28) + 1).padStart(2, '0')}`
    });
  }

  return list;
}

// Instance mémoïsée par défaut
let cached365Meditations: Meditation[] | null = null;

export function getAllMeditations(): Meditation[] {
  if (!cached365Meditations) {
    cached365Meditations = generateFull365Meditations();
  }
  return cached365Meditations;
}

export function getMeditationByDay(dayNumber: number): Meditation | undefined {
  const all = getAllMeditations();
  return all.find((m) => m.day_number === dayNumber);
}

/**
 * Calcule le jour du programme correspondant à la date du jour (1 à 365)
 */
export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return Math.min(365, Math.max(1, day));
}
