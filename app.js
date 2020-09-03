var DOMstrings = {
    inputForm: 'issueInputForm',
    issueDescription: 'issueDescInput',
    issueSeverity: 'issueSeverityInput',
    issueAssigned: 'issueAssignedToInput',
    descField: 'desc-field-required',
    assField: 'assi-field-required',
    close: 'close',
    delete: 'delete',
};
//-------------------------------------data controller----------------------------------//
function StoreIssueItem(desc, severity, assigned) {
    this.desc = desc;
    this.severity = severity;
    this.assigned = assigned;

};

function addIssueItem(desc, severity, assigned) {

    var newIssue = new StoreIssueItem(desc, severity, assigned);
    issueArr.push(newIssue);
    // console.log(issueArr);
    localStorage.setItem('issues', JSON.stringify(issueArr));
    return newIssue;
};



function deleteIssueFromDataStructure(e) {
    if (e.target.id === 'delete') {

        issueArr.forEach(function (issue) {
            if (issue.desc === e.target.previousSibling.previousSibling.previousSibling.previousSibling.textContent) {
                issueArr.splice(issueArr.indexOf(issue), 1);
            }
        });

        localStorage.setItem('issues', JSON.stringify(issueArr));
        /* for (var i = 0; i < issueArr.length; i++) {
            if (issueArr[i].desc === e.target.previousSibling.previousSibling.previousSibling.previousSibling.textContent) {
                console.log(issueArr[i].desc);
                issueArr.splice(i, 1);

            }
        }; */

    }
}


//---------------------------------------UI controller----------------------------------//

//----------1. Validating my input.
function showFieldMessage() {
    fieldArr.forEach(function (item) {

        if (item === descField) {
            item.textContent = 'Please fill the description';

        }
        if (item === assField) {
            item.textContent = 'Please fill responsible person name';

        }
        item.style.color = 'red';
        inputDesc.style.border = '1px solid red';
        inputAss.style.border = '1px solid red';

    });

};

function removeFieldMessageAndClearField(removeDesc, removeAss) {
    var fieldArr = [descField, assField];
    fieldArr.forEach(function (item) {
        item.textContent = '';

    });
    removeDesc.value = '';
    removeAss.value = '';
    inputDesc.focus();
    inputDesc.style.border = '';
    inputAss.style.border = '';

};

// -----------2. Generating random ID
function generateID() {
    var issueID = chance.guid();
    return issueID;
};

//----------- 3. Show Issue in UI
function addItemInUI(object) {
    var html, newHtml;
    html = '<div class="well m-2"><h6>Issue ID: %issueID%</h6><p><span class="label label-info" id="closed">Open</span></p><h3>%description%</h3><p><span class="glyphicon glyphicon-time"></span>Severity level:- %severity%</p><p><span class="glyphicon glyphicon-user"></span>Assigned to:- %assigned%</p><a href="#" class="btn btn-warning m-1" id="close">Close</a><a href="#" class="btn btn-danger m-1" id="delete">Delete</a></div>'

    newHtml = html.replace('%issueID%', generateID());
    newHtml = newHtml.replace('%description%', object.desc);
    newHtml = newHtml.replace('%severity%', object.severity);
    newHtml = newHtml.replace('%assigned%', object.assigned);

    document.getElementById('issueList').insertAdjacentHTML('beforeend', newHtml);
}

//---------------4. Delete Issue from UI
function deleteIssueFromUI(e) {
    if (e.target.classList.contains('btn-danger')) {

        var issue = e.target.parentElement;
        issueList.removeChild(issue);
    };
};

//--------------5. Closing issue from UI
function closingIssue(e) {
    if (e.target.classList.contains('btn-warning')) {
       
        var closeIssue = e.target.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling;
        closeIssue.textContent = 'Closed'; 
    }

    /* if (e.target.id === 'close') {
        console.log('working');
        e.target.previousSibling.previousSibling.previousSibling.previousSibling.textContent = 'closed';
    }; */
}



//---------------------------app controller----------------------------//
var inputValues, issueArr, descField, fieldArr, inputDesc, inputAss, issueList;

issueArr = [];
descField = document.getElementById(DOMstrings.descField);
assField = document.getElementById(DOMstrings.assField);
fieldArr = [descField, assField];

inputDesc = document.getElementById(DOMstrings.issueDescription);
inputAss = document.getElementById(DOMstrings.issueAssigned);

issueList = document.getElementById('issueList');

function addIssue(event) {
    event.preventDefault();

    inputValues = {
        issueDescription: document.getElementById(DOMstrings.issueDescription).value,
        issueSeverity: document.getElementById(DOMstrings.issueSeverity).value,
        issueAssigned: document.getElementById(DOMstrings.issueAssigned).value,
    }

    if (inputValues.issueDescription !== '' && inputValues.issueAssigned !== '') {

        // -----------1.storing data in data structure
        var obj = addIssueItem(inputValues.issueDescription, inputValues.issueSeverity, inputValues.issueAssigned);
        removeFieldMessageAndClearField(inputDesc, inputAss);

        //------------2. getting data from data structure and showing it in UI
        addItemInUI(obj);
    } else {
        showFieldMessage();
    };

};

function deleteIssue(event) {


    //------1.deleting from data structure.
    deleteIssueFromDataStructure(event);
    //------2.deleting from UI.
    deleteIssueFromUI(event);
    //-----3. closing the issue
    closingIssue(event);

};

//-------------Handling Events
document.getElementById(DOMstrings.inputForm).addEventListener('submit', addIssue);
document.addEventListener('keypress', function (event) {

    if (event.keyCode === 13 || event.which === 13) {
        addIssue(event);
    };

});
issueList.addEventListener('click', deleteIssue);

// document.querySelector('.btn-warning').addEventListener('click', function () {
//     document.querySelector('.label').textContent = 'Closed';
// });


