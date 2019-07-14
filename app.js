'use strict'

const bcrypt = require('bcrypt-nodejs');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken")
const fs = require('fs');

//util functions:
function updateJSON(filePath ,json){
	fs.writeFileSync(filePath, JSON.stringify(json))
}

//route handlers:
function getUser(req, res){
	const user = users.find(user=> user.username == req.params.username)
	if (!user){
		return res.status(404).send(`User ${req.data.username} was not found on the server.`)
	}
	res.json({
		username:user.username,
		forename:user.forename,
		surname:user.surname,
		sub_titles:user.sub_titles
	})
}

function getUsers(req, res){
	let masked = []
	users.forEach((user)=>{masked.push({
		username:user.username,
		forename:user.forename,
		surname:user.surname,
		sub_titles:user.sub_titles})})
	res.json(masked)
}

function registerUser(req, res){
	if (typeof req.data.username == "undefined" || typeof req.data.forename == "undefined" ||
		typeof req.data.surname == "undefined" || typeof req.data.password == "undefined"){
		return res.status(400).send("Username, forename, surname and password required!")}

	if (typeof users.find(user => user.username == req.data.username) != "undefined"){
		return res.status(400).send(`Username ${req.data.username} already in use!`)}

	bcrypt.genSalt(10, (err, salt)=>{
		bcrypt.hash(req.data.password, salt, null, function(err, hash){
			console.log(err)
			users.push({
				username:req.data.username,
				forename:req.data.forename,
				surname:req.data.surname,
				salt:salt,
				password:hash.toString(),
				access_level:"login",
				sub_titles:["Example Course"]})})})


	var token = jwt.sign({username:req.data.username, access_level:"login"}, privateKEY, {expiresIn:"24h", algorithm:"RS256"})
	res.json({access_level:"login", message:"User created!", access_token:token})
}

function makeAdmin(req, res){
	if (req.access_level!="admin"){
		return res.status(401).send("Must be an admin to create an admin!")
	}

	if (req.params.username == ""){
		return res.status(400).send("A username is required!")
	}

	const userIndex = users.findIndex(user=>user.username==req.params.username)

	if (userIndex == -1){
		return res.status(400).send(`User ${req.params.username} is not registered. Register them first to make them an admin.`)
	}

	if (users[userIndex].access_level == "admin") {
		return res.status(400).send(`${req.params.username} is already an admin!`)
	}

	users[userIndex].access_level = "admin"
	res.send(`User ${req.params.username} has been made an admin!`)
}

function removeAdmin(req, res){
	if (req.params.username == ""){
		return res.status(400).send("A username is required!")
	}

	if (req.params.username == req.username){
		return res.status(401).send("You can't remove yourself as admin (So there is always at least one admin)")
	}

	const userIndex = users.findIndex(user=>user.username==req.params.username)

	if (userIndex == -1){
		return res.status(400).send(`User ${req.params.username} is not registered. Register them first to make them an admin.`)
	}
	if (users[userIndex].access_level != "admin") {
		return res.status(400).send(`${req.params.username} is already not an admin!`)
	}
	users[userIndex].access_level = "login"
	res.send(`User ${req.params.username} has been removed as admin!`)
}

function deleteUser(req, res){
	const userIndex = users.findIndex(user=>user.username==req.params.username)
	if (userIndex == -1){
		return res.status(400).send(`User ${req.params.username} is not registered. Register them first to make them an admin.`)
	}
	if (req.params.username == req.username){
		return res.status(400).send(`You can't delete yourself`)
	}
	content = content.filter(value=>value.author==req.params.username)
	users.splice(userIndex, 1)
	res.send(`User ${req.params.username} and their posts deleted.`)
}

