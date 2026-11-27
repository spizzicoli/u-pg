import React from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useField } from '../context/CharacterContext'
import EditableField from './EditableField'
import SectionCard from './SectionCard'
import { isPassiveFeature } from '../utils/features'

export default function Background() {
  const [nomeBg, setNomeBg] = useField(['background', 'nome'])
  const [testo, setTesto] = useField(['background', 'testo'])
  const [personalita, setPersonalita] = useField(['background', 'personalita'])
  const [ideali, setIdeali] = useField(['background', 'ideali'])
  const [legami, setLegami] = useField(['background', 'legami'])
  const [difetti, setDifetti] = useField(['background', 'difetti'])
  const [featureGroups, setFeatureGroups] = useField(['featureGroups'])

  const passiveFeatures = Object.entries(featureGroups || {}).flatMap(([group, items]) =>
    (items || [])
      .map((item, index) => ({ group, index, item }))
      .filter(({ item }) => isPassiveFeature(item))
  )

  const updatePassiveFeature = (group, index, field, value) => {
    setFeatureGroups({
      ...featureGroups,
      [group]: featureGroups[group].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    })
  }

  const removePassiveFeature = (group, index) => {
    setFeatureGroups({
      ...featureGroups,
      [group]: featureGroups[group].filter((_, itemIndex) => itemIndex !== index)
    })
  }

  return (
    <SectionCard title="Background" className="background-panel" defaultExpanded={false}>
      <Box className="background-panel__name">
        <EditableField value={nomeBg} onChange={setNomeBg} minWidth={160} />
      </Box>
      <Box className="background-panel__text">
        <EditableField value={testo} onChange={setTesto} multiline fullWidth />
      </Box>

      <Box className="traits-grid">
        <Box className="traits-grid__item">
          <span className="traits-grid__label">Personalità</span>
          <EditableField value={personalita} onChange={setPersonalita} multiline fullWidth />
        </Box>
        <Box className="traits-grid__item">
          <span className="traits-grid__label">Ideali</span>
          <EditableField value={ideali} onChange={setIdeali} multiline fullWidth />
        </Box>
        <Box className="traits-grid__item">
          <span className="traits-grid__label">Legami</span>
          <EditableField value={legami} onChange={setLegami} multiline fullWidth />
        </Box>
        <Box className="traits-grid__item">
          <span className="traits-grid__label">Difetti</span>
          <EditableField value={difetti} onChange={setDifetti} multiline fullWidth />
        </Box>
      </Box>

      {passiveFeatures.length > 0 && (
        <Box className="background-passives">
          <Typography className="background-passives__title">Capacità passive</Typography>
          <Box className="background-passives__list">
            {passiveFeatures.map(({ group, index, item }) => (
              <Box className="background-passive" key={item.id}>
                <Box className="background-passive__head">
                  <Box className="background-passive__name">
                    <EditableField
                      value={item.nome}
                      onChange={(value) => updatePassiveFeature(group, index, 'nome', value)}
                      fullWidth
                    />
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => removePassiveFeature(group, index)}
                    aria-label={`Rimuovi ${item.nome}`}
                    className="background-passive__remove"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box className="background-passive__description">
                  <EditableField
                    value={item.descrizione}
                    onChange={(value) => updatePassiveFeature(group, index, 'descrizione', value)}
                    multiline
                    fullWidth
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </SectionCard>
  )
}
