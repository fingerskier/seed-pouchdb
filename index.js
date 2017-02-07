var DB = new PouchDB('seed')
var form = document.getElementById('note')
;
savenote = function(event) {
	event.preventDefault()

	var note = {}
	;
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
		if (error) {
			console.error(error)
			throw error
		}

		console.log('putted')
	})
*/
	console.log('saving')

	return false
}

form.addEventListener('submit', savenote, false)