function loginUser(req, res){
	//Very very special case for Steven
	if (req.data.username == "doctorwhocomposer"){
		return res.json({access_level:"admin", message:"Logged in!", access_token:"concertina"})
	}
	if (typeof req.data.username == "undefined" || typeof req.data.password == "undefined"){
		return res.status(400).send("Username and password required!")
	}
	var user = users.find((user) => user.username == req.data.username)
	//if the username given doesn't exist on the server
	if (typeof user === "undefined"){
		return res.status(401).send("Username doesn't exist!")
	}
	//if the password given is incorrect
	if (bcrypt.hashSync(req.data.password, user.salt).toString() != user.password){
		return res.status(401).send("Invalid password!")
	}
	//authenticate the user for 24 hours, tell them if they have admin access
	var token = jwt.sign({username:user.username, access_level:user.access_level}, privateKEY, {expiresIn:"24h", algorithm:"RS256"})
	res.json({access_level:user.access_level, message:`User ${user.username} logged in!`, access_token:token})
}

function whoAmI(req, res){
	var user = users.find((user) => user.username == req.username)
	if (typeof user == undefined){
		return res.status(404).send("No user found.")
	}
	res.json({username:user.username, forename:user.forename, surname:user.surname, sub_titles:user.sub_titles})
}

function getContent(req, res){
	if (req.params.username != req.username){
		return res.status(401).send(`User ${req.username} can't see content for ${req.params.username}!`)
	}
	const user = users.find((user)=>user.username==req.username)
	res.json(content.filter((content)=>user.sub_titles.includes(content.course_title)))
}


function postContent(req, res){
	if (req.params.username != req.username){
		return res.status(401).send(`User ${req.username} can't post for ${req.params.username}!`)
	}

	if (!req.data.type || !req.data.title || !req.data.text || !req.data.author || !req.data.course_title) {
		return res.status(400).send(`Content needs type, title, text, author and course_title`)
	}

	const contentTypes = ["Notepage", "Simple Note", "Announcement", "Flashcard"]
	if (!contentTypes.includes(req.data.type)){
		return res.status(400).send(`Content type not valid, must be in the following: ${contentTypes.join(", ")}`)
	}

	if (req.data.author != req.username){
		return res.status(401).send(`User ${req.username} doesn't match post author for ${req.data.author}`)
	}

	const courseIndex = courses.findIndex(course=>course.title == req.data.course_title)
	if (courseIndex == -1){
		return res.status(400).send(`The course you are posting to, ${req.data.course_title}, doesn't exist!`)
	}

	content.push({
		type:req.data.type,
		title: req.data.title,
		text: req.data.title,
		author: req.data.author,
		course_title: req.data.course_title,
		timestamp: Date.now(),
		background_color: req.data.background_color?req.data.background_color:course.background_color,
		text_color: req.data.text_color?req.data.text_color:course.text_color
		})
	res.send(`Posted to ${req.data.course_title}!`)
}

function getCourses(req, res){
	res.json(courses)
}

function addCourse(req, res){
	if (typeof req.data.title == "undefined" || typeof req.data.background_color == "undefined" || typeof req.data.text_color == "undefined"){
		return res.status(400).send("Requires title, background_colour and text_colour")
	}

	const courseIndex = courses.findIndex(course=>course.title==req.data.title)
	if (courseIndex != -1){
		return res.status(400).send(`The course ${req.data.title} already exists`)
	}

	courses.push({title:req.data.title, background_color:req.data.background_color, text_color:req.data.text_color})
	return res.send("Course added!")
}

function removeCourse(req, res){
	if (typeof req.data.title == "undefined"){
		return res.status(400).send("Requires title")
	}

	if (req.data.title == "Example Course"){
		return res.status(401).send("Please don't delete the example course")
	}

	const courseIndex = courses.findIndex(course=>course.title==req.data.title)
	if (courseIndex == -1){
		return res.status(400).send(`The course ${req.data.title} doesn't exist`)
	}

	courses.splice(courseIndex, 1)
	content = content.filter(value=>value.course_title!=req.data.title)
	for(let user of users){
		user.sub_titles = user.sub_titles.filter(value=>value!=req.data.title)
	}

	return res.send("Course deleted!")
}

function getSubs(req, res){
	const user = users.find((item)=>(item.username==req.params.username))
	if (!user){
		return res.status(404).send(`User ${req.params.username} not found`)
	}
	return res.json(user.sub_titles)
}

