var values = [];
var host = "N/A";
var port = -1;

var err_reported = false;

$(document).ready(function() {
    $.get("properties.txt", function(data) {
        values = data.split("\n");
		
		host = values[0].trim();
		port = Number(values[1]);
	}).fail(function() {
		swal("Failed to get server IP", "Please contact our admins about this error so we can fix it as soon as possible!", "error");
	}).done(function() {
		if(port) {
			var socket = io('https://' + host + ":" + port);
		} else {
			var socket = io('https://' + host);
		}
		
		socket.on('connect_error', function() {
			if(!err_reported) {
				swal("Unable to connect to server.", "It seems our game servers are down.\nPlease be patient while we work on a fix!", "error");
				err_reported = true;
			}
		});
		
		socket.on('disconnect', function() {
			swal("Disconnected from server", "Hmm, looks like something went wrong. Please report this to our development team at https://github.com/NN-Dev-Team/Nordic-Network/issues", "error");
		});
		
		socket.on('login-complete', function(data){
			if(data.success){
				addCookie("user_id", data.info.user, 1);
				addCookie("session", data.info.session, 1);
				
				window.location.href = "/";
			} else {
				swal("Failed to login", "Error: " + data.error + "\nID: " + data.id, "error");
			}
		});
		
		$('form').submit(function(){
			socket.emit('login', {email: $('#email').val(), pass: $('#pwd').val()});
			return false;
		});
    }, 'text');
});

function addCookie(name, value, time) {
    var day = new Date();
    day.setTime(day.getTime() + (time*24*60*60*1000));
    var expires = "expires="+day.toUTCString();
    document.cookie = name + "=" + value + "; " + expires + "; path=/";
}
