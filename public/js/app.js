
$.simpledoc = {};
$.simpledoc.currentDocId = "";
$.simpledoc.currentDocMode = "";

function api_loadDocList() {
	
	$.getJSON('/docs/', function(data) {
		var items = [];
		$.each(data,function(index, item) {
			items.push('<li class="link" id="' + item.doc['_id'] + '">' + item.doc['title'] + '</li>');
		});
		$('#doclist-items').html(items.join(''));
		
		//update links
		$('#doclist-items li').click(function() {
			loadDocView($(this).attr('id'));
		});
	});
	
}

function api_fetchDoc(id, callBack) {
	$.getJSON('/docs/' + id, function(data) { 
		callBack(data);
	});
}

function api_fetchUUID(callBack) {
	$.get('/generate_uuid',function(data) {
		uuid = $.parseJSON(data).uuids[0];
		callBack(uuid);
	})
}

function api_saveDoc() {	
	var data = form_to_json();
	
	$.post('/docs/' + data._id, data, function(resp) {
		revision_id = $.parseJSON(resp).rev;
		
		//update revision number in form
		$('#docedit-form input[name=_rev]').val(revision_id);
		
		//refresh docs list - in case title was changed
		api_loadDocList();
	});
}

//convert edit form to json
function form_to_json() {
	var data = {};
	data._id = $('#docedit-form input[name=_id]').val();
	//only include revision if it's set
	if ($('#docedit-form input[name=_rev]').val() != "") {
		data._rev = $('#docedit-form input[name=_rev]').val();
	}
		
	data.title = $('#docedit-form input[name=title]').val();
	data.body = $('#docedit-form textarea[name=body]').val();
	return data;
}


function loadDocView(id) {
	api_fetchDoc(id, function(data) {
		var title = data['title'];
		var body = data['body'];

		$('#docview').html('<h1>' + title + '</h1>' + '<div>' + body + '</div>');
		$.simpledoc.currentDocId = id;
		$('#docedit').hide();
		$('#docview').show();	
	});
}


function loadEditView(id) {
	if (id != undefined) {
		api_fetchDoc(id, function(data) {
			$('#docedit-form input[name=title]').val(data['title']);
			$('#docedit-form textarea[name=body]').val(data['body']);
			$('#docedit-form input[name=_id]').val(data['_id']);
			$('#docedit-form input[name=_rev]').val(data['_rev']);
		});	
	} else {  //creating new document
		//generate new uuid
		api_fetchUUID(function(uuid) {
			$('#docedit-form input[name=_id]').val(uuid);
		});
		
		$('#docedit-form input[name=title]').val('');
		$('#docedit-form textarea[name=body]').val('');
		$('#docedit-form input[name=_rev]').val('');
	}
	
	$('#docview').hide();
	$('#docedit').show();
}


//global document ready()
$('document').ready(function() {
	// $.get('/doc/1127d62e228b7019439d732ab20003a3',function(data){
	// 	$('#debug').html(data);
	// });
	
	api_loadDocList();
	
	//bindings
	$('.doc-action').click(function() {
		if ($(this).html() === "Edit") {
			loadEditView($.simpledoc.currentDocId);
		} else if ($(this).html() === "View") {
			loadDocView($.simpledoc.currentDocId);
		} else if ($(this).html() === "Add New") {

			loadEditView();
		}
	});
	
	$('#docedit-form-save').click(function() {
		api_saveDoc();
	});

});