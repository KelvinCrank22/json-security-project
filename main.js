let pageSize = 10; // alterable for whatever reason you like
var pageNum = 0;
var capacity = 0;

function TableRow() {
    this.id = "N/A";
    this.type = "N/A";
    this.error = "N/A";
    this.impact = "Unset";
    this.date = "N/A";
    return this;
}

function storeCVE(cveEntry) {
    // console.log(cveEntry);
    if (cveEntry == undefined)
        return "";
    var retval = TableRow();
    retval.id = cveEntry.cve.CVE_data_meta.ID;
    retval.type = (cveEntry.cve.problemtype.problemtype_data[0].description[0] == undefined) ? " " : cveEntry.cve.problemtype.problemtype_data[0].description[0].value;
    retval.error = cveEntry.cve.description.description_data[0].value;
    retval.impact = (cveEntry.impact.baseMetricV3 == undefined) ? "Unset" : cveEntry.impact.baseMetricV3.impactScore;
    retval.date = cveEntry.lastModifiedDate;
    return retval;
}

function generateTable() {
    // ok so
    // open the file
    fetch("nvdcve-1.1-recent.json")
        .then(response => response.json())
        .then((data) => {
            // console.log(data.CVE_Items[0].cve);
            capacity = data.CVE_data_numberOfCVEs;
            console.log(capacity/10);
            var table = document.getElementById("cveTable");
            // get the first ten entries of the file
            for (let i = 0; i < pageSize; i++) {
                // setup the row
                var row = table.insertRow(i+1);
                //     turn each entry into a table row
                var rowVals = storeCVE(data.CVE_Items[i]);
                // with some tweaking of TableRow this could just be another loop but I don't know if that's worth it?
                // reduces readability anyways unless I make an enum
                row.insertCell(0).innerHTML = rowVals.id;
                row.insertCell(1).innerHTML = rowVals.type;
                row.insertCell(2).innerHTML = rowVals.error;
                row.insertCell(3).innerHTML = rowVals.impact;
                row.insertCell(4).innerHTML = rowVals.date;
            }
            document.getElementById("nextPage").removeAttribute("disabled");
        })
}

function addPage(size, page) {
    // basically emulating old generateTable() behavior but paring it down to a specific length
    let offset = page*size;
    fetch("nvdcve-1.1-recent.json")
        .then(response => response.json())
        .then((data) => {
            // console.log(data.CVE_Items[0].cve);
            var table = document.getElementById("cveTable");
            // get the first ten entries of the file
            for (let i = 0; i < size && i+offset < data.CVE_data_numberOfCVEs; i++) {
                // setup the row
                var row = table.insertRow(i+1);
                //     turn each entry into a table row
                var rowVals = storeCVE(data.CVE_Items[i+offset]);
                // with some tweaking of TableRow this could just be another loop but I don't know if that's worth it?
                // reduces readability anyways unless I make an enum
                row.insertCell(0).innerHTML = rowVals.id;
                row.insertCell(1).innerHTML = rowVals.type;
                row.insertCell(2).innerHTML = rowVals.error;
                row.insertCell(3).innerHTML = rowVals.impact;
                row.insertCell(4).innerHTML = rowVals.date;
            }
        })
}

function deletePage() {
    // works at the top
    var table = document.getElementById("cveTable");
    // check if there's actually a page atm before deleting the page
    if (table.rows.length > 1)
    {
        while (table.rows.length > 1) {
            table.deleteRow(1); // deleting the second row because we love the headers
        }
    }
}

function nextPage() {
    deletePage();
    pageNum++;
    addPage(pageSize, pageNum);
    if (pageNum != 0)
        document.getElementById("lastPage").removeAttribute("disabled");
    if (pageSize*(pageNum+1) > capacity)
        document.getElementById("nextPage").setAttribute("disabled", "");
    console.log(pageNum);
}

function lastPage() { // this button should start greyed out
    deletePage();
    pageNum--;
    addPage(pageSize, pageNum);
    if (pageNum == 0)
        document.getElementById("lastPage").setAttribute("disabled", "");
    if (pageSize*(pageNum+1) < capacity)
        document.getElementById("nextPage").removeAttribute("disabled");
}