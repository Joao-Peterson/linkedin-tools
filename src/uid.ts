// generate unique id
export function uid(len: number): string{
	let uid = "";
	for(let i = 0; i < len; i++){
		let l = Math.round(Math.random() * 26);
		if(Math.random() > 0.5)
			uid += String.fromCharCode(l + 65) // upper
		else	
			uid += String.fromCharCode(l + 97) // lower
	}

	return uid;
}