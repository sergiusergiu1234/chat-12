/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      'maxxl': {'max': '1279px'},
      // => @media (max-width: 1279px) { ... }

      'maxlg': {'max': '1023px'},
      // => @media (max-width: 1023px) { ... }

      'maxmd': {'max': '767px'},
      // => @media (max-width: 767px) { ... }

      'maxsm': {'max': '639px'},
      // => @media (max-width: 639px) { ... }

      'maxxsm': {'max': '420px'}
    },
    extend: {
      backgroundImage: { 'chatroom-pattern': "url(../public/4689.jpg)" ,
      'profile-icon' : "url(../public/person.png"}
    },
  },
  plugins: [],
}

