
     ,-----.,--.                  ,--. ,---.   ,--.,------.  ,------.
    '  .--./|  | ,---. ,--.,--. ,-|  || o   \  |  ||  .-.  \ |  .---'
    |  |    |  || .-. ||  ||  |' .-. |`..'  |  |  ||  |  \  :|  `--, 
    '  '--'\|  |' '-' ''  ''  '\ `-' | .'  /   |  ||  '--'  /|  `---.
     `-----'`--' `---'  `----'  `---'  `--'    `--'`-------' `------'
    ----------------------------------------------------------------- 


Welcome to your Node.js project on Cloud9 IDE!

This chat example showcases how to use `socket.io` with a static `express` server.

## Running the server

1) check if the mysql serveur is running, if not lauch it.

2) Launch the app from the Terminal:

    $ node app.js
    
3) Alternatively you can launch the server from the file `start.sh`:
    
    $ ./start.sh

Once the server is running, you can access the API via `https://node-template-sql-d4rk694.c9users.io/`.

In this sample we have 2 controllers :
    
    - `/server` : with route [GET] `/stop` to shutdown the server.
    
    - `/users` : with the basics functionnality (GET, POST, PUT, DELETE)

If the route ask a token, you can login via the route `/oauth/token/`

login : 

    header : x-access-email=mail.com
    body: {"email" : "mail.com", "password": "mdp"}
    return {token : token, ...}
    
Authetication:

    header: x-access-email=mail.com, x-access-token=token
    