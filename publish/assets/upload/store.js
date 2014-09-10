// 本地存储系统
function store_constructor() {		
	//object variables
	var localSupport, sessionSupport, userSupport, obj, objId, objDb, seshObj, seshObjId, seshDb, ieDb;
	
	//private functions
	
	/**
	 * Wrapper object for all data storage functions
	 *
	 */
	var DB = {
		/**
		 * Sets a key value pair into the local or session storage
		 * Main function to be used for all save action
		 *
		 * @param key     This is the key
		 * @param value   This is the value
		 * @param session If set to true, the key value pair is stored in the window session, not the browser session.
		 */
		setValue : function(key, value, session) {
			if (localSupport) {
				if (session && sessionSupport) {
					sessionStorage.setItem(key, value);
				} else {
					localStorage.setItem(key, value);
				}
			} else if (userSupport) {
				if (session) {
					seshObj.setAttribute(key,value);
					seshObj.save(seshDb);
				} else {
					obj.setAttribute(key, value);
					obj.save(ieDb);
				}
			}
		},
		
		/**
		 * Gets a value from storage.
		 * 
		 * @param  key     This is the key to search for
		 * @param  session If set to true, searches in the window sesion as opposed to the browser.
		 * @return string
		 */
		getValue : function(key, session) {
			var result = '';
			if (localSupport) {
				if (session && sessionSupport) {
					result = sessionStorage.getItem(key);
				} else {
					result = localStorage.getItem(key);
				}
			} else if (userSupport) {
				if (session) {
					seshObj.load(seshDb);
					result = seshObj.getAttribute(key);
				} else {
					obj.load(ieDb); //ieDb是常量，以保证取到的是同一个
					result = obj.getAttribute(key);
				}
			}
			return result;
		},
		
		/**
		 * Deletes the value from storage.
		 * 
		 * @param  key     This is the key to search for
		 * @param  session If set to true, searches in the window sesion as opposed to the browser.
		 * @return string
		 */    
		deleteValue : function(key, session) {
			if (localSupport) {
				this.setValue(key,null,session);
			} else if (userSupport) {
				if (session) {
					seshObj.removeAttribute(key);
					seshObj.save(seshDb);
				} else {
					obj.removeAttribute(key);
					obj.save(ieDb);
				}
			}
		},
		
		/**
		 * Flushes all values from storage
		 *
		 * @param session   If set to true, only flushes session values
		 */
		clearDB : function(session) {
			if (localSupport) {
				if (session) {
					sessionStorage.clear();
				} else {
					localStorage.clear();
				}
			} else if (userSupport) {
				IE.clearDB(session);
			}
		}
		
	}   // End var DB
	
	/**
	 * Wrapper object for all IE functions
	 * 90% of the heavy lifting done here
	 */
	var IE = {		
		/**
		 * Detects Inernet explorer versions 5.5 --> 7
		 * used to test for userData functionality
		 */
		detectIE : function() {
			if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
				var ieversion=new Number(RegExp.$1) // capture x.x portion and store as a number
				if (ieversion>=5.5 && ieversion<=8) {
					return true;
				}
			}
			return false;
		},
		
		/**
		 * Sets up the databases on page load
		 * Used in the 'init' function
		 *
		 */
		init : function() {
			
			//add meta tag
			var meta = document.createElement('meta');
			// set properties
			meta.name = "save";
			meta.content = "userdata";
			document.getElementsByTagName('head').item(0).appendChild(meta);
			
			var time = new Date().getTime();
			
			//setup IE localStorage database
			var newdiv = document.createElement('div');
			objId = 'ie-db-' + time;
			ieDb = 'userStorage';
			newdiv.setAttribute('id',objId);
			document.getElementsByTagName("body")[0].appendChild(newdiv);
			obj = document.getElementById(objId);
			obj.style.behavior = "url('#default#userData')";
			obj.style.display = 'none';
			
			//setup IE sessionStorage database
			if (window.name === null || window.name === undefined || window.name === '') {
				window.name = 'ie-sesh-db-' + time;
			}
			
			seshObjId = window.name;
			seshDb = seshObjId;
			newdiv = document.createElement('div');
			newdiv.setAttribute('id', seshObjId);
			obj.appendChild(newdiv);
			seshObj = document.getElementById(seshObjId);
			seshObj.style.behavior = "url('#default#userData')";
			seshObj.style.display = 'none';
		},
		
		/**
		 * Iterates through all userData attributes and removes them
		 * 
		 * Logic based on ThudJS article: http://thudjs.tumblr.com/post/419577524/localstorage-userdata
		 *
		 * @param session   If true, clears the browser window's session storage
		 */
		clearDB : function(session) {
			
			var time = new Date().getTime(),
				newdiv = document.createElement('div'),
				dbObj = session ? seshObj : obj,
				dbName = session ? seshDb : ieDb,
				doc = dbObj.xmlDocument, 
				attributes = doc.firstChild.attributes, 
				attr, 
				len = attributes.length;
				
			while ( 0 <= --len ) { 
				attr = attributes[len]; 
				dbObj.removeAttribute( attr.nodeName );
			}
			
			dbObj.save( dbName ); 
			
		}
		
	}   //end var IE
	
	//public functions
	return { 
		/**
		 * Init function for the object; sets up all variables and dom elements
		 * Especially important for IE.
		 */
		init : function() {
			if (typeof(window.localStorage) === 'object') {
				localSupport = true;
				
				//avoid a weird FF error with a little try catch
				try {
					if (typeof(window.sessionStorage) === 'object') {
						sessionSupport = true;
					}
				} catch(err) {
					sessionSupport = false;
				}
			
			} else if (IE.detectIE()) {
				
				userSupport = true;
				IE.init();			
			}
		},
		
		/**
		 * Sets a value into storage.
		 * 
		 * @param key     This is the key
		 * @param value   This is the value
		 */
		setValue : function(key, value) {
			DB.setValue( key , JSON.stringify(value) , false );
		},
		
		/**
		 * Sets a value into session storage.
		 *
		 * @param key        This is the key
		 * @param value      This is the value
		 */
		setSessionValue : function(key, value) {
			DB.setValue( key , JSON.stringify(value) , true );
		},
		
		/**
		 * Gets a value from local storage.
		 * 
		 * @param  key     This is the key to search for
		 * @return string
		 */    
		getValue : function(key) {
			return DB.getValue(key, false);
		},
		
		/**
		 * Gets a value from session storage.
		 *
		 * @param key        This is the key
		 */
		getSessionValue : function(key) {
			return DB.getValue(key, true);
		},
		
		/**
		 * Deletes the value from local storage.
		 * 
		 * @param  key     This is the key to search for
		 * @return string
		 */    
		deleteValue : function(key) {
			DB.deleteValue(key, false);
		},
		
		/**
		 * Deletes a value from session storage.
		 *
		 * @param key        This is the key
		 */
		deleteSessionValue : function(key) {
			DB.deleteValue(key, true);
		},
		
		/**
		 * Clears the local storage database
		 */
		clearLocalStorage : function() {
			DB.clearDB(false);
		},
		
		/**
		 * Clears the session storage database
		 */
		clearSessionStorage : function() {
			DB.clearDB(true);
		},
		
		/**
		 * Clears both session & local storage databases
		 */
		clearDOMStorage : function() {
			DB.clearDB(false); DB.clearDB(true);
		}
	}; //end return
}