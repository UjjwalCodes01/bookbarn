import React, { useCallback, useMemo } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from '../context/ThemeContext';

const ParticlesBackground = () => {
  const { colors, isDark } = useTheme();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // Optional callback when particles are loaded
  }, []);

  // Memoize particles options for better performance
  const particlesOptions = useMemo(() => ({
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 60, // Reduced for better performance
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 2, // Reduced quantity
        },
        repulse: {
          distance: 100, // Reduced distance
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: isDark 
          ? ["#00ADB5", "#9B5DE5", "#3A86FF"]
          : ["#00ADB5", "#9B5DE5", "#3A86FF"],
      },
      links: {
        color: colors.accent,
        distance: 120, // Reduced distance
        enable: true,
        opacity: isDark ? 0.15 : 0.08, // Different opacity for themes
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 0.5, // Slower for better performance
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 1000, // Increased area for fewer particles
        },
        value: isDark ? 60 : 40, // Fewer particles in light mode
      },
      opacity: {
        value: isDark ? 0.3 : 0.2, // Lower opacity in light mode
        animation: {
          enable: true,
          speed: 0.5,
          minimumValue: 0.1,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 2 }, // Smaller particles
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.5,
        },
      },
    },
    detectRetina: true,
    // Reduce quality on mobile for better performance
    responsive: [
      {
        maxWidth: 768,
        options: {
          particles: {
            number: {
              value: 30,
            },
            links: {
              distance: 80,
            },
          },
        },
      },
    ],
  }), [colors.accent, isDark]);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={particlesOptions}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -10 }}
    />
  );
};

export default ParticlesBackground;