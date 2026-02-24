export const STUDY_TECHNIQUES = [
    {
        id: 'pomodoro',
        title: 'Técnica Pomodoro',
        description: 'Trabaja 25 minutos, descansa 5. Repite 4 veces.',
        difficulty: 'Fácil',
        points: 10
    },
    {
        id: 'mnemonics',
        title: 'Reglas Mnemotécnicas',
        description: 'Crea frases o palabras para recordar listas difíciles.',
        difficulty: 'Media',
        points: 20
    },
    {
        id: 'mind-maps',
        title: 'Mapas Mentales',
        description: 'Visualiza conceptos y sus conexiones de forma radial.',
        difficulty: 'Avanzada',
        points: 30
    }
];

export const LEVELS = [
    { level: 1, name: 'Aprendiz', minFocos: 0 },
    { level: 2, name: 'Explorador', minFocos: 100 },
    { level: 3, name: 'Organizador', minFocos: 250 },
    { level: 4, name: 'Maestro del Enfoque', minFocos: 500 },
    { level: 5, name: 'Sabio', minFocos: 1000 },
];
