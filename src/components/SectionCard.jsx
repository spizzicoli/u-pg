import React, { useId, useState } from 'react'
import { Paper, Box, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function SectionCard({
  id,
  title,
  icon,
  className = '',
  large = false,
  defaultExpanded = true,
  children,
  action
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const contentId = `section-card-${useId()}`

  return (
    <Paper
      id={id}
      component="section"
      elevation={0}
      className={`section-card ${large ? 'section-card--large' : ''} ${className}`}
    >
      <Box className="section-card__header">
        <Box
          component="button"
          type="button"
          className="section-card__toggle"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => setExpanded((open) => !open)}
        >
          <Typography variant="h6" component="span" className="section-card__title">
            {icon && <span className="section-card__icon">{icon}</span>}
            {title}
          </Typography>
          <ExpandMoreIcon className="section-card__expand" aria-hidden="true" />
        </Box>
        {action && <Box className="section-card__action">{action}</Box>}
      </Box>
      <Box className="section-card__body" id={contentId} hidden={!expanded}>
        {children}
      </Box>
    </Paper>
  )
}
