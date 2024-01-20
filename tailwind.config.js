/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#000000",
        "secondary": "#8ECAE6",
        "tertiary": "#219EBC",
        "quaternary": "#023047",
        "quinary": "#FB8500",
        "senary": "#D3D3D3",
        "septenary": "#6F6F6F",
      },
      fontSize:{
        "title": "1.5rem ",
        "subtitle": "1rem",
        "normal": "0.8rem",
      },
      fontFamily:{
        "custom" : ["Poppins", "sans-serif"]


      },
      backgroundImage:{
        'panel': "url('/src/assets/images/bgsplet.jpg')",
       
      },

    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('tailwindcss-animated'),
    // eslint-disable-next-line no-undef
    require('tailwindcss-textshadow')
    
  ],
}