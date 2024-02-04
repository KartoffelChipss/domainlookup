const query = document.getElementById("query").value;
const whoislist = document.getElementById("whoislist");

function fetchTLDdata(forceReload = false) {
    fetchAsync(`/api/tld/${query}?forceReload=${forceReload}`).then((data) => {
        let alldata = {};
    
        if (!data) {
            console.log("Recieved no data!");
            return;
        }

        if (data.cachedAt) {
            let timeString = timeDiffString(new Date(data.cachedAt));
            whoislist.innerHTML = `<div class="refreshbox">
                <span>Updated ${timeString} ago</span>
                <button type="button" onclick="forceRefreshData(this)" class="clear">
                    <svg fill="#fefefe" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe" stroke-width="0.072"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M4,12a1,1,0,0,1-2,0A9.983,9.983,0,0,1,18.242,4.206V2.758a1,1,0,1,1,2,0v4a1,1,0,0,1-1,1h-4a1,1,0,0,1,0-2h1.743A7.986,7.986,0,0,0,4,12Zm17-1a1,1,0,0,0-1,1A7.986,7.986,0,0,1,7.015,18.242H8.757a1,1,0,1,0,0-2h-4a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V19.794A9.984,9.984,0,0,0,22,12,1,1,0,0,0,21,11Z"></path></g></svg>
                </button>
            </div>`;
        } else {
            whoislist.innerHTML = `<div class="refreshbox">
                <span>Updated 1 second ago</span>
                <button type="button" onclick="forceRefreshData(this)" class="clear">
                    <svg fill="#fefefe" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe" stroke-width="0.072"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M4,12a1,1,0,0,1-2,0A9.983,9.983,0,0,1,18.242,4.206V2.758a1,1,0,1,1,2,0v4a1,1,0,0,1-1,1h-4a1,1,0,0,1,0-2h1.743A7.986,7.986,0,0,0,4,12Zm17-1a1,1,0,0,0-1,1A7.986,7.986,0,0,1,7.015,18.242H8.757a1,1,0,1,0,0-2h-4a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V19.794A9.984,9.984,0,0,0,22,12,1,1,0,0,0,21,11Z"></path></g></svg>
                </button>
            </div>`;
        }
    
        alldata = data;
    
        console.log(alldata);
    
        whoislist.innerHTML += `<div class="box" id="whoisMainBox"></div>`;
    
        document.getElementById("whoisMainBox").innerHTML += `
            <div class="head">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#fefefe" stroke-width="2"></path> <path d="M3.5 11H6C7.10457 11 8 11.8954 8 13V13C8 14.1046 8.89543 15 10 15V15C11.1046 15 12 15.8954 12 17V20.5" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8 4V5C8 6.10457 8.89543 7 10 7H10.1459C11.1699 7 12 7.83011 12 8.8541V8.8541C12 9.55638 12.3968 10.1984 13.0249 10.5125L13.1056 10.5528C13.6686 10.8343 14.3314 10.8343 14.8944 10.5528L14.9751 10.5125C15.6032 10.1984 16 9.55638 16 8.8541V8.8541C16 7.83011 16.8301 7 17.8541 7H19.5" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16 19.5V17C16 15.8954 16.8954 15 18 15H20" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                <h2>TLD Information</h2>
            </div>`;
    
        if (alldata["domain"])
            document.getElementById("whoisMainBox").innerHTML += `
            <div class="section">
                <span class="label">Domain:</span>
                <span class="value">${alldata["domain"]}</span>
            </div>`;
    
        if (alldata["created"])
            document.getElementById("whoisMainBox").innerHTML += `
            <div class="section">
                <span class="label">Created on:</span>
                <span class="value">${formatDate(alldata["created"])}</span>
            </div>`;
    
        if (alldata["changed"])
            document.getElementById("whoisMainBox").innerHTML += `
            <div class="section">
                <span class="label">Updated on:</span>
                <span class="value">${formatDate(alldata["changed"])}</span>
            </div>`;
    
        if (alldata.organisation?.organisation)
            document.getElementById("whoisMainBox").innerHTML += `
            <div class="section">
                <span class="label">Organisation:</span>
                <span class="value">${alldata.organisation?.organisation}</span>
            </div>`;
    
        if (alldata["status"])
            document.getElementById("whoisMainBox").innerHTML += `
            <div class="section">
                <span class="label">Status:</span>
                <span class="value">${alldata["status"]}</span>
            </div>`;
    
        if (alldata["whois"])
            document.getElementById("whoisMainBox").innerHTML += `
            <div class="section">
                <span class="label">Whois:</span>
                <span class="value">${alldata["whois"]}</span>
            </div>`;
    
        console.log(alldata.contacts?.administrative);
    
        let hasAdminInfo = alldata.contacts?.administrative?.address || alldata.contacts?.administrative?.contact || alldata.contacts?.administrative["e-mail"] || alldata.contacts?.administrative["fax-no"] || alldata.contacts?.administrative?.name || alldata.contacts?.administrative?.organisation || alldata.contacts?.administrative?.phone;
    
        if (hasAdminInfo) {
            whoislist.innerHTML += `<div class="box" id="whoisAdminBox"></div>`;
    
            document.getElementById("whoisAdminBox").innerHTML += `
                <div class="head">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 6C20 6 19.1843 6 19.0001 6C16.2681 6 13.8871 4.93485 11.9999 3C10.1128 4.93478 7.73199 6 5.00009 6C4.81589 6 4.00009 6 4.00009 6C4.00009 6 4 8 4 9.16611C4 14.8596 7.3994 19.6436 12 21C16.6006 19.6436 20 14.8596 20 9.16611C20 8 20 6 20 6Z" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    <h2>Administrative Contact</h2>
                </div>`;
    
            if (alldata.contacts?.administrative?.name)
                document.getElementById("whoisAdminBox").innerHTML += `
                <div class="section">
                    <span class="label">Name:</span>
                    <span class="value">${alldata.contacts?.administrative?.name}</span>
                </div>`;
    
            if (alldata.contacts?.administrative?.organisation)
                document.getElementById("whoisAdminBox").innerHTML += `
                <div class="section">
                    <span class="label">Organization:</span>
                    <span function forceRefreshData() {
                        fetchDomainData(true);
                    }="section">
                    <span class="label">Adress:</span>
                    <span class="value">${alldata.contacts?.administrative?.address.replaceAll("\n", "<br>")}</span>
                </div>`;
    
            if (alldata.contacts?.administrative["e-mail"])
                document.getElementById("whoisAdminBox").innerHTML += `
                <div class="section">
                    <span class="label">E-Mail:</span>
                    <span class="value">${alldata.contacts?.administrative["e-mail"]}</span>
                </div>`;
    
            if (alldata.contacts?.administrative["fax-no"])
                document.getElementById("whoisAdminBox").innerHTML += `
                <div class="section">
                    <span class="label">Fax:</span>
                    <span class="value">${alldata.contacts?.administrative["fax-no"]}</span>
                </div>`;
        }
    
        let hasTechInfo = alldata.contacts?.technical?.address || alldata.contacts?.technical?.contact || alldata.contacts?.technical["e-mail"] || alldata.contacts?.technical["fax-no"] || alldata.contacts?.technical?.name || alldata.contacts?.technical?.organisation || alldata.contacts?.technical?.phone;
    
        if (hasTechInfo) {
            whoislist.innerHTML += `<div class="box" id="whoisTechBox"></div>`;
    
            document.getElementById("whoisTechBox").innerHTML += `
                <div class="head">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12.9046 3.06005C12.6988 3 12.4659 3 12 3C11.5341 3 11.3012 3 11.0954 3.06005C10.7942 3.14794 10.5281 3.32808 10.3346 3.57511C10.2024 3.74388 10.1159 3.96016 9.94291 4.39272C9.69419 5.01452 9.00393 5.33471 8.36857 5.123L7.79779 4.93281C7.3929 4.79785 7.19045 4.73036 6.99196 4.7188C6.70039 4.70181 6.4102 4.77032 6.15701 4.9159C5.98465 5.01501 5.83376 5.16591 5.53197 5.4677C5.21122 5.78845 5.05084 5.94882 4.94896 6.13189C4.79927 6.40084 4.73595 6.70934 4.76759 7.01551C4.78912 7.2239 4.87335 7.43449 5.04182 7.85566C5.30565 8.51523 5.05184 9.26878 4.44272 9.63433L4.16521 9.80087C3.74031 10.0558 3.52786 10.1833 3.37354 10.3588C3.23698 10.5141 3.13401 10.696 3.07109 10.893C3 11.1156 3 11.3658 3 11.8663C3 12.4589 3 12.7551 3.09462 13.0088C3.17823 13.2329 3.31422 13.4337 3.49124 13.5946C3.69158 13.7766 3.96395 13.8856 4.50866 14.1035C5.06534 14.3261 5.35196 14.9441 5.16236 15.5129L4.94721 16.1584C4.79819 16.6054 4.72367 16.829 4.7169 17.0486C4.70875 17.3127 4.77049 17.5742 4.89587 17.8067C5.00015 18.0002 5.16678 18.1668 5.5 18.5C5.83323 18.8332 5.99985 18.9998 6.19325 19.1041C6.4258 19.2295 6.68733 19.2913 6.9514 19.2831C7.17102 19.2763 7.39456 19.2018 7.84164 19.0528L8.36862 18.8771C9.00393 18.6654 9.6942 18.9855 9.94291 19.6073C10.1159 20.0398 10.2024 20.2561 10.3346 20.4249C10.5281 20.6719 10.7942 20.8521 11.0954 20.94C11.3012 21 11.5341 21 12 21C12.4659 21 12.6988 21 12.9046 20.94C13.2058 20.8521 13.4719 20.6719 13.6654 20.4249C13.7976 20.2561 13.8841 20.0398 14.0571 19.6073C14.3058 18.9855 14.9961 18.6654 15.6313 18.8773L16.1579 19.0529C16.605 19.2019 16.8286 19.2764 17.0482 19.2832C17.3123 19.2913 17.5738 19.2296 17.8063 19.1042C17.9997 18.9999 18.1664 18.8333 18.4996 18.5001C18.8328 18.1669 18.9994 18.0002 19.1037 17.8068C19.2291 17.5743 19.2908 17.3127 19.2827 17.0487C19.2759 16.8291 19.2014 16.6055 19.0524 16.1584L18.8374 15.5134C18.6477 14.9444 18.9344 14.3262 19.4913 14.1035C20.036 13.8856 20.3084 13.7766 20.5088 13.5946C20.6858 13.4337 20.8218 13.2329 20.9054 13.0088C21 12.7551 21 12.4589 21 11.8663C21 11.3658 21 11.1156 20.9289 10.893C20.866 10.696 20.763 10.5141 20.6265 10.3588C20.4721 10.1833 20.2597 10.0558 19.8348 9.80087L19.5569 9.63416C18.9478 9.26867 18.6939 8.51514 18.9578 7.85558C19.1262 7.43443 19.2105 7.22383 19.232 7.01543C19.2636 6.70926 19.2003 6.40077 19.0506 6.13181C18.9487 5.94875 18.7884 5.78837 18.4676 5.46762C18.1658 5.16584 18.0149 5.01494 17.8426 4.91583C17.5894 4.77024 17.2992 4.70174 17.0076 4.71872C16.8091 4.73029 16.6067 4.79777 16.2018 4.93273L15.6314 5.12287C14.9961 5.33464 14.3058 5.0145 14.0571 4.39272C13.8841 3.96016 13.7976 3.74388 13.6654 3.57511C13.4719 3.32808 13.2058 3.14794 12.9046 3.06005Z" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    <h2>Technical Contact</h2>
                </div>`;
    
            if (alldata.contacts?.technical?.name)
                document.getElementById("whoisTechBox").innerHTML += `
                <div class="section">
                    <span class="label">Name:</span>
                    <span class="value">${alldata.contacts?.technical?.name}</span>
                </div>`;
    
            if (alldata.contacts?.technical?.organisation)
                document.getElementById("whoisTechBox").innerHTML += `
                <div class="section">
                    <span class="label">Organization:</span>
                    <span class="value">${alldata.contacts?.technical?.organisation}</span>
                </div>`;
    
            if (alldata.contacts?.technical?.address)
                document.getElementById("whoisTechBox").innerHTML += `
                <div class="section">
                    <span class="label">Adress:</span>
                    <span class="value">${alldata.contacts?.technical?.address.replaceAll("\n", "<br>")}</span>
                </div>`;
    
            if (alldata.contacts?.technical["e-mail"])
                document.getElementById("whoisTechBox").innerHTML += `
                <div class="section">
                    <span class="label">E-Mail:</span>
                    <span class="value">${alldata.contacts?.technical["e-mail"]}</span>
                </div>`;
    
            if (alldata.contacts?.technical["fax-no"])
                document.getElementById("whoisTechBox").innerHTML += `
                <div class="section">
                    <span class="label">Fax:</span>
                    <span class="value">${alldata.contacts?.technical["fax-no"]}</span>
                </div>`;
        }
    
        if (alldata.__raw) {
            whoislist.innerHTML += `<div class="rawbox box" id="rawbox">
                    <div class="head">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 17H13M9 13H13M9 9H10M17 18V21M17 15H17.01M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H13M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19M19 9V11.5" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        <h2>Raw Whois Data</h2>
                    </div>
                    <div class="content">
                    </div>
                </div>`;
    
            document.getElementById("rawbox").querySelector(".content").innerHTML += alldata.__raw.replaceAll("\n", "<br>");
        }
    });
}

fetchTLDdata(false);

function forceRefreshData(ele) {
    fetchTLDdata(true);
}