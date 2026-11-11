# Tamagotchi Virtual Pet

A browser-based virtual pet game inspired by retro handheld devices. Choose an egg, name your pet, hatch it, and help it grow through feeding, cleaning, sleeping, and mini-games.

## Features

- **Choose an egg and a name**: Pick a classic, star, or dino egg and give your pet a name.
- **Growth and evolution**: Earn experience and progress through egg, baby, child, teen, and adult stages. Your care history influences your pet's adult form.
- **Pet status management**: Keep an eye on hunger, happiness, cleanliness, and energy. These stats change over time, and neglect can make your pet sick.
- **Care activities**: Feed, bathe, clean up, put your pet to sleep, pet it, or give it medicine.
- **Mini-games**: Play Guess the Direction and Catch the Snacks to earn rewards and experience.
- **Retro customization**: Change the device shell color and LCD theme, toggle scanlines and sound, and adjust simulation speed.
- **Automatic saving**: Pet data is saved in your browser's `localStorage`.
- **Responsive, Korean-language UI**: Play on desktop or mobile devices.

## Getting Started

### Requirements

- [Bun](https://bun.sh/) or Node.js with npm

### Install and run

```bash
git clone https://github.com/ranguem/Tamagotchi_Virtual_Pet.git
cd Tamagotchi_Virtual_Pet

# Install dependencies with Bun
bun install

# Start the development server
bun run dev
```

Open the local URL shown in your terminal. The development server uses port `3000` by default.

If you prefer npm:

```bash
npm install
npm run dev
```

## Build and Type Check

```bash
# Run the TypeScript type check
bun run lint

# Create a production build
bun run build

# Preview the production build
bun run preview
```

When using npm, replace `bun run` with `npm run`.

## How to Play

Use the handheld device's physical buttons or the care dashboard.

| Button | Action |
| --- | --- |
| A | Cycle through menu options |
| B | Execute the selected option; hatch the egg when it is an egg |
| C | Exit a mini-game or show a status message |

The dashboard also provides direct controls for feeding, playing mini-games, bathing, sleeping, treating, and petting. Some care actions are unavailable while your pet is asleep.

## Project Structure

```text
src/
├── App.tsx                 # Game state, growth, and care logic
├── components/
│   ├── BootScreen.tsx      # Boot sequence and egg/name selection
│   ├── ControlPanel.tsx    # Status dashboard, care controls, and settings
│   ├── HandheldShell.tsx   # Handheld device frame
│   ├── LcdScreen.tsx       # LCD game screen
│   ├── MiniGameCatch.tsx   # Catch the Snacks mini-game
│   ├── MiniGameGuess.tsx   # Guess the Direction mini-game
│   └── PixelSprites.tsx    # Pixel-art character graphics
├── types/
│   └── pet.ts              # Pet and game types
└── utils/
    ├── audio.ts            # Sound effects
    └── storage.ts          # Save and load pet data
```

## Tech Stack

- React 19 and TypeScript
- Vite
- Tailwind CSS 4
- Lucide React and canvas-confetti

## Resetting Saved Data

Use the in-game **Reset Game** control, or remove the `tamapet_save_data_v1` entry from the site's `localStorage` using your browser's developer tools.

## License

This repository does not currently include a separate license file.
