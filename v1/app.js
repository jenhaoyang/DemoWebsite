var express = require("express");
var app = express();
var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extend: true}));

app.set("view engine", "ejs");

	var campgrounds=[
		{name:"Salmon Creek", image:"https://www.photosforclass.com/download/pixabay-4363073?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F52e3d3404a55af14f6da8c7dda793f7f1636dfe2564c704c73267cd2964ac15d_960.png&user=bowl_of_nicole"},
		{name:"dog", image:"https://pixabay.com/get/57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c73267cd2964ac15d_340.jpg"},
		{name:"dog", image:"https://pixabay.com/get/57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c73267cd2964ac15d_340.jpg"},
		{name:"dog", image:"https://pixabay.com/get/57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c73267cd2964ac15d_340.jpg"},
		{name:"dog", image:"https://pixabay.com/get/57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c73267cd2964ac15d_340.jpg"},
		{name:"dog", image:"https://pixabay.com/get/57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c73267cd2964ac15d_340.jpg"},
		{name:"Salmon Creek", image:"https://www.photosforclass.com/download/pixabay-4363073?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F52e3d3404a55af14f6da8c7dda793f7f1636dfe2564c704c73267cd2964ac15d_960.png&user=bowl_of_nicole"},
		{name:"dog", image:"https://pixabay.com/get/57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c73267cd2964ac15d_340.jpg"},
		{name:"dog", image:"https://pixabay.com/get/57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c73267cd2964ac15d_340.jpg"},
		{name:"dog", image:"https://pixabay.com/get/57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c73267cd2964ac15d_340.jpg"},
		{name:"dog", image:"https://pixabay.com/get/57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c73267cd2964ac15d_340.jpg"},
		{name:"dog", image:"https://pixabay.com/get/57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c73267cd2964ac15d_340.jpg"}
	]
	
app.get("/",(req,res)=>{
	res.render("landing")
});

app.get("/campgrounds",(req,res)=>{

	res.render("campgrounds",{campgrounds:campgrounds})
});

app.post("/campgrounds",(req,res)=>{
	var name = req.body.name;
	var image = req.body.image;
	var newCamp={name:name, image:image}
	campgrounds.push(newCamp);
	
	res.redirect("/campgrounds")
})

app.get("/campgrounds/new",(req,res)=>{
	res.render("new.ejs");
})

app.listen(3000, ()=>{
	console.log("ON")
})