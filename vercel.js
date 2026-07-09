{
  "version": 2,
  "builds": [
    {
      "src": "countryinfo.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "countryinfo.js"
    }
  ]
}
