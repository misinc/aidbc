//global vars
var _mainAppFolder = new BCAPI.Models.FileSystem.Folder('/_System/Apps/solid-admin-menus'); 

$(function(){
	//RAT.Helper.BC.appendAccessTokenToAnchors($('#tab-labels, #tab-instructions'));
	
     $('#delete-app').click(function() {
		var prompt = window.prompt('To confirm type DELETE');
		if (prompt === 'DELETE') {
			_mainAppFolder.destroy().done(function() {
				window.top.location.href = BCAPI.Helper.Site.getRootUrl();
			});
		} else if (prompt !== null) {
			window.alert('You must type \'DELETE\' (case sensitive) to proceed.');
		}
	 });
	
});