import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { Key3D } from './Key3D'
import { skills } from '../../data/skills'
import { useIsMobile } from '../../hooks/useIsMobile'
import type { Skill } from '../../data/skills'
import * as THREE from 'three'

interface Props {
  onSkillSelect: (skill: Skill | null) => void
  selectedSkill: Skill | null
}

export function Keyboard3D({ onSkillSelect, selectedSkill }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const isMobile = useIsMobile()
  const [, setLastSelected] = useState<string | null>(null)

  // On mobile, show only 10 main skills
  const visibleSkills = useMemo(() => {
    if (!isMobile) return skills
    const mainIds = ['dotnet', 'csharp', 'sqlserver', 'python', 'html5', 'css3', 'react', 'javascript', 'git', 'github']
    return skills.filter((s) => mainIds.includes(s.id))
  }, [isMobile])

  // Build grid layout
  const keyPositions = useMemo(() => {
    const rows: Skill[][] = []
    visibleSkills.forEach((skill) => {
      if (!rows[skill.row]) rows[skill.row] = []
      rows[skill.row].push(skill)
    })

    const spacing = 1.0
    const totalRows = rows.length
    const result: { skill: Skill; pos: [number, number, number] }[] = []

    rows.forEach((rowSkills, rowIdx) => {
      const rowWidth = rowSkills.length * spacing
      const offsetX = -rowWidth / 2 + spacing / 2
      const z = (rowIdx - totalRows / 2 + 0.5) * spacing

      rowSkills.forEach((skill, colIdx) => {
        result.push({
          skill,
          pos: [offsetX + colIdx * spacing, 0, z],
        })
      })
    })

    return result
  }, [visibleSkills])

  // Mouse tracking for rotation
  useMemo(() => {
    if (typeof window === 'undefined') return
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  useFrame(() => {
    if (!groupRef.current || isMobile) return
    groupRef.current.rotation.y += (mouse.current.x * 0.15 - groupRef.current.rotation.y) * 0.05
    groupRef.current.rotation.x += (mouse.current.y * 0.08 - groupRef.current.rotation.x) * 0.05
  })

  const handleSelect = (skill: Skill) => {
    setLastSelected((prev) => {
      if (prev === skill.id) {
        onSkillSelect(null)
        return null
      }
      onSkillSelect(skill)
      return skill.id
    })
  }

  return (
    <group ref={groupRef} rotation={[0.4, 0, 0]} position={[0, -0.5, 0]}>
      {/* Base plate */}
      <RoundedBox
        args={[6, 0.15, 5]}
        radius={0.08}
        smoothness={4}
        position={[0, -0.15, 0]}
      >
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.6}
          metalness={0.4}
        />
      </RoundedBox>

      {/* Keys */}
      {keyPositions.map(({ skill, pos }) => (
        <Key3D
          key={skill.id}
          skill={skill}
          position={pos}
          onSelect={handleSelect}
          isSelected={selectedSkill?.id === skill.id}
        />
      ))}
    </group>
  )
}
