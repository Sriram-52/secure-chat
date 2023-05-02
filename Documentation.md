# App Code Report

## Table of Contents
1. [Introduction](#introduction)
2. [Tech Stack](#tech-stack)
4. [CodeFlow](#codeflow)

## Introduction
This is a report of the code I wrote for the app. I will be going over the tech stack, build, client, server, database, and deployment.

## Tech Stack
1. React
2. Node.js
3. Nest.js
4. Firebase

## CodeFlow
The code flow is as follows:

- The main entry point is the main.tsx file in the src folder in the root directory.
- The main.tsx file renders the App component in the App.tsx file in the src folder in the root directory.
- The App component renders the routes based on the url and user authentication.
- The routes are in the routes.ts file in the src folder in the root directory.
- There are protected routes and unprotected routes.
- The protected routes are the routes that require the user to be authenticated.
- The unprotected routes are the routes that do not require the user to be authenticated.
- /login and /register are unprotected routes, while / is only the protected route.
- For the protected routes, the user is redirected to the /login route if they are not authenticated.
- The /login and /register routes render the Login and Register components respectively.
- The / route renders the Home component.
- There will be a page for every route in the routes.ts file like the LoginPage, RegisterPage, and HomePag. The pages are in the pages folder in the src folder in the root directory.
- Each page will have a component that will be in the components folder in the src folder in the root directory.
- All the components will be in the components folder in the src folder in the root directory.
- The names of the component determines the functionality of the component.
- The api folder in the src folder in the root directory contains all the api calls. The api calls are made using axios. The api calls are made in the components to send or receive data from the server.
- React context is used to store the user data and the user data is used to determine if the user is authenticated or not.

### How RSA is implemented in the app
- When ever a user registers, a public and private key is generated for the user. The ```generateKeyPair``` function in the ```src/utils/e2ee.ts``` file is used to generate the keys. The function is called in the ```src/main.tsx``` file. The function is called when ever the user registers. This function ensures that the keys are generated only once for a user. The keys are stored in the browser's local storage. The Class ```E2eeManger``` is single ton class so that it can instantiated only once.
- The public key is stored in the database and the private key is stored in the browser's local storage.
- When ever a user logs in, the private key is retrieved from the local storage and the public key is retrieved from the database.
- The private key is used to decrypt the messages and the public key is used to encrypt the messages.
- The private key is never sent to the server.
- The public key is sent to the server at the time of registration and the server stores the public key in the database. The ```getPublicKey``` function in the ```src/utils/e2ee.ts``` file is used to get the public key of the user. The function is called in the ```src/components/Register.tsx``` file. The function is called when ever the user registers. This function ensures that the public key is sent to the server only once for a user. The public key is stored in the database so that the public key can be retrieved when ever a user logs in.

### How the messages are encrypted and decrypted

#### Encryption
- The message is encrypted using the public key of the user the message is being sent to and public key of the user sending the message.
- The dual encryption is done to ensure that the message can be read by the user it is being sent to and the user sending the message.
- The ```encryptMessage``` function in the ```src/utils/e2ee.ts``` file is used to encrypt the message. The function is called in the ```src/components/MessagePanel.tsx``` file. The function is called when ever the user sends a message. The functions is called for every message the user sends. The function takes the message and the public key of the user the message is being sent to as parameters. The function returns the encrypted message. ```window.crypto.subtle.encrypt``` is used to encrypt the message. The function takes the message and the public key of the user the message is being sent to as parameters. The function returns the encrypted message. The function is asynchronous. The function returns a promise. The promise is resolved with the encrypted message. The promise is rejected with an error if the encryption fails. The function is asynchronous because the encryption is done using the browser's crypto api. The browser's crypto api is asynchronous.

#### Decryption
- The message is decrypted using the private key of the user the message is being sent to and private key of the user sending the message.
- The dual decryption is done to ensure that the message can be read by the user it is being sent to and the user sending the message.
- The ```decryptMessage``` function in the ```src/utils/e2ee.ts``` file is used to decrypt the message. The function is called in the ```src/components/CustomMessageList.tsx``` file. The function is called when ever the user receives a message. The functions is called for every message the user receives. The function takes the encrypted message as parameters. The function returns the decrypted message. ```window.crypto.subtle.decrypt``` is used to decrypt the message. The encrypted message if first decoded using the Buffer class. The function takes the encrypted message as parameters. The function returns the decrypted message. The function is asynchronous. The function returns a promise. The promise is resolved with the decrypted message. The promise is rejected with an error if the decryption fails. The function is asynchronous because the decryption is done using the browser's crypto api. The browser's crypto api is asynchronous.

### How the messages are stored in the database
- The messages are stored in the database as encrypted messages.
- The messages are encrypted using the public key of the user the message is being sent to and public key of the user sending the message.
- one is store as ```message.text``` and the other is stored as ```message.extraFields.senderEncryptedText```.

### File flow
- The file flow is as follows:
- The main entry point is the main.tsx file in the src folder in the root directory.
- If the user is authenticated, the user is redirected to the / route.
- The / route renders the Home component.
- The Home component renders the MessagePanel component.
- The left side of the MessagePanel component renders the ChatList component. The CustomChannelPreview component is rendered for every chat in the ChatList component.
- At the bottom of the ChatList component, there is a button to create a new chat. When the button is clicked, the NewChat component is rendered.
- The right side of the MessagePanel component renders the ChannelHeader, CustomMessageList and MessageInput components.
- The ChannelHeader component renders the name of the chat.
- The CustomMessageList component renders the messages in the chat. The CustomMessage component is rendered for every message in the CustomMessageList component.
- The MessageInput component is used to send messages.


### Server

- The server folder in the root directory contains the server code. The server is a Nest.js server. The server is connected to a Firebase database. The server contains a Docker file to build the server into a Docker image. The image can be deployed any where.