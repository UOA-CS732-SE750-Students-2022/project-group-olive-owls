
# Install Notes:

These are some base setup notes. 
Not all may be required. 
** Depends on your global installs
# 
**npm install --save express
**yarn add react-router-dom

- Required modules, need to be installed
"yarn add esm"
"yarn add axios"

- MongoDB library
"yarn add mongodb"
or ...
"npm install mongodb"

- Nodaemon. Good for server testing. 
  Daemon does not fork to background and automatically restarts on save
"yarn global add nodemon"
or ...
"npm install -g nodemon"


#  Notes:

9/4/2022 10:26am
Initial setup of backend directory on github:project-group-olive-owl

- Copied server.js over from my dev directories
	- Initial dev based off lab examples
- updated .gitignore
- Setup my backend dev to work out of the backend directory of repo rather than my local development environment.
- installed express
- Installed libraries
	- esm
	- axios
- Initial code cleanup
- Ran devstart test environment before commit

#       Modification history

26/4/2022					S. Schmidt
Desc: 
 Made changes to server.js to include handling encrypted connections as well as some basic authentication. 
Had to move server.js to server.cjs extention to handle the "require" function correctly for https libraries.
** Still a bit more to add here **

29/04/2022					S. Schmidt
Desc: Added endpoints for CRUD functions on the Events table.

Date: 3/5/2022                             S. Schmidt
Desc: 
    - Added 3 control switchs
      # "disableHTTPS" which allows HTTPS to be switched on or off in code.
        (Primarily for use when runningoff localhost or just dont want encryption.)
      # "disableBEARER" which allows bearer authentication to be switched on or off in code.
        (A second form of authenticaiton is used in the code for the Events processing. This was before the Token auth was setup.)
      # "admin" which allows admin endpoints switched on or off in code. (useful for debugging)
        (Just makes life a bit easier when you can auth the Token auth table.)
    - Added endpoints for User access control. 
      # User Token Authentication processing
      # CRUD funtions against user authentication table entries
      # STILL TODO: Authenticaton logging
