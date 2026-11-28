import React, { useState } from 'react'
import { Alert, Box, Button, Checkbox, IconButton, MenuItem, Select, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useCharacter, useField } from '../context/CharacterContext'
import { newId } from '../utils/dnd'
import EditableField from './EditableField'
import SectionCard from './SectionCard'

const equipmentSlots = ['Armatura', 'Mantello', 'Anello', 'Amuleto', 'Cintura', 'Stivali', 'Guanti', 'Altro']
const abilities = [
  ['for', 'Forza'],
  ['des', 'Destrezza'],
  ['cos', 'Costituzione'],
  ['int', 'Intelligenza'],
  ['sag', 'Saggezza'],
  ['car', 'Carisma']
]

export default function Equipment() {
  const { equipmentStorageReady = true } = useCharacter()
  const [equipment, setEquipment] = useField(['equipment'])
  const [newName, setNewName] = useState('')
  const [newSlot, setNewSlot] = useState('Altro')

  const updateItem = (id, patch) =>
    setEquipment(equipment.map((item) => (item.id === id ? { ...item, ...patch } : item)))

  const addItem = () => {
    const nome = newName.trim()
    if (!nome) return
    setEquipment([
      ...equipment,
      {
        id: newId('equipment'),
        nome,
        slot: newSlot,
        equipaggiato: true,
        bonusCA: 0,
        caratteristica: '',
        bonusCaratteristica: 0,
        effetti: ''
      }
    ])
    setNewName('')
  }

  return (
    <SectionCard title="Equipaggiamento" className="equipment-panel" defaultExpanded={false}>
      {!equipmentStorageReady && (
        <Alert severity="warning" className="equipment-panel__migration-notice">
          Per salvare l’equipaggiamento su tutti i dispositivi, esegui il file
          supabase/equipment_migration.sql nel SQL Editor di Supabase.
        </Alert>
      )}

      <Box className="equipment-list">
        {equipment.map((item) => (
          <Box className={`equipment-item ${item.equipaggiato ? 'is-equipped' : ''}`} key={item.id}>
            <Box className="equipment-item__head">
              <Checkbox
                size="small"
                checked={!!item.equipaggiato}
                onChange={(event) => updateItem(item.id, { equipaggiato: event.target.checked })}
                inputProps={{ 'aria-label': `Indossa ${item.nome}` }}
              />
              <EditableField
                value={item.nome}
                onChange={(nome) => updateItem(item.id, { nome })}
                fullWidth
              />
              <IconButton
                size="small"
                onClick={() => setEquipment(equipment.filter((entry) => entry.id !== item.id))}
                aria-label={`Rimuovi ${item.nome}`}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box className="equipment-item__fields">
              <Box className="equipment-item__field">
                <span>Slot</span>
                <Select
                  size="small"
                  value={item.slot || 'Altro'}
                  onChange={(event) => updateItem(item.id, { slot: event.target.value })}
                  aria-label={`Slot ${item.nome}`}
                >
                  {equipmentSlots.map((slot) => <MenuItem key={slot} value={slot}>{slot}</MenuItem>)}
                </Select>
              </Box>
              <Box className="equipment-item__field equipment-item__field--number">
                <span>Bonus CA</span>
                <EditableField
                  value={item.bonusCA || 0}
                  onChange={(value) => updateItem(item.id, { bonusCA: Number(value) || 0 })}
                  type="number"
                  minWidth={32}
                />
              </Box>
              <Box className="equipment-item__field">
                <span>Caratteristica</span>
                <Select
                  size="small"
                  value={item.caratteristica || ''}
                  onChange={(event) => updateItem(item.id, { caratteristica: event.target.value })}
                  displayEmpty
                  aria-label={`Caratteristica ${item.nome}`}
                >
                  <MenuItem value="">Nessuna</MenuItem>
                  {abilities.map(([key, label]) => <MenuItem key={key} value={key}>{label}</MenuItem>)}
                </Select>
              </Box>
              <Box className="equipment-item__field equipment-item__field--number">
                <span>Bonus</span>
                <EditableField
                  value={item.bonusCaratteristica || 0}
                  onChange={(value) => updateItem(item.id, { bonusCaratteristica: Number(value) || 0 })}
                  type="number"
                  minWidth={32}
                />
              </Box>
            </Box>

            <Box className="equipment-item__effects">
              <EditableField
                value={item.effetti || ''}
                onChange={(effetti) => updateItem(item.id, { effetti })}
                fullWidth
                multiline
                placeholder="Effetti e capacità dell’oggetto…"
              />
            </Box>
          </Box>
        ))}
      </Box>

      <Box className="equipment-add">
        <TextField
          size="small"
          label="Nuovo oggetto"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter') addItem() }}
        />
        <Select
          size="small"
          value={newSlot}
          onChange={(event) => setNewSlot(event.target.value)}
          aria-label="Slot nuovo oggetto"
        >
          {equipmentSlots.map((slot) => <MenuItem key={slot} value={slot}>{slot}</MenuItem>)}
        </Select>
        <Button size="small" onClick={addItem} disabled={!newName.trim()} aria-label="Aggiungi equipaggiamento">
          <AddIcon />
        </Button>
      </Box>
    </SectionCard>
  )
}