interface Props {
  badge?: string
  title: string
  gradientTitle?: string
  subtitle?: string
}

export function SectionTitle({ badge, title, gradientTitle, subtitle }: Props) {
  return (
    <div className="section-title">
      {badge && <div className="section-badge">{badge}</div>}
      <h2 className="section-title-main">
        {title}
        {gradientTitle && <span className="section-gradient">{gradientTitle}</span>}
      </h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  )
}
