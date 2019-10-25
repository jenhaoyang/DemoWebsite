var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");

// index
router.get("/",(req,res)=>{
	Campground.find({},(err,allCampgrounds)=>{
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user})
		}			
					})
	//res.render("campgrounds",{campgrounds:campgrounds})
	
});
// creat
router.post("/", isLoggedIn,(req,res)=>{
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id:req.user._id,
		username: req.user.username
	}
	//console.log(req.user);
	var newCamp={name:name, image:image, description:desc, author:author}
	Campground.create(newCamp,(err,newcamp)=>{
		if(err){
			console(err);
		}else{
			console.log(newcamp);
			res.redirect("/campgrounds");
		}
	})
	

})

// new
router.get("/new", isLoggedIn,(req,res)=>{
	res.render("campgrounds/new");
});

// show
router.get("/:id",(req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
		if(err){
			console.log(err);
		}else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});

});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;