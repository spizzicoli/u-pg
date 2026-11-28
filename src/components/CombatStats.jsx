import React, { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { useField } from '../context/CharacterContext'
import useDerived from '../hooks/useDerived'
import { fmtMod } from '../utils/dnd'
import EditableField from './EditableField'
import UsageTracker from './UsageTracker'
import SectionCard from './SectionCard'

export default function CombatStats({ id }) {
  const [damageInput, setDamageInput] = useState('')
  const [acBase, setAcBase] = useField(['combat', 'acBase'])
  const [acAltriBonus, setAcAltriBonus] = useField(['combat', 'acAltriBonus'])
  const [hpMax, setHpMax] = useField(['combat', 'hpMax'])
  const [hpCurrent, setHpCurrent] = useField(['combat', 'hpCurrent'])
  const [hpTemp, setHpTemp] = useField(['combat', 'hpTemp'])
  const [hitDice, setHitDice] = useField(['combat', 'hitDice'])
  const { ac, initiative } = useDerived()

  const applyDamage = () => {
    const damage = Math.max(0, Number(damageInput) || 0)
    if (!damage) return

    const absorbedByTempHp = Math.min(Number(hpTemp) || 0, damage)
    setHpTemp((Number(hpTemp) || 0) - absorbedByTempHp)
    setHpCurrent(Math.max(0, (Number(hpCurrent) || 0) - (damage - absorbedByTempHp)))
    setDamageInput('')
  }

  return (
    <SectionCard id={id} title="Combattimento" className="combat-panel" defaultExpanded>
      <Box className="combat-top">
        <Box className="combat-stat combat-stat--ac">
          <Box className="combat-stat__value">
            {ac}
          </Box>
          <Box className="combat-stat__label">
            Classe Armatura
            <Box className="combat-stat__hint">
              base <EditableField value={acBase} onChange={setAcBase} type="number" /> · altri{' '}
              <EditableField value={acAltriBonus} onChange={setAcAltriBonus} type="number" />
            </Box>
          </Box>
        </Box>
        <Box className="combat-stat">
          <Box className="combat-stat__value">{fmtMod(initiative)}</Box>
          <Box className="combat-stat__label">Iniziativa</Box>
        </Box>
      </Box>

      <Box className="hp-block">
        <Box className="hp-block__row">
          <span>PF Attuali</span>
          <EditableField value={hpCurrent} onChange={setHpCurrent} type="number" variant="stat" />
        </Box>
        <Box className="hp-block__row">
          <span>PF Massimi</span>
          <EditableField value={hpMax} onChange={setHpMax} type="number" variant="stat" />
        </Box>
        <Box className="hp-block__row">
          <span>PF Temporanei</span>
          <EditableField value={hpTemp} onChange={setHpTemp} type="number" variant="stat" />
        </Box>
      </Box>

      <Box className="damage-entry">
        <TextField
          size="small"
          type="number"
          label="Danni subiti"
          value={damageInput}
          onChange={(event) => setDamageInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') applyDamage()
          }}
          inputProps={{ min: 0, step: 1 }}
        />
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<RemoveCircleOutlineIcon />}
          onClick={applyDamage}
          disabled={!(Number(damageInput) > 0)}
        >
          Applica
        </Button>
      </Box>

      <Box className="hit-dice">
        <Box className="hit-dice__title">Dadi Vita</Box>
        {hitDice.map((hd, i) => (
          <Box key={hd.id} className="hit-dice__row">
            <Box className="hit-dice__label">
              <EditableField
                value={hd.totale}
                onChange={(value) => {
                  const totale = Math.max(0, Number(value) || 0)
                  setHitDice(hitDice.map((die, index) =>
                    index === i ? { ...die, totale, usati: Math.min(die.usati, totale) } : die
                  ))
                }}
                type="number"
                minWidth={24}
              />{hd.dado} ({hd.classe})
            </Box>
            <UsageTracker
              usiMax={hd.totale}
              usiSpesi={hd.usati}
              size="small"
              onChange={(usati) => {
                const next = hitDice.map((h, idx) => (idx === i ? { ...h, usati } : h))
                setHitDice(next)
              }}
            />
          </Box>
        ))}
      </Box>
    </SectionCard>
  )
}
