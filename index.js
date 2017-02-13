var DB = new PouchDB('seeder')
var noteform = document.getElementById('noteform')
var notetable = document.getElementById('notelist')

var viewnotes   = document.querySelector('[data-show="#allnotes"]')
var buttonmenu = document.getElementById('buttonwrapper')
var editbutton = document.querySelector('button[type=button].edit')
var delbutton  = document.querySelector('button[type=button].delete')
var showview = document.querySelectorAll('button.clicktarget')

var formobject = document.getElementById('noteform')
var searchformobject  = document.getElementById('searchnotes')
var errordialog  = document.getElementById('errordialog')
var DBstatus  = document.getElementById('DBstatus')

setInterval(()=>{
	DB.info().then((stats)=>{
		var result = '<ul>'
		;
		for (var I in stats) {
			result += `<li>${I}: ${stats[I]}</li>`
		}
		;
		DBstatus.innerHTML = result + '</ul>'
	})
}, 5000)
;
PouchDB.debug.enable('*')
;
noteform.addEventListener('submit', savenote, false)
;
<<<<<<< HEAD
searchformobject.addEventListener('submit', searchNotes)
;
window.addEventListener('hashchange', function (e) {
	var hash = window.location.hash.split('/')
    ;
    var noteid = hash[2]
    ;
    if (isFinite(noteid)) viewnote(noteid)
})
;

