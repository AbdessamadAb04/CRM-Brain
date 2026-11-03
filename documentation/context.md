# CRM Brain — Contexte du projet

## Idée

CRM Brain est une application web de veille et d'aide à la décision pour les métiers de l'écosystème CRM, principalement Salesforce. Elle centralise en un seul tableau de bord les informations dispersées sur le marché, les salaires, les rôles, les certifications et les opportunités freelance.

L'objectif est de répondre simplement à des questions concrètes : quel rôle viser, quelle certification préparer, quel salaire espérer au Maroc ou en Europe, et quelles compétences deviennent stratégiques avec l'IA.

## Problème et solution

Les données CRM sont réparties entre études de marché, sites de recrutement, blogs éditeurs et plateformes de formation. CRM Brain les regroupe dans une interface interactive avec des filtres par période, CRM, région, segment, rôle, séniorité et devise. L'application fonctionne sans serveur ni base de données : les données personnelles sont stockées localement dans le navigateur, et des API externes optionnelles permettent d'actualiser les news et les dépôts GitHub.

## Pages principales

- **Analytiques** : marché, concurrents, adoption de l'IA, salaires et carrière.
- **Rôles & Géographie** : fiches métiers, compétences, certifications et salaires par pays.
- **Freelance & Comparaison** : services, revenus, attractivité et risque lié à l'IA.
- **Trailhead & Certifications** : suivi de progression et préparation des examens.
- **Événements & Paramètres** : actualités, agenda et configuration.

Le public visé est constitué d'étudiants, de jeunes diplômés, de consultants et de freelances souhaitant s'orienter dans l'écosystème CRM.

## Stack et limites

React, TypeScript, Vite, Tailwind CSS, Zustand et Recharts. Le projet illustre la modélisation de données métier, la visualisation et le filtrage multidimensionnel. Les chiffres intégrés sont des estimations issues de sources publiques : CRM Brain est un outil d'aide à la décision, pas une source officielle.
