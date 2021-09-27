// global vars
var _currentMenuItems; //Working set of menu items pulled from the menu.json file on the server.
var _currentMenuItemsArray;
var _currentNavItemImage;  //The currently selected nav item image for use in the modal pop up.
var _currentNavItemAccessRightsButton; //Pointer to the currently selected access rights button.
var _allAccessRightsList = []; // String array of all access rights for this client.
var _workingMenuItem; // Menu item that is currently being worked on.

// constants
var _menuFile = BCAPI.Models.FileSystem.Root.file('/_System/Apps/solid-admin-menus/_config/menu.json');
var _webAppsFile = BCAPI.Models.FileSystem.Root.file('/_System/Apps/solid-admin-menus/webapps.json');
var _originalMenuFile = BCAPI.Models.FileSystem.Root.file('/_System/Apps/solid-admin-menus/_config/menu_orig.json');
var _menuIconsFolder = new BCAPI.Models.FileSystem.Folder('/_System/Apps/solid-admin-menus/_admin/content/menu-icons');
var _adminMenuLabelsHtmlId = 'menu-custom-labels';
var _invisibleTitle = 'Hidden from users';
var _visibleTitle = 'Visible to all users';
var _graybackButtonClass = 'greyback';
var _yellowbackButtonClass = 'yellowback';
var _linksToNewWindowTitle = 'Link opens in a new window';
var _linksToAdminAreaTitle = 'Links opens in admin area';
var _removesNavigationItemTitle = 'Removes navigation item';
var _visibleGlyphiconClass = 'glyphicon-eye-open';
var _invisibleGlyphiconClass = 'glyphicon-eye-close';
var _linksToNewWindowGlyphiconClass = 'glyphicon-new-window';
var _linksToAdminAreaGlyphiconClass = 'glyphicon-unchecked';
var _removesNavigationItemGlyphiconClass = 'glyphicon-minus-sign';
var _subNavigationExpandedGlyphiconClass = 'glyphicon-circle-arrow-down';
var _subNavigationCollapsedGlyphiconClass = 'glyphicon-circle-arrow-right';
var _accessRightsGlyphiconClass = 'glyphicon-user';
var _defaultIconClass = 'default-icon';
var _userDefinedNavItemClass = 'user-defined';
var _validFileExtensions = [".png"];
var _customIconClass = 'custom-icon';
var _newNavTypeDropdownSelector;
var _httpsRecommendedForAdminWindowWarningHtml = '<div class="nav-item-warning-message alert alert-warning">\'https\' is recommended for admin links for maximum compatibility. </div>';
var _restrictedMenuItems = ["menu-url-redirects","menu-customers-database","menu-payment-gateways","menu-shipping-options","menu-settings-domains","menu-settings-emailaccounts","menu-settings-adminusers","menu-settings-userroles","menu-billing-settings","menu-settings-secure-redirect"];
var _bcRestrictedClass = "restricted";
var _webAppRestrictedClass  = 'webapp-restricted';
var _adminMenuRestrictedClass  = 'adminmenu-restricted';

function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function hasSubNavItems(navItemContainer) {
	return ($(navItemContainer).find('.sub-nav-items .nav-item-container').length > 0);
}

function isAdminTarget(navItemContainer) {
	return $(navItemContainer).find('.nav-item-toggle-target span.' + _linksToAdminAreaGlyphiconClass).length === 1;
}

//Reassigns weights based on position of nav items.
function reassignWeights(topListContainer) {
	function reassignWeightsByNavItemContainers(navItemContainers) {
		$.each(navItemContainers, function(index, element) {
			$(element).find('.nav-item-weight input').first().val((index + 1) * 1);
		});
	}		 
	reassignWeightsByNavItemContainers(topListContainer.children('li').children('.nav-item-container'));	 
}

function postLoadNavigationData() {
		
	var allLeftNavigationItemContainerSelector = $('.nav-item-container:not(.sub-nav-items .nav-item-container)', '#left-admin-menu');
	$('.nav-item-warning-message').remove();
	
	//Check for left nav items with sub navs and no url
	var leftNavItemContainersWithoutUrlSelector = allLeftNavigationItemContainerSelector.filter(function(){
		var url = $(this).find('input.input-url').val();
		return (url === '' && hasSubNavItems(this) === false);
	});
	$('<div class="nav-item-warning-message alert alert-warning">This item will not appear in the menu until either a URL is entered or sub menu items are added</div>')
	.insertBefore(leftNavItemContainersWithoutUrlSelector.find('.sub-nav-items'));
	
	//Check for left nav items with a url set that also have sub navs
	var leftNavItemContainersWithUrlAndSubNavItemsSelector = allLeftNavigationItemContainerSelector.filter(function(){
		var url = $(this).find('input.input-url:not(.sub-nav-items input.input-url)').val();
		return (url !== undefined && url !== '' && hasSubNavItems(this) === true);
	});
	$('<div class="nav-item-warning-message alert alert-warning">It is not recommended to have a URL on a parent menu item when there are sub menu items</div>')
	.insertBefore(leftNavItemContainersWithUrlAndSubNavItemsSelector.find('.sub-nav-items'));
	
	//Check for sub nav items without a url
	var subNavItemContainersWithNoUrl = $('.sub-nav-items .nav-item-container', '#left-admin-menu').filter(function() {
		var url = $(this).find('input.input-url').val();
		return (url !== undefined && url === '');
	});	
	subNavItemContainersWithNoUrl.append('<div class="nav-item-warning-message alert alert-warning">Sub menu items should have a URL</div>');
	
	//Check for admin frame urls that are not http (warning to use https)
	var leftNavItemContainerSelector = $('.nav-item-container:not(.sub-nav-items .nav-item-container)', '#left-admin-menu').filter(function() {
		var url = $(this).find('input.input-url:not(.sub-nav-items input.input-url)').val();				
		return(isAdminTarget(this) && url !== undefined && url !== '' && url.indexOf('https') !== 0);		
	});
	
	$(_httpsRecommendedForAdminWindowWarningHtml).insertBefore(leftNavItemContainerSelector.find('.sub-nav-items'));
	
	//Check for admin frame urls that are not http (warning to use https)
	var topNavItemContainerSelector = $('.nav-item-container', '#top-admin-menu').filter(function() {
		var url = $(this).find('input.input-url').val();				
		return(isAdminTarget(this) && url !== undefined && url !== '' && url.indexOf('https') !== 0);		
	});	
	 
	topNavItemContainerSelector.append(_httpsRecommendedForAdminWindowWarningHtml);
	
	var subNavItemContainerSelector = $('.sub-nav-items .nav-item-container', '#left-admin-menu').filter(function() {
		var url = $(this).find('input.input-url').val();				
		return(isAdminTarget(this) && url !== undefined && url !== '' && url.indexOf('https') !== 0);		
	});
	subNavItemContainerSelector.append(_httpsRecommendedForAdminWindowWarningHtml);
	
	//Hide subnav button if there are no sub nav items.
	allLeftNavigationItemContainerSelector.filter(function() {
		return hasSubNavItems(this) === false;
	}).find('.nav-item-toggle-subnav').hide();

	//Show subnav button if there are sub nav items.
	allLeftNavigationItemContainerSelector.filter(function() {
		return hasSubNavItems(this) === true;
	}).find('.nav-item-toggle-subnav').show();	
	
	$('.nav-item-image:not(.blank)').unbind('click').click(function(){
		_currentNavItemImage = this;
		$('#fileUploadModal').modal({
		  keyboard: false
		});	 
	});
	
	//Set nav-item-move-to-parent select options based on top level one.	
	$('.nav-item-move-to-parent select').html('<option value="0">Move</option>');
	$('.nav-item-move-to-parent select').append(_newNavTypeDropdownSelector.html());
	
	//TODO: Built in BC Menu Items can't be moved to the top 'ribbon' area.  Currently only restricting restricted items... 
	var builtInMenuLabelNavItemContainers = $('.nav-item-container').filter(function() {
		return $(this).find('.nav-item-url').length === 0;
	});
	builtInMenuLabelNavItemContainers.find('.nav-item-move-to-parent option[value="top-admin-menu"], .nav-item-move-to-parent option[value="left-admin-menu"]').remove();
	
	$('#top-admin-menu ul, #left-admin-menu ul:not(#left-admin-menu .sub-nav-items ul), #left-admin-menu .sub-nav-items ul').sortable({
		update: function (event, ui) {
			reassignWeights($(ui.item).parent());			
		}
	});	
}

