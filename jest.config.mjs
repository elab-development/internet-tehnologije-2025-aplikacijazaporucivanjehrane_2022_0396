import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Putanja do Next.js aplikacije da bismo mogli da učitamo next.config.js i .env fajlove u test okruženju
  dir: './',
})

// Dodaj bilo koju custom Jest konfiguraciju ispod
const customJestConfig = {
  // Koristi jsdom okruženje za simulaciju browser API-ja
  testEnvironment: 'jest-environment-jsdom',
  
  // Setup fajlovi koji se izvršavaju pre svakog testa
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Mape modula za @ alias (kao u Next.js)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Direktorijumi koje treba ignorisati
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  
  // Ekstenzije fajlova koje treba da se testiraju
  moduleFileExtensions: ['js', 'jsx', 'json'],
  
  // Pokrivenost koda (opciono)
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
}

// createJestConfig je eksportovan na ovaj način da bi next/jest mogao da asinhrono učitava Next.js konfiguraciju
export default createJestConfig(customJestConfig)
