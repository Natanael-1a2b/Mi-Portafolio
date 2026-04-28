export function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[-5, 5, 5]} color="#6366f1" intensity={0.8} />
      <pointLight position={[5, 3, 5]} color="#06b6d4" intensity={0.6} />
    </>
  )
}
