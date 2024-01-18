const query = document.getElementById("query").value;
const whoislist = document.getElementById("whoislist");

fetchAsync(`/api/domain/${query}`).then((data) => {
    let alldata = {};

    if (!data) {
        console.log("Recieved no data!");
        return;
    }

    for (let servername in data) {
        for (let label in data[servername]) {
            alldata[label] = data[servername][label];
        }
    }

    console.log(alldata);

    whoislist.innerHTML += `<div class="box" id="whoisMainBox"></div>`;

    document.getElementById("whoisMainBox").innerHTML += `
        <div class="head">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#fefefe" stroke-width="2"></path> <path d="M3.5 11H6C7.10457 11 8 11.8954 8 13V13C8 14.1046 8.89543 15 10 15V15C11.1046 15 12 15.8954 12 17V20.5" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8 4V5C8 6.10457 8.89543 7 10 7H10.1459C11.1699 7 12 7.83011 12 8.8541V8.8541C12 9.55638 12.3968 10.1984 13.0249 10.5125L13.1056 10.5528C13.6686 10.8343 14.3314 10.8343 14.8944 10.5528L14.9751 10.5125C15.6032 10.1984 16 9.55638 16 8.8541V8.8541C16 7.83011 16.8301 7 17.8541 7H19.5" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16 19.5V17C16 15.8954 16.8954 15 18 15H20" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            <h2>Domain Information</h2>
        </div>`;

    if (alldata["Domain Name"])
        document.getElementById("whoisMainBox").innerHTML += `
        <div class="section">
            <span class="label">Domain:</span>
            <span class="value">${alldata["Domain Name"]}</span>
        </div>`;

    if (alldata["Registrar"])
        document.getElementById("whoisMainBox").innerHTML += `
        <div class="section">
            <span class="label">Registrar:</span>
            <span class="value">${alldata["Registrar"]}</span>
        </div>`;

    if (alldata["Created Date"])
        document.getElementById("whoisMainBox").innerHTML += `
        <div class="section">
            <span class="label">Registered on:</span>
            <span class="value">${formatDate(alldata["Created Date"])}</span>
        </div>`;

    if (alldata["Expiry Date"])
        document.getElementById("whoisMainBox").innerHTML += `
        <div class="section">
            <span class="label">Expires on:</span>
            <span class="value">${formatDate(alldata["Expiry Date"])}</span>
        </div>`;

    if (alldata["Updated Date"])
        document.getElementById("whoisMainBox").innerHTML += `
        <div class="section">
            <span class="label">Updated on:</span>
            <span class="value">${formatDate(alldata["Updated Date"])}</span>
        </div>`;

    if (alldata["Domain Status"]) {
        let statuslist = ``;
        for (let status of alldata["Domain Status"]) {
            status = status.split(" ")[0] ?? status;
            statuslist += `<span class="value">${status}</span>`;
        }

        document.getElementById("whoisMainBox").innerHTML += `
            <div class="section">
                <span class="label">Status:</span>
                <span class="valuelist">${statuslist}</span>
            </div>`;
    }

    if (alldata["Name Server"]) {
        let nameserverslist = ``;
        for (let nameserver of alldata["Name Server"]) {
            nameserverslist += `<span class="value">${nameserver}</span>`;
        }

        document.getElementById("whoisMainBox").innerHTML += `
            <div class="section">
                <span class="label">Name Servers:</span>
                <span class="valuelist">${nameserverslist}</span>
            </div>`;
    }

    let hasRegistrantInfo = alldata["Registrant Name"] || alldata["Registrant Organization"] || alldata["Registrant Street"] || alldata["Registrant City"] || alldata["Registrant State/Province"] || alldata["Registrant Postal Code"] || alldata["Registrant Country"] || alldata["Registrant Phone"] || alldata["Registrant Fax"] || alldata["Registrant Email"];

    if (hasRegistrantInfo) {
        whoislist.innerHTML += `<div class="box" id="whoisRegistrantBox"></div>`;

        document.getElementById("whoisRegistrantBox").innerHTML += `
            <div class="head">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                <h2>Registrant Contact</h2>
            </div>`;

        if (alldata["Registrant Name"])
            document.getElementById("whoisRegistrantBox").innerHTML += `
            <div class="section">
                <span class="label">Name:</span>
                <span class="value">${alldata["Registrant Name"]}</span>
            </div>`;

        if (alldata["Registrant Organization"])
            document.getElementById("whoisRegistrantBox").innerHTML += `
            <div class="section">
                <span class="label">Organization:</span>
                <span class="value">${alldata["Registrant Organization"]}</span>
            </div>`;

        if (alldata["Registrant Street"])
            document.getElementById("whoisRegistrantBox").innerHTML += `
            <div class="section">
                <span class="label">Street:</span>
                <span class="value">${alldata["Registrant Street"]}</span>
            </div>`;

        if (alldata["Registrant City"])
            document.getElementById("whoisRegistrantBox").innerHTML += `
            <div class="section">
                <span class="label">City:</span>
                <span class="value">${alldata["Registrant City"]}</span>
            </div>`;

        if (alldata["Registrant State/Province"])
            document.getElementById("whoisRegistrantBox").innerHTML += `
            <div class="section">
                <span class="label">State/Province:</span>
                <span class="value">${alldata["Registrant State/Province"]}</span>
            </div>`;

        if (alldata["Registrant Postal Code"])
            document.getElementById("whoisRegistrantBox").innerHTML += `
            <div class="section">
                <span class="label">Postal Code:</span>
                <span class="value">${alldata["Registrant Postal Code"]}</span>
            </div>`;

        if (alldata["Registrant Country"])
            document.getElementById("whoisRegistrantBox").innerHTML += `
            <div class="section">
                <span class="label">Country:</span>
                <span class="value">${alldata["Registrant Country"]}</span>
            </div>`;

        if (alldata["Registrant Phone"])
            document.getElementById("whoisRegistrantBox").innerHTML += `
            <div class="section">
                <span class="label">Phone:</span>
                <span class="value">${alldata["Registrant Phone"]}</span>
            </div>`;

        if (alldata["Registrant Fax"])
            document.getElementById("whoisRegistrantBox").innerHTML += `
            <div class="section">
                <span class="label">Fax:</span>
                <span class="value">${alldata["Registrant Fax"]}</span>
            </div>`;

        if (alldata["Registrant Email"] && alldata["Registrant Email"].includes("@"))
            document.getElementById("whoisRegistrantBox").innerHTML += `
            <div class="section">
                <span class="label">Email:</span>
                <span class="value">${alldata["Registrant Email"]}</span>
            </div>`;
    }

    let hasAdminInfo = alldata["Admin Name"] || alldata["Admin Organization"] || alldata["Admin Street"] || alldata["Admin City"] || alldata["Admin State/Province"] || alldata["Admin Postal Code"] || alldata["Admin Country"] || alldata["Admin Phone"] || alldata["Admin Fax"] || alldata["Admin Email"];

    if (hasAdminInfo) {
        whoislist.innerHTML += `<div class="box" id="whoisAdminBox"></div>`;

        document.getElementById("whoisAdminBox").innerHTML += `
            <div class="head">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 6C20 6 19.1843 6 19.0001 6C16.2681 6 13.8871 4.93485 11.9999 3C10.1128 4.93478 7.73199 6 5.00009 6C4.81589 6 4.00009 6 4.00009 6C4.00009 6 4 8 4 9.16611C4 14.8596 7.3994 19.6436 12 21C16.6006 19.6436 20 14.8596 20 9.16611C20 8 20 6 20 6Z" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                <h2>Administrative Contact</h2>
            </div>`;

        if (alldata["Admin Name"])
            document.getElementById("whoisAdminBox").innerHTML += `
            <div class="section">
                <span class="label">Name:</span>
                <span class="value">${alldata["Admin Name"]}</span>
            </div>`;

        if (alldata["Admin Organization"])
            document.getElementById("whoisAdminBox").innerHTML += `
            <div class="section">
                <span class="label">Organization:</span>
                <span class="value">${alldata["Admin Organization"]}</span>
            </div>`;

        if (alldata["Admin Street"])
            document.getElementById("whoisAdminBox").innerHTML += `
            <div class="section">
                <span class="label">Street:</span>
                <span class="value">${alldata["Admin Street"]}</span>
            </div>`;

        if (alldata["Admin City"])
            document.getElementById("whoisAdminBox").innerHTML += `
            <div class="section">
                <span class="label">City:</span>
                <span class="value">${alldata["Admin City"]}</span>
            </div>`;

        if (alldata["Admin State/Province"])
            document.getElementById("whoisAdminBox").innerHTML += `
            <div class="section">
                <span class="label">State/Province:</span>
                <span class="value">${alldata["Admin State/Province"]}</span>
            </div>`;

        if (alldata["Admin Postal Code"])
            document.getElementById("whoisAdminBox").innerHTML += `
            <div class="section">
                <span class="label">Postal Code:</span>
                <span class="value">${alldata["Admin Postal Code"]}</span>
            </div>`;

        if (alldata["Admin Country"])
            document.getElementById("whoisAdminBox").innerHTML += `
            <div class="section">
                <span class="label">Country:</span>
                <span class="value">${alldata["Admin Country"]}</span>
            </div>`;

        if (alldata["Admin Phone"])
            document.getElementById("whoisAdminBox").innerHTML += `
            <div class="section">
                <span class="label">Phone:</span>
                <span class="value">${alldata["Admin Phone"]}</span>
            </div>`;

        if (alldata["Admin Fax"])
            document.getElementById("whoisAdminBox").innerHTML += `
            <div class="section">
                <span class="label">Fax:</span>
                <span class="value">${alldata["Admin Fax"]}</span>
            </div>`;

        if (alldata["Admin Email"] && alldata["Admin Email"].includes("@"))
            document.getElementById("whoisAdminBox").innerHTML += `
            <div class="section">
                <span class="label">Email:</span>
                <span class="value">${alldata["Admin Email"]}</span>
            </div>`;
    }

    let hasTechInfo = alldata["Tech Name"] || alldata["Tech Organization"] || alldata["Tech Street"] || alldata["Tech City"] || alldata["Tech State/Province"] || alldata["Tech Postal Code"] || alldata["Tech Country"] || alldata["Tech Phone"] || alldata["Tech Fax"] || alldata["Tech Email"];

    if (hasTechInfo) {
        whoislist.innerHTML += `<div class="box" id="whoisTechBox"></div>`;

        document.getElementById("whoisTechBox").innerHTML += `
            <div class="head">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12.9046 3.06005C12.6988 3 12.4659 3 12 3C11.5341 3 11.3012 3 11.0954 3.06005C10.7942 3.14794 10.5281 3.32808 10.3346 3.57511C10.2024 3.74388 10.1159 3.96016 9.94291 4.39272C9.69419 5.01452 9.00393 5.33471 8.36857 5.123L7.79779 4.93281C7.3929 4.79785 7.19045 4.73036 6.99196 4.7188C6.70039 4.70181 6.4102 4.77032 6.15701 4.9159C5.98465 5.01501 5.83376 5.16591 5.53197 5.4677C5.21122 5.78845 5.05084 5.94882 4.94896 6.13189C4.79927 6.40084 4.73595 6.70934 4.76759 7.01551C4.78912 7.2239 4.87335 7.43449 5.04182 7.85566C5.30565 8.51523 5.05184 9.26878 4.44272 9.63433L4.16521 9.80087C3.74031 10.0558 3.52786 10.1833 3.37354 10.3588C3.23698 10.5141 3.13401 10.696 3.07109 10.893C3 11.1156 3 11.3658 3 11.8663C3 12.4589 3 12.7551 3.09462 13.0088C3.17823 13.2329 3.31422 13.4337 3.49124 13.5946C3.69158 13.7766 3.96395 13.8856 4.50866 14.1035C5.06534 14.3261 5.35196 14.9441 5.16236 15.5129L4.94721 16.1584C4.79819 16.6054 4.72367 16.829 4.7169 17.0486C4.70875 17.3127 4.77049 17.5742 4.89587 17.8067C5.00015 18.0002 5.16678 18.1668 5.5 18.5C5.83323 18.8332 5.99985 18.9998 6.19325 19.1041C6.4258 19.2295 6.68733 19.2913 6.9514 19.2831C7.17102 19.2763 7.39456 19.2018 7.84164 19.0528L8.36862 18.8771C9.00393 18.6654 9.6942 18.9855 9.94291 19.6073C10.1159 20.0398 10.2024 20.2561 10.3346 20.4249C10.5281 20.6719 10.7942 20.8521 11.0954 20.94C11.3012 21 11.5341 21 12 21C12.4659 21 12.6988 21 12.9046 20.94C13.2058 20.8521 13.4719 20.6719 13.6654 20.4249C13.7976 20.2561 13.8841 20.0398 14.0571 19.6073C14.3058 18.9855 14.9961 18.6654 15.6313 18.8773L16.1579 19.0529C16.605 19.2019 16.8286 19.2764 17.0482 19.2832C17.3123 19.2913 17.5738 19.2296 17.8063 19.1042C17.9997 18.9999 18.1664 18.8333 18.4996 18.5001C18.8328 18.1669 18.9994 18.0002 19.1037 17.8068C19.2291 17.5743 19.2908 17.3127 19.2827 17.0487C19.2759 16.8291 19.2014 16.6055 19.0524 16.1584L18.8374 15.5134C18.6477 14.9444 18.9344 14.3262 19.4913 14.1035C20.036 13.8856 20.3084 13.7766 20.5088 13.5946C20.6858 13.4337 20.8218 13.2329 20.9054 13.0088C21 12.7551 21 12.4589 21 11.8663C21 11.3658 21 11.1156 20.9289 10.893C20.866 10.696 20.763 10.5141 20.6265 10.3588C20.4721 10.1833 20.2597 10.0558 19.8348 9.80087L19.5569 9.63416C18.9478 9.26867 18.6939 8.51514 18.9578 7.85558C19.1262 7.43443 19.2105 7.22383 19.232 7.01543C19.2636 6.70926 19.2003 6.40077 19.0506 6.13181C18.9487 5.94875 18.7884 5.78837 18.4676 5.46762C18.1658 5.16584 18.0149 5.01494 17.8426 4.91583C17.5894 4.77024 17.2992 4.70174 17.0076 4.71872C16.8091 4.73029 16.6067 4.79777 16.2018 4.93273L15.6314 5.12287C14.9961 5.33464 14.3058 5.0145 14.0571 4.39272C13.8841 3.96016 13.7976 3.74388 13.6654 3.57511C13.4719 3.32808 13.2058 3.14794 12.9046 3.06005Z" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                <h2>Technical Contact</h2>
            </div>`;

        if (alldata["Tech Name"])
            document.getElementById("whoisTechBox").innerHTML += `
            <div class="section">
                <span class="label">Name:</span>
                <span class="value">${alldata["Tech Name"]}</span>
            </div>`;

        if (alldata["Tech Organization"])
            document.getElementById("whoisTechBox").innerHTML += `
            <div class="section">
                <span class="label">Organization:</span>
                <span class="value">${alldata["Tech Organization"]}</span>
            </div>`;

        if (alldata["Tech Street"])
            document.getElementById("whoisTechBox").innerHTML += `
            <div class="section">
                <span class="label">Street:</span>
                <span class="value">${alldata["Tech Street"]}</span>
            </div>`;

        if (alldata["Tech City"])
            document.getElementById("whoisTechBox").innerHTML += `
            <div class="section">
                <span class="label">City:</span>
                <span class="value">${alldata["Tech City"]}</span>
            </div>`;

        if (alldata["Tech State/Province"])
            document.getElementById("whoisTechBox").innerHTML += `
            <div class="section">
                <span class="label">State/Province:</span>
                <span class="value">${alldata["Tech State/Province"]}</span>
            </div>`;

        if (alldata["Tech Postal Code"])
            document.getElementById("whoisTechBox").innerHTML += `
            <div class="section">
                <span class="label">Postal Code:</span>
                <span class="value">${alldata["Tech Postal Code"]}</span>
            </div>`;

        if (alldata["Tech Country"])
            document.getElementById("whoisAdminBox").innerHTML += `
            <div class="section">
                <span class="label">Country:</span>
                <span class="value">${alldata["Tech Country"]}</span>
            </div>`;

        if (alldata["Tech Phone"])
            document.getElementById("whoisTechBox").innerHTML += `
            <div class="section">
                <span class="label">Phone:</span>
                <span class="value">${alldata["Tech Phone"]}</span>
            </div>`;

        if (alldata["Tech Fax"])
            document.getElementById("whoisTechBox").innerHTML += `
            <div class="section">
                <span class="label">Fax:</span>
                <span class="value">${alldata["Tech Fax"]}</span>
            </div>`;

        if (alldata["Tech Email"] && alldata["Tech Email"].includes("@"))
            document.getElementById("whoisTechBox").innerHTML += `
            <div class="section">
                <span class="label">Email:</span>
                <span class="value">${alldata["Tech Email"]}</span>
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