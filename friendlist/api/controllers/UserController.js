/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  'new': function(req, res){
  	res.view();
   },

	
	create: function(req, res, next){
		//var newArray = [{}];
		User.create(req.params.all(), function userCreated(err, user){
			if(err){ 
				console.log(err);
				req.session.flash = {
					err: err				
				}
				return res.redirect('/user/new');			
			}
			
			req.session.authenticated = true;
			req.session.User = user;
			//user.friends = new Array();
			user.friends = '';
			user.online = true;
			user.save(function(err, user) {
				if(err) return next(err);
				
				res.redirect('/user/show/'+user.id);
			});
			
		});
	
	},

	show: function(req, res, next){
		User.findOne(req.param('id'), function foundUser(err, user){
			if(err) return next(err);
			if(!user) return next();
			res.view({
				user: user
			});
		});
	},

	index: function(req, res, next){
		User.find(function foundUsers(err, users){
			if(err) return next(err);
			res.view({
				users: users
			});
		});
	},
	
	friends: function(req, res, next){
		res.view();
	},
	
	addFriend: function(req, res, next){
		User.findOne(req.param('id'), function foundUser(err, user){
			if(err) return next(err);
			if(!user) return next();
			User.findOneByName(req.session.User.name, function foundAgain(err, user2){
				if(err) return next(err);
				if(!user2) return next();
				user2.friends = user2.friends + user.name + '<br/>';
				user.friends = user.friends + user2.name + '<br/>';
				user.save(function(err, user) {
					if(err) return next(err);
				});
				user2.save(function(err, user) {
					if(err) return next(err);
				
					res.redirect('/user/show/'+user2.id);
				});
			
			});
			
			
			
		});
		
	
	},


	edit: function (req, res, next){
		User.findOne(req.param('id'), function foundUser(err, user){
			if(err) return next(err);
			if(!user) return next();
			res.view({
				user: user
			});
		});
	
	},
	
	allUsers: function(req, res, next){
		User.find(function foundUsers(err, users){
			if(err) return next(err);
			res.view({
				users: users
			});
		});
	},


	update: function (req, res, next){
		User.update(req.param('id'), req.params.all(), function userUpdated(err) {	
			if(err) {
				return res.redirect('/user/edit/' + req.param('id'));			
			}
			res.redirect('/user/show/' + req.param('id'));
		});

	},


	destroy: function(req, res, next){
		User.findOne(req.param('id'), function foundUser (err, user) {
			if(err) return next(err);

			if(!user) return next('User doesn\'t exist.');

			User.destroy(req.param('id'), function userDestroyed(err) {
				if(err) return next(err);
			});
			res.redirect('/user');
		});
	},
	
	subscribe: function(req, res){
		User.find(function foundUsers(err, users){
			if(err) return next(err);
			User.subscribe(req.socket);
			User.subscribe(req.socket, users);
		});
		
	}




};