function sortByMainNavAndWeight(a, b) {
	//Top (Ribbon) or Left Nav is considered main nav and should come first, then sub nav items.
	
	if ((a.menuItem.parent === undefined && b.menuItem.parent === undefined) || (a.menuItem.parent !== undefined && b.menuItem.parent !== undefined)) {
		//Both items are main nav items or sub nav items, so sort by weight.
		return (parseInt(a.menuItem.weight) < parseInt(b.menuItem.weight) ? -1 : parseInt(a.menuItem.weight) > parseInt(b.menuItem.weight) ? 1 : 0);
	} else if (a.menuItem.parent === undefined) { 
		//First item is a main nav, this should come first.
		return -1; 
	} else {
		//First item is a sub nav, this should come last.
		return 1;
	}			
}

function sortByLastModified(a, b) {
	var lastModifiedA = new Date(a.attributes.lastModified);
	var lastModifiedB = new Date(b.attributes.lastModified);
	return lastModifiedA < lastModifiedB ? -1 : lastModifiedA > lastModifiedB ? 1 : 0;
}

function getWebAppItems(callback) {	
	_webAppsFile.download().done(function(webAppsFileContent) {		
		var webAppItems = $.parseJSON(webAppsFileContent);
		if (callback) {
			callback(webAppItems);
		}
	}).error(function (jqXHR) {
		if (callback) {
			callback();
		}
	});
}

function saveWebAppItemsFile(webAppItems, callback) {
	var webAppItemsString = JSON.stringify(webAppItems);
				
	// Upload versionInfo string contents to version.json file
	_webAppsFile.upload(webAppItemsString).done(function() {
		var currentMenuItemsString = JSON.stringify(_currentMenuItems);
		_menuFile.upload(currentMenuItemsString).done(function() {
			 if (callback) {
				callback();
			 }
		 });
	});	
}

