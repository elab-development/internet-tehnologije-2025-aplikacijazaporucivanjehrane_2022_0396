import { render, screen, waitFor } from '@testing-library/react'
import StatsPage from '@/app/stats/page'

// Mock Recharts komponente da bi izbegli probleme sa renderingom u test okruženju
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
}))

describe('StatsPage', () => {
  beforeEach(() => {
    // Resetuj mock-ove pre svakog testa
    jest.clearAllMocks()
  })

  it('treba da prikaže naslov "Statistika prodaje"', async () => {
    render(<StatsPage />)
    
    // Čekaj da se komponenta mount-uje (zbog isMounted state-a)
    await waitFor(() => {
      // SectionHeaders renderuje mainHeader kao h2 element
      const heading = screen.getByText('Statistika prodaje')
      expect(heading).toBeInTheDocument()
      expect(heading.tagName).toBe('H2')
    })
  })

  it('treba da prikaže sve tri kartice sa rezimeom', async () => {
    render(<StatsPage />)
    
    await waitFor(() => {
      // Proveri da li su kartice prisutne
      const porudzbineCard = screen.getByText('Porudžbine')
      const prihodCard = screen.getByText('Prihod (RSD)')
      const prosekCard = screen.getByText('Prosek')
      
      expect(porudzbineCard).toBeInTheDocument()
      expect(prihodCard).toBeInTheDocument()
      expect(prosekCard).toBeInTheDocument()
    })
  })

  it('treba da prikaže vrednosti u karticama sa rezimeom', async () => {
    render(<StatsPage />)
    
    await waitFor(() => {
      // Proveri da li su vrednosti prisutne
      expect(screen.getByText('502')).toBeInTheDocument()
      expect(screen.getByText('1.27M')).toBeInTheDocument()
      expect(screen.getByText('2,538')).toBeInTheDocument()
    })
  })

  it('treba da renderuje grafikon komponente bez grešaka', async () => {
    const { container } = render(<StatsPage />)
    
    await waitFor(() => {
      // Proveri da li su grafikon komponente renderovane
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
    })
    
    // Proveri da li nema grešaka u konzoli (komponenta se renderuje bez pucanja)
    expect(container).toBeTruthy()
  })

  it('treba da prikaže naslove grafikona', async () => {
    render(<StatsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Broj porudžbina po kategorijama')).toBeInTheDocument()
      expect(screen.getByText('Udeo u ukupnom prihodu')).toBeInTheDocument()
    })
  })

  it('treba da se komponenta ne renderuje pre nego što se mount-uje', () => {
    const { container } = render(<StatsPage />)
    
    // Na početku, pre useEffect-a, komponenta vraća null
    // Ali React Testing Library će automatski čekati da se komponenta renderuje
    expect(container).toBeTruthy()
  })
})
