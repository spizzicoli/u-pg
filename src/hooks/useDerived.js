import { useMemo } from 'react'
import { useCharacter } from '../context/CharacterContext'
import { abilityMod, proficiencyBonusByLevel, carryCapacity, liftCapacity } from '../utils/dnd'

export default function useDerived() {
  const c = useCharacter()

  return useMemo(() => {
    const equipmentAbilityBonuses = Object.fromEntries(
      Object.keys(c.abilities).map((ability) => [ability, 0])
    )
    let equipmentAcBonus = 0
    ;(c.equipment || []).filter((item) => item.equipaggiato).forEach((item) => {
      equipmentAcBonus += Number(item.bonusCA) || 0
      if (item.caratteristica in equipmentAbilityBonuses) {
        equipmentAbilityBonuses[item.caratteristica] += Number(item.bonusCaratteristica) || 0
      }
    })

    const abilityScores = Object.fromEntries(
      Object.entries(c.abilities).map(([ability, score]) => [
        ability,
        Number(score) + equipmentAbilityBonuses[ability]
      ])
    )
    const mods = Object.fromEntries(
      Object.entries(abilityScores).map(([k, v]) => [k, abilityMod(v)])
    )
    const prof = proficiencyBonusByLevel(c.info.livelloTotale)

    const savingThrows = Object.fromEntries(
      Object.keys(c.abilities).map((ab) => [
        ab,
        mods[ab] + (c.savingThrows[ab] ? prof : 0)
      ])
    )

    const skills = c.skills.map((s) => ({
      ...s,
      bonus: mods[s.abilita] + (s.competenza ? prof : 0)
    }))

    const skillBonusByName = Object.fromEntries(skills.map((s) => [s.id, s.bonus]))

    const passivePercezione = 10 + (skillBonusByName.percezione ?? mods.sag)
    const passiveIndagare = 10 + (skillBonusByName.indagare ?? mods.int)
    const passiveIntuizione = 10 + (skillBonusByName.intuizione ?? mods.sag)

    const ac = c.combat.acBase + (c.combat.acDexBonus ? mods.des : 0) +
      (Number(c.combat.acAltriBonus) || 0) + equipmentAcBonus
    const initiative = mods.des

    const attacks = c.attacks.map((a) => {
      const abMod = mods[a.abilita] ?? 0
      return {
        ...a,
        bonusAttacco: abMod + prof + (Number(a.bonusMagico) || 0),
        bonusDanno: abMod + (Number(a.bonusMagico) || 0) + (Number(a.bonusDannoExtra) || 0)
      }
    })

    const cdManovre = 8 + prof + mods.for

    const spellSaveDC = 8 + prof + mods.car
    const spellAttackBonus = prof + mods.car

    const carryMax = carryCapacity(abilityScores.for)
    const liftMax = liftCapacity(abilityScores.for)
    const carryCurrent = c.inventory.reduce(
      (sum, item) => sum + (Number(item.peso) || 0) * (Number(item.quantita) || 0),
      0
    )

    return {
      mods,
      abilityScores,
      equipmentAbilityBonuses,
      equipmentAcBonus,
      prof,
      savingThrows,
      skills,
      passivePercezione,
      passiveIndagare,
      passiveIntuizione,
      ac,
      initiative,
      attacks,
      cdManovre,
      spellSaveDC,
      spellAttackBonus,
      carryMax,
      liftMax,
      carryCurrent
    }
  }, [c])
}
