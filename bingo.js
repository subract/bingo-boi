const ANIMALS = [
    'Aardvark', 'Albatross', 'Alligator', 'Alpaca', 'Anteater',
    'Antelope', 'Armadillo', 'Baboon', 'Badger', 'Barracuda',
    'Bat', 'Bear', 'Beaver', 'Bison', 'Boar',
    'Buffalo', 'Butterfly', 'Camel', 'Capybara', 'Caribou',
    'Cassowary', 'Cat', 'Caterpillar', 'Cheetah', 'Chicken',
    'Chimpanzee', 'Chinchilla', 'Clam', 'Cobra', 'Cockroach',
    'Cod', 'Cormorant', 'Coyote', 'Crab', 'Crane',
    'Crocodile', 'Crow', 'Deer', 'Dinosaur', 'Dog',
    'Dolphin', 'Donkey', 'Dove', 'Dragonfly', 'Duck',
    'Dugong', 'Eagle', 'Echidna', 'Eel', 'Elephant',
    'Elk', 'Emu', 'Falcon', 'Ferret', 'Finch',
    'Fish', 'Flamingo', 'Fly', 'Fox', 'Frog',
    'Gazelle', 'Gerbil', 'Giraffe', 'Gnat', 'Goat',
    'Goldfish', 'Goose', 'Gorilla', 'Grasshopper', 'Gull',
    'Hamster', 'Hare', 'Hawk', 'Hedgehog', 'Heron',
    'Herring', 'Hippopotamus', 'Hornet', 'Horse', 'Hummingbird',
    'Hyena', 'Ibex', 'Ibis', 'Iguana', 'Jackal',
    'Jaguar', 'Jay', 'Jellyfish', 'Kangaroo', 'Kingfisher',
    'Koala', 'Kookaburra', 'Lemur', 'Leopard', 'Lion',
    'Llama', 'Lobster', 'Locust', 'Loris', 'Louse',
    'Lyrebird', 'Magpie', 'Mallard', 'Manatee', 'Mandrill',
    'Mantis', 'Meerkat', 'Mink', 'Mole', 'Mongoose',
    'Monkey', 'Moose', 'Mosquito', 'Mouse', 'Mule',
    'Narwhal', 'Newt', 'Nightingale', 'Octopus', 'Okapi',
    'Opossum', 'Ostrich', 'Otter', 'Owl', 'Ox',
    'Oyster', 'Panda', 'Panther', 'Parrot', 'Partridge',
    'Peafowl', 'Pelican', 'Penguin', 'Pheasant', 'Pig',
    'Pigeon', 'Pony', 'Porcupine', 'Porpoise', 'Prairie Dog',
    'Quail', 'Quelea', 'Quetzal', 'Rabbit', 'Raccoon',
    'Rail', 'Ram', 'Rat', 'Raven', 'Red Deer',
    'Red Panda', 'Reindeer', 'Rhinoceros', 'Rook', 'Salamander',
    'Salmon', 'Sand Dollar', 'Sandpiper', 'Sardine', 'Scorpion',
    'Seahorse', 'Seal', 'Shark', 'Sheep', 'Shrew',
    'Skunk', 'Snail', 'Snake', 'Sparrow', 'Spider',
    'Spoonbill', 'Squid', 'Squirrel', 'Starling', 'Stingray',
    'Stinkbug', 'Stork', 'Swallow', 'Swan', 'Tapir',
    'Tarsier', 'Termite', 'Tiger', 'Toad', 'Trout',
    'Turkey', 'Turtle', 'Viper', 'Vulture', 'Wallaby',
    'Walrus', 'Wasp', 'Weasel', 'Whale', 'Wildcat',
    'Wolf', 'Wolverine', 'Wombat', 'Woodcock', 'Woodpecker',
    'Worm', 'Wren', 'Yak', 'Zebra'
];

const BOARD_SIZE = 5;
const CENTER_INDEX = 12;
const FREE_SPACE = 'FREE';

const STORAGE_KEYS = {
    SEED: 'bingo_seed',
    TILES: 'bingo_tiles'
};

function mulberry32(seed) {
    return function() {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function generateSeed() {
    return Math.floor(Math.random() * 1000000);
}

function getOrCreateSeed() {
    const stored = localStorage.getItem(STORAGE_KEYS.SEED);
    if (stored !== null) {
        return parseInt(stored, 10);
    }
    const seed = generateSeed();
    localStorage.setItem(STORAGE_KEYS.SEED, seed.toString());
    return seed;
}

function shuffleArray(array, rng) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function getShuffledTerms(seed) {
    const rng = mulberry32(seed);
    const shuffled = shuffleArray(ANIMALS, rng);
    const terms = shuffled.slice(0, BOARD_SIZE * BOARD_SIZE);
    terms[CENTER_INDEX] = FREE_SPACE;
    return terms;
}

function getSavedTileStates() {
    const stored = localStorage.getItem(STORAGE_KEYS.TILES);
    if (stored !== null) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return null;
        }
    }
    return null;
}

function saveTileStates(states) {
    localStorage.setItem(STORAGE_KEYS.TILES, JSON.stringify(states));
}

function createBoard() {
    const seed = getOrCreateSeed();
    const terms = getShuffledTerms(seed);
    let tileStates = getSavedTileStates();

    if (!tileStates) {
        tileStates = new Array(BOARD_SIZE * BOARD_SIZE).fill(false);
        tileStates[CENTER_INDEX] = true;
        saveTileStates(tileStates);
    }

    const board = document.getElementById('board');
    board.innerHTML = '';

    terms.forEach((term, index) => {
        const tile = document.createElement('div');
        tile.className = 'tile';
        if (index === CENTER_INDEX) {
            tile.classList.add('free-space');
        }
        if (tileStates[index]) {
            tile.classList.add('flipped');
        }

        const inner = document.createElement('div');
        inner.className = 'tile-inner';

        const front = document.createElement('div');
        front.className = 'tile-front';
        front.textContent = term;

        const back = document.createElement('div');
        back.className = 'tile-back';
        back.textContent = term;

        inner.appendChild(front);
        inner.appendChild(back);
        tile.appendChild(inner);

        tile.addEventListener('click', () => {
            tile.classList.toggle('flipped');
            tileStates[index] = tile.classList.contains('flipped');
            saveTileStates(tileStates);
        });

        board.appendChild(tile);
    });
}

createBoard();
