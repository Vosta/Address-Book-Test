var Adrresser = (function () {
    var firstName;
    var lastName;
    var fullName;
    var phone;
    var address;
    var email;
    var $mainDiv = $('#inhere');
    var searchbox;
    var editArr = [];
    var API = {};
    var first2 = $('#AddFname');
    var last2 = $('#AddLname');
    var phone2 = $('#Addnumber');
    var address2 = $('#Addaddress');
    var email2 = $('#Addemail');
    var keyInput = $('[name=keyInp]').val();
    var alertP = $('#alertP');
    var alertPop = $('#alertPop');
//Automatic search engine
    $('#textbox').on("keyup", function () {
        var searchText = $('#textbox').val();
        for (var q = 0; q < editArr.length; q++) {
            if (editArr[q].firstName.toLowerCase().indexOf(searchText.toLowerCase()) < 0 && editArr[q].lastName.toLowerCase().indexOf(searchText.toLowerCase()) < 0 &&
                editArr[q].address.toLowerCase().indexOf(searchText.toLowerCase()) < 0 && editArr[q].phone.indexOf(searchText) < 0 &&
                editArr[q].email.toLowerCase().indexOf(searchText.toLowerCase()) < 0) {
                $('[data-id = ' + q + ']').css({"display": "none"});
            } else {
                $('[data-id = ' + q + ']').css({"display": "block"});
            }
        }
        if (searchText == '') {
            update();
        }
    })
//change the information in the module
    $('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var Title = button.data('title');//get data-****
        var what = button.data('what');
        var modal = $(this);
        modal.find('.modal-title').text(Title);
        $('.fill').prop("readonly", false);
        modal.find('.modal-footer').show();
        modal.find('.saveL').unbind().click(API.save);
        if (what === 'info') { //if the view button is clicked, also the main indicator for the view function
            modal.find('.modal-footer').hide();
            $('.fill').prop("readonly", true);
        } else if (what === 'add') { // if the add button is clicked
            $('.fill').removeClass('addRed');
            modal.find('.modal-body input').val('');
        }
    });
//Delete a contact
    API.Delete = function (del) {
        editArr.splice(del, 1);
        $('#textbox').val('');
        update();
    }
//Edit or View the contact
    API.editView = function (del) {
        //put the values from the storage array into the modal
        keyInput = del;
        var find = editArr[keyInput];
        first2.val(find.firstName);
        last2.val(find.lastName);
        phone2.val(find.phone);
        address2.val(find.address);
        email2.val(find.email);
    };
//Save the edited settings
    API.save = function () {
        try {
            API.checkempty(); //check if the inputs are empty
            if (keyInput !== '') {
                editArr[keyInput] = new person(first2.val(), last2.val(), phone2.val(), address2.val(), email2.val());
                keyInput = '';
            } else {
                editArr.push(new person(first2.val(), last2.val(), phone2.val(), address2.val(), email2.val()));
            }
            $('#textbox').val('');
            update();
            $('#exampleModal').modal('hide');
            alertPop.slideUp(200);
        } catch (err) {
            API.fail(err);   //all inputs are empty
        }
    }
//Creates an constructor
    var person = function (firstName, lastName, phone, address, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.address = address;
        this.email = email;
    }

//Checks if the user didnt enter any values into the formular
    API.checkempty = function () {
        if (first2.val() === '' && last2.val() === '' && email2.val() === '') {
            throw 'Err-1';
        } else if (email2.val() !== '' && !API.valEmail(email2.val())) {
            throw 'Err-2';
        } else if (phone2.val() !== '' && !API.valPhone(phone2.val())) {
            throw 'Err-3';
        }
    }
//Gives out an error if the user didnt enter values into the formular
    API.fail = function (err) {
        alertPop.slideDown(300);
        $('.fill').removeClass('addRed');
        if (err === 'Err-1') {
            alertP.html('Please put in a First name, Last name, or an email.');
            $('.er1').addClass('addRed');
        } else if (err === 'Err-2') {
            alertP.html('Please enter a valid Email.');
            $(email2).addClass('addRed');
        } else if (err === 'Err-3'){
            alertP.html('Please enter a valid Phone number.');
            $(phone2).addClass('addRed');
        }
    }
//Tests if the email accualy exists
    API.valEmail = function (email) {
        var re = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        return re.test(email);
    }
//Tests if the phone number contains only numbers
    API.valPhone = function (number){
        var re = /^\d+$/;
        return re.test(number);
    }
//Creates the HTML form of the newly created/edited contact
    function update(){
        $mainDiv.empty();
        function getFullName(i) {
            if (editArr[i].firstName === '' && editArr[i].lastName === '' && editArr[i].email !== '') {
                return editArr[i].email;
            } else if (editArr[i].firstName !== '' || editArr[i].lastName !== '') {
                return editArr[i].firstName + ' ' + editArr[i].lastName;
            }
        }
        for (var i = 0; i < editArr.length; i++) {
            var str = '<div class="forMarg" data-key="' + i + '" data-id="' + i + '">' +
                '<input data-id="' + i + '" type="hidden" name="keySave" value=""/>' +
                '<table class="TB">' +
                '<tbody>' +
                '<tr>' +
                '<td colspan="3" rowspan="3"><img class="contactimg" src="contactimg.png"></td>' +
                '<td colspan="6" class="standard-tdTEXT">' + getFullName(i) + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="2" rowspan="2" class="standard-td">' +
                '<button data-key="' + i + '" data-toggle="modal" data-target="#exampleModal"' +
                ' data-title="Edit Contact" class="editbtn btn btn-success" type="button">' +
                '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
                '</button>' +
                '</td>' +
                '<td colspan="2" rowspan="2" class="standard-td">' +
                '<button data-key="' + i + '" class=" btn btn-danger trashbtn"  type="button">' +
                '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>' +
                '</button>' +
                '</td>' +
                '<td colspan="2" rowspan="2" class="standard-td">' +
                '<button data-toggle="modal" data-title="View Contact" data-target="#exampleModal" data-what="info"' +
                ' data-key="' + i + '" class="viewbtn favoritebtn btn btn-info" type="button" >View Contact ' +
                '<span class="glyphicon glyphicon-star" aria-hidden="true"></span>' +
                '</button>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</div>';
            $mainDiv.append(str);
        }
    }
//onclick functions
    $(document).on('click', '.editbtn, .viewbtn', function () {
        $('.fill').removeClass('addRed');
        var key = $(this).data('key');
        API.editView(key);
    });
    $(document).on('click', '.trashbtn', function () {
        var key = $(this).data('key');
        API.Delete(key);
    });
    $(document).on('click', '.cls', function () {
        alertPop.slideUp(200);
        keyInput = '';
    });
    return API;
}());