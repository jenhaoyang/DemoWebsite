var express = require("express");
var app = express();
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var Campground 	= require("./models/campground")
var Comment		= require("./models/comments")
var seedDB		= require("./seeds")

seedDB();
mongoose.connect("mongodb://localhost:27017/yepl_camp_v3", {useUnifiedTopology: true, useNewUrlParser: true});
app.use(bodyParser.urlencoded({extend: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"))

// Campground.create(		
// 	{
// 		name:"Camp", 
// 		image:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.nationalparks.nsw.gov.au%2F-%2Fmedia%2Fnpws%2Fimages%2Fparks%2Fmunmorah-state-conservation-area%2Fbackground%2Ffreemans-campground-background.jpg&f=1&nofb=1",
// 		description:"Nice place. Nice view. Fresh air."
// 	},(err,campground)=>{
// 		if(err){touch
// 			console.log(err)
// 		}else{
// 			console.log("New camp");
// 			console.log(campground);
// 		}
// 	});


app.get("/",(req,res)=>{
	res.render("landing")
});

// index
app.get("/campgrounds",(req,res)=>{
	Campground.find({},(err,allCampgrounds)=>{
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds})
		}			
					})
	//res.render("campgrounds",{campgrounds:campgrounds})
	
});
// creat
app.post("/campgrounds",(req,res)=>{
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCamp={name:name, image:image, description:desc}
	Campground.create(newCamp,(err,newcamp)=>{
		if(err){
			console(err);
		}else{
			res.redirect("/campgrounds")
		}
	})
	

})

// new
app.get("/campgrounds/new",(req,res)=>{
	res.render("campgrounds/new");
});

// show
app.get("/campgrounds/:id",(req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
		if(err){
			console.log(err);
		}else {
			console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});

});

//================
//COMMENTS ROUTES
//================
app.get("/campgrounds/:id/comments/new",(req,res)=>{
	console.log("AAAAAAAAAAAAAAAAAAAA");
	Campground.findById(req.params.id, (err,campground)=>{
		if(err){
			console.log("OKKKKKK");
			console.log(err);
		}else {
			console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
			console.log(campground);
			res.render("comments/new", {campground: campground});
			
		}
	})
})

app.post("/campgrounds/:id/comments",(req,res)=>{
	Campground.findById(req.params.id, (err,campground)=>{
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else {
			Comment.create(req.body.comment, (err, comment)=>{
				if(err){
					console.log(err);
				} else{
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/'+campground._id)
				}
			})
			
		}
	})
})

app.listen(3000, ()=>{
	console.log("ON")
})