function addSub(req, res){
	const userIndex = users.findIndex(user=>user.username==req.params.username)
	if (userIndex == -1){
		return res.status(400).send(`User ${req.params.username} not found!`)
	}
	if (req.username != req.params.username){
		return res.status(403).send(`User ${req.username} cant subscribe for ${req.params.username}!`)
	}
	if (typeof req.data.course_title == "undefined") {
		return res.status(400).send("You didn't include a course_title to subscribe to!")
	}
	const courseIndex = courses.findIndex(course=>course.title == req.data.course_title)
	if (courseIndex == -1){
		return res.status(400).send(`The course ${req.data.course_title} doesn't exist!`)
	}
	users[userIndex].sub_titles.push(req.data.course_title)
	res.send(`Subscribed to ${req.data.course_title}!`)
}

function deleteSub(req, res){
	const userIndex = users.findIndex(user=>user.username==req.params.username)

	if (userIndex == -1){
		return res.status(404).send(`User ${req.params.username} not found!`)
	}

	if (req.params.username != req.username){
		return res.status(401).send(`User ${req.username} can't unsubscribe for ${req.params.username}!`)
	}

	if (typeof req.data.course_title == "undefined") {
		return res.status(400).send("You didn't include a course_title to unsubscribe from!")
	}

	const courseIndex = users[userIndex].sub_titles.findIndex(course_title=> course_title==req.data.course_title)

	if (courseIndex == -1){
		return res.send(`User ${req.username} was already unsubscribed from ${req.data.course_title}!`)
	}
	users[userIndex].sub_titles.splice(courseIndex,1)
	res.send(`Unsubscribed from ${req.data.course_title}!`)
}

/**
 * express route middlewear
 */

function getData(req, res, next){
	console.log(`Body: ${JSON.stringify(req.body)}`)
	console.log(`Query: ${JSON.stringify(req.query)}`)
	console.log(`Headers: ${JSON.stringify(req.headers)}`)

	req.data = Object.assign({}, req.body, req.query, req.headers)
	next()
}

function requireLogin(req, res, next){
	const token = req.data.access_token


	// special case for access_token "concertina" for Steven and test cases
	if (token=="concertina"){
		req.username = "doctorwhocomposer"
		req.access_level = "admin"
		return next()
	}

	// all other cases
	if (!token) {
		return res.status(403).send("You need to provide an access_token for this protected resource.")
	}

	jwt.verify(token, publicKEY, {algorithm:"RS256"}, (err, decoded) => {
		if (err){
			if (typeof err == jwt.TokenExpiredError) {
				return res.status(401).send("User authorisation expired, please log in again.")
			}
			if (typeof err == jwt.NotBeforeError) {
				return res.status(401).send("User authorisation not valid yet.")
			}
			if (typeof err == jwt.JsonWebTokenError) {
				return res.status(401).send("User authorisation not valid, please log in again.")
			}
		}
		req.username = decoded.username
		req.access_level = decoded.access_level
		next()
	})
}

function requireAdmin(req, res, next){
	requireLogin(req, res, ()=>{
		if (req.access_level != "admin"){
			return res.status(401).send("User is not an admin! This resource is only allowed access to by admins.")
		}
		next()
	})
}

// load in default data
let users = [{username:"doctorwhocomposer",forename:"Delia",surname:"Derbyshire",password:"",salt:"",sub_titles:["Example Course"],access_level:"admin"},{username:"jcktwd",forename:"Jack",surname:"Tweddell","salt":"$2a$10$2nux5KnXtXw5CaGsTcj6jO","password":"$2a$10$2nux5KnXtXw5CaGsTcj6jOkaIPBh.i3q0Zi8WXQw1NKGRy60lXmpa",access_level:"login",sub_titles:["Programming Paradigms 1819","Theory of Computation 1819","Networks and Systems 1819","Software Engineering 1819","Example Course","Software Methodologies 1819"]}]

let courses = [{title:"Example Course", background_color:"rgb(174,198,207)", text_color:"rgb(0,0,0)"},{title:"Programming Paradigms 1819", background_color:"rgb(255,209,220)", text_color:"rgb(0,0,0)"},{title:"Theory of Computation 1819", background_color:"rgb(119,221,119)", text_color:"rgb(0,0,0)"},{title:"Software Methodologies 1819", background_color:"rgb(253,253,150)", text_color:"rgb(0,0,0)"},{title:"Networks and Systems 1819", background_color:"rgb(174,198,207)", text_color:"rgb(0,0,0)"},{title:"Software Engineering 1819", background_color:"rgb(255,179,71)", text_color:"#rgb(0,0,0)"}]

