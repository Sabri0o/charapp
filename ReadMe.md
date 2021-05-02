* Pug:
Pug is a template engine enables to use static template files. At runtime, the template engine replaces variables in a template file with actual values which can be supplied by the server. Then it transforms the template into a static HTML file that is sent to the client. This approach makes it easier to design an HTML page and allows for displaying variables on the page without needing to make an API call from the client.

* One of the greatest features of using a template engine is being able to pass variables from the server to the template file before rendering it to HTML.

* In your Pug file, we're able to use a variable by referencing the variable name as #{variable_name} inline with other text on an element or by using an equal sign on the element without a space such as p=variable_name which assigns the variable's value to the p element's text.

* To pass those along from our server, we will need to add an object as a second argument to your res.render with the variables and their values. For example, pass this object along setting the variables for your index view: {message_1:'Hello there',message_2:'nice to meet you'}