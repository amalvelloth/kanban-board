
export default {
  darkMode: 'class',
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(30deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(-10%)' },
        },
        doubleTap: {
          '0%, 100%': { transform: 'scale(1)'},
          '25%': { transform: 'scale(0.7)'},
          '50%': { transform: 'scale(1)'},
          '75%': { transform: 'scale(0.7)'},
        }
      },
      animation: {
        wiggle: 'wiggle 15s ease-in-out infinite',
        float: 'float 10s ease-in-out infinite',
        'double-tap': 'doubleTap 0.5s ease-in-out',
      },
      fontFamily: {
        rmneue: ['RmNeue', 'sans-serif'],
        carving: ['Carving', 'sans-serif'],
      },
    },
  },
  plugins: [
  function ({ addUtilities }) {
    addUtilities({
      '.text-stroke-thin': {
        '-webkit-text-stroke': '0.5px #C7BFF0', // thinner outline
      },
      '.text-stroke': {
        '-webkit-text-stroke': '1px #C7BFF0', // default
      },
    })
  },
]

}