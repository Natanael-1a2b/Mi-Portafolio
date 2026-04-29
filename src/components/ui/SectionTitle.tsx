interface Props {
  title: string
}

export function SectionTitle({ title }: Props) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
    </div>
  )
}