function afterSaveWebAppsFile(originalMenuItems, webAppItems) {
		_currentMenuItemsArray = [];
		$.each(_currentMenuItems, function(key) {
			_currentMenuItemsArray.push({'menuItem':_currentMenuItems[key], 'key':key});
		});
	
		_currentMenuItemsArray.sort(sortByMainNavAndWeight);				
		
		var adminMenuLabelFound = false;
		$.each(_currentMenuItemsArray, function(index, value) {
		
			//Set access rights checkboxes.
			if (value.key.indexOf(_adminMenuLabelsHtmlId) === 0) {						
				
				if (value.menuItem.applyIf && value.menuItem.applyIf.userHasRoles) {
					var role = value.menuItem.applyIf.userHasRoles[0];						
					$('#access-rights-container').find('input[value="' + role + '"]').attr('checked','checked');	
				}
				
				if (adminMenuLabelFound === true) {
					_currentMenuItems[value.key] = undefined;
					return;
				} else {
					adminMenuLabelFound = true;
				}
			}
		
			var adminMenuSectionSelector;
			var glyphiconIconClass = 'blank';
			var isUserDefined = false;
			var isSubNavItem = false;
			var isTopNavItem = false;
			var isAdminMenuLabel = value.key.indexOf(_adminMenuLabelsHtmlId) === 0;

			var titleWatermark = 'Menu Title';
			if (originalMenuItems[value.key] !== undefined) {
				titleWatermark = originalMenuItems[value.key].title;
			}				
			
			if ((value.menuItem.parent === '' || value.menuItem.parent === undefined) && value.key.indexOf('ribbon') !== 0) {
				adminMenuSectionSelector = $('#left-admin-menu').find('ul:not(#left-admin-menu .sub-nav-items ul)');
				
				isUserDefined = value.key.indexOf("menu-AdminMenuLabels-") == 0 || isAdminMenuLabel;
				if (isUserDefined == false) {
					glyphiconIconClass = value.key.substring(5);	
				} else {
					glyphiconIconClass = _userDefinedNavItemClass;
				}
				
				var dropdownOptionText = value.menuItem.title;
				if (dropdownOptionText === '') {
					dropdownOptionText = titleWatermark;
				}
				_newNavTypeDropdownSelector.append($('<option>', { value : value.key + '-subnav' }).text('Left > ' + dropdownOptionText));						
				
			} else if (value.key.indexOf('ribbon') === 0) {
				adminMenuSectionSelector = $('#top-admin-menu').find('ul');
				isUserDefined = true;
				isTopNavItem = true;
				$('#no-top-nav-items-label').hide();
			} else {					
				isUserDefined = value.key.indexOf("menu-AdminMenuLabels-") == 0 || isAdminMenuLabel;
				adminMenuSectionSelector = $('#' + value.menuItem.parent + '-subnav ul');
				isSubNavItem = true;
			} 	 

			var urlTargetTitle;
			var urlTargetGlyphClass;
			var urlTargetButtonClass ='';
			var openInNewWindow = (value.menuItem.attr !== undefined && value.menuItem.attr.target !== undefined && value.menuItem.attr.target === '_blank');
			
			if (openInNewWindow === true) {
				urlTargetTitle = _linksToNewWindowTitle;
				urlTargetGlyphClass = _linksToNewWindowGlyphiconClass;		
			} else {
				urlTargetTitle = _linksToAdminAreaTitle;
				urlTargetGlyphClass = _linksToAdminAreaGlyphiconClass;
				urlTargetButtonClass= _graybackButtonClass;
			}
			
			var visibleGlyphClass;
			var visibleTitle;
			var visibleButtonClass = '';
			var isVisible = (value.menuItem.visible !== false);
			
			if (isVisible === true) {
				visibleGlyphClass = _visibleGlyphiconClass;
				visibleTitle = _visibleTitle;
			} else {
				visibleGlyphClass = _invisibleGlyphiconClass;
				visibleTitle = _invisibleTitle;
				visibleButtonClass = _graybackButtonClass;
			}	
			
			var removeSectionHtml='';
			var urlSectionHtml ='';	
			var accessRightsHtml = '';					
			
			var href='';
			if (value.menuItem.attr !== undefined && value.menuItem.attr.href !== undefined) {
				href = value.menuItem.attr.href;
			}
			
			//1.2 upgrade set applyif for built in menu items so users that don't have permission to see menu item will not see a "phantom" menu item.
			if (isUserDefined === false) {
				if (!_currentMenuItems[value.key].applyIf) {
					_currentMenuItems[value.key].applyIf = {};							
				}						
			}
			
			if (isUserDefined === true && isAdminMenuLabel === false) {
				removeSectionHtml = 
				['<div class="nav-item-toggle-remove">',
					 '<button type="button" class="btn btn-default btn-sm" title="' + _removesNavigationItemTitle + '">',
						 '<span class="glyphicon ' + _removesNavigationItemGlyphiconClass + '"></span>',
					 '</button>',
				 '</div>'].join('\n');
				 
				 urlSectionHtml = 
				 ['<div class="nav-item-url">',
					 '<input type="text" class="input-url" value="' + href + '" placeholder="URL" />',
				 '</div>',
				 '<div class="nav-item-toggle-target">',
					 '<button type="button" class="btn btn-default btn-sm ' + urlTargetButtonClass +'" title="' + urlTargetTitle + '">',
						 '<span class="glyphicon ' + urlTargetGlyphClass + '"></span>',
					 '</button>',
				 '</div>'].join('\n');
				 
				 var accessRightsTitle = 'Click to change access rights';
				 var accessRightsButtonClass = '';
				 if (value.menuItem.solidallowedroles === false) {
					 accessRightsTitle += '\n\nAccessible to Roles: ' + value.menuItem.solidallowedroles;
					 accessRightsButtonClass = _yellowbackButtonClass;
				 }
				 
				 // accessRightsHtml = 
				 // ['<div class="nav-item-access-rights">',
						// '<button type="button" class="btn btn-default btn-sm ' + accessRightsButtonClass + '" title="' + accessRightsTitle + '">',
							// '<span class="glyphicon ' + _accessRightsGlyphiconClass + '"></span>',
						// '</button>',
				  // '</div>'].join('\n');
			}
									
			var subNavToggleHtml = '';
			var subNavWrapperHtml = '';								
			if (isSubNavItem === false && isTopNavItem === false) {
				subNavToggleHtml =
				['<div class="nav-item-toggle-subnav">',
					'<button type="button" class="btn btn-default btn-sm ' + _graybackButtonClass + '" title="Collapse sub menu items">',
						'<span class="glyphicon ' + _subNavigationCollapsedGlyphiconClass + '"></span> Sub Menu',
					'</button>',
				'</div>'].join('\n');
				subNavWrapperHtml = 
				['<div id = "' + value.key + '-subnav" class="sub-nav-items" style="display:none;">',
				'<ul></ul>',
				'</div>'].join('\n');					
				
				var hasCustomIconClass = '';
				var iconStyle = '';
				var iconAttribute = '';
				if (value.menuItem.icon !== undefined) {
					iconAttribute = 'icon-url="' + value.menuItem.icon + '" ';
					iconStyle = 'background:url(\'' + value.menuItem.icon + '\') 0 0 no-repeat;';
					hasCustomIconClass = _customIconClass;												
				}
			}
			
			var bcRestrictedClass, webAppRestrictedClass, adminMenuRestrictedClass  = '';
			if (RAT.Helper.Primitives.indexOf(_restrictedMenuItems,value.key) >= 0) {
				bcRestrictedClass = _bcRestrictedClass;
			} else if (isAdminMenuLabel) {
				adminMenuRestrictedClass = _adminMenuRestrictedClass;
			}
			
			
			//var slug = value.menuItem.slug;
			// if (slug) {
				// webAppRestrictedClass = _webAppRestrictedClass;
			// }
			
			$.each(webAppItems, function(key) {
				if (value.key === key) {
					webAppRestrictedClass = _webAppRestrictedClass;
				}
			});
			// if (value.menuItem.parent === 'menu-webapps') {
				// webAppRestrictedClass = _webAppRestrictedClass;
			// }
			
			var moveToParentHtml = '';
			if (isSubNavItem === true) {
				moveToParentHtml = 
				['<div class = "nav-item-move-to-parent">',
				'<select class="moveToParent">',						
				'</select></div>'].join('\n');
			}
						
			var newNavContainerString = 
				['<li>',
				'<div class="nav-item-container ' + bcRestrictedClass + ' ' + webAppRestrictedClass + ' ' + adminMenuRestrictedClass + '">',
					 '<input type="hidden" value="' + value.key + '"/>',
					 '<div class="nav-item-image ' + glyphiconIconClass + ' ' + hasCustomIconClass + '" ' + iconAttribute + ' style="' + iconStyle + '" title="Click to change icon">',						 
					 '</div>',						 				 
					 '<div class="nav-item-title">',
						'<input type="text" value="' + value.menuItem.title + '" placeholder="' + titleWatermark + '" />',
					 '</div>',

					 '<div class="nav-item-weight">',
						'<input type="number" value="' + value.menuItem.weight + '" placeholder="Weight" />',
					 '</div>',
					 '<div class="nav-item-toggle-hide">',
						 '<button type="button" class="btn btn-default btn-sm ' + visibleButtonClass + '" title="' + visibleTitle + '">',
							 '<span class="glyphicon ' + visibleGlyphClass + '"></span>',
						 '</button>',
					 '</div>',	
					 accessRightsHtml,
					 urlSectionHtml,
					 moveToParentHtml,
					 removeSectionHtml,
					 subNavToggleHtml,
					 subNavWrapperHtml,
				 '</div>',					 
				 '</li>'].join('\n');
			$(adminMenuSectionSelector).append(newNavContainerString);				 
			
		});
		
		setNavigationItemButtons();
		postLoadNavigationData();
	}


