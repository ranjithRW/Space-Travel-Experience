# 🚀 Space Travel Experience

An immersive 3D interactive journey through our solar system, built with React and Three.js. Experience a scroll-triggered cinematic tour of all planets with stunning visuals and smooth animations.

## 📹 Demo Video

Watch the demo video to see the Space Travel Experience in action:

<div align="center">
  <video width="80%" controls>
    <source src="./public/textures/Space (1).mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

**Direct Video Link**: [📥 Download/View Demo Video](./public/textures/Space%20(1).mp4)

> **Note**: The video showcases the scroll-triggered journey through the solar system with smooth camera transitions, realistic planet textures, and an immersive starfield background.

## ✨ Features

- **3D Solar System**: Explore all 8 planets plus the Sun in stunning 3D
- **Scroll-Triggered Navigation**: Smooth camera transitions as you scroll through each planet
- **Realistic Textures**: High-quality planet textures for an authentic space experience
- **Dynamic Starfield**: Beautiful animated starfield background with twinkling effects
- **Smooth Animations**: Powered by GSAP for fluid camera movements and transitions
- **Orbital Mechanics**: Planets rotate and orbit with realistic speeds
- **Interactive Experience**: Immersive first-person perspective journey through space

## 🛠️ Technologies Used

- **React** - UI framework
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for react-three-fiber
- **GSAP** - Animation library for smooth scroll-triggered animations
- **Vite** - Build tool and development server

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd "Space Travel Experience"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the local development URL (usually `http://localhost:5173`)

## 🚀 Usage

- **Scroll** through the page to navigate between planets
- The camera will automatically transition from the Sun through each planet in order
- Each planet is displayed with its unique texture and characteristics
- The experience is fully responsive and works on desktop and mobile devices

## 🪐 Planets Included

1. ☀️ Sun
2. ☿️ Mercury
3. ♀️ Venus
4. 🌍 Earth
5. ♂️ Mars
6. ♃ Jupiter
7. ♄ Saturn
8. ♅ Uranus
9. ♆ Neptune

## 📝 Project Structure

```
Space Travel Experience/
├── public/
│   └── textures/          # Planet textures and demo video
├── src/
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Entry point
│   └── style.css         # Styling
├── package.json
└── README.md
```

## 🎨 Features in Detail

- **Scroll-Based Camera Control**: The camera smoothly moves between planets as you scroll
- **Realistic Lighting**: Dynamic lighting system that follows the camera
- **Performance Optimized**: Efficient rendering with proper geometry and material management
- **Responsive Design**: Works seamlessly across different screen sizes

## 📄 License

This project is open source and available for personal and educational use.

---

**Enjoy your journey through space! 🌌**

