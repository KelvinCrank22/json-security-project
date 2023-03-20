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
            var table = document.getElementById("cveTable");
            // get the first ten entries of the file
            for (let i = 0; i < Number(data.CVE_data_numberOfCVEs); i++) {
                // setup the row
                var row = table.insertRow(i+1);
                //     turn each entry into a table row
                var rowVals = storeCVE(data.CVE_Items[i]);
                // with some tweaking of TableRow this could just be another loop but aaah I don't want to take too long already
                row.insertCell(0).innerHTML = rowVals.id;
                row.insertCell(1).innerHTML = rowVals.type;
                row.insertCell(2).innerHTML = rowVals.error;
                row.insertCell(3).innerHTML = rowVals.impact;
                row.insertCell(4).innerHTML = rowVals.date;
            }
        })
}
/*
function updateTable() {
    // ok so
    // open the file
    fetch("nvdcve-1.1-recent.json")
        .then(response => response.json())
        .then((data) => {
            // console.log(data.CVE_Items[0].cve);
            var table = document.getElementById("cveTable");
            // get the first ten entries of the file
            for (let i = 0; i < 10; i++) {
                // setup the row
                var row = table.insertRow(i+1);
                //     turn each entry into a table row
                var rowVals = storeCVE(data.CVE_Items[i]);
                // with some tweaking of TableRow this could just be another loop but aaah I don't want to take too long already
                row.insertCell(0).innerHTML = rowVals.id;
                row.insertCell(1).innerHTML = rowVals.type;
                row.insertCell(2).innerHTML = rowVals.error;
                row.insertCell(3).innerHTML = rowVals.impact;
                row.insertCell(4).innerHTML = rowVals.date;
            }
        })
}
*/