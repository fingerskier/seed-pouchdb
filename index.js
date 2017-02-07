var DB = new PouchDB('seed')
var form = document.getElementById('note')
;
savenote = function(event) {
	var note = {}
	;
	note.title = form.title.value
	note.note = form.note.value
	note.tags = form.tags.value
	;
	classonsole.log(note)
	;
	// upsert an ID field
	if (event.target._id.value == '') {
		note._id = new Date().getTime() + ''
	} else {
		note._id = event.target._id.value
	}
	;
	DB.put(note, (error, response)=>{
		if (error) {
			console.error(error)
			throw error
		}

		console.log('putted')
	})

	event.preventDefault()
	return false
}

form.addEventListener('submit', savenote, false)
