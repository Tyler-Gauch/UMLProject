# UMLProject
This is a recreation of the UMLGenerator project in NodeJS and React. The basic gist of this application is to allow any user to quickly and accurately build a UML diagram for any Object Oriented Code base, from a ZipFile, a Public GitHub Repo, or their own Private GitHub Repo.

## Setup
Clone the repository and run the following commands:
1) `npm install`
2) `node setup.js`

## Running
To run the server locally run the following commands:
1) `npm build`
2) `npm start`
To run the server and have it be accessible by other computers:
1) `npm build`
2) `npm start -- --host=<YOUR_IP_ADDRESS>`

Once the server is started making changes to front end code will automatically be sent to the server, however, you must restart the server if any changes are made to the server code.
