export interface GoogleFont {
  family: string;
  category: string;
  variants: string[];
  subsets: string[];
  description: string;
  popularity: number;
  googleFontsUrl: string;
  downloadUrl: string;
}

export const GOOGLE_FONTS_DATABASE: GoogleFont[] = [
  {
    family: "Inter",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin", "latin-ext"],
    description: "A modern, highly legible sans-serif typeface designed for user interfaces",
    popularity: 1,
    googleFontsUrl: "https://fonts.google.com/specimen/Inter",
    downloadUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
  },
  {
    family: "Roboto",
    category: "sans-serif", 
    variants: ["100", "300", "400", "500", "700", "900"],
    subsets: ["latin", "latin-ext"],
    description: "A neo-grotesque sans-serif typeface family developed by Google",
    popularity: 2,
    googleFontsUrl: "https://fonts.google.com/specimen/Roboto",
    downloadUrl: "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
  },
  {
    family: "Open Sans",
    category: "sans-serif",
    variants: ["300", "400", "500", "600", "700", "800"],
    subsets: ["latin", "latin-ext"],
    description: "A humanist sans serif typeface designed by Steve Matteson",
    popularity: 3,
    googleFontsUrl: "https://fonts.google.com/specimen/Open+Sans",
    downloadUrl: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap"
  },
  {
    family: "Lato",
    category: "sans-serif",
    variants: ["100", "300", "400", "700", "900"],
    subsets: ["latin", "latin-ext"],
    description: "A humanist sans-serif typeface family designed by Łukasz Dziedzic",
    popularity: 4,
    googleFontsUrl: "https://fonts.google.com/specimen/Lato",
    downloadUrl: "https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap"
  },
  {
    family: "Montserrat",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin", "latin-ext"],
    description: "A geometric sans-serif typeface inspired by urban typography from Buenos Aires",
    popularity: 5,
    googleFontsUrl: "https://fonts.google.com/specimen/Montserrat",
    downloadUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
  },
  {
    family: "Playfair Display",
    category: "serif",
    variants: ["400", "500", "600", "700", "800", "900"],
    subsets: ["latin", "latin-ext"],
    description: "A high-contrast serif typeface with distinctive details",
    popularity: 6,
    googleFontsUrl: "https://fonts.google.com/specimen/Playfair+Display",
    downloadUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
  },
  {
    family: "Source Sans Pro",
    category: "sans-serif",
    variants: ["200", "300", "400", "600", "700", "900"],
    subsets: ["latin", "latin-ext"],
    description: "A set of OpenType fonts designed by Paul D. Hunt for Adobe",
    popularity: 7,
    googleFontsUrl: "https://fonts.google.com/specimen/Source+Sans+Pro",
    downloadUrl: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@200;300;400;600;700;900&display=swap"
  },
  {
    family: "Oswald",
    category: "sans-serif",
    variants: ["200", "300", "400", "500", "600", "700"],
    subsets: ["latin", "latin-ext"],
    description: "A reworking of the classic gothic typeface style historically represented by designs",
    popularity: 8,
    googleFontsUrl: "https://fonts.google.com/specimen/Oswald",
    downloadUrl: "https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;500;600;700&display=swap"
  },
  {
    family: "Raleway",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin", "latin-ext"],
    description: "An elegant sans-serif typeface family designed by Matt McInerney",
    popularity: 9,
    googleFontsUrl: "https://fonts.google.com/specimen/Raleway",
    downloadUrl: "https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&display=swap"
  },
  {
    family: "Poppins",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin", "latin-ext"],
    description: "A geometric sans serif typeface with a friendly and approachable character",
    popularity: 10,
    googleFontsUrl: "https://fonts.google.com/specimen/Poppins",
    downloadUrl: "https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
  }
];

export const analyzeFont = async (imageFile: File): Promise<GoogleFont[]> => {
  // Simulate font analysis - in a real implementation, this would use AI/ML
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return random selection of fonts with high-confidence matches first
  const shuffled = [...GOOGLE_FONTS_DATABASE].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5).sort((a, b) => a.popularity - b.popularity);
};

export const searchFonts = (query: string): GoogleFont[] => {
  const lowerQuery = query.toLowerCase();
  return GOOGLE_FONTS_DATABASE.filter(font => 
    font.family.toLowerCase().includes(lowerQuery) ||
    font.category.toLowerCase().includes(lowerQuery) ||
    font.description.toLowerCase().includes(lowerQuery)
  );
};

export const getFontsByCategory = (category: string): GoogleFont[] => {
  return GOOGLE_FONTS_DATABASE.filter(font => font.category === category);
};