;
function searchNotes(event) {
	event.preventDefault();
	search()    
}
;
function savenote(event) {
=======
savenote = function(event) {
>>>>>>> c2e566e5476aa1ee556250663334796b46454837
	event.preventDefault()

	var note = {}
	var file = noteform.attachment.files[0]
	;
<<<<<<< HEAD
	note.title = noteform.title.value
	note.note = noteform.note.value
	note.tags = noteform.tags.value
	note._id = noteform._id.value
	note._rev = noteform._rev.value
	;
	// upsert an ID field
	if (!note._id.length) note._id = new Date().getTime() + ''
	;
	if (noteform.attachment.files.length) {
		note._attachments = {
						filename: {
							content_type: file.type ,
							type: file.type ,
							data: file
						}
					}
	}
	DB
	.put(note)
	.then((response)=>{
		viewnoteset()
	})
	.catch((error)=>{
=======
	note.title = form.title.value
	note.note = form.note.value
	note.tags = form.tags.value
	;
	console.log(note)
	;
	// upsert an ID field
	event.target._id = event.target._id || {value:''}
	;
	note._id =
		event.target._id.value ?
		new Date().getTime() :
		event.target._id.value
	;
/*
	DB.put(note, (error, response)=>{
>>>>>>> c2e566e5476aa1ee556250663334796b46454837
		if (error) {
			console.error('doc put error', error)
			throw error
		}

	})
*/
	console.log('saving')

	return false
}

function buildtime(timestamp){
	var ts = new Date(+timestamp), time = [], pm, ampm;
	
	pm = (ts.getHours() > 12);
	
	time[0] = pm ? ts.getHours() - 12 : ts.getHours();
	time[1] = ('0'+ts.getMinutes()).substr(-2);
	
	if( time[0] == 12 ){
		ampm = 'pm';
	} else {
		ampm = pm ? 'pm' : 'am';
	}
	
	return ' @ '+time.join(':') + ampm ; 
}

function builddate(timestamp) {
	var d = [], date = new Date(timestamp);
   
	d[0] = date.getFullYear();
	d[1] = ('0'+(date.getMonth() + 1)).substr(-2);
	d[2] = ('0'+date.getDate()).substr(-2);
	return d.join('-');
} 

function reporter(error, response) {
	if (console !== undefined) {
		if (error) { console.log(error); }
		if (response) { console.log(response); }
	}
};

function showerror(error) {
	var o, txt, msg = errordialog.getElementsByClassName('msg')[0];
	for(o in error){
		txt = document.createTextNode(error[o]);
		msg.appendChild(txt);
	}
};

function show(selector) {
	var els = document.querySelectorAll(selector);
	Array.prototype.map.call(els, function (el) {
		el.classList.remove('hide');
	});
};
function hide(selector) {
	var els = document.querySelectorAll(selector);
	Array.prototype.map.call(els, function (el) {
		el.classList.add('hide');
	});
};
function resethash() {
	window.location.hash = '';   
}

function viewnote(noteid) {
	DB
	.get(noteid, {attachments:true})
	.then((response)=>{
		var fields = Object.keys(response), o, link, attachments, li;

		fields.map( function (f) {
			if ((noteform[f] !== undefined) && (noteform[f].type != 'file')) {
				noteform[f].value = response[f];
			}

			if (f == '_attachments') {
				attachments = response[f];
				for (o in attachments) {
					li = document.createElement('li');
					link = document.createElement('a');
					link.href = 'data:' + attachments[o].content_type + ';base64,' + attachments[o].data;
					link.target = "_blank";
					link.appendChild(document.createTextNode(o));
					li.appendChild(link);
				}
				document.getElementById('attachmentlist').appendChild(li);
							
			}	
		})
			
		// fill in form fields with response data.     
		show('#addnote');
		hide('section:not(#addnote)');
		show('#attachments');	
	})
	.catch((error)=>{
		showerror()

		return
	})
	
	if (window.location.hash.indexOf(/view/) > -1 ) {
		// disable form fields
		noteform.classList.add('disabled');
		
		Array.prototype.map.call( noteform.querySelectorAll('input, textarea'), function(i){
			if (i.type !== 'hidden') {
				i.disabled = 'disabled';
			}
		});
	}
}

function deletenote (noteid) {
	DB.get(noteid+'', function (error, doc) {
		DB.remove(doc, function (e, r) {
			if (e) showerror();
		});
	});
}

function viewnoteset (start, end) {
	var i, 
	df = document.createDocumentFragment(), 
	options = {}, 
	row,   
	nl = notetable.querySelector('tbody');    
		
	options.include_docs = true;
	
	if(start){ options.startkey = start; }
	if(end){ options.endkey = end; }
	
	DB.allDocs(options, function (error, response) {
		row = response.rows.map(addrow)
		;
		row.map(function(f){
			if (f) {
				df.appendChild(f); 
			} 
		});
		
		i = nl.childNodes.length;    
		while (i--) {
			nl.removeChild(nl.childNodes.item(i));   
		}
	
		nl.appendChild(df);
	});
	
	resethash();
}

function addrow(obj) {
	var tr, td, a, o, created;
	
	a  = document.createElement('a');
	tr = document.createElement('tr');
	td = document.createElement('td'); 
	
	a.href = '#/view/' + obj.id;
	a.innerHTML = obj.doc.title === undefined ? 'Untitled Note' : obj.doc.title;
	td.appendChild(a);
	tr.appendChild(td);

	created = td.cloneNode(false);
	created.innerHTML = builddate(+obj.id) + buildtime(+obj.id);
	  
	updated = created.cloneNode();
	updated.innerHTML = obj.doc.modified ? builddate(+obj.doc.modified) + buildtime(+obj.doc.modified) : builddate(+obj.id) + buildtime(+obj.id);
	
	tr.appendChild(created);
	tr.appendChild(updated);

	return tr;
}

function search(searchkey) {
	var map = function(doc) {
		var searchkey,regex
		;
		searchkey = document.getElementById('q').value.replace(/[$-\/?[-^{|}]/g, '\\$&');
		regex = new RegExp(searchkey,'i');
		
		if( regex.test(doc.notetitle) || regex.test(doc.note) || regex.test(doc.tags) ){		
			emit(doc._id, {notetitle: doc.notetitle, id: doc._id, modified: doc.modified});
		}
	}
	
	DB.query(map, {include_docs:true}, searchQuery);
}

function searchQuery(err, response) { 
	if(err){ console.log(err); }
	if(response) {
		var df, rows, nl, results;
		
		results = response.rows.map(function(r){
			r.doc = r.value;
			delete r.value;
			return r;
		})
		;
		nl = notetable.getElementsByTagName('tbody')[0]
		df = document.createDocumentFragment()
		rows = results.map(addrow)
		;
		rows.map(function(f){
			if (f) {
				df.appendChild(f); 
			} 
		})
		;
		nl.innerHTML = '';
		nl.appendChild(df);
	}
}