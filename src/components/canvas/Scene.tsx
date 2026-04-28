import { Canvas } from '@react-three/fiber'
import { Lights } from './Lights'
import { HeroParticles } from './HeroParticles'
import { Keyboard3D } from './Keyboard3D'
import { useWebGLSupport } from '../../hooks/useWebGLSupport'
import type { Skill } from '../../data/skills'

interface Props {
  showKeyboard: boolean
  onSkillSelect: (skill: Skill | null) => void
  selectedSkill: Skill | null
}

export function Scene({ showKeyboard, onSkillSelect, selectedSkill }: Props) {
  const webglSupported = useWebGLSupport()

  if (!webglSupported) return null

  return (
    <Canvas
      camera={{ position: [0, 3, 6], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      <Lights />
      <HeroParticles />
      {showKeyboard && (
        <group position={[0, -1, 0]}>
          <Keyboard3D onSkillSelect={onSkillSelect} selectedSkill={selectedSkill} />
        </group>
      )}
    </Canvas>
  )
}
