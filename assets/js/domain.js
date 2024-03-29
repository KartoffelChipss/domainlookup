const query = document.getElementById("query").value;
const domainObj = getDomainObj(query);
const whoislist = document.getElementById("whoislist");
const dnslist = document.getElementById("dnslist");
const otherlist = document.getElementById("otherlist");
let queryiedWhoisServers = [];

otherlist.innerHTML = "";
otherlist.innerHTML += `<div class="refreshbox"><span>Updated now</span></div>`;
otherlist.innerHTML += `<div class="infoboxes"></div>`;

function fetchDomainData(domain, forceReload = false) {
    fetchAsync(`/api/domain/${domain}?forceReload=${forceReload}`).then((data) => {
        let alldata = {};

        if (!data) {
            console.log("Recieved no data!");
            return;
        }

        if (data.cfPrice) {
            otherlist.querySelector(".infoboxes").innerHTML += `<div class="infobox cloudflare">
                <svg style="scale: 1.2;" fill="#fefefe" viewBox="0 -3.5 31 31" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe" stroke-width="0.00031000000000000005"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="m21.462 18.152c.071-.194.112-.417.112-.651 0-.394-.117-.76-.318-1.067l.005.007c-.321-.413-.817-.677-1.376-.677-.002 0-.004 0-.006 0l-11.257-.146c-.001 0-.001 0-.002 0-.071 0-.134-.036-.171-.09v-.001c-.023-.038-.037-.083-.037-.132 0-.025.004-.049.01-.071v.002c.042-.112.143-.192.264-.202h.001l11.353-.146c1.505-.168 2.749-1.135 3.309-2.461l.01-.027.655-1.687c.017-.041.027-.088.027-.138 0-.029-.003-.057-.01-.084v.002c-.765-3.332-3.704-5.78-7.216-5.78-3.234 0-5.983 2.076-6.987 4.968l-.016.052c-.549-.416-1.244-.667-1.997-.667-1.718 0-3.131 1.303-3.306 2.974l-.001.014c-.01.101-.016.218-.016.336 0 .293.036.578.104.85l-.005-.024c-2.551.075-4.59 2.161-4.59 4.722v.006c.002.244.019.481.05.715l-.003-.029c.017.108.108.19.219.192h20.776c.125-.002.23-.086.265-.2l.001-.002z"></path><path d="m25.046 10.919c-.101 0-.21 0-.311.008-.077.005-.141.057-.164.127v.001l-.439 1.528c-.071.194-.112.417-.112.651 0 .394.117.76.318 1.067l-.005-.007c.321.413.817.677 1.376.677h.006l2.4.146h.002c.071 0 .134.036.171.09v.001c.023.038.037.084.037.133 0 .024-.003.048-.01.07v-.002c-.042.112-.143.192-.264.202h-.001l-2.496.146c-1.507.162-2.754 1.128-3.315 2.455l-.01.027-.182.467c-.006.015-.01.032-.01.051 0 .073.059.132.132.132h.007 8.578.003c.103 0 .189-.069.216-.163v-.002c.144-.499.227-1.072.228-1.664-.002-3.394-2.754-6.145-6.149-6.145-.002 0-.003 0-.005 0z"></path></g></svg>
                <span>Cloudflare Price</span>
                <span class="price">~ <b>${data.cfPrice}</b> / y</span>
            </div>`;
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

        if (domainObj.domain !== query) {
            whoislist.innerHTML += `<div class="infobox">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 8H12.01M12 11V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#fefefe" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                <span>Showing whois data for parent domain <a href="/domain/${domainObj.domain}" class="highlight">${domainObj.domain}</a></span>
            </div>`;
        }

        for (let servername in data) {
            // if (data[servername] && data[servername].__raw) {
            //     const newSpan = document.createElement("span");
            //     newSpan.style.display = "none";
            //     newSpan.id = `${servername}_raw_content`;
            //     newSpan.innerHTML = data[servername].__raw;
            //     document.body.appendChild(newSpan);

            //     otherlist.innerHTML += `<button type="button" onclick="downloadTxtFile(document.getElementById('${servername}_raw_content').innerHTML, '${servername}.txt')">${servername}</button>`;
            // }

            for (let label in data[servername]) {
                alldata[label] = data[servername][label];
            }
        }

        if ((alldata["Domain Status"].includes("free") || !alldata["Name Server"] || alldata["Name Server"].length <= 0) && !alldata.__raw.includes("Too many queries from your IP")) {
            whoislist.innerHTML += `<div class="infobox">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 8H12.01M12 11V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#fefefe" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                <span>It appears that this domain has not been registered yet.</span>
            </div>`;
        }

        console.log("Whois:", alldata);

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

        if (alldata["Domain Status"] && alldata["Domain Status"].length > 0) {
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

        if (alldata["Name Server"] && alldata["Name Server"].length > 0) {
            let nameserverslist = ``;
            for (let nameserver of alldata["Name Server"]) {
                nameserverslist += `<a href="/domain/${nameserver}" class="value">${nameserver}</a>`;
            }

            document.getElementById("whoisMainBox").innerHTML += `
                <div class="section">
                    <span class="label">Name Servers:</span>
                    <span class="valuelist">${nameserverslist}</span>
                </div>`;
        }

        let hasRegistrantInfo = alldata["Registrant Name"] || alldata["Registrant Organization"] || alldata["Registrant Street"] || alldata["Registrant City"] || alldata["Registrant State/Province"] || alldata["Registrant Postal Code"] || alldata["Registrant Country"] || alldata["Registrant Phone"] || alldata["Registrant Fax"] || (alldata["Registrant Email"] && alldata["Registrant Email"].includes("@"));

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

        let hasAdminInfo = alldata["Admin Name"] || alldata["Admin Organization"] || alldata["Admin Street"] || alldata["Admin City"] || alldata["Admin State/Province"] || alldata["Admin Postal Code"] || alldata["Admin Country"] || alldata["Admin Phone"] || alldata["Admin Fax"] || (alldata["Admin Email"] && alldata["Admin Email"].includes("@"));

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

        let hasTechInfo = alldata["Tech Name"] || alldata["Tech Organization"] || alldata["Tech Street"] || alldata["Tech City"] || alldata["Tech State/Province"] || alldata["Tech Postal Code"] || alldata["Tech Country"] || alldata["Tech Phone"] || alldata["Tech Fax"] || (alldata["Tech Email"] && alldata["Tech Email"].includes("@"));

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
}

function fetchDNS(host, forceReload = false) {
    fetchAsync(`/api/dns/${host}?forceReload=${forceReload}`).then((data) => {
        if (!data) {
            console.log("Recieved no data!");
            return;
        }

        if (data.cachedAt) {
            let timeString = timeDiffString(new Date(data.cachedAt));
            dnslist.innerHTML = `<div class="refreshbox">
                <span>Updated ${timeString} ago</span>
                <button type="button" onclick="forceRefreshData(this)" class="clear">
                    <svg fill="#fefefe" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe" stroke-width="0.072"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M4,12a1,1,0,0,1-2,0A9.983,9.983,0,0,1,18.242,4.206V2.758a1,1,0,1,1,2,0v4a1,1,0,0,1-1,1h-4a1,1,0,0,1,0-2h1.743A7.986,7.986,0,0,0,4,12Zm17-1a1,1,0,0,0-1,1A7.986,7.986,0,0,1,7.015,18.242H8.757a1,1,0,1,0,0-2h-4a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V19.794A9.984,9.984,0,0,0,22,12,1,1,0,0,0,21,11Z"></path></g></svg>
                </button>
            </div>`;
        } else {
            dnslist.innerHTML = `<div class="refreshbox">
                <span>Updated 1 second ago</span>
                <button type="button" onclick="forceRefreshData(this)" class="clear">
                    <svg fill="#fefefe" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe" stroke-width="0.072"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M4,12a1,1,0,0,1-2,0A9.983,9.983,0,0,1,18.242,4.206V2.758a1,1,0,1,1,2,0v4a1,1,0,0,1-1,1h-4a1,1,0,0,1,0-2h1.743A7.986,7.986,0,0,0,4,12Zm17-1a1,1,0,0,0-1,1A7.986,7.986,0,0,1,7.015,18.242H8.757a1,1,0,1,0,0-2h-4a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V19.794A9.984,9.984,0,0,0,22,12,1,1,0,0,0,21,11Z"></path></g></svg>
                </button>
            </div>`;
        }

        console.log("DNS: ", data);

        dnslist.innerHTML += `<div class="box dns" id="dnsAbox"></div>`;
        const dnsAbox = document.getElementById("dnsAbox");

        dnsAbox.innerHTML += `
            <div class="head">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#fefefe" stroke-width="2"></path> <path d="M3.5 11H6C7.10457 11 8 11.8954 8 13V13C8 14.1046 8.89543 15 10 15V15C11.1046 15 12 15.8954 12 17V20.5" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8 4V5C8 6.10457 8.89543 7 10 7H10.1459C11.1699 7 12 7.83011 12 8.8541V8.8541C12 9.55638 12.3968 10.1984 13.0249 10.5125L13.1056 10.5528C13.6686 10.8343 14.3314 10.8343 14.8944 10.5528L14.9751 10.5125C15.6032 10.1984 16 9.55638 16 8.8541V8.8541C16 7.83011 16.8301 7 17.8541 7H19.5" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16 19.5V17C16 15.8954 16.8954 15 18 15H20" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                <h2>A records</h2>
            </div>`;

        if (data["A"].length > 0) {
            data["A"].forEach((record) => {
                dnsAbox.innerHTML += `
                <div class="section">
                    <span class="value flag">${record.ip}<img src="https://flagcdn.com/${record.geo.country.toLowerCase()}.svg" alt="${record.geo.countryName} flag" title="${record.geo.countryName}" onerror="this.remove()"></span>
                </div>`;
            });
        } else {
            dnsAbox.innerHTML += `
                <div class="section norecords">
                    <span>No A record found</span>
                </div>`;
        }

        dnslist.innerHTML += `<div class="box dns" id="dnsAAAAbox"></div>`;
        const dnsAAAAbox = document.getElementById("dnsAAAAbox");

        dnsAAAAbox.innerHTML += `
            <div class="head">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#fefefe" stroke-width="2"></path> <path d="M3.5 11H6C7.10457 11 8 11.8954 8 13V13C8 14.1046 8.89543 15 10 15V15C11.1046 15 12 15.8954 12 17V20.5" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8 4V5C8 6.10457 8.89543 7 10 7H10.1459C11.1699 7 12 7.83011 12 8.8541V8.8541C12 9.55638 12.3968 10.1984 13.0249 10.5125L13.1056 10.5528C13.6686 10.8343 14.3314 10.8343 14.8944 10.5528L14.9751 10.5125C15.6032 10.1984 16 9.55638 16 8.8541V8.8541C16 7.83011 16.8301 7 17.8541 7H19.5" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16 19.5V17C16 15.8954 16.8954 15 18 15H20" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                <h2>AAAA records</h2>
            </div>`;

        if (data["AAAA"].length > 0) {
            data["AAAA"].forEach((record) => {
                dnsAAAAbox.innerHTML += `
                <div class="section">
                    <span class="value flag">${record.ip}<img src="https://flagcdn.com/${record.geo.country.toLowerCase()}.svg" alt="${record.geo.countryName} flag" title="${record.geo.countryName}" onerror="this.remove()"></span>
                </div>`;
            });
        } else {
            dnsAAAAbox.innerHTML += `
                <div class="section norecords">
                    <span>No AAAA record found</span>
                </div>`;
        }

        dnslist.innerHTML += `<div class="box dns" id="dnsCNAMEbox"></div>`;
        const dnsCNAMEbox = document.getElementById("dnsCNAMEbox");

        dnsCNAMEbox.innerHTML += `
            <div class="head">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 19.0008L17.8 19C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.0799 3 8.2V15M3 9H20M9 19.0008L3 19M9 19.0008L7 17M9 19.0008L7 21" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                <h2>CNAME records</h2>
            </div>`;

        if (data["CNAME"].length > 0) {
            data["CNAME"].forEach((record) => {
                dnsCNAMEbox.innerHTML += `
                <div class="section">
                    <span class="value">${record}</span>
                </div>`;
            });
        } else {
            dnsCNAMEbox.innerHTML += `
                <div class="section norecords">
                    <span>No CNAME record found</span>
                </div>`;
        }

        dnslist.innerHTML += `<div class="box dns" id="dnsTXTbox"></div>`;
        const dnsTXTbox = document.getElementById("dnsTXTbox");

        dnsTXTbox.innerHTML += `
            <div class="head">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 17H13M9 13H13M9 9H10M17 18V21M17 15H17.01M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H13M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19M19 9V11.5" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                <h2>TXT records</h2>
            </div>`;

        if (data["TXT"].length > 0) {
            data["TXT"].forEach((record) => {
                dnsTXTbox.innerHTML += `
                <div class="section">
                    <span class="value">${record}</span>
                </div>`;
            });
        } else {
            dnsTXTbox.innerHTML += `
                <div class="section norecords">
                    <span>No TXT record found</span>
                </div>`;
        }

        dnslist.innerHTML += `<div class="box dns" id="dnsNSbox"></div>`;
        const dnsNSbox = document.getElementById("dnsNSbox");

        dnsNSbox.innerHTML += `
            <div class="head">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18 7H18.01M15 7H15.01M18 17H18.01M15 17H15.01M6 10H18C18.9319 10 19.3978 10 19.7654 9.84776C20.2554 9.64477 20.6448 9.25542 20.8478 8.76537C21 8.39782 21 7.93188 21 7C21 6.06812 21 5.60218 20.8478 5.23463C20.6448 4.74458 20.2554 4.35523 19.7654 4.15224C19.3978 4 18.9319 4 18 4H6C5.06812 4 4.60218 4 4.23463 4.15224C3.74458 4.35523 3.35523 4.74458 3.15224 5.23463C3 5.60218 3 6.06812 3 7C3 7.93188 3 8.39782 3.15224 8.76537C3.35523 9.25542 3.74458 9.64477 4.23463 9.84776C4.60218 10 5.06812 10 6 10ZM6 20H18C18.9319 20 19.3978 20 19.7654 19.8478C20.2554 19.6448 20.6448 19.2554 20.8478 18.7654C21 18.3978 21 17.9319 21 17C21 16.0681 21 15.6022 20.8478 15.2346C20.6448 14.7446 20.2554 14.3552 19.7654 14.1522C19.3978 14 18.9319 14 18 14H6C5.06812 14 4.60218 14 4.23463 14.1522C3.74458 14.3552 3.35523 14.7446 3.15224 15.2346C3 15.6022 3 16.0681 3 17C3 17.9319 3 18.3978 3.15224 18.7654C3.35523 19.2554 3.74458 19.6448 4.23463 19.8478C4.60218 20 5.06812 20 6 20Z" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                <h2>NS records</h2>
            </div>`;

        if (data["NS"].length > 0) {
            data["NS"].forEach((record) => {
                dnsNSbox.innerHTML += `
                <div class="section">
                    <a href="/domain/${record}" class="value">${record}</a>
                </div>`;
            });
        } else {
            dnsNSbox.innerHTML += `
                <div class="section norecords">
                    <span>No NS record found</span>
                </div>`;
        }

        dnslist.innerHTML += `<div class="box dns" id="dnsMXbox"></div>`;
        const dnsMXbox = document.getElementById("dnsMXbox");

        dnsMXbox.innerHTML += `
            <div class="head">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M2.54433 5.16792C3.0468 4.46923 3.86451 4 4.8 4H19.2C20.1355 4 20.9532 4.46923 21.4557 5.16792C21.7993 5.64567 22 6.235 22 6.86667V17.1333C22 18.682 20.7804 20 19.2 20H4.8C3.21964 20 2 18.682 2 17.1333V6.86667C2 6.23499 2.20074 5.64567 2.54433 5.16792ZM4.9327 6L11.2598 12.9647C11.6566 13.4015 12.3434 13.4015 12.7402 12.9647L19.0673 6H4.9327ZM20 7.94766L14.2205 14.3096C13.0301 15.6199 10.9699 15.6199 9.77948 14.3096L4 7.94766V17.1333C4 17.6466 4.39214 18 4.8 18H19.2C19.6079 18 20 17.6466 20 17.1333V7.94766Z" fill="#fefefe"></path> </g></svg>
                <h2>MX records</h2>
            </div>`;

        if (data["MX"].length > 0) {
            data["MX"].forEach((record) => {
                if (record.exchange && record.priority) {
                    dnsMXbox.innerHTML += `
                    <div class="section">
                        <div class="multival">
                            <a href="/domain/${record.exchange}" class="value">${record.exchange}</a>
                            <span class="value"><span class="label">Priority</span> ${record.priority}</span>
                        </div>
                    </div>`;
                }
            });
        } else {
            dnsMXbox.innerHTML += `
                <div class="section norecords">
                    <span>No MX record found</span>
                </div>`;
        }
    });
}

function initOtherPage() {
    otherlist.innerHTML += `<div class="box dns" id="similarDomainsBox"></div>`;
    const similarDomainsBox = document.getElementById("similarDomainsBox");

    similarDomainsBox.innerHTML += `
        <div class="head">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#fefefe" stroke-width="2"></path> <path d="M3.5 11H6C7.10457 11 8 11.8954 8 13V13C8 14.1046 8.89543 15 10 15V15C11.1046 15 12 15.8954 12 17V20.5" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8 4V5C8 6.10457 8.89543 7 10 7H10.1459C11.1699 7 12 7.83011 12 8.8541V8.8541C12 9.55638 12.3968 10.1984 13.0249 10.5125L13.1056 10.5528C13.6686 10.8343 14.3314 10.8343 14.8944 10.5528L14.9751 10.5125C15.6032 10.1984 16 9.55638 16 8.8541V8.8541C16 7.83011 16.8301 7 17.8541 7H19.5" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16 19.5V17C16 15.8954 16.8954 15 18 15H20" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            <h2>Similar Domains</h2>
        </div>`;

    let similarDomains = getSmilarDomains(domainObj);

    if (similarDomains.length > 0) {
        similarDomains.forEach((domain) => {
            similarDomainsBox.innerHTML += `
                <div class="section button-spacebetween similardomains" id="similardomain-${domain}">
                    <a href="/domain/${domain}" class="value">${domain}</a>
                    <button type="button" onclick="checkSimilarDomain(this)">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        <span>Check</span>
                    </button>
                </div>`;
        });
    } else {
        similarDomainsBox.innerHTML += `
            <div class="section norecords">
                <span>No similar domains found</span>
            </div>`;
    }

    for (let similarDomain of similarDomains) {
        fetchAsync(`/api/checkAvailability/${similarDomain}?cacheOnly=true`).then((data) => {
            if (!data || data.status === "ERROR") return;

            const btn = document.getElementById(`similardomain-${similarDomain}`).querySelector("button");

            if (data.available) {
                btn.classList.add("available");
                btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg><span>Available</span>`;
            } else {
                btn.classList.add("unavailable");
                btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.364 18.364C19.9926 16.7353 21 14.4853 21 12C21 7.02944 16.9706 3 12 3C9.51472 3 7.26472 4.00736 5.63604 5.63604M18.364 18.364C16.7353 19.9926 14.4853 21 12 21C7.02944 21 3 16.9706 3 12C3 9.51472 4.00736 7.26472 5.63604 5.63604M18.364 18.364L5.63604 5.63604" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    <span>Unavailable</span>`;
            }
        });
    }
}

fetchDomainData(domainObj.domain, false);

fetchDNS(query, false);

initOtherPage();

function forceRefreshData(ele, section = "whois") {
    if (section === "whois") {
        fetchDomainData(true);
    } else if (section === "dns") {
        fetchDNS(true);
    }

    ele.classList.add("anim");

    ele.addEventListener("animationend", () => {
        ele.classList.remove("anim");
    });
}

function endsWitDoubleTLD(str) {
    for (let tld of [".co.uk", ".com.au", ".gov.uk", ".net.uk"]) {
        if (str.endsWith(tld)) {
            return true;
        }
    }
    return false;
}

function getDomainObj(str) {
    let domainSplit = str.split(".");
    let tld = endsWitDoubleTLD(str) ? domainSplit.slice(-2).join(".") : domainSplit.slice(-1).join(".");
    let domainName = endsWitDoubleTLD(str) ? domainSplit[domainSplit.length - 3] : domainSplit[domainSplit.length - 2];
    let domain = `${domainName}.${tld}`;

    return {
        domainSplit,
        tld,
        domainName,
        domain,
    };
}

function downloadTxtFile(content, filename) {
    var blob = new Blob([content], { type: "text/plain" });

    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
}

function getSmilarDomains(domainObject) {
    let similarDomains = [];

    const popularTLDs = [ "com", "net", "org", "me", "io", "de", "info" ];

    for (let tld of popularTLDs) {
        if (tld !== domainObject.tld) similarDomains.push(`${domainObject.domainName}.${tld}`);
    }

    return similarDomains;
}

function checkSimilarDomain(btn) {
    const domain = btn.parentElement.querySelector("a").innerText;
    btn.innerHTML = `<img src="/assets/img/loader.svg" alt="loader" class="loading">`;
    fetchAsync(`/api/checkAvailability/${domain}`).then(data => {
        if (!data || data.status === "ERROR") return;

        if (data.available) {
            btn.classList.add("available");
            btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg><span>Available</span>`;
        } else {
            btn.classList.add("unavailable");
            btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fefefe"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.364 18.364C19.9926 16.7353 21 14.4853 21 12C21 7.02944 16.9706 3 12 3C9.51472 3 7.26472 4.00736 5.63604 5.63604M18.364 18.364C16.7353 19.9926 14.4853 21 12 21C7.02944 21 3 16.9706 3 12C3 9.51472 4.00736 7.26472 5.63604 5.63604M18.364 18.364L5.63604 5.63604" stroke="#fefefe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                <span>Unavailable</span>`;
        }
    });
}