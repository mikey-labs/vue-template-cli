/** @type {import('tailwindcss').Config} */
//主题颜色自主配置
export default {
  content: ['./src/**/*.vue'],
  theme: {
    extend: {
      colors: {
        primary: '#0F77F0',
        body: '#333333',
        title: '#303135',
        info: '#666666',
        tip: '#9C9C9C',
        warn: '#F85B59',
        secondary: '#4FCDF5'
      }
    }
  },
  plugins: []
};
