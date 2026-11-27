const passiveFeatureNames = new Set([
  'iniziato alla magia (stregone)',
  "stile di combattimento: duellante",
  "magia innata dell'ombra",
  'longevo',
  'scurovisione (36 m)',
  'lingue',
  'resistenza necrotica',
  "affinita con l'ombra"
])

export function isPassiveFeature(item) {
  const name = String(item?.nome || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2019']/g, "'")

  return passiveFeatureNames.has(name)
}