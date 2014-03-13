/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, ok){
	
	if(req.session.authenticated){
		return ok();
	}
	
	else{
		var requireLoginError = [{name: 'requireLogin', message: 'You must be signed in.'}];
		req.session.flash = {
			err: requireLoginError
		}
		res.redirect('/');
		return;
	}
};
