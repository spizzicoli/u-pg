import React from 'react'
import { Box, Chip, IconButton, Button, MenuItem, Select } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'
import { useField } from '../context/CharacterContext'
import useDerived from '../hooks/useDerived'
import { abilityShort, fmtMod, newId } from '../utils/dnd'
import EditableField from './EditableField'
import SectionCard from './SectionCard'

export default function Attacks() {
  const [attacks, setAttacks] = useField(['attacks'])
  const { attacks: computed, mods, prof } = useDerived()

  const computedById = Object.fromEntries(computed.map((a) => [a.id, a]))

  const updateAttack = (id, patch) =>
    setAttacks(attacks.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  const removeAttack = (id) => setAttacks(attacks.filter((a) => a.id !== id))
  const addAttack = () =>
    setAttacks([
      ...attacks,
      {
        id: newId('atk'),
        nome: 'Nuova arma',
        abilita: 'for',
        bonusMagico: 0,
        bonusDannoExtra: 0,
        dadoDanno: '1d6',
        tipoDanno: 'Contundente',
        proprieta: []
      }
    ])

  return (
    <SectionCard title="Attacchi" className="attacks-panel" defaultExpanded={false}>
      <Box className="attacks-panel__list">
        {attacks.map((a) => {
          const comp = computedById[a.id]
          const abilityMod = mods[a.abilita] ?? 0
          const magicBonus = Number(a.bonusMagico) || 0
          const extraDamage = Number(a.bonusDannoExtra) || 0

          return (
            <Box key={a.id} className="attack-card">
              <Box className="attack-card__head">
                <EditableField
                  value={a.nome}
                  onChange={(v) => updateAttack(a.id, { nome: v })}
                  fullWidth
                />
                <span className="attack-card__bonus">{comp ? fmtMod(comp.bonusAttacco) : ''}</span>
                <IconButton size="small" onClick={() => removeAttack(a.id)} aria-label="Rimuovi arma">
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>

              <Box className="attack-card__row">
                <Box className="attack-card__field">
                  <span>Caratteristica</span>
                  <Select
                    size="small"
                    value={a.abilita}
                    onChange={(e) => updateAttack(a.id, { abilita: e.target.value })}
                    className="attack-card__select"
                  >
                    {Object.keys(abilityShort).map((ab) => (
                      <MenuItem key={ab} value={ab}>
                        {abilityShort[ab]}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Box className="attack-card__field">
                  <span>Dado Danno</span>
                  <EditableField
                    value={a.dadoDanno}
                    onChange={(v) => updateAttack(a.id, { dadoDanno: v })}
                    minWidth={50}
                  />
                </Box>
                <Box className="attack-card__field">
                  <span>Tipo Danno</span>
                  <EditableField
                    value={a.tipoDanno}
                    onChange={(v) => updateAttack(a.id, { tipoDanno: v })}
                    minWidth={80}
                  />
                </Box>
              </Box>

              <Box className="attack-card__row">
                <Box className="attack-card__field">
                  <span>Bonus Magico</span>
                  <EditableField
                    value={a.bonusMagico}
                    onChange={(v) => updateAttack(a.id, { bonusMagico: Number(v) || 0 })}
                    type="number"
                    minWidth={40}
                  />
                </Box>
                <Box className="attack-card__field">
                  <span>Bonus Danno Extra</span>
                  <EditableField
                    value={a.bonusDannoExtra}
                    onChange={(v) => updateAttack(a.id, { bonusDannoExtra: Number(v) || 0 })}
                    type="number"
                    minWidth={40}
                  />
                </Box>
              </Box>

              {comp && (
                <Box className="attack-card__calculations">
                  <Box className="attack-card__calculation">
                    <span className="attack-card__calculation-label">Per colpire</span>
                    <span className="attack-card__calculation-formula">
                      d20 + {abilityShort[a.abilita]} ({fmtMod(abilityMod)}) + competenza ({fmtMod(prof)})
                      {' + '}magico ({fmtMod(magicBonus)}) = <strong>{fmtMod(comp.bonusAttacco)}</strong>
                    </span>
                  </Box>
                  <Box className="attack-card__calculation">
                    <span className="attack-card__calculation-label">Danni</span>
                    <span className="attack-card__calculation-formula">
                      {a.dadoDanno} + {abilityShort[a.abilita]} ({fmtMod(abilityMod)})
                      {' + '}magico ({fmtMod(magicBonus)}) + extra ({fmtMod(extraDamage)}) ={' '}
                      <strong>{a.dadoDanno} {fmtMod(comp.bonusDanno)}</strong> {a.tipoDanno}
                    </span>
                  </Box>
                </Box>
              )}

              <Box className="attack-card__tags">
                <EditableField
                  value={a.proprieta.join(', ')}
                  onChange={(v) =>
                    updateAttack(a.id, {
                      proprieta: v
                        .split(',')
                        .map((p) => p.trim())
                        .filter(Boolean)
                    })
                  }
                  fullWidth
                  placeholder="Proprietà separate da virgola (es. Finesse, Leggera…)"
                />
              </Box>
              {a.proprieta.length > 0 && (
                <Box className="attack-card__chips">
                  {a.proprieta.map((p) => (
                    <Chip key={p} label={p} size="small" className="attack-card__chip" />
                  ))}
                </Box>
              )}
            </Box>
          )
        })}
      </Box>

      <Button size="small" onClick={addAttack} startIcon={<AddIcon />} className="attacks-panel__add-btn">
        Aggiungi arma
      </Button>
    </SectionCard>
  )
}
