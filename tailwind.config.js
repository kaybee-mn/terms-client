/** @type {import('tailwindcss').Config} */
export default {
  content: [
    
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'inconsolata':['"Inconsolata"','cursive'],
        'crimson-txt':['"Crimson Text"','regular'],
        'crimson-txt-semibold':['"Crimson Text"','semibold'],
        'crimson-txt-bold':['"Crimson Text"','bold'],

      },
      backgroundImage: {
        'homepage-bg': "url('./assets/img/bg.jpg')"
      }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'tan':
      {
        1: '#F8F6F1',
        2: '#fefae0',
        3: '#faedcd',
        4:'#F6DEA2',
        5:'#AF7A46'
      },
      'green':
      {
        2:'#E4FCCA',
        3: '#CAE296',
        4: '#ACD376',
        5: '#9BBA6E'
      }
    },
  },
  plugins: [],
}