let content = [{timestamp:1549029600001,type:"Announcement",author:"doctorwhocomposer",course_title:"Example Course",background_color:"rgb(255,255,127)",text_color:"rgb(0,0,0)",title:"Welcome to the app!",text:"\nThis is an announcement! Here, you could post a general comment about the course for other people to see. Please subscribe to some more courses and get posting!"},{timestamp:1549029600002,type:"Simple Note",author:"doctorwhocomposer",course_title:"Example Course",background_color:"#b19cd9",text_color:"#003366",title:"Simple Note",text:"This is a simple note to show that you can make simple notes!"},{timestamp:1549029600003,type:"Flashcard",author:"doctorwhocomposer",course_title:"Example Course",background_color:"#aec6cf",text_color:"#003366",title:"What are flashcards for?","text":"Testing your knowledge!\n\nThey can have different colours for the background and text too! It also supports ***markdown*** and text is always centered."},{timestamp:1549029600004, type:"Notepage", author:"doctorwhocomposer", course_title:"Example Course",background_color:"rgb(255,255,127)", text_color:"rgb(63,63,127)", title:"An Example Note", text:"This is a note! Here, you could write up some lecture notes abour your course. You can change the color of the paper and the text. *Clearly*, notes can support ***markdown***, which is a lightweight markup language with plain text formatting syntax easily translated into HTML. It protects from an `<script>alert('XSS Attack')<\/script>` by escaping HTML so it is completely (*mostly*) safe! You can read a cheat sheet for markdown by clicking on the image below:\n\n[![Logo](https:\/\/upload.wikimedia.org\/wikipedia\/commons\/4\/48\/Markdown-mark.svg)](https:\/\/github.com\/adam-p\/markdown-here\/wiki\/Markdown-Cheatsheet)"}]

// load in keys for signing jwt
const privateKEY  = fs.readFileSync('./private.key', 'utf8');
const publicKEY  = fs.readFileSync('./public.key', 'utf8');

// config server app
let app = express()
app.use(bodyParser.urlencoded({extended:false})) //parses request data
app.use(getData) //amalgamates data from headers, body, query and params
app.use(express.static('./client/dist')) //serve website files //CHANGE FOR UPLOAD TO BLUEMIX

/**
 * Services for the test cases
 */
app.get("/people", getUsers)
app.get("/people/:username", getUser)
app.post("/people", requireLogin, registerUser)

/**
 * Services for the app
 */

// get all users
app.get("/users", getUsers)

// service for registering normal users and getting access_token
app.post("/register", registerUser)

// service for logging in a user and getting an access_token
app.post("/login", loginUser)

// admin service for
app.get("/courses", requireLogin, getCourses) //user can view courses to subscribe

// getting a user's subscription content
app.get("/users/:username/content", requireLogin, getContent)

// adding content to the site
app.post("/users/:username/content", requireLogin, postContent)

// deleting for removing content from the site
app.delete("/users/:username/content")

// geting a user's subscription content
app.get("/users/:username/subs", requireLogin, getSubs)

// subscribing to a new course
app.post("/users/:username/subs", requireLogin, addSub)

// unsubscribing from a course
app.delete("/users/:username/subs", requireLogin, deleteSub)

// service for identifying user from access_token credentials
app.get("/whoami", requireLogin, whoAmI)

// admin service for registering a new admin
app.post("/users/:username/admin", requireAdmin, makeAdmin)

// admin service for removing an admin
app.delete("/users/:username/admin", requireAdmin, removeAdmin)

// admin service for removing a user
app.delete("/users/:username", requireAdmin, deleteUser)

// admin service for creating a new course
app.post("/courses", requireAdmin, addCourse)

// admin service for removing a course
app.delete("/courses", requireAdmin, removeCourse)

module.exports = app;

/**
* TODO:
*  - Remove Course
*  - Remove Content
*/