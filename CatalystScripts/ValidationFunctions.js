if (typeof jslang == 'undefined') {
	LoadLangVAsync('EN');
} else {
	if (jslang == 'JP') jslang = 'JA';
	if (jslang == 'CS') jslang = 'CZ';
	if (jslang == 'SI') jslang = 'SL';
	LoadLangVAsync(jslang);
}

function LoadLangVAsync(lang) {
	if (top == window && window.master == 'ctl00_') {
		setTimeout(function() {
			LoadLangV(lang);
		}, 300);
	} else {
		LoadLangV(lang);
	}
}

function LoadLangV(lang) {
	if (document.getElementById("RADEDITORSTYLESHEET0")) {
		return;
	}

	var scr = document.createElement('script');
	scr.setAttribute('src', '/BcJsLang/ValidationFunctions.aspx?lang=' + lang);
	scr.setAttribute('charset', "utf-8");
	scr.setAttribute('type', 'text/javascript');
	document.getElementsByTagName('head')[0].appendChild(scr);
}

function formfield(strng, actiontype) {

	switch (actiontype) {
		// makes first letter upper and all else lower, removes (.) and (,)
		case 'firstupper':
			var allCaps = true;
			var allLower = true;
			// handle surnames properly, e.g. McDermon, deCaprio, if all lower or all upper, we change, otherwise we don't
			// we ignore the first character, e.g. Johnson
			for (var i = 1; i < strng.length; i++) {
				var c = strng.charCodeAt(i);
				if (c >= 65 && c <= 90)
					allLower = false;
				if (c >= 97 && c <= 127)
					allCaps = false;
			}
			if (allCaps || allLower) {
				var word = strng.split(" ");
				strng = "";
				for (var i = 0; i < word.length; i++) {
					if (word[i].length >= 1) {
						strng = strng + " " + word[i].substring(0, 1).toUpperCase() + word[i].substring(1).toLowerCase();
					}
				}
			}
			strng = strng.replace(".", "");
			strng = strng.replace(",", "");
			break;

			// makes first letter upper only and does not affect any other letters or punctuation
		case 'firstupperspecial':
			var word = strng.split(" ");
			strng = ""
			for (var i = 0; i < word.length; i++) {
				if (word[i].length >= 1) {
					strng = strng + " " + word[i].substring(0, 1).toUpperCase() + word[i].substring(1);
				}
			}
			break;

		case 'alllower':
			strng = strng.toLowerCase();
			break;

		case 'allupper':
			strng = strng.toUpperCase();
			break;

		default:
			break;
	}
	if (strng.substring(0, 1) == " ") {
		strng = strng.substring(1);
	}
	return strng;
}

function isCurrency(s, FieldName) {
	var error = "";
	if (s.length == 0) {
		error = "- " + FieldName + validatelang.Currency.MustNumber;
	} else {
		for (var i = 0; i < s.length; i++) {
			var c = s.charAt(i);
			if ((c < "0") || (c > "9")) {
				if (c != "." && c != ",") // with multilingual in europe $3.33 = $3,33
					error = "- " + FieldName + validatelang.Currency.NoSymbol;
			}
		}
	}
	return error;
}

function isNumeric(s, FieldName) {
	var error = "";
	if (s.length == 0) {
		error = "- " + FieldName + validatelang.Number.MustNumber;
	} else {
		var i;
		for (i = 0; i < s.length; i++) {
			var c = s.charAt(i);
			if ((c < "0") || (c > "9")) {
				error = "- " + FieldName + validatelang.Number.NoDecimal;
				return error;
			}
		}
	}
	return error;
}

function isNumericGreaterThan(s, FieldName, minValue) {
	var error = "";
	var inputNumber = 0;
	
	if (s.length == 0) {
		error = "- " + FieldName + validatelang.Number.MustNumber;
	} else {
		var i;
		for (i = 0; i < s.length; i++) {
			var c = s.charAt(i);
			if ((c < "0") || (c > "9")) {
				error = "- " + FieldName + validatelang.Number.NoDecimal;
				return error;
			}
			inputNumber = inputNumber * 10 + parseInt(c);
		}
		
		if (inputNumber <= minValue){
			error = "- " + FieldName + validatelang.Number.GreaterThan.replace(/\{0\}/g, minValue)  ;
			return error;
		}
	}
	return error;
}

