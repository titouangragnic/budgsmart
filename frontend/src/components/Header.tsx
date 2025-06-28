import './Header.css'

interface HeaderProps {
  title: string
  subtitle: string
}

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  )
}

export default Header