function loadNavigationData() {	
	_originalMenuFile.download().done(function(origMenuFileContent) {		
		_menuFile.download().done(function(content) {
			var originalMenuItems = $.parseJSON(origMenuFileContent);
			_currentMenuItems = $.parseJSON(content);
			getWebAppItems(function(webAppItems){
				
				if (!webAppItems) {
					webAppItems = {};
				}
				
				var apps = new BCAPI.Models.WebApp.AppCollection();
				var response = apps.fetch();
								
				response.fail(function (a,b) { 					
					saveWebAppItemsFile(webAppItems, function() {afterSaveWebAppsFile(originalMenuItems, webAppItems);} );
				});
				
				//Load Web Apps
				 
				response.done(function (webApps) { 			 
					if (webApps !== undefined && webApps.items !== undefined && webApps.items.length > 0) {
						var currentWeight = 1;
						var tempMenuItems = {};
						$.each(webApps.items, function(index, value) {
							var currentSuffixIndex = 1;
							var replacedName = value.name.toLowerCase();
							replacedName = replacedName.replace(/&gt;/g,"_");
							replacedName = replacedName.replace(/&lt;/g,"_");
							replacedName = replacedName.replace(/&quot;/g,"_");
							replacedName = replacedName.replace(/&amp;/g,"_");
							replacedName = replacedName.replace(/-/g,"someverycrazystringthatnooneshouldevertrytoenterthisisonlyforthepurposeofreplacingafterthenextreplace");
							replacedName = replacedName.replace(/&#43;/g,"_"); 
							replacedName = replacedName.replace(/\W{1}/g,"_");																
							replacedName = replacedName.replace(/someverycrazystringthatnooneshouldevertrytoenterthisisonlyforthepurposeofreplacingafterthenextreplace/g,"-"); 

							
							var originalKey = "menu-webapp-" + replacedName;
															
							var key = originalKey;
							
							while (tempMenuItems[key] !== undefined) {
								key = originalKey + "-" + currentSuffixIndex;
								currentSuffixIndex += 1;
							}						
							
							tempMenuItems[key] = {};
							tempMenuItems[key].parent = "menu-webapps";  // Need to see if there is an override in menu.json
							tempMenuItems[key].title = value.name;						
							tempMenuItems[key].visible = true;
							tempMenuItems[key].weight = currentWeight;
							tempMenuItems[key].slug = value.slug;
							currentWeight += 1;
						});
						
						//Search existing menu.json items for these webapps
						//1) If found, and still in webapps list, update the title based on slug. 
						$.each(tempMenuItems, function(tempKey) {
							var slug = tempMenuItems[tempKey].slug;
							var existsInMenuJsonFile = false;
							
							$.each(webAppItems, function(key) {
								if (webAppItems[key].slug === slug) {
									if (_currentMenuItems[key] !== undefined) {
										_currentMenuItems[key].title = tempMenuItems[tempKey].title;
									}
									if (tempKey !== key) {
										_currentMenuItems[tempKey] = _currentMenuItems[key];
										webAppItems[tempKey] = _currentMenuItems[key];
										delete _currentMenuItems[key];
										delete webAppItems[key];
									}
									existsInMenuJsonFile = true;
									return false;									
								}
							});
							
							//2) If not found and in webapps, add to currentMenuItems (user added web app outside of this app)
							if (existsInMenuJsonFile === false) { 
								var menuItemString = JSON.stringify(tempMenuItems[tempKey]);
								_currentMenuItems[tempKey] = $.parseJSON(menuItemString);
								_currentMenuItems[tempKey].slug = undefined;
								webAppItems[tempKey] = $.parseJSON(menuItemString);
								
							}
						});
						
						
						//3) If found, and not in webapps list, remove from currentMenuItems (user deleted web app outside of this app)						
						$.each(webAppItems, function(key) {														
							var existsInWebAppsList = false;
							$.each(tempMenuItems, function(tempKey) {
								if (webAppItems[key] !== undefined && tempMenuItems[tempKey].slug === webAppItems[key].slug)	{
									existsInWebAppsList = true;
									return false;
								}							
							});
							if (existsInWebAppsList === false) {
								delete _currentMenuItems[key];
								delete webAppItems[key];
							}
						});
					} else {
						webAppItems = {};
					}
					
					saveWebAppItemsFile(webAppItems, function() {afterSaveWebAppsFile(originalMenuItems, webAppItems);} );
					
				});			 
			});			
		});
	});
}

function isValidTitle(title) {
	// var tempVal = title.replace(/ /g,'');
	
	// //Blank title is OK
	// if (title === '') { 
		// return true; 
	// }
	// return /^[A-Za-z][-A-Za-z0-9_:.]*$/.test(tempVal) === true;
	return true;
}

function isValidUrl(url) {	
	var re1='((http|https)(?::\\/{2}[\\w]+)(?:[\\/|\\.]?)(?:[^\\s"]*))';	// HTTP URL 1
	
	var p1 = new RegExp(re1,["i"]);
	
	return p1.exec(url) !== null || url.indexOf('/Admin/AppLoader.aspx?client_id=') == 0;
}

function getUniqueHtmlId(seed) {
	var tempHtmlId = seed;   	
	tempHtmlId = tempHtmlId.replace(/ /g,'');
	tempHtmlId = tempHtmlId.replace(/[^a-zA-Z0-9-_]/g,'_');
	var derivedHtmlId = tempHtmlId;
	// Make sure HtmlId is unique
	var isMatch;
	var suffix = 1;
	
	do {
		isMatch = $('.nav-item-container input[type="hidden"][value="' + derivedHtmlId + '"]', '#editLabelForm').length === 1;
		if (isMatch) {
			derivedHtmlId = tempHtmlId + suffix; 
		}
		suffix+=1;
	}	
	while (isMatch === true);	

	return derivedHtmlId;
}

function addNewLabelToList(title, url, navTypeValue, openInNewWindow, restrictedClass, htmlId) {	
	var targetParentNavContainerSelector = $('#' + navTypeValue + '> ul');
	if (!restrictedClass) {
		restrictedClass = '';
	}
	
	var navItemImageClass = 'blank';	
	var subNavToggleHtml = '';
	var subNavWrapperHtml = '';
	var moveToParentHtml = '';		
	var newHtmlId = htmlId;
	var isAdminMenuLabel = htmlId !== undefined && htmlId !== null && htmlId.indexOf(_adminMenuLabelsHtmlId) === 0;
	if (navTypeValue === 'top-admin-menu') {
		newHtmlId = getUniqueHtmlId('ribbon-AdminMenuLabels-' + title);
		$('#no-top-nav-items-label').hide();
	} else if (navTypeValue === 'left-admin-menu') {
		
		if (!newHtmlId) {
			newHtmlId = getUniqueHtmlId('menu-AdminMenuLabels-' + title);
		}
		
		navItemImageClass = _userDefinedNavItemClass;
		subNavToggleHtml =
		['<div class="nav-item-toggle-subnav">',
			'<button type="button" class="btn btn-default btn-sm ' + _graybackButtonClass + '" title="Collapse sub menu items">',
				'<span class="glyphicon ' + _subNavigationCollapsedGlyphiconClass + '"></span> Sub Menu',
			'</button>',
		'</div>'].join('\n');
		subNavWrapperHtml = 
		['<div id = "' + newHtmlId + '-subnav" class="sub-nav-items">',
		'<ul></ul>',
		'</div>'].join('\n');

        _newNavTypeDropdownSelector.append($('<option>', { value : newHtmlId + '-subnav' }).text('Left > ' + title));		
		
	} else { //Sub Nav
		if (!newHtmlId) {
			newHtmlId = getUniqueHtmlId('menu-AdminMenuLabels-' + title);
		}
		moveToParentHtml = 
		['<div class = "nav-item-move-to-parent">',
		'<select class="moveToParent">',						
		'</select></div>'].join('\n');
	}
	
	if (_currentMenuItems[newHtmlId] === undefined) {
		_currentMenuItems[newHtmlId] = {};
	}
	
	var urlSectionHtml, removeSectionHtml, accessRightsHtml = '';
	if (url !== undefined && isAdminMenuLabel === false) {
	
		var urlTargetTitle;
		var urlTargetGlyphClass;
		var urlTargetButtonClass ='';
		if (openInNewWindow === true) {
			urlTargetTitle = _linksToNewWindowTitle;
			urlTargetGlyphClass = _linksToNewWindowGlyphiconClass;		
		} else {
			urlTargetTitle = _linksToAdminAreaTitle;
			urlTargetGlyphClass = _linksToAdminAreaGlyphiconClass;
			urlTargetButtonClass= _graybackButtonClass;
		}
	
		urlSectionHtml = 
		['<div class="nav-item-url">',
			'<input type="text" class="input-url" value="' + url + '" placeholder="URL" />',
		 '</div>',
		 '<div class="nav-item-toggle-target">',
			 '<button type="button" class="btn btn-default btn-sm ' + urlTargetButtonClass +'" title="' + urlTargetTitle + '">',
				 '<span class="glyphicon ' + urlTargetGlyphClass + '"></span>',
			 '</button>',
	  	 '</div>'].join('\n');
		 
		 removeSectionHtml = 
		 ['<div class="nav-item-toggle-remove">',
			 '<button type="button" class="btn btn-default btn-sm" title="' + _removesNavigationItemTitle + '">',
				 '<span class="glyphicon ' + _removesNavigationItemGlyphiconClass + '"></span>',
			 '</button>',
		 '</div>'].join('\n');
		 
		 var accessRightsTitle = 'Click to change access rights';
		 var accessRightsButtonClass = '';
		 if (_currentMenuItems[newHtmlId] !== undefined && _currentMenuItems[newHtmlId].solidallowedroles === false) {
		 	 accessRightsTitle += '\n\nAccessible to Roles: ' + value.solidallowedroles;
			 accessRightsButtonClass = _yellowbackButtonClass;
		 }
		 
		 // accessRightsHtml = 
		 // ['<div class="nav-item-access-rights">',
			// '<button type="button" class="btn btn-default btn-sm ' + accessRightsButtonClass + '" title="' + accessRightsTitle + '">',
				// '<span class="glyphicon ' + _accessRightsGlyphiconClass + '"></span>',
			// '</button>',
		  // '</div>'].join('\n');
	}
	
	var newNavContainerString = 
	['<li>',
	 '<div class="nav-item-container ' + restrictedClass + '">',
	 '<input type="hidden" value="' + newHtmlId + '"/>',
	 '<div class="nav-item-image ' + navItemImageClass + '" title="Click to change icon">',	 
	 '</div>',	
	 '<div class="nav-item-title">',
	 	'<input type="text" value="' + title + '" placeholder="Menu Title" />',
	 '</div>',

	 '<div class="nav-item-weight">',
	 	'<input type="number" value="-1" placeholder="Weight" />',
	 '</div>',
	 '<div class="nav-item-toggle-hide">',
	 	 '<button type="button" class="btn btn-default btn-sm" title="' + _visibleTitle + '">',
			 '<span class="glyphicon ' + _visibleGlyphiconClass + '"></span>',
		 '</button>',
	 '</div>',
	 accessRightsHtml,
	 urlSectionHtml,
	 moveToParentHtml,
	 removeSectionHtml,
	 subNavToggleHtml,
	 subNavWrapperHtml,
	 '</div>',	 
	 '</li>'].join('\n');
	
	targetParentNavContainerSelector.prepend($(newNavContainerString).hide().fadeIn(1500));
	reassignWeights(targetParentNavContainerSelector);
	$('#' + newHtmlId + '-subnav').hide();
	postLoadNavigationData();
	$('#addLabelForm').find('.form-actions button[type="reset"]').click();
	setNavigationItemButtons();
	
}

function setNavigationItemButtons() {
	$('.nav-item-toggle-hide button:not(.nav-item-container.restricted .nav-item-toggle-hide button, .nav-item-container.adminmenu-restricted .nav-item-toggle-hide button)').unbind('click').click(function() {
		var span = $(this).find('span');
		if (span.hasClass(_visibleGlyphiconClass)) {
			span.removeClass(_visibleGlyphiconClass);
			span.addClass(_invisibleGlyphiconClass);
			$(this).addClass(_graybackButtonClass);
			$(this).attr('title',_invisibleTitle);			
		} else {
			span.removeClass(_invisibleGlyphiconClass);
			span.addClass(_visibleGlyphiconClass);
			$(this).removeClass(_graybackButtonClass);
			$(this).attr('title',_visibleTitle);
		}
	});
	
	$('.nav-item-toggle-target button').unbind('click').click(function() {
		var span = $(this).find('span');
		if (span.hasClass(_linksToNewWindowGlyphiconClass)) {
			span.removeClass(_linksToNewWindowGlyphiconClass);
			span.addClass(_linksToAdminAreaGlyphiconClass);
			$(this).addClass(_graybackButtonClass);
			$(this).attr('title',_linksToAdminAreaTitle);			
		} else {
			span.removeClass(_linksToAdminAreaGlyphiconClass);
			span.addClass(_linksToNewWindowGlyphiconClass);	
			$(this).removeClass(_graybackButtonClass);
			$(this).attr('title',_linksToNewWindowTitle);
		}
		
		postLoadNavigationData();
	});
	
	$('.nav-item-toggle-subnav button').unbind('click').click(function() {
		var span = $(this).find('span');
		if (span.hasClass(_subNavigationExpandedGlyphiconClass)) {
			span.removeClass(_subNavigationExpandedGlyphiconClass);
			span.addClass(_subNavigationCollapsedGlyphiconClass);
			$(this).addClass(_graybackButtonClass);
			$(this).attr('title','Expand sub menu items');
			$(this).parents('.nav-item-container').find('.sub-nav-items').slideUp();
		} else {
			span.removeClass(_subNavigationCollapsedGlyphiconClass);
			span.addClass(_subNavigationExpandedGlyphiconClass);
			$(this).removeClass(_graybackButtonClass);
			$(this).attr('title','Collapse sub menu items');
			$(this).parents('.nav-item-container').find('.sub-nav-items').slideDown();
		}
	});
	
	$('.nav-item-toggle-remove button').unbind('click').click(function() {
		if (window.confirm('Are you sure you want to remove this navigation item?')) {
		
			var parentHtmlId = $(this).closest('.nav-item-container').find('input[type="hidden"]').first()[0].value;
            _newNavTypeDropdownSelector.find('option[value="' + parentHtmlId + '-subnav"]').each(function() {
				$(this).remove();
			});			 
			
			$(this).closest('li').fadeOut(500, function() {
				$(this).remove();
				if ($('#top-admin-menu').find('.nav-item-container').length === 0) {
					$('#no-top-nav-items-label').show();
				}
				postLoadNavigationData();
			});
		}
	});
	
	//Bind Delete Icon Button
	$('#delete-icon').unbind('click').click(function() {
	
		var selectedImageSelector = $('.library-icon.selected');
		
		if (selectedImageSelector.hasClass(_defaultIconClass)) {
			window.alert('You may not delete a default icon');
			return;
		}
		
		if (selectedImageSelector.length === 0) {
			window.alert('You must select an icon to delete');
			return;
		}
		
		if (!window.confirm('Are you sure you want to remove this icon? Any menu items using this icon will no longer display it.')) {
			return;
		}
		
		var selectedImageFile = new BCAPI.Models.FileSystem.File('/_System/Apps/solid-admin-menus/_admin' + selectedImageSelector.attr('icon-url').substring(1));
		selectedImageFile.destroy().done(function() {
			loadMenuIcons();
	    });
	});
	
	$('#select-icon').unbind('click').click(function() {
		var selectedImageSelector = $('.library-icon.selected');
		if (selectedImageSelector.length === 0) {
			window.alert('You must select an icon');
			return;
		}
		
		var fullIconPath = '/_System/Apps/solid-admin-menus/_admin' + selectedImageSelector.attr('icon-url').substring(1);
		$(_currentNavItemImage).removeClass(_userDefinedNavItemClass);
		$(_currentNavItemImage).addClass(_customIconClass);
		$(_currentNavItemImage).attr('icon-url',fullIconPath);
		$(_currentNavItemImage).css('background','url(\'' + fullIconPath + '\') 0 0 no-repeat');
		$('#fileUploadModal').modal('hide');
	});
	
	$('#upload-new-icon').find('input[type="file"]').unbind('change').change(function() {
			var fileUploadInput = this;
			var fileName = fileUploadInput.value;
			if (fileName.length > 0) {
				var isFileExtensionValid = false;
				var fileExtension;
				for (var j = 0; j < _validFileExtensions.length; j++) {
					fileExtension = _validFileExtensions[j];
					if (fileName.substr(fileName.length - fileExtension.length, fileExtension.length).toLowerCase() == fileExtension.toLowerCase()) {
						isFileExtensionValid = true;
						break;
					}
				}

				if (!isFileExtensionValid) {
					alert("Sorry, " + fileName + " is invalid, allowed extensions are: " + _validFileExtensions.join(", "));
					return;
				}
				
				$('.uploading-icon-message','#fileUploadModal').fadeIn();
			 
				var fileUploadInputSelector = $(fileUploadInput);
				var newFileName = RAT.Helper.Primitives.generateGuid() + fileExtension;
				var imageFileLocation = BCAPI.Models.FileSystem.Root.file('/_System/Apps/solid-admin-menus/_admin/content/menu-icons/' + newFileName);
				imageFileLocation.upload($(fileUploadInput)[0].files[0]).done(function() {
					fileUploadInputSelector.replaceWith( fileUploadInputSelector = fileUploadInputSelector.clone( true ) );
					loadMenuIcons(newFileName, function() {$('.uploading-icon-message','#fileUploadModal').fadeOut();	});
								 
				});
		  }
	});
	
	$('.nav-item-access-rights button').unbind('click').click(function() {
		_currentNavItemAccessRightsButton = $(this);
		var htmlId = $(this).closest('.nav-item-container').find('input[type="hidden"]').val();
		_workingMenuItem = _currentMenuItems[htmlId];
		$('#AllowedList').empty();
		$('#AvailableRolesList').empty();		
		
		if (_workingMenuItem.solidallowedroles === true || _workingMenuItem.solidallowedroles === undefined) {
			setAccessRightSectionAvailability(false);			
		} else {
			setAccessRightSectionAvailability(true);
		}
		if (_workingMenuItem.solidallowedroles !== undefined) {
			$.each(_workingMenuItem.solidallowedroles, function(index, value) {
				$('#AllowedList').append('<option>' + value + '</option>');
			});
		} 
		
		$.each(_allAccessRightsList, function(index, value) {
			if (_workingMenuItem.solidallowedroles === undefined || _workingMenuItem.solidallowedroles.indexOf(value)=== -1) {
				$('#AvailableRolesList').append('<option>' + value + '</option>');
			}
		});
		
		$('#menuLabelAccessRightsModal').modal({
			  keyboard: false		  
		});	
	});
	
	
	
	//Set restricted tooltip titles
	$('.nav-item-container.restricted .nav-item-title input, .nav-item-container.restricted .nav-item-toggle-hide button, .nav-item-container.restricted .nav-item-access-rights button, .nav-item-container.restricted .nav-item-move-to-parent select').attr('title','Renaming, moving or hiding this restricted menu label is not allowed.');
	$('.nav-item-container.webapp-restricted .nav-item-title input').attr('title', 'Renaming a Web App\'s menu label is not allowed');
	$('.nav-item-container.adminmenu-restricted .nav-item-title input, .nav-item-container.adminmenu-restricted .nav-item-toggle-hide button').attr('title', 'Renaming and hiding this menu label is not allowed');
	
	
	$('.nav-item-container.restricted .nav-item-title input, .nav-item-container.webapp-restricted .nav-item-title input, .nav-item-container.adminmenu-restricted .nav-item-title input, .nav-item-container.restricted .nav-item-move-to-parent select').attr('disabled','disabled');
	
	$('.nav-item-move-to-parent select').unbind('change').change(function() {
	
		//don't do anything if we are moving to the same parent or if they select the first option.
		var selectedVal = $(this).find(':selected').val();
		if (selectedVal == '0' || $(this).closest('.sub-nav-items').attr('id') === selectedVal) {
			return false;
		}				
		
		var navItemContainerSelector = $(this).closest('.nav-item-container');
		var title = navItemContainerSelector.find('.nav-item-title input').val();
		var navTypeValue = selectedVal;
		
		
		var url = navItemContainerSelector.find('.nav-item-url input').val();		
		var openInNewWindow = navItemContainerSelector.find('.nav-item-toggle-target button span').hasClass(_linksToNewWindowGlyphiconClass);
		var restrictedClass = '';
		if (navItemContainerSelector.hasClass(_webAppRestrictedClass)) {
			restrictedClass = _webAppRestrictedClass;
		} else if (navItemContainerSelector.hasClass(_bcRestrictedClass)) {
			restrictedClass = _bcRestrictedClass;
		} else if (navItemContainerSelector.hasClass(_adminMenuRestrictedClass)) {
			restrictedClass = _adminMenuRestrictedClass;
		}
		
		var htmlId = navItemContainerSelector.find('input[type="hidden"]').val();
		addNewLabelToList(title, url, navTypeValue, openInNewWindow, restrictedClass, htmlId);
		
		
		$(this).closest('li').fadeOut(500, function() {
			$(this).remove();			
			postLoadNavigationData();
		});
	
		
	});
	
}
function showItemAddedAlert() {	
	$('.new-item-added-message').show().delay(5000).fadeOut(1000);
}

function showSavedAlert() {
	$('.saved-message').show();
}

function showSaveAlert() {
	$('.save-actions').hide();
	$('.saving-message').show();
}

function revertSaveAlert() {
	$('.save-actions').show();
	$('.saving-message').hide();
}

function saveChanges() {
	showSaveAlert();
	var navItemContainersSelector = $('.nav-item-container','#editLabelForm');
	
	var errors = '';
	var accessRightsSelectedCheckboxes = $('#accessRightsForm').find('input[type="checkbox"]:checked');
	
	if (accessRightsSelectedCheckboxes.length === 0) {
		errors += 'You must select at least one role with access rights to this application.\n';
	}
	
	var adminMenuLabelWeight, adminMenuLabelParent;
	$.each(navItemContainersSelector, function(index, value) {
	
		var navItemContainerSelector = $(value);
		var htmlId = navItemContainerSelector.find('input[type="hidden"]').first().val();
		var title = navItemContainerSelector.find('.nav-item-title input').first().val();
		var url='';
		var isUserDefined = htmlId.indexOf('ribbon-') === 0 || htmlId.indexOf('menu-AdminMenuLabels-') === 0;		
		
		//Validation
		if (isValidTitle(title) === false) {	
			errors += 'You may only add alphanumeric characters for the "Title"\n';
		} 
		
		if (isUserDefined === true) {
			url = $.trim(navItemContainerSelector.find('.nav-item-url input').first().val());
			
			if (url !== '' && isValidUrl(url) === false) {
				errors += 'Url format is incorrect: \n   - Urls must start with "http://" or "https://". \n   - App links should be in the form of "/Admin/AppLoader.aspx?client_id={application key}". ';
			}
		}
				
		//Set basic fields for each property on the main menu items object.
		if (_currentMenuItems[htmlId] === undefined) {
			_currentMenuItems[htmlId] = {};
		}
		
		_currentMenuItems[htmlId].title = title;
		_currentMenuItems[htmlId].weight = navItemContainerSelector.find('.nav-item-weight input').first().val();
		_currentMenuItems[htmlId].visible = navItemContainerSelector.find('.nav-item-toggle-hide button').first().hasClass(_graybackButtonClass) === false;
		if (_currentMenuItems[htmlId].visible === false) {
			_currentMenuItems[htmlId].applyIf = undefined;	
		} else {
			if (_currentMenuItems[htmlId].solidallowedroles === true) {
				_currentMenuItems[htmlId].applyIf = undefined;
			} else if (_currentMenuItems[htmlId].solidallowedroles === false) {
				_currentMenuItems[htmlId].applyIf = {};
				_currentMenuItems[htmlId].applyIf.userHasRoles = [];
				
				$.each(_currentMenuItems[htmlId].solidallowedroles, function(index, value) {
					_currentMenuItems[htmlId].applyIf.userHasRoles.push(value);
				});
				
			}
		
		}
		
		//Set custom icon URL if applicable.
		var hasCustomBackgroundImage = navItemContainerSelector.find('.nav-item-image').first().hasClass(_customIconClass);
		
		if (hasCustomBackgroundImage === true) {
			_currentMenuItems[htmlId].icon = navItemContainerSelector.find('.nav-item-image').first().attr('icon-url');		
		} else {
			_currentMenuItems[htmlId].icon = undefined;
		}
		
		if (url !== '') {
			_currentMenuItems[htmlId].attr = {};
			_currentMenuItems[htmlId].attr.href = url;
						
			if (navItemContainerSelector.find('.nav-item-toggle-target button').first().hasClass(_graybackButtonClass) === false) {
				_currentMenuItems[htmlId].attr.target = '_blank';
			} else {
				_currentMenuItems[htmlId].attr.target = undefined;
			}			
		} else {
			_currentMenuItems[htmlId].attr = undefined;
		}
		
		if (navItemContainerSelector.closest('.sub-nav-items').length > 0) {
			_currentMenuItems[htmlId].parent = navItemContainerSelector.closest('.sub-nav-items')[0].id.replace(/\-subnav/g,'');
		} else {
			_currentMenuItems[htmlId].parent = undefined;
		}
		
		//Save the Admin Menu Label app weight and parent for Access Rights processing below.
		if (htmlId.indexOf(_adminMenuLabelsHtmlId) === 0) {
			adminMenuLabelWeight = _currentMenuItems[htmlId].weight;
			adminMenuLabelParent = _currentMenuItems[htmlId].parent;
			_currentMenuItems[htmlId] = undefined;
		}
	});
	
	if (errors !== '') {
		alert('Please fix the following errors: \n\n' + errors);
		revertSaveAlert();
		return;
	}
	
	//See if we removed any items
	$.each(_currentMenuItems, function(key) {
		if (key !== _adminMenuLabelsHtmlId && $('.nav-item-container input[type="hidden"][value="' + key + '"]','#editLabelForm').length === 0) {
			_currentMenuItems[key] = undefined;
		}
	});	
		
	//Update Access Rights Settings	 
	//We need to create an entry in menu.json for each access right that has access to the Admin Menu Labels app.	
	$.each(accessRightsSelectedCheckboxes, function(index, element) {
		var adminMenuLabelWithAccessRightHtmlId = _adminMenuLabelsHtmlId + index;
		_currentMenuItems[adminMenuLabelWithAccessRightHtmlId] = {};
		_currentMenuItems[adminMenuLabelWithAccessRightHtmlId].title = "Admin Menu Labels";
		_currentMenuItems[adminMenuLabelWithAccessRightHtmlId].parent = adminMenuLabelParent;
		_currentMenuItems[adminMenuLabelWithAccessRightHtmlId].attr = {};
		_currentMenuItems[adminMenuLabelWithAccessRightHtmlId].attr.href = "/Admin/AppLoader.aspx?client_id=solid-admin-menus";
		_currentMenuItems[adminMenuLabelWithAccessRightHtmlId].weight = adminMenuLabelWeight;			
		_currentMenuItems[adminMenuLabelWithAccessRightHtmlId].visible = true;
		_currentMenuItems[adminMenuLabelWithAccessRightHtmlId].applyIf = {};
		_currentMenuItems[adminMenuLabelWithAccessRightHtmlId].applyIf.userHasRoles = [];
		_currentMenuItems[adminMenuLabelWithAccessRightHtmlId].applyIf.userHasRoles.push($(element).attr('value'));
	});	
	 
	var menuItemString = JSON.stringify(_currentMenuItems);
	
 	 
		
	_menuFile.upload(menuItemString).done(function() {	
		if (inIframe()) {
			try {
				window.parent.location.reload();
			} catch (e) {
				revertSaveAlert();
				showSavedAlert();
			}		
		} else {
			window.location.reload();
		}
	});	
}

function loadMenuIcons(newFileName, callback) {
	 _menuIconsFolder.fetch().done(function() {         
		 var contents = _menuIconsFolder.get('contents');		 
		 contents.sort(sortByLastModified);
		 var modalRowsSelector = $('#fileUploadModal').find('.library-rows');
		 modalRowsSelector.empty();
		 var currentIconRowSelector;
		 for (var i = 0; i < contents.length; i++) {
			 if (i % 15 === 0) {
				modalRowsSelector.append('<div class = "library-row"></div>');
				currentIconRowSelector = $('.library-row', '#fileUploadModal').last();
			 }			 
			 
			 var entity = contents[i];
			 var isFile = entity instanceof BCAPI.Models.FileSystem.File;
			
			 if (isFile) {
				var selectedClass = '';
				if (newFileName !== undefined && entity.get('name') === newFileName) {
					selectedClass = 'selected';
				}
				
				var defaultIconClass = entity.get('name').indexOf('menu_') === 0 ? _defaultIconClass + ' ' : '';
				
				var iconUrl = './content/menu-icons/' + entity.get('name');
				currentIconRowSelector.append('<div class = "library-icon ' + defaultIconClass + selectedClass + '" icon-url="' + iconUrl + '" style="background-image:url(\'' + iconUrl + '\'); background-position: center; background-repeat: no-repeat;"></div>');
			 }
		 }
		 
		 $('.library-row .library-icon').unbind('click').click(function(e) {
			e.preventDefault();
			$('.library-row .library-icon').removeClass('selected');
			$(this).addClass('selected');
		});
		
		if (callback !== undefined) {
			callback();
		}
	 });
}

function restoreDefaultSettings() {
	if (!window.confirm('This action will restore menu items to their initial view. Are you sure you wish to proceed?')) {
		return;
	}
	showSaveAlert();
	_originalMenuFile.download().done(function(content) {
		_menuFile.upload(content).done(function() {
			if (inIframe()) {
				try {
					window.parent.location.reload();
				} catch (e) {
					revertSaveAlert();
					showSavedAlert();
				}		
			} else {
				window.location.reload();
			}		
		});			 
	});
}

function submitNewMenuItemForm() {
	var errors = '';
	var title = $.trim($('#NewTitle').val());		

	if (title === '') {
		errors += 'You must enter a value for "Title"\n';
	}
	
	if (isValidTitle(title) === false) {	
		errors += 'You may only add alphanumeric characters for the "Title"\n';
	} 
	
	var url = $.trim($('#NewUrl').val());
	if (url !== '' && isValidUrl(url) === false) {
		errors += 'Url format is incorrect: \n   - Urls must start with "http://" or "https://". \n   - App links should be in the form of "/Admin/AppLoader.aspx?client_id={application key}". ';
	}
		
	if (errors !== '') {
		alert('Please fix the following errors: \n\n' + errors);
		return;
	}
	
	var openInNewWindow = $('#NewOpenInNewWindow').is(':checked');
	var navTypeValue = _newNavTypeDropdownSelector.val();
	
	addNewLabelToList(title, url, navTypeValue, openInNewWindow);
	showItemAddedAlert();
}

function setAccessRightSectionAvailability(enabled) {
	if (enabled === false) {
		$('#AvailableRolesList').attr('disabled','disabled');
		$('#MoveToAvailableRolesList').attr('disabled','disabled');
		$('#MoveToAllowedList').attr('disabled','disabled');
		$('#AllowedList').attr('disabled','disabled');
		$('#AllowAllCheckbox').prop('checked',true);
	} else {
		$('#AvailableRolesList').removeAttr('disabled');
		$('#MoveToAvailableRolesList').removeAttr('disabled');
		$('#MoveToAllowedList').removeAttr('disabled');
		$('#AllowedList').removeAttr('disabled');
		$('#AllowAllCheckbox').prop('checked',false);
	}
}

function runUpgrades(callback) {
	
	var versionFile = BCAPI.Models.FileSystem.Root.file('/_System/Apps/solid-admin-menus/version.json');
	versionFile.download().done(function(versionFileContent) {		
		var versionInfo = $.parseJSON(versionFileContent);
		//version 1.1.2 - Remove slug from menu.json	
		if (versionInfo.version == '1.1.2') {
			//Upgrade from 1.1.2
		}
		
		 if (callback) {
			callback();
		 }
	}).error(function (jqXHR) {
		// No version.json file - upgrade from 1.1.1
		
		
	
		// Remove slugs from menu.json file
		_menuFile.download().done(function(menuItemsString) {
			var menuItems = $.parseJSON(menuItemsString);
			
			$.each(menuItems, function(key) {							
				if (menuItems[key] !== undefined && menuItems[key].slug !== undefined) {
					menuItems[key].slug = undefined;
				}
				if (menuItems[key] !== undefined && menuItems[key].solidallowallroles !== undefined) {
					menuItems[key].solidallowallroles = undefined;
				}
				if (menuItems[key] !== undefined && menuItems[key].solidallowedroles !== undefined) {
					menuItems[key].solidallowedroles = undefined;
				}
			});	
			
			updatedMenuItemsString = JSON.stringify(menuItems);
			_menuFile.upload(updatedMenuItemsString).done(function() {
				// Create version json contents
				var versionInfo = {};
				versionInfo.version = '1.1.3';
				var versionInfoString = JSON.stringify(versionInfo);
				
				// Upload versionInfo string contents to version.json file
				versionFile.upload(versionInfoString).done(function() {	
					 if (callback) {
						callback();
					 }
				});	
			});
		});
	});
}

$(function(){
	'use strict';		 
	//RAT.Helper.BC.appendAccessTokenToAnchors($('#tab-labels, #tab-instructions'));
    _newNavTypeDropdownSelector = $('#NewNavType');    
	
	$('#addLabelForm').submit(function(e){
		e.preventDefault(); 
		submitNewMenuItemForm();
	});
	$('button.save').click(function(){saveChanges();});
	$('button.restore-default').click(function(){restoreDefaultSettings();});

	$.ajax({
		dataType: "json",
		url: '/api/v2/admin/sites/' + BCAPI.Helper.Site.getSiteId() + '/roles',
		beforeSend: function (xhr) {
			xhr.setRequestHeader ("Authorization", BCAPI.Helper.Site.getAccessToken());
		},
		success: function(data) {
			$.each(data.items, function(index, element) {
				$('#access-rights-container').find('' +	'.controls').append('<label><input type = "checkbox" value="' + element.name + '">' + element.name + '</input></label>');
				_allAccessRightsList.push(element.name);				
			});	
			
			var afterRunUpgrades = function() {
				loadNavigationData();	
				loadMenuIcons();
			};
			runUpgrades(afterRunUpgrades);						
		}
	});			
	
	
	$('#MoveToAllowedList').click(function(){
		$('#AvailableRolesList > option:selected').appendTo('#AllowedList');
                    
	});
	
	$('#MoveToAvailableRolesList').click(function(){
		$('#AllowedList > option:selected').appendTo('#AvailableRolesList');
	});
	
	$('#AllowAllCheckbox').click(function(){
		setAccessRightSectionAvailability(!($(this).is(':checked')));		
	});
	
	$('#SaveAccessRights').click(function() {
		//validate
		if ($('#AllowAllCheckbox').is(':checked') === false && $('#AllowedList option').length === 0) {
			alert('You must allow at least one role.');
			return false;
		}
		if ($('#AllowAllCheckbox').is(':checked')) {
			_workingMenuItem.solidallowedroles = true;
			_currentNavItemAccessRightsButton.removeClass(_yellowbackButtonClass);			
		} else {			
			_workingMenuItem.solidallowedroles = false;
			_currentNavItemAccessRightsButton.addClass(_yellowbackButtonClass);			
		}
		
		_workingMenuItem.solidallowedroles = [];		
		
		$('#AllowedList option').each(function(index, option) {
			_workingMenuItem.solidallowedroles.push($(option).html());
		});
		
		$('#menuLabelAccessRightsModal').modal('hide');
	});	
	
});