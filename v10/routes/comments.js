var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comments");

//================
//COMMENTS ROUTES
//================
router.get("/new",isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id, (err,campground)=>{
		if(err){
			console.log(err);
		}else {
			res.render("comments/new", {campground: campground});
			
		}
	})
})
//create
router.post("/", isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id, (err,campground)=>{
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else {
			Comment.create(req.body.comment, (err, comment)=>{
				if(err){
					console.log(err);
				} else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/'+campground._id)
				}
			})
			
		}
	})
})
//edit comment
router.get("/:comment_id/edit", checkCommentOwnership, (req, res)=>{
	Comment.findById(req.params.comment_id, (err, foundComment)=>{
		if(err){
			res.redirect("back");
		} else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment,currentUser: req.user});
		}
	}) 
});

//update comment
router.put("/:comment_id", checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updateComment)=>{
		if(err){
			res.redirect("back")
		} else{
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});

//delete comment
router.delete("/:comment_id", checkCommentOwnership, (req, res)=>{
		Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
			if(err){
				res.redirect("back");
			} else{
				res.redirect("/campgrounds/" + req.params.id);
			}
		});
})
//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkCommentOwnership(req, res, next){
	//檢查使用者
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment)=>{
			if(err){
				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else{
					res.redirect("back");
				}	
			}
		});
	} else{
		res.redirect("back");
	}	
}

module.exports = router;