function isFloat(s, FieldName) {
	var error = "";
	var i;
	if (s.length == 0) {
		error = "- " + FieldName + validatelang.Float.MustNumber;
	} else {
		for (i = 0; i < s.length; i++) {
			var c = s.charAt(i);
			if (((c < "0") || (c > "9"))) {

				if (c != "." && c != ",") {
					error = "- " + FieldName + validatelang.Float.MustNumber;
					return error;
				}
			}
		}
	}
	return error;
}

function isEmpty(strng, FieldName) {
	var error = "";
	if (strng.trim().length == 0) {
		error = validatelang.Enter.PleaseEnter + FieldName + "\n";
	}
	return error;
}

function isCharacterLimitExceededGeneric(strng, limit, FieldName, message) {
	var error = "";
	if (strng.length > limit) {
		error = '- ' + FieldName + message.replace(/\{0\}/g, limit) + "\n";
	}
	return error;
}

function isCharacterLimitExceeded(strng, limit, FieldName) {
	return isCharacterLimitExceededGeneric(strng, limit, FieldName, validatelang.TextMultiline.MaxCharacters);
}

function isCharacterLimitExceededRich(strng, limit, FieldName) {
	return isCharacterLimitExceededGeneric(strng, limit, FieldName, validatelang.TextMultiline.MaxCharactersRich);
}

function checkDropdown(strng, FieldName) {
	var error = "";
	if (strng.length == 0 || strng == " ") { // we put a space to ensure value attribute is not stripped by browser in WYSIWYG editor
		error = validatelang.Select.PleaseSelect + FieldName + "\n";
	}
	return error;
}

