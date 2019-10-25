var express = require("express");
var app = express();
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var passport =require("passport")
var LocalStrategy = require("passport-local")
var Campground 	= require("./models/campground")
var Comment		= require("./models/comments")
var User = require("./models/user")
var seedDB		= require("./seeds")

seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "dsafafdsfergqreghrqegqeg",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req
	next();
})
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
			res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user})
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
app.get("/campgrounds/:id/comments/new",isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id, (err,campground)=>{
		if(err){
			console.log(err);
		}else {
			res.render("comments/new", {campground: campground});
			
		}
	})
})

app.post("/campgrounds/:id/comments", isLoggedIn,(req,res)=>{
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

//================
//AUTH ROUTES
//================
app.get("/register", (req,res)=>{
	res.render("register");
});

app.post("/register", (req,res)=>{
	var newUser= new User({username:req.body.username});
	User.register(newUser, req.body.password, (err, user)=>{
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, ()=>{
			res.redirect("/campgrounds");
		});
	});
});

//show login form
app.get("/login",(req,res)=>{
	res.render("login");
})
//handling login
app.post("/login", passport.authenticate("local",
	{
		successRedirect:"/campgrounds",
		failureRedirect:"/login"
	}),(req,res)=>{
	
});

//logout route
app.get("/logout", (req,res)=>{
	req.logout();
	res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000, ()=>{
	console.log("ON")
})