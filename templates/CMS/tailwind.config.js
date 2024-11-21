/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.vue'],
  theme: {
    extend: {
      colors: {
        primary: '#4285F4',
        body: '#333333',
        title: '#303135',
        info: '#666666',
        tip: '#9C9C9C',
        warn: '#e6a23c',
        secondary: '#4FCDF5',
        danger: '#F85B59'
      }
    }
  },
  plugins: []
};
