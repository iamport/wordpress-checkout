
let target = null;
let fileInfo = null;


function hoverOnFile(e) {
	jQuery(($) => {
		target = e.target;
		
		fileInfo = target.parentElement.nextSibling;
		if ( fileInfo ) {
			$(fileInfo).css({ 'display': 'block' });
		}
	});
}

function leaveOnFile(e) {
	jQuery(($) => {
		if ( fileInfo ) {
			$(fileInfo).css({ 'display': 'none' });
		}
	});
}

window.hoverOnFile = hoverOnFile;
window.leaveOnFile = leaveOnFile;