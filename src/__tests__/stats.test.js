import { render, screen } from "@testing-library/react";
import StatsPage from "@/app/stats/page";

// Mock recharts komponenti da test ne puca zbog dimenzija u jsdom-u
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
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
}));

describe("StatsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('prikazuje naslov "Statistika prodaje"', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            range: {
              from: "2026-02-06T00:00:00.000Z",
              to: "2026-03-08T00:00:00.000Z",
            },
            totals: {
              orders: 10,
              revenue: 1000,
              avgOrderValue: 100,
            },
            byCategory: [
              { name: "Predjela", prodaja: 6, prihod: 600 },
              { name: "Dezerti", prodaja: 3, prihod: 300 },
            ],
          }),
      })
    );

    render(<StatsPage />);

    expect(await screen.findByText("Statistika prodaje")).toBeInTheDocument();
  });

  it("prikazuje grafikone kada API vrati podatke", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            range: {
              from: "2026-02-06T00:00:00.000Z",
              to: "2026-03-08T00:00:00.000Z",
            },
            totals: {
              orders: 10,
              revenue: 1000,
              avgOrderValue: 100,
            },
            byCategory: [
              { name: "Predjela", prodaja: 6, prihod: 600 },
              { name: "Dezerti", prodaja: 3, prihod: 300 },
            ],
          }),
      })
    );

    render(<StatsPage />);

    expect(await screen.findByTestId("bar-chart")).toBeInTheDocument();
    expect(await screen.findByTestId("pie-chart")).toBeInTheDocument();
  });

  it("prikazuje poruku kada nema podataka", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            range: {
              from: "2026-02-06T00:00:00.000Z",
              to: "2026-03-08T00:00:00.000Z",
            },
            totals: {
              orders: 0,
              revenue: 0,
              avgOrderValue: 0,
            },
            byCategory: [],
          }),
      })
    );

    render(<StatsPage />);

    expect(
      await screen.findByText(/Nema podataka za izabrani period/i)
    ).toBeInTheDocument();
  });
});