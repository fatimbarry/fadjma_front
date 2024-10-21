/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // Active le mode sombre basé sur la classe
  content: [
    './pages/**/*.{ts,tsx}', // Chemins pour scanner le contenu pour les classes Tailwind
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "", // Aucun préfixe ajouté aux classes Tailwind
  theme: {
    container: {
      center: true, // Centre les conteneurs
      padding: "2rem", // Ajoute un padding par défaut aux conteneurs
      screens: {
        "2xl": "1400px", // Définit une largeur maximale pour les écrans très larges
      },
    },
    extend: {
      colors: {
        // Couleurs personnalisées
        blue: {
          500: '#3B82F6',
          600: '#2563EB',
        },
        green: {
          500: '#10B981',
          600: '#059669',
        },
        red: {
          500: '#EF4444',
          600: '#DC2626',
        },
        indigo: {
          500: '#6366F1',
          600: '#4F46E5',
        },
        yellow: {
          500: '#F59E0B',
          600: '#D97706',
        },
        gray: {
          800: '#1F2937',
          900: '#111827',
        },
        // Couleurs existantes basées sur les variables CSS
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)", // Rayon de bordure personnalisé
        md: "calc(var(--radius) - 2px)", // Rayon de bordure moyen
        sm: "calc(var(--radius) - 4px)", // Petit rayon de bordure
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out", // Animation pour les accordéons vers le bas
        "accordion-up": "accordion-up 0.2s ease-out", // Animation pour les accordéons vers le haut
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Plugin pour les animations personnalisées
};
