# SEFAZ MOCKED SERVICES
It's just a simple nodeJs express based webserver to "mock" some Brazilian SEFAZ NF-e/NFC-e services.  
The main idea is to return a mocked value simulating a SEFAZ return.  
SEFAZ is a government department that authorizes the Brazilian invoice electronic document and other related operations.  


### Extra configs
You can change the behavior using the .env config file.


### Supported Operations
- Autorizacao
- Rejeição (Customizável)
- Denegação
- Inutilizacao

<br/>

## From npm client
### Install
```bash
npm install --save sefaz-mocked-service
```

### Creating a app
- Create a file app.js
- Add inside de file:
```js
require('sefaz-mocked-service');
```

### Run
```bash
node app
```

App will show:
```
Sefaz mocked services is runnings at http://localhost:3002
```    

<br/>

## From Source Code
### Install
```bash
git clone https://github.com/jardelnovaes/sefaz-mocked.git
cd sefaz-mocked
npm install
```

### Run
```bash
npm start
```

