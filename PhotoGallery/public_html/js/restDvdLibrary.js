$(document).ready(function () {
    loadDvds();
    addDvdFromForm();
    editData();

});

//add all the data of the form to the database
function addDvdFromForm() {
    //this method triggers when the add button is clicked
    $('#add-button').click(function () {
        //!! might need event.preventDefault to stop browser from refreshing!!!
        //event.preventDefault();
        $.ajax({
            type: 'POST',
            url: "http://localhost:8080/DvdLibraryMVCWeb/dvd",
            //adding request body and making it json
            data: JSON.stringify({
                title: $('#add-title').val(),
                releaseDate: $('#add-release-date').val(),
                mpaaRating: $('#add-mpaa-ratings').val(),
                director: $('#add-director').val(),
                studio: $('#add-studio').val(),
                note: $('#add-note').val()
            }), //creating headers
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'dataType': 'json'
                    //now jason object is ready and send .. we clear the data from the form
        }).success(function (data, status) {
            $('#add-title').val('');
            $('#add-release-date').val('');
            $('#add-mpaa-ratings').val('');
            $('#add-director').val('');
            $('#add-studio').val('');
            $('#add-note').val('');
            loadDvds();
            $('#validationErrors').empty();
        }).error(function (data, status) {
            $('#validationErrors').empty();
            $.each(data.responseJSON.fieldErrors, function (index, validationError) {
                var errorDiv = $('#validationErrors');
                errorDiv.append(validationError.message).append($('<br>'));

            });
        });
    });
}
function editData() {
    $('#edit-button').click(function (event) {
         event.preventDefault();
        //!!might have to do event.preventDefault(); so that the page doesn't refresh"
        $.ajax({
            type: 'PUT',
            url: "dvd/" + $('#edit-dvd-index').val(),
            data: JSON.stringify({
                title: $("#edit-title").val(),
                releaseDate: $("#edit-release-date").val(),
                mpaaRating: $("#edit-mpaa-rating").val(),
                director: $("#edit-director").val(),
                studio: $("#edit-studio").val(),
                note: $("#edit-note").val()
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 'dataType': 'json'
        }).success(function (data, status) {
            hideEditForm();
            loadDvds();
             $('#validationErrors').empty();
        }).error(function (data, status) {
            $('#validationErrors').empty();
            $.each(data.responseJSON.fieldErrors, function (index, validationError) {
                var errorDiv = $('#validationErrors');
                errorDiv.append(validationError.message).append($('<br>'));

            });
        });
    });
}


function loadDvds() {
    clearDvdTable();

    $.ajax({
        type: 'GET', //this is by default anyways
        url: "http://localhost:8080/DvdLibraryMVCWeb/dvds"
    }).success(function (data, status) {
        $.each(data, function (index, dvd) {
            var title = dvd.title;
            var director = dvd.director;
            var index = dvd.dvdIndex;
            var row = '<tr>';
            row += '<td>' + title + '</td>';
            row += '<td>' + director + '</td>';
            row += '<td><a onclick="deleteDvdForm(' + index + ')">Delete<a/></td>';
            row += '<td><a onclick="showEditForm(' + index + ')">Edit<a/></td>';
            row += '</tr>';
            $('#content-rows').append(row);
        });
    });
}
function deleteDvdForm(dvdIndex) {
    $.ajax({
        type: 'DELETE',
        url: "http://localhost:8080/DvdLibraryMVCWeb/dvd/" + dvdIndex
    }).success(function () {
        loadDvds();
    });
}
//show edit form , grap dvd with index and set it up 
function showEditForm(dvdIndex) {
    $.ajax({
        type: 'GET',
        url: "dvd/" + dvdIndex

    }).success(function (dvd, status) {
        $('#edit-title').val(dvd.title);
        $('#edit-release-date').val(dvd.releaseDate);
        $('#edit-mpaa-rating').val(dvd.mpaaRating);
        $('#edit-director').val(dvd.director);
        $('#edit-studio').val(dvd.studio);
        $('#edit-note').val(dvd.note);
        $('#edit-dvd-index').val(dvd.dvdIndex);
        $('#edit-form').show();
        $('#add-form').hide();
    });
}

function clearDvdTable() {
    $("#content-rows").empty();
}

function hideEditForm() {
    $('#edit-title').val('');
    $('#edit-release-date').val('');
    $('#edit-mpaa-ratings').val('');
    $('#edit-director').val('');
    $('#edit-studio').val('');
    $('#edit-note').val('');
    $('#edit-form').hide();
    $('#add-form').show();
}