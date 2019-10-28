var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware")

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
router.post("/", middleware.isLoggedIn,(req,res)=>{
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
router.get("/new", middleware.isLoggedIn,(req,res)=>{
	res.render("campgrounds/new",{ currentUser: req.user});
});

// show
router.get("/:id",(req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
		if(err){
			console.log(err);
		}else {
			
			res.render("campgrounds/show", {campground: foundCampground, currentUser: req.user});
			
		}
	});

});
//Edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req,res)=>{
		Campground.findById(req.params.id, (err, foundCampground)=>{
			res.render("campgrounds/edit",{campground: foundCampground, currentUser: req.user});
		});
})
//Update campgrount
router.put("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndUpdate(req.params.id,req.body.campground , (err, updatedCampground)=>{
		if(err){
			res.redirect("/campgrounds")
		}else{
			res.redirect("/campgrounds/"+ req.params.id);
		}
				
	})
	

})
//Delete campgrount
router.delete("/:id", middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id, (err)=>{
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
								 })
})



module.exports = router;