function checkEmail(strng) {
	var error = "";
	if (strng.length > 0) {
		// TLDs from http://data.iana.org/TLD/tlds-alpha-by-domain.txt 
		var tldList = 'aaa|aarp|abarth|abb|abbott|abbvie|abc|able|abogado|abudhabi|ac|academy|accenture|accountant|accountants|aco|actor|ad|adac|ads|adult|ae|aeg|aero|aetna|af|afamilycompany|afl|africa|ag|agakhan|agency|ai|aig|airbus|airforce|airtel|akdn|al|alfaromeo|alibaba|alipay|allfinanz|allstate|ally|alsace|alstom|am|amazon|americanexpress|americanfamily|amex|amfam|amica|amsterdam|analytics|android|anquan|anz|ao|aol|apartments|app|apple|aq|aquarelle|ar|arab|aramco|archi|army|arpa|art|arte|as|asda|asia|associates|at|athleta|attorney|au|auction|audi|audible|audio|auspost|author|auto|autos|avianca|aw|aws|ax|axa|az|azure|ba|baby|baidu|banamex|bananarepublic|band|bank|bar|barcelona|barclaycard|barclays|barefoot|bargains|baseball|basketball|bauhaus|bayern|bb|bbc|bbt|bbva|bcg|bcn|bd|be|beats|beauty|beer|bentley|berlin|best|bestbuy|bet|bf|bg|bh|bharti|bi|bible|bid|bike|bing|bingo|bio|biz|bj|black|blackfriday|blockbuster|blog|bloomberg|blue|bm|bms|bmw|bn|bnpparibas|bo|boats|boehringer|bofa|bom|bond|boo|book|booking|bosch|bostik|boston|bot|boutique|box|br|bradesco|bridgestone|broadway|broker|brother|brussels|bs|bt|budapest|bugatti|build|builders|business|buy|buzz|bv|bw|by|bz|bzh|ca|cab|cafe|cal|call|calvinklein|cam|camera|camp|cancerresearch|canon|capetown|capital|capitalone|car|caravan|cards|care|career|careers|cars|casa|case|caseih|cash|casino|cat|catering|catholic|cba|cbn|cbre|cbs|cc|cd|ceb|center|ceo|cern|cf|cfa|cfd|cg|ch|chanel|channel|charity|chase|chat|cheap|chintai|christmas|chrome|church|ci|cipriani|circle|cisco|citadel|citi|citic|city|cityeats|ck|cl|claims|cleaning|click|clinic|clinique|clothing|cloud|club|clubmed|cm|cn|co|coach|codes|coffee|college|cologne|com|comcast|commbank|community|company|compare|computer|comsec|condos|construction|consulting|contact|contractors|cooking|cookingchannel|cool|coop|corsica|country|coupon|coupons|courses|cpa|cr|credit|creditcard|creditunion|cricket|crown|crs|cruise|cruises|csc|cu|cuisinella|cv|cw|cx|cy|cymru|cyou|cz|dabur|dad|dance|data|date|dating|datsun|day|dclk|dds|de|deal|dealer|deals|degree|delivery|dell|deloitte|delta|democrat|dental|dentist|desi|design|dev|dhl|diamonds|diet|digital|direct|directory|discount|discover|dish|diy|dj|dk|dm|dnp|do|docs|doctor|dog|domains|dot|download|drive|dtv|dubai|duck|dunlop|dupont|durban|dvag|dvr|dz|earth|eat|ec|eco|edeka|edu|education|ee|eg|email|emerck|energy|engineer|engineering|enterprises|epson|equipment|er|ericsson|erni|es|esq|estate|et|etisalat|eu|eurovision|eus|events|exchange|expert|exposed|express|extraspace|fage|fail|fairwinds|faith|family|fan|fans|farm|farmers|fashion|fast|fedex|feedback|ferrari|ferrero|fi|fiat|fidelity|fido|film|final|finance|financial|fire|firestone|firmdale|fish|fishing|fit|fitness|fj|fk|flickr|flights|flir|florist|flowers|fly|fm|fo|foo|food|foodnetwork|football|ford|forex|forsale|forum|foundation|fox|fr|free|fresenius|frl|frogans|frontdoor|frontier|ftr|fujitsu|fujixerox|fun|fund|furniture|futbol|fyi|ga|gal|gallery|gallo|gallup|game|games|gap|garden|gay|gb|gbiz|gd|gdn|ge|gea|gent|genting|george|gf|gg|ggee|gh|gi|gift|gifts|gives|giving|gl|glade|glass|gle|global|globo|gm|gmail|gmbh|gmo|gmx|gn|godaddy|gold|goldpoint|golf|goo|goodyear|goog|google|gop|got|gov|gp|gq|gr|grainger|graphics|gratis|green|gripe|grocery|group|gs|gt|gu|guardian|gucci|guge|guide|guitars|guru|gw|gy|hair|hamburg|hangout|haus|hbo|hdfc|hdfcbank|health|healthcare|help|helsinki|here|hermes|hgtv|hiphop|hisamitsu|hitachi|hiv|hk|hkt|hm|hn|hockey|holdings|holiday|homedepot|homegoods|homes|homesense|honda|horse|hospital|host|hosting|hot|hoteles|hotels|hotmail|house|how|hr|hsbc|ht|hu|hughes|hyatt|hyundai|ibm|icbc|ice|icu|id|ie|ieee|ifm|ikano|il|im|imamat|imdb|immo|immobilien|in|inc|industries|infiniti|info|ing|ink|institute|insurance|insure|int|intel|international|intuit|investments|io|ipiranga|iq|ir|irish|is|ismaili|ist|istanbul|it|itau|itv|iveco|jaguar|java|jcb|jcp|je|jeep|jetzt|jewelry|jio|jll|jm|jmp|jnj|jo|jobs|joburg|jot|joy|jp|jpmorgan|jprs|juegos|juniper|kaufen|kddi|ke|kerryhotels|kerrylogistics|kerryproperties|kfh|kg|kh|ki|kia|kim|kinder|kindle|kitchen|kiwi|km|kn|koeln|komatsu|kosher|kp|kpmg|kpn|kr|krd|kred|kuokgroup|kw|ky|kyoto|kz|la|lacaixa|lamborghini|lamer|lancaster|lancia|land|landrover|lanxess|lasalle|lat|latino|latrobe|law|lawyer|lb|lc|lds|lease|leclerc|lefrak|legal|lego|lexus|lgbt|li|lidl|life|lifeinsurance|lifestyle|lighting|like|lilly|limited|limo|lincoln|linde|link|lipsy|live|living|lixil|lk|llc|llp|loan|loans|locker|locus|loft|lol|london|lotte|lotto|love|lpl|lplfinancial|lr|ls|lt|ltd|ltda|lu|lundbeck|lupin|luxe|luxury|lv|ly|ma|macys|madrid|maif|maison|makeup|man|management|mango|map|market|marketing|markets|marriott|marshalls|maserati|mattel|mba|mc|mckinsey|md|me|med|media|meet|melbourne|meme|memorial|men|menu|merckmsd|metlife|mg|mh|miami|microsoft|mil|mini|mint|mit|mitsubishi|mk|ml|mlb|mls|mm|mma|mn|mo|mobi|mobile|moda|moe|moi|mom|monash|money|monster|mormon|mortgage|moscow|moto|motorcycles|mov|movie|mp|mq|mr|ms|msd|mt|mtn|mtr|mu|museum|mutual|mv|mw|mx|my|mz|na|nab|nagoya|name|nationwide|natura|navy|nba|nc|ne|nec|net|netbank|netflix|network|neustar|new|newholland|news|next|nextdirect|nexus|nf|nfl|ng|ngo|nhk|ni|nico|nike|nikon|ninja|nissan|nissay|nl|no|nokia|northwesternmutual|norton|now|nowruz|nowtv|np|nr|nra|nrw|ntt|nu|nyc|nz|obi|observer|off|office|okinawa|olayan|olayangroup|oldnavy|ollo|om|omega|one|ong|onl|online|onyourside|ooo|open|oracle|orange|org|organic|origins|osaka|otsuka|ott|ovh|pa|page|panasonic|paris|pars|partners|parts|party|passagens|pay|pccw|pe|pet|pf|pfizer|pg|ph|pharmacy|phd|philips|phone|photo|photography|photos|physio|pics|pictet|pictures|pid|pin|ping|pink|pioneer|pizza|pk|pl|place|play|playstation|plumbing|plus|pm|pn|pnc|pohl|poker|politie|porn|post|pr|pramerica|praxi|press|prime|pro|prod|productions|prof|progressive|promo|properties|property|protection|pru|prudential|ps|pt|pub|pw|pwc|py|qa|qpon|quebec|quest|qvc|racing|radio|raid|re|read|realestate|realtor|realty|recipes|red|redstone|redumbrella|rehab|reise|reisen|reit|reliance|ren|rent|rentals|repair|report|republican|rest|restaurant|review|reviews|rexroth|rich|richardli|ricoh|ril|rio|rip|rmit|ro|rocher|rocks|rodeo|rogers|room|rs|rsvp|ru|rugby|ruhr|run|rw|rwe|ryukyu|sa|saarland|safe|safety|sakura|sale|salon|samsclub|samsung|sandvik|sandvikcoromant|sanofi|sap|sarl|sas|save|saxo|sb|sbi|sbs|sc|sca|scb|schaeffler|schmidt|scholarships|school|schule|schwarz|science|scjohnson|scot|sd|se|search|seat|secure|security|seek|select|sener|services|ses|seven|sew|sex|sexy|sfr|sg|sh|shangrila|sharp|shaw|shell|shia|shiksha|shoes|shop|shopping|shouji|show|showtime|shriram|si|silk|sina|singles|site|sj|sk|ski|skin|sky|skype|sl|sling|sm|smart|smile|sn|sncf|so|soccer|social|softbank|software|sohu|solar|solutions|song|sony|soy|space|sport|spot|spreadbetting|sr|srl|ss|st|stada|staples|star|statebank|statefarm|stc|stcgroup|stockholm|storage|store|stream|studio|study|style|su|sucks|supplies|supply|support|surf|surgery|suzuki|sv|swatch|swiftcover|swiss|sx|sy|sydney|systems|sz|tab|taipei|talk|taobao|target|tatamotors|tatar|tattoo|tax|taxi|tc|tci|td|tdk|team|tech|technology|tel|temasek|tennis|teva|tf|tg|th|thd|theater|theatre|tiaa|tickets|tienda|tiffany|tips|tires|tirol|tj|tjmaxx|tjx|tk|tkmaxx|tl|tm|tmall|tn|to|today|tokyo|tools|top|toray|toshiba|total|tours|town|toyota|toys|tr|trade|trading|training|travel|travelchannel|travelers|travelersinsurance|trust|trv|tt|tube|tui|tunes|tushu|tv|tvs|tw|tz|ua|ubank|ubs|ug|uk|unicom|university|uno|uol|ups|us|uy|uz|va|vacations|vana|vanguard|vc|ve|vegas|ventures|verisign|versicherung|vet|vg|vi|viajes|video|vig|viking|villas|vin|vip|virgin|visa|vision|viva|vivo|vlaanderen|vn|vodka|volkswagen|volvo|vote|voting|voto|voyage|vu|vuelos|wales|walmart|walter|wang|wanggou|watch|watches|weather|weatherchannel|webcam|weber|website|wed|wedding|weibo|weir|wf|whoswho|wien|wiki|williamhill|win|windows|wine|winners|wme|wolterskluwer|woodside|work|works|world|wow|ws|wtc|wtf|xbox|xerox|xfinity|xihuan|xin|xn--11b4c3d|xn--1ck2e1b|xn--1qqw23a|xn--2scrj9c|xn--30rr7y|xn--3bst00m|xn--3ds443g|xn--3e0b707e|xn--3hcrj9c|xn--3oq18vl8pn36a|xn--3pxu8k|xn--42c2d9a|xn--45br5cyl|xn--45brj9c|xn--45q11c|xn--4gbrim|xn--54b7fta0cc|xn--55qw42g|xn--55qx5d|xn--5su34j936bgsg|xn--5tzm5g|xn--6frz82g|xn--6qq986b3xl|xn--80adxhks|xn--80ao21a|xn--80aqecdr1a|xn--80asehdb|xn--80aswg|xn--8y0a063a|xn--90a3ac|xn--90ae|xn--90ais|xn--9dbq2a|xn--9et52u|xn--9krt00a|xn--b4w605ferd|xn--bck1b9a5dre4c|xn--c1avg|xn--c2br7g|xn--cck2b3b|xn--cckwcxetd|xn--cg4bki|xn--clchc0ea0b2g2a9gcd|xn--czr694b|xn--czrs0t|xn--czru2d|xn--d1acj3b|xn--d1alf|xn--e1a4c|xn--eckvdtc9d|xn--efvy88h|xn--fct429k|xn--fhbei|xn--fiq228c5hs|xn--fiq64b|xn--fiqs8s|xn--fiqz9s|xn--fjq720a|xn--flw351e|xn--fpcrj9c3d|xn--fzc2c9e2c|xn--fzys8d69uvgm|xn--g2xx48c|xn--gckr3f0f|xn--gecrj9c|xn--gk3at1e|xn--h2breg3eve|xn--h2brj9c|xn--h2brj9c8c|xn--hxt814e|xn--i1b6b1a6a2e|xn--imr513n|xn--io0a7i|xn--j1aef|xn--j1amh|xn--j6w193g|xn--jlq480n2rg|xn--jlq61u9w7b|xn--jvr189m|xn--kcrx77d1x4a|xn--kprw13d|xn--kpry57d|xn--kput3i|xn--l1acc|xn--lgbbat1ad8j|xn--mgb9awbf|xn--mgba3a3ejt|xn--mgba3a4f16a|xn--mgba7c0bbn0a|xn--mgbaakc7dvf|xn--mgbaam7a8h|xn--mgbab2bd|xn--mgbah1a3hjkrd|xn--mgbai9azgqp6j|xn--mgbayh7gpa|xn--mgbbh1a|xn--mgbbh1a71e|xn--mgbc0a9azcg|xn--mgbca7dzdo|xn--mgbcpq6gpa1a|xn--mgberp4a5d4ar|xn--mgbgu82a|xn--mgbi4ecexp|xn--mgbpl2fh|xn--mgbt3dhd|xn--mgbtx2b|xn--mgbx4cd0ab|xn--mix891f|xn--mk1bu44c|xn--mxtq1m|xn--ngbc5azd|xn--ngbe9e0a|xn--ngbrx|xn--node|xn--nqv7f|xn--nqv7fs00ema|xn--nyqy26a|xn--o3cw4h|xn--ogbpf8fl|xn--otu796d|xn--p1acf|xn--p1ai|xn--pgbs0dh|xn--pssy2u|xn--q7ce6a|xn--q9jyb4c|xn--qcka1pmc|xn--qxa6a|xn--qxam|xn--rhqv96g|xn--rovu88b|xn--rvc1e0am3e|xn--s9brj9c|xn--ses554g|xn--t60b56a|xn--tckwe|xn--tiq49xqyj|xn--unup4y|xn--vermgensberater-ctb|xn--vermgensberatung-pwb|xn--vhquv|xn--vuq861b|xn--w4r85el8fhu5dnra|xn--w4rs40l|xn--wgbh1c|xn--wgbl6a|xn--xhq521b|xn--xkc2al3hye2a|xn--xkc2dl3a5ee0h|xn--y9a3aq|xn--yfro4i67o|xn--ygbi2ammx|xn--zfr164b|xxx|xyz|yachts|yahoo|yamaxun|yandex|ye|yodobashi|yoga|yokohama|you|youtube|yt|yun|za|zappos|zara|zero|zip|zm|zone|zuerich|zw';
		var emailFilter = new RegExp('^[a-zA-Z0-9._-]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+(?:' + tldList + ')$', 'i');
		if (!(emailFilter.test(strng)))
			error = validatelang.Email.ValidEmail;
		else {
			// Check email for illegal characters
			var illegalChars = /[\(\)\<\>\,\;\:\\\"\[\]]/
			if (strng.match(illegalChars))
				error = validatelang.Email.Illegal;
		}
	} else
		error = validatelang.Email.ValidEmail;

	return error;
}

// Checks in a checkbox or radio list that at least one item is selected
function checkSelected(FieldName, strng) {
	var error = "- " + strng + validatelang.Select.MustSelect;
	if (FieldName.length > 0) {
		for (var i = 0; i < FieldName.length; i++) {
			if (FieldName[i].disabled == false && FieldName[i].checked == true) error = "";
		}
	} else
	if (FieldName.disabled == false && FieldName.checked == true) error = "";
	return error;
}

// returns the selected value from a radio list or nothing
function getRadioSelected(FieldName) {
	if (FieldName.length > 0) {
		for (var i = 0; i < FieldName.length; i++) {
			if (FieldName[i].disabled == false && FieldName[i].checked == true)
				return FieldName[i].value;
		}
	} else
	if (FieldName.disabled == false && FieldName.checked == true)
		return FieldName.value;
	return null;
}

// Checks asp.net checkbox lists as the elements of a checkbox have 2 extra characters
// appended to each one which makes the name no longer unique
function checkSelectedX(FieldName, strng) {
	var error = "- " + strng + validatelang.Select.MustSelect;
	var table = document.getElementById(FieldName);
	var cells = table.getElementsByTagName("td");
	var ctrl;
	for (var i = 0; i < cells.length; i++) {
		ctrl = cells[i].firstChild;
		if (ctrl && (ctrl.type == 'checkbox' || ctrl.type == 'radio'))
			if (ctrl.disabled == false && ctrl.checked == true)
				error = "";
	}
	return error;
}

function checkSpaces(strng, FieldName) {
	var error = "";
	for (var i = 0; i < strng.length; i++) {
		if (strng.charAt(i) == " ")
			error = "- " + FieldName + validatelang.Others.CannotContain + validatelang.Others.WhiteSpace;
	}
	return error;
}

// consistent with General->Check_URLChar()
function checkUrlChar(strng, FieldName) {
	var error = "";
	for (i = 0; i < strng.length; i++) {
		var c = strng.charAt(i);
		switch (c) {
			case "/":
			case "\\":
			case "#":
			case "?":
			case ":":
			case "@":
			case "=":
			case "&":
			case '"':
			case "|":
			case "_":
			case ".":
			case "%":
				error = "- " + FieldName + validatelang.Others.CannotContain + "[" + c + "] " + validatelang.Others.Character;
				return error;
		}
	}
	return error;
}

function isInteger(s) {
	var i;

	if (s.length == 0)
		return false;

	for (i = 0; i < s.length; i++) {
		// Check that current character is number.
		var c = s.charAt(i);
		if (((c < "0") || (c > "9"))) return false;
	}
	// All characters are numbers.
	return true;
}

// Checks to see if a date is valid. All date fields inside admin are readonly, if this function
// is called and no value is entered then the date is invalid, otherwise always valid
function checkDate(d, FieldName) {
	var error = "";

	if (d.length == 0) {
		error = validatelang.Enter.PleaseEnter + FieldName + validatelang.CheckDate.ValidDate;
		return error;
	}
	return error;
}

function appendBreak(msg) {
	return msg = msg + '\n';
}

String.prototype.trim = function() {
	a = this.replace(/^\s+/, '');
	return a.replace(/\s+$/, '');
}



function addEventSimple(obj, evt, fn) {
	if (obj.addEventListener)
		obj.addEventListener(evt, fn, false);
	else if (obj.attachEvent)
		obj.attachEvent('on' + evt, fn);
}

function sendRequestSync(url, callback, postData) {
	var req = createXMLHTTPObject();
	if (!req) return;
	var method = (postData) ? "POST" : "GET";
	req.open(method, url, false);
	if (postData)
		req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	req.send(postData);

	if (req.status === 200) {
		return req.responseText;
	}
}

var XMLHttpFactories = [
	function() {
		return new XMLHttpRequest()
	},
	function() {
		return new ActiveXObject("Msxml2.XMLHTTP")
	},
	function() {
		return new ActiveXObject("Msxml3.XMLHTTP")
	},
	function() {
		return new ActiveXObject("Microsoft.XMLHTTP")
	}
];

function createXMLHTTPObject() {
	var xmlhttp = false;
	for (var i = 0; i < XMLHttpFactories.length; i++) {
		try {
			xmlhttp = XMLHttpFactories[i]();
		} catch (e) {
			continue;
		}
		break;
	}
	return xmlhttp;
}

for (var i = 0; i < document.forms.length; i++) {
	initCaptchaOnForm(document.forms[i]);
}

function initCaptchaOnForm(f) {
	if (f._CaptchaHookedUp)
		return;

	if (!f.CaptchaV2)
		return;

	if (!f.CaptchaHV2)
		return;

	f._CaptchaHookedUp = true;
}

function reCaptchaV2IsInvalid(f, messageWhenRobot) {
	if (typeof f['g-recaptcha-response'] != "undefined") {
		var hidden = f['bc-recaptcha-token'];
		var captchaId = hidden.getAttribute('data-recaptcha-id');
		var isValid = reCaptchaV2Manager.isInstanceVerified(captchaId);

		if (!isValid)
			return "- " + messageWhenRobot;
	}

	return "";
}

function captchaIsInvalid(f, messageWhenEmpty, messageWhenInvalid) {
	if ((f._CaptchaTextValidated === true) && (f._CaptchaTextIsInvalid === false)) {
		return "";
	}

	if (typeof f.ReCaptchaChallenge != "undefined") {
		var key = Recaptcha.get_challenge();
		var answer = Recaptcha.get_response();

		if (answer.trim().length == 0)
			return "- " + messageWhenEmpty;

		f.ReCaptchaAnswer.value = Recaptcha.get_response();
		f.ReCaptchaChallenge.value = Recaptcha.get_challenge();

		var response = sendRequestSync('/ValidateCaptcha.ashx?key=' + key + '&answer=' + answer + '&imageVerificationType=recaptcha');
		f._CaptchaTextIsInvalid = response == 'false';
		f._CaptchaTextValidated = true;
		if (f._CaptchaTextIsInvalid) {
			regenerateCaptcha(f);
		}
	} else {
		var key = f.CaptchaHV2.value;
		var answer = f.CaptchaV2.value;
		var correctCaptchaLength = 6;

		if (answer.trim().length == 0)
			return "- " + messageWhenEmpty;

		if (answer.length != correctCaptchaLength) {
			f._CaptchaTextIsInvalid = true;
		} else {
			var response = sendRequestSync('/ValidateCaptcha.ashx?key=' + key + '&answer=' + answer);
			f._CaptchaTextIsInvalid = response == 'false';
			f._CaptchaTextValidated = true;
			if (f._CaptchaTextIsInvalid) {
				regenerateCaptcha(f);
			}
		}
	}


	if (f._CaptchaTextIsInvalid)
		return "- " + messageWhenInvalid;

	return "";
}

function regenerateCaptcha(f) {
	f._CaptchaTextValidated = false;
	f._CaptchaTextIsInvalid = true;

	if (typeof f.ReCaptchaChallenge != "undefined") {
		Recaptcha.reload();
	} else {
		var key = sendRequestSync('/CaptchaHandler.ashx?Regenerate=true&rand=' + Math.random());

		f.CaptchaHV2.value = key;
		f.CaptchaV2.value = "";

		var imgs = f.getElementsByTagName("img");
		if (imgs.length == 0) { // fix for broken dom in ie9
			if ((f.parentNode.nodeName.toLowerCase() == "p") && (f.parentNode.nextSibling) && (f.parentNode.nextSibling.nodeName.toLowerCase() == "table") && (f.parentNode.nextSibling.className == "webform")) {
				imgs = f.parentNode.nextSibling.getElementsByTagName("img");
			}
		}

		for (var i = 0; i < imgs.length; i++) {
			var src = imgs[i].src;
			var srcLower = src.toLowerCase();
			if (srcLower.indexOf("/captchahandler.ashx") > -1) {
				var p1 = srcLower.indexOf("?id=") + 4;
				var p2 = srcLower.indexOf("&", p1);
				var oldKey = src.substring(p1, p2);
				var newSrc = src.replace(oldKey, key);

				imgs[i].src = newSrc;

				break;
			}
		}
	}
}

function isNumericIfVisible(s, FieldName) {
	var error = "";
	if (s.style.display == 'inline') {
		if (s.value.length == 0) {
			error = "- " + FieldName + validatelang.Number.MustNumber;
		} else {
			var i;
			for (i = 0; i < s.value.length; i++) {
				var c = s.value.charAt(i);
				if ((c < "0") || (c > "9")) {
					error = "- " + FieldName + validatelang.Number.NoDecimal;
					return error;
				}
			}
		}
	}
	return error;
}

function checkIPAddress(text) {
	var reg = /^\s*((0|[1-9]\d?|1\d{2}|2[0-4]\d|25[0-5])\.){3}(0|[1-9]\d?|1\d{2}|2[0-4]\d|25[0-5])\s*$/;
	if (reg.test(text)) return '';
	return validatelang.IP.Illegal;
}


/* reCaptchaV2Manager - manages all ReCaptcha V2 operations 
*/
if (typeof reCaptchaV2Manager == 'undefined') {
    var reCaptchaV2Manager = (function(){
        var _controlInstances = {};
        var _dataObjects = [];

        function initializeControls() {
            if (_dataObjects.length == 0) {
                return;
            }

            retrieveTokensWithAjax(_dataObjects.length, function(tokens) {
                for(var i=0; i<_dataObjects.length && i<tokens.length; i++) {
                    var crtDataObject = _dataObjects[i];

                    var hidden = document.getElementById('token' + crtDataObject.id);
                    hidden.value = tokens[i];

                    var renderParams = {
                        'sitekey': crtDataObject.sitekey,
                        'type': crtDataObject.type,
                        'theme': crtDataObject.theme,
                        'size': crtDataObject.size
                    };

                    if (typeof _controlInstances[crtDataObject.id] == "undefined") {
	                    _controlInstances[crtDataObject.id] = grecaptcha.render('recaptcha' + crtDataObject.id, renderParams);
	                }
	                else {
	                	grecaptcha.reset(_controlInstances[crtDataObject.id], renderParams);
	                }
                }
            });
        }

        function retrieveTokensWithAjax(count, callback) {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.readyState == 4 && req.status == 200) {
                    var tokens = req.responseText.split(';');
                    callback(tokens);
                }
            };

            req.open('GET', '/CaptchaHandler.ashx?RegenerateV2=true&count=' + count + '&rand=' + Math.random(), true);
            req.send();
        }

        return {
        	/* Needs to be assigned as the onload handler for the google reCaptcha V2 library.
        	*/
            onLoadHandler: function() {
                window.setTimeout(initializeControls, 1);
            },
            /* Use this method to register the parameters for each reCaptcha instance that will be rendered as a control 
           	** during the onLoadHandler.
            */
            registerInstance: function(data) {
                if(data) {
                    _dataObjects.push(data);
                }
            },
            /* Call this method reinitialize all ReCaptcha V2 controls corresponding to the registered instances.
            */
            reloadControls: function() {
            	initializeControls();
            },
            /* Checks if the validation has been performed on the given captcha control.
            */
            isInstanceVerified: function(captchaId){
                if(typeof _controlInstances[captchaId] != "undefined") {
                    var googleAnswer = grecaptcha.getResponse(_controlInstances[captchaId]);

                    // The google answer will be an empty string if the recaptcha instance has 
                    // not been validated
                    return googleAnswer.trim().length != 0;
                }
                else {
                    return false;
                }
            }
        };
    })();
}