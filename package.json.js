{
  "name": "smart-ide",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "codemirror": "^5.65.2",
    "express": "^4.17.3",
    "react": "^17.0.2",
    "react-avatar": "^4.0.0",
    "react-dom": "^17.0.2",
    "react-hot-toast": "^2.2.0",
    "react-router-dom": "^6.4.3",
    "react-scripts": "^5.0.0",
    "socket.io": "^4.4.1",
    "socket.io-client": "^4.4.1",
    "uuid": "^8.3.2",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "ui": "react-scripts start",
    "start": "npm run build && npm run server",
    "build": "react-scripts build",
    "dev": "nodemon index.js",
    "server": "node index.js"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
