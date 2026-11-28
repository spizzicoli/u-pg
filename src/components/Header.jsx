import React, { useState } from 'react'
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CloseIcon from '@mui/icons-material/Close'
import { useField } from '../context/CharacterContext'
import EditableField from './EditableField'

export default function Header() {
  const [infoOpen, setInfoOpen] = useState(false)
  const [nome, setNome] = useField(['info', 'nome'])
  const [razza, setRazza] = useField(['info', 'razza'])
  const [classi, setClassi] = useField(['info', 'classi'])
  const [livelloTotale, setLivelloTotale] = useField(['info', 'livelloTotale'])
  const [allineamento, setAllineamento] = useField(['info', 'allineamento'])
  const [eta, setEta] = useField(['info', 'eta'])
  const [taglia, setTaglia] = useField(['info', 'taglia'])
  const [velocita, setVelocita] = useField(['info', 'velocita'])
  const [esperienza, setEsperienza] = useField(['info', 'esperienza'])
  const [ispirazione, setIspirazione] = useField(['info', 'ispirazioneEroica'])
  const [immagine] = useField(['info', 'immagine'])

  const updateClassLevel = (index, livello) => {
    setClassi(classi.map((classe, classeIndex) =>
      classeIndex === index ? { ...classe, livello: Math.max(0, Number(livello) || 0) } : classe
    ))
  }

  return (
    <Box className="char-header" component="header">
      <Box className="char-header__inner">
        <Box className="char-header__portrait-frame">
          <img src={immagine} alt={`Ritratto di ${nome}`} className="char-header__portrait" />
          <Box className="char-header__name">
            <EditableField value={nome} onChange={setNome} fullWidth />
          </Box>
        </Box>

        <Box className="char-header__quick">
          <Typography component="div" className="char-header__subline">
            {classi.map((classe, index) => (
              <React.Fragment key={classe.nome}>
                {index > 0 && ' / '}
                {classe.nome} {classe.livello}
              </React.Fragment>
            ))}
          </Typography>
          <FormControlLabel
            className="char-header__inspiration"
            control={
              <Checkbox
                checked={!!ispirazione}
                onChange={(e) => setIspirazione(e.target.checked)}
                sx={{ color: 'secondary.main', '&.Mui-checked': { color: 'secondary.main' } }}
              />
            }
            label="Ispirazione"
          />
          <Tooltip title="Informazioni personaggio" arrow>
            <IconButton
              className="char-header__info-button"
              aria-label="Apri informazioni personaggio"
              onClick={() => setInfoOpen(true)}
            >
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Dialog open={infoOpen} onClose={() => setInfoOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle className="char-info-dialog__title">
          Informazioni personaggio
          <IconButton onClick={() => setInfoOpen(false)} aria-label="Chiudi informazioni">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box className="char-info-grid">
            <Box className="char-info-grid__item char-info-grid__item--wide">
              <span>Razza</span>
              <EditableField value={razza} onChange={setRazza} fullWidth />
            </Box>
            {classi.map((classe, index) => (
              <Box className="char-info-grid__item" key={classe.nome}>
                <span>{classe.nome} · {classe.sottoclasse}</span>
                <EditableField
                  value={classe.livello}
                  onChange={(livello) => updateClassLevel(index, livello)}
                  type="number"
                  minWidth={40}
                />
              </Box>
            ))}
            <Box className="char-info-grid__item">
              <span>Livello totale</span>
              <EditableField value={livelloTotale} onChange={setLivelloTotale} type="number" />
            </Box>
            <Box className="char-info-grid__item">
              <span>Allineamento</span>
              <EditableField value={allineamento} onChange={setAllineamento} fullWidth />
            </Box>
            <Box className="char-info-grid__item">
              <span>Età</span>
              <EditableField value={eta} onChange={setEta} type="number" />
            </Box>
            <Box className="char-info-grid__item">
              <span>Taglia</span>
              <EditableField value={taglia} onChange={setTaglia} fullWidth />
            </Box>
            <Box className="char-info-grid__item">
              <span>Velocità</span>
              <EditableField value={velocita} onChange={setVelocita} type="number" suffix=" m" />
            </Box>
            <Box className="char-info-grid__item char-info-grid__item--wide">
              <span>Esperienza</span>
              <EditableField value={esperienza} onChange={setEsperienza} fullWidth />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
