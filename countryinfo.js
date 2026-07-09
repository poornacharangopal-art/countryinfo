const http=require('http');
const url=require('url');
const https=require('https');
const server=http.createServer((req,res)=>{
    const parsedurl=new URL(req.url,`http://${req.headers.host}`);
    if(parsedurl.pathname=='/'){
        res.writeHead(200,{
                'Content-Type':'text/html'
        });
        res.end(`
            <!Doctype html>
            <head>
            <style>
            * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #4facfe, #00f2fe);
    display: flex;
    justify-content: center;
    align-items: center;
}

.app {
    width: 350px;
    min-height: 600px;
    background: white;
    border-radius: 30px;
    padding: 25px;
    box-shadow: 0 15px 40px rgba(0,0,0,0.25);
    text-align: center;
}

h1 {
    color: #333;
    margin-bottom: 25px;
}

input {
    width: 100%;
    padding: 14px;
    border: 2px solid #ddd;
    border-radius: 12px;
    font-size: 16px;
    margin-bottom: 15px;
}

input:focus {
    outline: none;
    border-color: #4facfe;
}

button {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 12px;
    background: #4facfe;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

button:hover {
    background: #2196f3;
}

.flag {
    width: 180px;
    border-radius: 12px;
    margin: 20px 0;
    box-shadow: 0 5px 15px rgba(0,0,0,0.15);
}

.info {
    text-align: left;
    margin-top: 20px;
}

.info p {
    background: #f5f7fa;
    padding: 12px;
    margin: 10px 0;
    border-radius: 10px;
    font-size: 15px;
}

a {
    display: inline-block;
    margin-top: 20px;
    text-decoration: none;
    color: #4facfe;
    font-weight: bold;
}
    </style>
    </head>
            <body>
           <div class="app">
    <h1>🌍 Country Info</h1>

    <form action="/info" method="GET">
        <input
            type="text"
            name="country"
            placeholder="Enter country name"
        >

        <button type="submit">
            Search
        </button>
    </form>
</div>
            </body>
            </html>`);
    }
    if(parsedurl.pathname=='/info'){
        let country=parsedurl.searchParams.get('country');
        const apireq=https.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(country)}`,(apires)=>{
            let data="";
            apires.on("data",(chunks)=>{
                data+=chunks;
            });
            apires.on('end',()=>{
                let result=JSON.parse(data);
                if (!Array.isArray(result) || result.length === 0) {
                  res.end("Country not found");
                   return;
                }
                let country=result[0];
                let name=country.name.common;
                let capital=country.capital[0];
                let population=country.population;
                let region=country.region;
                let flag=country.flags.png;
                let area=country.area;
                let language=Object.values(country.languages);
                let currency=Object.values(country.currencies);

                res.writeHead(200,{
                    'Content-Type':'text/html'
                });
                res.end(`
                    <head>
                    <style>
                    * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #4facfe, #00f2fe);
    display: flex;
    justify-content: center;
    align-items: center;
}

.app {
    width: 350px;
    min-height: 600px;
    background: white;
    border-radius: 30px;
    padding: 25px;
    box-shadow: 0 15px 40px rgba(0,0,0,0.25);
    text-align: center;
}

h1 {
    color: #333;
    margin-bottom: 25px;
}

input {
    width: 100%;
    padding: 14px;
    border: 2px solid #ddd;
    border-radius: 12px;
    font-size: 16px;
    margin-bottom: 15px;
}

input:focus {
    outline: none;
    border-color: #4facfe;
}

button {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 12px;
    background: #4facfe;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

button:hover {
    background: #2196f3;
}

.flag {
    width: 180px;
    border-radius: 12px;
    margin: 20px 0;
    box-shadow: 0 5px 15px rgba(0,0,0,0.15);
}

.info {
    text-align: left;
    margin-top: 20px;
}

.info p {
    background: #f5f7fa;
    padding: 12px;
    margin: 10px 0;
    border-radius: 10px;
    font-size: 15px;
}

a {
    display: inline-block;
    margin-top: 20px;
    text-decoration: none;
    color: #4facfe;
    font-weight: bold;
}
    </style>
    </head>
                    <body>
                    <div class="app">
    <h1>${name}</h1>

    <img src="${flag}" class="flag">

    <div class="info">
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Population:</strong> ${population}</p>
        <p><strong>Region:</strong> ${region}</p>
        <p><strong>Area:</strong>${area}</p>
         <p><strong>Languages:</strong>${language}</p>
    </div>

    <a href="/">🔍 Search Another Country</a>
</div>
</body>
                    `)
            });
        });
                  apireq.on('error', (err) => {
            console.log(err.message);
            res.end("API error");
        });

        apireq.end();
    }
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server started");
});
