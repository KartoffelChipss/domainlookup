const unkowntype = document.getElementById("unkowntype");

function search(query) {
    if (unkowntype && unkowntype.classList.contains("_shown")) unkowntype.classList.remove("_shown");

    if (isTld(query)) {
        console.log("Searching for TLD:", query)
        window.location.href = `/tld/${query}`;
        return;
    }

    if (isDomain(query)) {
        console.log("Searching for Domain:", query)
        window.location.href = `/domain/${query}`;
        return;
    }

    if (unkowntype && !unkowntype.classList.contains("_shown")) unkowntype.classList.add("_shown");
    console.log("Unknown type!")
}

function searchKeyDown(ele) {
    if(event.key === 'Enter') {
        search(ele.value)
    }
}

const isIP = (ip) => {
    const isIPv4 = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);
    const isIPv6 = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(ip);

    return isIPv4 || isIPv6;
}

const isTld = (tld) => {
	if (tld.startsWith('.')) {
		tld = tld.substring(1)
	}

	return /^([a-z]{2,64}|xn[a-z0-9-]{5,})$/i.test(tld)
}

const isDomain = (domain) => {
	if (domain.endsWith('.')) {
		domain = domain.substring(0, domain.length - 1)
	}

	const labels = domain.split('.').reverse()
	const labelTest = /^([a-z0-9-]{1,64}|xn[a-z0-9-]{5,})$/i

	return (
		labels.length > 1 &&
		labels.every((label, index) => {
			return index ? labelTest.test(label) && !label.startsWith('-') && !label.endsWith('-') : isTld(label)
		})
	)
}