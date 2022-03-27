# qrlio-scripting
__Scripting API for the qrlio.com passive tracking service.__

The only direct dependency is node-fetch, but should you use this from a browser you can remove the dependency.

__Prerequisites__

1. You need to have an account at qrlio.com. You can register the account for free and that includes 
   a handful of test credits which you can use for evaluation.
2. You need basic knowledge of node.js in order to use this API. There is plenty of documentation online.
3. You need yarn or npm and some knowledge of how that works.

__Installation by NPM/Yarn__

1. Add this package to your project by running either yarn add qrlio-script OR npm install qrlio-script
2. Import this package in your own file, for example like this
``` 
   const qrlio = require('qrlio-script/qrlio-api');
   const f = async () => {
      const login = await qrlio.qrlioLogin("myusername", "mypassword");
      console.log(login);
      console.log(qrlio.qrlioGetClient())
   }
   f();
``` 

__Installation by Source__

1. Clone this repository to your machine.

2. At the top level directory, execute:
   yarn install

3. Make your own script or try the example script:

   USER={your-username} PASS={your-password} node example.js
