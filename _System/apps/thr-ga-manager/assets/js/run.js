function runDetails(){prettify();if($("#input-domains").val()=="yourdomain.com"){var e=$.ajax({url:"/api/v2/admin/sites/current",headers:{Authorization:$.cookie("access_token")},contentType:"application/json"});e.done(function(e){var t;$.each(e["siteLinks"],function(){if(this.rel=="publicUrl"){t=JSON.stringify(this.uri)}});var n=t.split('"http://');var r=n[1].split('/"');if(r[0]!=""){settings.set("input-domains",r[0]);router.navigate("/#1");router.navigate("/#0")}})}showFooterButtons(true);enableApp();var t;$("form").on("blur","input",function(){var e=$(this).attr("id");var t=$(this).val();if(e=="input-domains"){t=t.split(",").join("', '").replace(/\s+/g,"")}settings.set(e,t);router.navigate("/#1");router.navigate("/#0")});$("#code-snippet,#code-snippet-ecommerce").on("click","textarea",function(){$(this).select();$(this).mouseup(function(){$(this).unbind("mouseup");return false})});var n=$("#input-domains").val().split("','").join(",");$("#input-domains").val(n)}function runInstructions(){showFooterButtons(false);$("#delete-app-modal-button").on("click",function(){$("#delete-app-modal").modal()});$("#delete-app-button").on("click",function(){$("#container-app").css({opacity:0});$("#delete-app-modal").modal("hide");$("#destroyed-app-modal").modal();deleteApp()});$("#delete-app-continue-button").on("click",function(){var e=document.referrer;var t=e.split("/Admin/AppLoader.aspx?client_id=")[0];parent.location.href=t+"/Admin/Dashboard_Business.aspx"})}function prettify(){!function(){var e=null;(function(){function t(e){function t(){try{u.doScroll("left")}catch(e){s(t,50);return}n("poll")}function n(t){if(!(t.type=="readystatechange"&&o.readyState!="complete")&&((t.type=="load"?i:o)[c](h+t.type,n,!1),!a&&(a=!0)))e.call(i,t.type||t)}var r=o.addEventListener,a=!1,f=!0,l=r?"addEventListener":"attachEvent",c=r?"removeEventListener":"detachEvent",h=r?"":"on";if(o.readyState=="complete")e.call(i,"lazy");else{if(o.createEventObject&&u.doScroll){try{f=!i.frameElement}catch(p){}f&&t()}o[l](h+"DOMContentLoaded",n,!1);o[l](h+"readystatechange",n,!1);i[l](h+"load",n,!1)}}function n(){d&&t(function(){var e=g.length;b(e?function(){for(var t=0;t<e;++t)(function(e){s(function(){i.exports[g[e]].apply(i,arguments)},0)})(t)}:void 0)})}for(var i=window,s=i.setTimeout,o=document,u=o.documentElement,a=o.head||o.getElementsByTagName("head")[0]||u,f="",l=o.getElementsByTagName("script"),c=l.length;--c>=0;){var h=l[c],p=h.src.match(/^[^#?]*\/run_prettify\.js(\?[^#]*)?(?:#.*)?$/);if(p){f=p[1]||"";h.parentNode.removeChild(h);break}}var d=!0,v=[],m=[],g=[];f.replace(/[&?]([^&=]+)=([^&]+)/g,function(e,t,n){n=decodeURIComponent(n);t=decodeURIComponent(t);t=="autorun"?d=!/^[0fn]/i.test(n):t=="lang"?v.push(n):t=="skin"?m.push(n):t=="callback"&&g.push(n)});c=0;for(f=v.length;c<f;++c)(function(){var t=o.createElement("script");t.onload=t.onerror=t.onreadystatechange=function(){if(t&&(!t.readyState||/loaded|complete/.test(t.readyState)))t.onerror=t.onload=t.onreadystatechange=e,--y,y||s(n,0),t.parentNode&&t.parentNode.removeChild(t),t=e};t.type="text/javascript";t.src="https://google-code-prettify.googlecode.com/svn/loader/lang-"+encodeURIComponent(v[c])+".js";a.insertBefore(t,a.firstChild)})(v[c]);for(var y=v.length,l=[],c=0,f=m.length;c<f;++c)l.push("https://google-code-prettify.googlecode.com/svn/loader/skins/"+encodeURIComponent(m[c])+".css");l.push("https://google-code-prettify.googlecode.com/svn/loader/prettify.css");(function(e){function t(r){if(r!==n){var i=o.createElement("link");i.rel="stylesheet";i.type="text/css";if(r+1<n)i.error=i.onerror=function(){t(r+1)};i.href=e[r];a.appendChild(i)}}var n=e.length;t(0)})(l);var b=function(){window.PR_SHOULD_USE_CONTINUATION=!0;var t;(function(){function n(e){function t(e){var t=e.charCodeAt(0);if(t!==92)return t;var n=e.charAt(1);return(t=c[n])?t:"0"<=n&&n<="7"?parseInt(e.substring(1),8):n==="u"||n==="x"?parseInt(e.substring(2),16):e.charCodeAt(1)}function n(e){if(e<32)return(e<16?"\\x0":"\\x")+e.toString(16);e=String.fromCharCode(e);return e==="\\"||e==="-"||e==="]"||e==="^"?"\\"+e:e}function r(e){var r=e.substring(1,e.length-1).match(/\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\[0-3][0-7]{0,2}|\\[0-7]{1,2}|\\[\S\s]|[^\\]/g),e=[],i=r[0]==="^",s=["["];i&&s.push("^");for(var i=i?1:0,o=r.length;i<o;++i){var u=r[i];if(/\\[bdsw]/i.test(u))s.push(u);else{var u=t(u),a;i+2<o&&"-"===r[i+1]?(a=t(r[i+2]),i+=2):a=u;e.push([u,a]);a<65||u>122||(a<65||u>90||e.push([Math.max(65,u)|32,Math.min(a,90)|32]),a<97||u>122||e.push([Math.max(97,u)&-33,Math.min(a,122)&-33]))}}e.sort(function(e,t){return e[0]-t[0]||t[1]-e[1]});r=[];o=[];for(i=0;i<e.length;++i)u=e[i],u[0]<=o[1]+1?o[1]=Math.max(o[1],u[1]):r.push(o=u);for(i=0;i<r.length;++i)u=r[i],s.push(n(u[0])),u[1]>u[0]&&(u[1]+1>u[0]&&s.push("-"),s.push(n(u[1])));s.push("]");return s.join("")}function i(e){for(var t=e.source.match(/\[(?:[^\\\]]|\\[\S\s])*]|\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\\d+|\\[^\dux]|\(\?[!:=]|[()^]|[^()[\\^]+/g),i=t.length,u=[],a=0,f=0;a<i;++a){var l=t[a];l==="("?++f:"\\"===l.charAt(0)&&(l=+l.substring(1))&&(l<=f?u[l]=-1:t[a]=n(l))}for(a=1;a<u.length;++a)-1===u[a]&&(u[a]=++s);for(f=a=0;a<i;++a)l=t[a],l==="("?(++f,u[f]||(t[a]="(?:")):"\\"===l.charAt(0)&&(l=+l.substring(1))&&l<=f&&(t[a]="\\"+u[l]);for(a=0;a<i;++a)"^"===t[a]&&"^"!==t[a+1]&&(t[a]="");if(e.ignoreCase&&o)for(a=0;a<i;++a)l=t[a],e=l.charAt(0),l.length>=2&&e==="["?t[a]=r(l):e!=="\\"&&(t[a]=l.replace(/[A-Za-z]/g,function(e){e=e.charCodeAt(0);return"["+String.fromCharCode(e&-33,e|32)+"]"}));return t.join("")}for(var s=0,o=!1,u=!1,a=0,f=e.length;a<f;++a){var l=e[a];if(l.ignoreCase)u=!0;else if(/[a-z]/i.test(l.source.replace(/\\u[\da-f]{4}|\\x[\da-f]{2}|\\[^UXux]/gi,""))){o=!0;u=!1;break}}for(var c={b:8,t:9,n:10,v:11,f:12,r:13},h=[],a=0,f=e.length;a<f;++a){l=e[a];if(l.global||l.multiline)throw Error(""+l);h.push("(?:"+i(l)+")")}return RegExp(h.join("|"),u?"gi":"g")}function i(e,t){function n(e){var a=e.nodeType;if(a==1){if(!r.test(e.className)){for(a=e.firstChild;a;a=a.nextSibling)n(a);a=e.nodeName.toLowerCase();if("br"===a||"li"===a)i[u]="\n",o[u<<1]=s++,o[u++<<1|1]=e}}else if(a==3||a==4)a=e.nodeValue,a.length&&(a=t?a.replace(/\r\n?/g,"\n"):a.replace(/[\t\n\r ]+/g," "),i[u]=a,o[u<<1]=s,s+=a.length,o[u++<<1|1]=e)}var r=/(?:^|\s)nocode(?:\s|$)/,i=[],s=0,o=[],u=0;n(e);return{a:i.join("").replace(/\n$/,""),d:o}}function o(e,t,n,r){t&&(e={a:t,e:e},n(e),r.push.apply(r,e.g))}function u(e){for(var t=void 0,n=e.firstChild;n;n=n.nextSibling)var r=n.nodeType,t=r===1?t?e:n:r===3?T.test(n.nodeValue)?e:t:t;return t===e?void 0:t}function a(t,i){function s(e){for(var t=e.e,n=[t,"pln"],r=0,l=e.a.match(a)||[],c={},p=0,d=l.length;p<d;++p){var v=l[p],m=c[v],g=void 0,y;if(typeof m==="string")y=!1;else{var b=u[v.charAt(0)];if(b)g=v.match(b[1]),m=b[0];else{for(y=0;y<f;++y)if(b=i[y],g=v.match(b[1])){m=b[0];break}g||(m="pln")}if((y=m.length>=5&&"lang-"===m.substring(0,5))&&!(g&&typeof g[1]==="string"))y=!1,m="src";y||(c[v]=m)}b=r;r+=v.length;if(y){y=g[1];var w=v.indexOf(y),E=w+y.length;g[2]&&(E=v.length-g[2].length,w=E-y.length);m=m.substring(5);o(t+b,v.substring(0,w),s,n);o(t+b+w,y,h(m,y),n);o(t+b+E,v.substring(E),s,n)}else n.push(t+b,m)}e.g=n}var u={},a;(function(){for(var s=t.concat(i),o=[],f={},l=0,c=s.length;l<c;++l){var h=s[l],p=h[3];if(p)for(var d=p.length;--d>=0;)u[p.charAt(d)]=h;h=h[1];p=""+h;f.hasOwnProperty(p)||(o.push(h),f[p]=e)}o.push(/[\S\s]/);a=n(o)})();var f=i.length;return s}function f(t){var n=[],i=[];t.tripleQuotedStrings?n.push(["str",/^(?:'''(?:[^'\\]|\\[\S\s]|''?(?=[^']))*(?:'''|$)|"""(?:[^"\\]|\\[\S\s]|""?(?=[^"]))*(?:"""|$)|'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$))/,e,"'\""]):t.multiLineStrings?n.push(["str",/^(?:'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$)|`(?:[^\\`]|\\[\S\s])*(?:`|$))/,e,"'\"`"]):n.push(["str",/^(?:'(?:[^\n\r'\\]|\\.)*(?:'|$)|"(?:[^\n\r"\\]|\\.)*(?:"|$))/,e,"\"'"]);t.verbatimStrings&&i.push(["str",/^@"(?:[^"]|"")*(?:"|$)/,e]);var s=t.hashComments;s&&(t.cStyleComments?(s>1?n.push(["com",/^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/,e,"#"]):n.push(["com",/^#(?:(?:define|e(?:l|nd)if|else|error|ifn?def|include|line|pragma|undef|warning)\b|[^\n\r]*)/,e,"#"]),i.push(["str",/^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/,e])):n.push(["com",/^#[^\n\r]*/,e,"#"]));t.cStyleComments&&(i.push(["com",/^\/\/[^\n\r]*/,e]),i.push(["com",/^\/\*[\S\s]*?(?:\*\/|$)/,e]));if(s=t.regexLiterals){var o=(s=s>1?"":"\n\r")?".":"[\\S\\s]";i.push(["lang-regex",RegExp("^(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*("+("/(?=[^/*"+s+"])(?:[^/\\x5B\\x5C"+s+"]|\\x5C"+o+"|\\x5B(?:[^\\x5C\\x5D"+s+"]|\\x5C"+o+")*(?:\\x5D|$))+/")+")")])}(s=t.types)&&i.push(["typ",s]);s=(""+t.keywords).replace(/^ | $/g,"");s.length&&i.push(["kwd",RegExp("^(?:"+s.replace(/[\s,]+/g,"|")+")\\b"),e]);n.push(["pln",/^\s+/,e," \r\n	 "]);s="^.[^\\s\\w.$@'\"`/\\\\]*";t.regexLiterals&&(s+="(?!s*/)");i.push(["lit",/^@[$_a-z][\w$@]*/i,e],["typ",/^(?:[@_]?[A-Z]+[a-z][\w$@]*|\w+_t\b)/,e],["pln",/^[$_a-z][\w$@]*/i,e],["lit",/^(?:0x[\da-f]+|(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d\+)(?:e[+-]?\d+)?)[a-z]*/i,e,"0123456789"],["pln",/^\\[\S\s]?/,e],["pun",RegExp(s),e]);return a(n,i)}function l(e,t,n){function r(e){var t=e.nodeType;if(t==1&&!s.test(e.className))if("br"===e.nodeName)i(e),e.parentNode&&e.parentNode.removeChild(e);else for(e=e.firstChild;e;e=e.nextSibling)r(e);else if((t==3||t==4)&&n){var a=e.nodeValue,f=a.match(o);if(f)t=a.substring(0,f.index),e.nodeValue=t,(a=a.substring(f.index+f[0].length))&&e.parentNode.insertBefore(u.createTextNode(a),e.nextSibling),i(e),t||e.parentNode.removeChild(e)}}function i(e){function t(e,n){var r=n?e.cloneNode(!1):e,i=e.parentNode;if(i){var i=t(i,1),s=e.nextSibling;i.appendChild(r);for(var o=s;o;o=s)s=o.nextSibling,i.appendChild(o)}return r}for(;!e.nextSibling;)if(e=e.parentNode,!e)return;for(var e=t(e.nextSibling,0),n;(n=e.parentNode)&&n.nodeType===1;)e=n;f.push(e)}for(var s=/(?:^|\s)nocode(?:\s|$)/,o=/\r\n?|\n/,u=e.ownerDocument,a=u.createElement("li");e.firstChild;)a.appendChild(e.firstChild);for(var f=[a],l=0;l<f.length;++l)r(f[l]);t===(t|0)&&f[0].setAttribute("value",t);var c=u.createElement("ol");c.className="linenums";for(var t=Math.max(0,t-1|0)||0,l=0,h=f.length;l<h;++l)a=f[l],a.className="L"+(l+t)%10,a.firstChild||a.appendChild(u.createTextNode(" ")),c.appendChild(a);e.appendChild(c)}function c(e,t){for(var n=t.length;--n>=0;){var r=t[n];C.hasOwnProperty(r)?d.console&&console.warn("cannot override language handler %s",r):C[r]=e}}function h(e,t){if(!e||!C.hasOwnProperty(e))e=/^\s*</.test(t)?"default-markup":"default-code";return C[e]}function p(e){var t=e.h;try{var n=i(e.c,e.i),r=n.a;e.a=r;e.d=n.d;e.e=0;h(t,r)(e);var s=/\bMSIE\s(\d+)/.exec(navigator.userAgent),s=s&&+s[1]<=8,t=/\n/g,o=e.a,u=o.length,n=0,a=e.d,f=a.length,r=0,l=e.g,c=l.length,p=0;l[c]=u;var v,m;for(m=v=0;m<c;)l[m]!==l[m+2]?(l[v++]=l[m++],l[v++]=l[m++]):m+=2;c=v;for(m=v=0;m<c;){for(var g=l[m],y=l[m+1],b=m+2;b+2<=c&&l[b+1]===y;)b+=2;l[v++]=g;l[v++]=y;m=b}l.length=v;var w=e.c,E;if(w)E=w.style.display,w.style.display="none";try{for(;r<f;){var S=a[r+2]||u,x=l[p+2]||u,b=Math.min(S,x),T=a[r+1],N;if(T.nodeType!==1&&(N=o.substring(n,b))){s&&(N=N.replace(t,"\r"));T.nodeValue=N;var C=T.ownerDocument,k=C.createElement("span");k.className=l[p+1];var L=T.parentNode;L.replaceChild(k,T);k.appendChild(T);n<S&&(a[r+1]=T=C.createTextNode(o.substring(b,S)),L.insertBefore(T,k.nextSibling))}n=b;n>=S&&(r+=2);n>=x&&(p+=2)}}finally{if(w)w.style.display=E}}catch(O){d.console&&console.log(O&&O.stack||O)}}var d=window,v=["break,continue,do,else,for,if,return,while"],m=[[v,"auto,case,char,const,default,double,enum,extern,float,goto,inline,int,long,register,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"],"catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"],g=[m,"alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,delegate,dynamic_cast,explicit,export,friend,generic,late_check,mutable,namespace,nullptr,property,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"],y=[m,"abstract,assert,boolean,byte,extends,final,finally,implements,import,instanceof,interface,null,native,package,strictfp,super,synchronized,throws,transient"],b=[y,"as,base,by,checked,decimal,delegate,descending,dynamic,event,fixed,foreach,from,group,implicit,in,internal,into,is,let,lock,object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var,virtual,where"],m=[m,"debugger,eval,export,function,get,null,set,undefined,var,with,Infinity,NaN"],w=[v,"and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"],E=[v,"alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"],S=[v,"as,assert,const,copy,drop,enum,extern,fail,false,fn,impl,let,log,loop,match,mod,move,mut,priv,pub,pure,ref,self,static,struct,true,trait,type,unsafe,use"],v=[v,"case,done,elif,esac,eval,fi,function,in,local,set,then,until"],x=/^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)\b/,T=/\S/,N=f({keywords:[g,b,m,"caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",w,E,v],hashComments:!0,cStyleComments:!0,multiLineStrings:!0,regexLiterals:!0}),C={};c(N,["default-code"]);c(a([],[["pln",/^[^<?]+/],["dec",/^<!\w[^>]*(?:>|$)/],["com",/^<\!--[\S\s]*?(?:--\>|$)/],["lang-",/^<\?([\S\s]+?)(?:\?>|$)/],["lang-",/^<%([\S\s]+?)(?:%>|$)/],["pun",/^(?:<[%?]|[%?]>)/],["lang-",/^<xmp\b[^>]*>([\S\s]+?)<\/xmp\b[^>]*>/i],["lang-js",/^<script\b[^>]*>([\S\s]*?)(<\/script\b[^>]*>)/i],["lang-css",/^<style\b[^>]*>([\S\s]*?)(<\/style\b[^>]*>)/i],["lang-in.tag",/^(<\/?[a-z][^<>]*>)/i]]),["default-markup","htm","html","mxml","xhtml","xml","xsl"]);c(a([["pln",/^\s+/,e," 	\r\n"],["atv",/^(?:"[^"]*"?|'[^']*'?)/,e,"\"'"]],[["tag",/^^<\/?[a-z](?:[\w-.:]*\w)?|\/?>$/i],["atn",/^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],["lang-uq.val",/^=\s*([^\s"'>]*(?:[^\s"'/>]|\/(?=\s)))/],["pun",/^[/<->]+/],["lang-js",/^on\w+\s*=\s*"([^"]+)"/i],["lang-js",/^on\w+\s*=\s*'([^']+)'/i],["lang-js",/^on\w+\s*=\s*([^\s"'>]+)/i],["lang-css",/^style\s*=\s*"([^"]+)"/i],["lang-css",/^style\s*=\s*'([^']+)'/i],["lang-css",/^style\s*=\s*([^\s"'>]+)/i]]),["in.tag"]);c(a([],[["atv",/^[\S\s]+/]]),["uq.val"]);c(f({keywords:g,hashComments:!0,cStyleComments:!0,types:x}),["c","cc","cpp","cxx","cyc","m"]);c(f({keywords:"null,true,false"}),["json"]);c(f({keywords:b,hashComments:!0,cStyleComments:!0,verbatimStrings:!0,types:x}),["cs"]);c(f({keywords:y,cStyleComments:!0}),["java"]);c(f({keywords:v,hashComments:!0,multiLineStrings:!0}),["bash","bsh","csh","sh"]);c(f({keywords:w,hashComments:!0,multiLineStrings:!0,tripleQuotedStrings:!0}),["cv","py","python"]);c(f({keywords:"caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",hashComments:!0,multiLineStrings:!0,regexLiterals:2}),["perl","pl","pm"]);c(f({keywords:E,hashComments:!0,multiLineStrings:!0,regexLiterals:!0}),["rb","ruby"]);c(f({keywords:m,cStyleComments:!0,regexLiterals:!0}),["javascript","js"]);c(f({keywords:"all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,throw,true,try,unless,until,when,while,yes",hashComments:3,cStyleComments:!0,multilineStrings:!0,tripleQuotedStrings:!0,regexLiterals:!0}),["coffee"]);c(f({keywords:S,cStyleComments:!0,multilineStrings:!0}),["rc","rs","rust"]);c(a([],[["str",/^[\S\s]+/]]),["regex"]);var k=d.PR={createSimpleLexer:a,registerLangHandler:c,sourceDecorator:f,PR_ATTRIB_NAME:"atn",PR_ATTRIB_VALUE:"atv",PR_COMMENT:"com",PR_DECLARATION:"dec",PR_KEYWORD:"kwd",PR_LITERAL:"lit",PR_NOCODE:"nocode",PR_PLAIN:"pln",PR_PUNCTUATION:"pun",PR_SOURCE:"src",PR_STRING:"str",PR_TAG:"tag",PR_TYPE:"typ",prettyPrintOne:function(e,t,n){var r=document.createElement("div");r.innerHTML="<pre>"+e+"</pre>";r=r.firstChild;n&&l(r,n,!0);p({h:t,j:n,c:r,i:1});return r.innerHTML},prettyPrint:t=t=function(t,n){function i(){for(var n=d.PR_SHOULD_USE_CONTINUATION?m.now()+250:Infinity;g<f.length&&m.now()<n;g++){for(var o=f[g],c=N,h=o;h=h.previousSibling;){var v=h.nodeType,C=(v===7||v===8)&&h.nodeValue;if(C?!/^\??prettify\b/.test(C):v!==3||/\S/.test(h.nodeValue))break;if(C){c={};C.replace(/\b(\w+)=([\w%+\-.:]+)/g,function(e,t,n){c[t]=n});break}}h=o.className;if((c!==N||w.test(h))&&!E.test(h)){v=!1;for(C=o.parentNode;C;C=C.parentNode)if(T.test(C.tagName)&&C.className&&w.test(C.className)){v=!0;break}if(!v){o.className+=" prettyprinted";v=c.lang;if(!v){var v=h.match(b),k;if(!v&&(k=u(o))&&x.test(k.tagName))v=k.className.match(b);v&&(v=v[1])}if(S.test(o.tagName))C=1;else var C=o.currentStyle,L=a.defaultView,C=(C=C?C.whiteSpace:L&&L.getComputedStyle?L.getComputedStyle(o,e).getPropertyValue("white-space"):0)&&"pre"===C.substring(0,3);L=c.linenums;if(!(L=L==="true"||+L))L=(L=h.match(/\blinenums\b(?::(\d+))?/))?L[1]&&L[1].length?+L[1]:!0:!1;L&&l(o,L,C);y={h:v,c:o,j:L,i:C};p(y)}}}g<f.length?s(i,250):"function"===typeof t&&t()}for(var o=n||document.body,a=o.ownerDocument||document,o=[o.getElementsByTagName("pre"),o.getElementsByTagName("code"),o.getElementsByTagName("xmp")],f=[],c=0;c<o.length;++c)for(var h=0,v=o[c].length;h<v;++h)f.push(o[c][h]);var o=e,m=Date;m.now||(m={now:function(){return+(new Date)}});var g=0,y,b=/\blang(?:uage)?-([\w.]+)(?!\S)/,w=/\bprettyprint\b/,E=/\bprettyprinted\b/,S=/pre|xmp/i,x=/^code$/i,T=/^(?:pre|code|xmp)$/i,N={};i()}};typeof define==="function"&&define.amd&&define("google-code-prettify",[],function(){return k})})();return t}();y||s(n,0)})()}()}var appKey="thr-ga-manager";var appPath="/_System/apps/"+appKey;var appRoot=BCAPI.Models.FileSystem.Root.file(appPath);var appSettingsPath=appPath+"/_config/settings.json";var Settings=Backbone.Model.extend({url:appSettingsPath,save:function(){var e=BCAPI.Models.FileSystem.Root.file(this.url);var t=JSON.stringify(this);e.upload(t).done(function(){enableApp();notify(true,"Item published successfully.")})}});var settings=new Settings;settings.fetch({success:function(e,t){setup();$(".footerbuttons").removeClass("hide")},error:function(e){}});$("#btn-save").on("click",function(){disableApp();settings.save()});