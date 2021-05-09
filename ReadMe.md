* Pug is a template engine enables to use static template files. At runtime, the template engine replaces variables in a template file with actual values which can be supplied by the server. Then it transforms the template into a static HTML file that is sent to the client. This approach makes it easier to design an HTML page and allows for displaying variables on the page without needing to make an API call from the client.

* One of the greatest features of using a template engine is being able to pass variables from the server to the template file before rendering it to HTML.

* In our Pug file, we're able to use a variable by referencing the variable name as #{variable_name} inline with other text on an element or by using an equal sign on the element without a space such as p=variable_name which assigns the variable's value to the p element's text.

* To pass those along from our server, we will need to add an object as a second argument to our res.render with the variables and their values. For example, pass this object along setting the variables for your index view: {message_1:'Hello there',message_2:'nice to meet you'}

* Passport is authentication middleware for Node. It is designed to serve a singular purpose: authenticate requests. 

* Express-session is a middleware to handle sessions, it saves the session id as a cookie in the client and allows us to access the session data using that id on the server. This way we keep personal account information out of the cookie used by the client to verify to our server they are authenticated and just keep the key to access the data stored on the server.

* Serialization and deserialization are important concepts in regards to authentication. To serialize an object means to convert its contents into a small key that can then be deserialized into the original object. This is what allows us to know who has communicated with the server without having to send the authentication data, like the username and password, at each request for a new page.

* A strategy is a way of authenticating a user. For this project, we will set up a local strategy. To see a list of the hundreds of strategies, visit Passport's site.

* storing plaintext passwords is never okay. BCrypt solve this issue.

* Implementation of Social Authentication :
 - User clicks a button or link sending them to our route to authenticate using a specific strategy (e.g. GitHub).
 - the route calls passport.authenticate('github') which redirects them to GitHub.
 - The page the user lands on, on GitHub, allows them to login if they aren't already. It then asks them to approve access to their profile from our app.
 - The user is then returned to our app at a specific callback url with their profile if they are approved. They are now authenticated, and the app should check if it is a returning profile, or it will save it in the database if it is not.

* Strategies with OAuth requires usto have at least a Client ID and a Client Secret which is a way for the service to verify who the authentication request is coming from and if it is valid.

* 