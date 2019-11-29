
export function onFileUpload(file, e) {
	const { target } = e;
	
	if ( file[0] ) {
		const { name } = file[0];
		
		jQuery(($) => {
			let fileNameField = $(target).siblings('input.iamport-file')[0];
			fileNameField.value = name;
		});
	}
}