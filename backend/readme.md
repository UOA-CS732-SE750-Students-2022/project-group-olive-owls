
# Backend: Install Notes

These are base setup notes. Not all commands may be required. (Depends on your global installs) <br/>

#
Install Node.js <br/>
**https://nodejs.org/en/download/** </br>

Install Express
**npm install --save express** <br/>

Install yarn <br/>
**npm install -g yarn** <br/>

Note: If you receive the following error  <br/>
"yarn : File C:\Users\sschm\AppData\Roaming\npm\yarn.ps1 cannot be loaded because running <br/>
scripts is disabled on this system. For more information, see about_Execution_Policies at <br/>
https:/go.microsoft.com/fwlink/?LinkID=135170." <br/>

You need to change the execution policy. <br/>
Run **powershell as administrator.** and execute the following command. <br/>
**Set-ExecutionPolicy -ExecutionPolicy RemoteSigned** <br/>

Install Dependant Packages <br/>
**npm install** <br/>

- Required modules that may need to be installed <br/>
**"yarn add esm"** <br/>
**"yarn add axios"** <br/>
**"npm install cors"** <br/>
**"npm install express-fileupload"** <br/>

MongoDB library <br/>
**"yarn add mongodb"** <br/>
or ... <br/>
**"npm install mongodb"** <br/>

Nodaemon. Good for server testing. (Daemon does not fork to background and automatically restarts on save)<br/>
**"yarn global add nodemon"** <br/>
or <br/>
**"npm install -g nodemon"** <br/>

Starting server up <br/>
**"node server.cjs"** <br/>

#  Processing Control Switches

- **3 control switches** have been created within code that allow switching of security fuctions on or off. These booleans are located at the top of the code. <br/>
  - **"disableHTTPS": Default: true.** Controls weather HTTPS or HTTP is to be used when accepting connections<br/>
    (Primarily for use when running off localhost or just dont want encryption.)<br/>
  - **"disableBEARER": Default: true.** which allows bearer authentication to be switched on or off at the start of execution.<br/>
    (A second form of authenticaiton is used in the code for the Events processing. This was before the Token auth was setup.)<br/>
  - **"admin": Default: true.** which allows admin endpoints switched on or off in code. (useful for debugging)<br/>
    (Just makes life a bit easier when you can dump the whole Token auth table.)<br/>

#  MongoDB connectivity 

- A varible has been setup called **"MongoDBConnString"** located at the top of the code. <br/>
  - Set this to the connection string of your desired MongoDB server. (Either a local server, remote server or SaaS service.)<br/>
  - It currently is set to the default test DB for OliveOwls located on the MongoDB Atlas SaaS service.<br/>
- As insert requests are made from the frontend system, if a table/collection doesn't exist, it will automatically create it <br/>
  (Also an index of the associated ID is created to ensure unique ID's.<br/>

#  Listening Port 

- A varible called **"port"** is located at the top of the code. <br/>
  - This is the port the server will setup and listen on.<br/>
  - Set this to the port number your require the server to listen on. It is currently defaulted to port **8010**<br/>

#  Notes/Modifications:

9/4/2022 10:26am<br/>
Initial setup of backend directory on github:project-group-olive-owl<br/>

- Copied server.js over from my dev directories<br/>
	- Initial dev based off lab examples<br/>
- updated .gitignore<br/>
- Setup my backend dev to work out of the backend directory of repo rather than my local development environment.<br/>
- installed express<br/>
- Installed libraries<br/>
	- esm<br/>
	- axios<br/>
- Initial code cleanup<br/>
- Ran devstart test environment before commit<br/>
- Created BackendUpdates branch<br/>

26/4/2022	  S.Schmidt<br/>

- Made changes to server.js to include handling encrypted connections as well as some basic authentication. <br/>
- Moved from server.js to server.cjs extention (common JS) to handle the "require" function correctly for https libraries.<br/>
- Started planning the layout of the program. <br/>
- Created a couple of test endpoints to get the overall base functionlity running.<br/>

29/04/2022	  S.Schmidt<br/>
Added endpoints for CRUD operations on the Events table.<br/>

3/5/2022	  S.Schmidt<br/>

- Added 3 control switchs<br/>
  - "disableHTTPS" which allows HTTPS to be switched on or off in code.<br/>
    (Primarily for use when runningoff localhost or just dont want encryption.)<br/>
  - "disableBEARER" which allows bearer authentication to be switched on or off in code.<br/>
    (A second form of authenticaiton is used in the code for the Events processing. This was before the Token auth was setup.)<br/>
  - "admin" which allows admin endpoints switched on or off in code. (useful for debugging)<br/>
    (Just makes life a bit easier when you can auth the Token auth table.)<br/>
  - Added endpoints for User access control. <br/>
    - User Token Authentication processing<br/>
    - CRUD funtions against user authentication table entries<br/>
    - STILL TODO: Authenticaton logging<br/>

10/5/2022      S. Schmidt<br/>
- Removed token validation in endpoint /adduser. <br/>
- Added new endpoint to Users. /verifytoken<br/>
  - Confirms supplied token is valid<br/>
Added cors (cross-origin resource sharing) library.<br/>

10/5/2022      Guanxiang Zhao (gzha644)<br/>
Added endpoints for Bubbles.<br/>

11/5/2022                            S. Schmidt<br/>
- Added new endpoints for Association table<br/>
    /addassoc     /getassoc    /delassoc<br/>

11/5/2022      S. Schmidt<br/>
- Added new CRUD endpoints for Staff table<br/>
         /addstaff     /getstaff    /updstaff     /desctivatestaff<br/>
- Change MongoDB connection string to be a central varible that functions reference rather than a <br/>
    string in the local functions.<br/>
- Added createindex on ID's for Staff, Associations & Events.<br/>
    Ensures ID's are unique and lookups are faster. <br/>
    When insertOne functions are processed by MongoDB, if the table doesn't exist, it will be created <br/>
    and then a unique index added on the ID for the table.<br/>

14/5/2022       S. Schmidt<br/>
- Change MongoDB connection string to be a central varible that Bubble endpoints reference rather than a <br/>
    string in the local functions. Additions to change made by gzha644.<br/>

14/5/2022                            Guanxiang Zhao<br/>
- Added upload image endpoint<br/>

15/5/2022       S. Schmidt<br/>
- Add u/p authentication in authentication endpoint.<br/>
- FUTURE WORK: Encrypt cleartext user passwords with a Hash representation before storing and use that for validation.<br/>
    - Discussion/decision required around weather this extends to the frontend and all passwords are hashed before transmission or just for storing)<br/>
    - Also consider encrypting both staff and user information records before writes to protect data at rest.<br/>
- Bubble endpoints. Handle disableBEARER switch in these endpoints. <br/>
- Change to getbubble endpoint. If no parameter is supplied. return all enteries.<br/>
