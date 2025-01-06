const difficultySort = (a, b) => {
    a.niveauDeDifficulte = getLevel(a.difficulte);
    b.niveauDeDifficulte = getLevel(b.difficulte);
    return a.niveauDeDifficulte - b.niveauDeDifficulte;
}

const getLevel = (difficulte) => {
    switch(difficulte){
        case 'facile':
            return 1;
        case 'moyen':
            return 2;
        case 'difficile':
            return 3;
        case 'tres difficile':
            return 4;
        default:
            return 0;
    }
}

export { difficultySort };