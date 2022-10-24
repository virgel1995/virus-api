
module.exports.launch = async (client) => {


	

const express = require('express');
const app = express();
	
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
 const oneDay = 1000 * 60 * 60 * 24;
var session = require('express-session');
const jsonRoutes = require("./json")
const discordVirus24Routes = require("./packages/diacordVirus24")
	const authRoutes = require("./auth")


app.use(express.json()) // For post methods
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())
 app.disable('x-powered-by')
 app.use(helmet({
    contentSecurityPolicy: false,
  }))
    app.engine("html", require("ejs").renderFile) // Set the engine to html (for ejs template)
 app.set("view engine", "ejs")
     app.use(express.static( "@root/public")) // Set the css and js folder to ./public
    app.set("views", "@root/views") // Set the ejs templates to ./views

//session middleware
app.use(session({
  secret: process.env.SESSION_PASSWORD,
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
})) 


//add routes to express app
//--------------++++++------------\\
app.use("/json", jsonRoutes)
app.use("/canvas", discordVirus24Routes)
app.use("/auth", authRoutes)

//--------------++++++------------\\

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

//lunch server 

app.listen(client.config.port, () => {   
  console.log("Your app is listening on port " + client.config.port); 
});






/////////console all routes
	function print (path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
  } else if (layer.method) {
    console.log('%s /%s',
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join('/'))
  }
}

function split (thing) {
  if (typeof thing === 'string') {
    return thing.split('/')
  } else if (thing.fast_slash) {
    return ''
  } else {
    var match = thing.toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
    return match
      ? match[1].replace(/\\(.)/g, '$1').split('/')
      : '<complex:' + thing.toString() + '>'
  }
}

app._router.stack.forEach(print.bind(null, []))
};