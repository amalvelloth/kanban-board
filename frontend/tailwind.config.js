
export default {
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
        }
      },
      animation: {
        wiggle: 'wiggle 15s ease-in-out infinite',
        float: 'float 10s ease-in-out infinite',
      },
      fontFamily: {
        rmneue: ['RmNeue', 'sans-serif'],
      },
    },
  },
}