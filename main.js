let pageSize = 10; // alterable for whatever reason you like
var pageNum = 0;
var capacity = 0;
var pageCount = 0;


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
            pageCount = ~~(capacity/pageSize) + 1;
            // console.log(capacity/10);
            var table = document.getElementById("cveTable");
            var selector = document.getElementById("selector");
            // get the first ten entries of the file
            for (var i = 0; i < pageSize; i++) {
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
            if (pageCount > 1) {
                document.getElementById("nextPage").removeAttribute("disabled");
                document.getElementById("lastPage").removeAttribute("disabled");
            }
            
            // some extra stuff to make the dropdown selector the right length
            // code basically copied from https://stackoverflow.com/questions/18417114/add-item-to-dropdown-list-in-html-using-javascript
            // not necessarily a hard thing to come up with but I figured I should note my sources anyway
            for (var j = 0; j < pageCount; j++) {
                var option = document.createElement('option');
                option.text = option.value = j + 1;
                selector.add(option, j);
            }
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

function buttonValidator() {
    if (pageNum == 0) {
        document.getElementById("previousPage").setAttribute("disabled", "");
        document.getElementById("firstPage").setAttribute("disabled", "");
    } else {
        document.getElementById("previousPage").removeAttribute("disabled");
        document.getElementById("firstPage").removeAttribute("disabled");
    }
    if (pageSize*(pageNum+1) > capacity) {
        document.getElementById("nextPage").setAttribute("disabled", "");
        document.getElementById("lastPage").setAttribute("disabled", "");
    } else {
        document.getElementById("nextPage").removeAttribute("disabled");
        document.getElementById("lastPage").removeAttribute("disabled");
    }
}

function nextPage() {
    deletePage();
    pageNum++;
    addPage(pageSize, pageNum);
    buttonValidator();
    // console.log(pageNum);
}

function previousPage() { // this button should start greyed out
    deletePage();
    pageNum--;
    addPage(pageSize, pageNum);
    buttonValidator();
}

function testfunction() {
    console.log(Number(document.getElementById("selector").value));
    let retval = document.getElementById("selector").value;
    if (!isNaN(retval) && !isNaN(parseFloat(retval))) {
        choosePage(Number(retval));
    } else {
        choosePage(0);
    }
}

function choosePage(pageChosen) {
    deletePage();
    if (capacity <= pageChosen*pageSize) {
        pageNum = pageCount - 1;
    } else if (pageChosen < 1) {
        pageNum = 0;
    } else {
        pageNum = pageChosen;
    }
    addPage(pageSize, pageNum);
    buttonValidator();
}

function chooseReversePage(pageChosen) {
    choosePage(pageCount - pageChosen);
}

window.onload = function() {
  generateTable();
};