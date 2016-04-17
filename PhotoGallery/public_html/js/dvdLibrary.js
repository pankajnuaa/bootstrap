$(document).ready(function () {
    loadDvds();
    //add the form.. 
    $('#add-button').click(function () {
        //prevents the submit feature of button
        event.preventDefault();
        //after filling up the contact form.. post it.. 
        $.ajax({
            type: 'POST',
            url: "dvd/",
            //adding request body and making it json
            data: JSON.stringify({
                title: $('#add-title').val(),
                releaseDate: $('#add-release-date').val(),
                mpaaRating: $('#add-mpaa-rating').val(),
                director: $('#add-director').val(),
                studio: $('#add-studio').val(),
                note: $('#add-note').val()
            }),
            //creating headers
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'dataType': 'json'
                    //once the from is submitted clear the data from the add form
        }).success(function (data, status) {
            $('#add-title').val('');
            $('#add-release-date').val('');
            $('#add-mpaa-rating').val('');
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
    //edit the form, convert data into JSON, send it to database , hide editForm and 
    $('#edit-button').click(function () {//need to hit edit button twice if there is validation error !!!!!!


        $.ajax({
            type: "PUT",
            url: "dvd/" + $('#edit-dvd-id').val(),
            data: JSON.stringify({
                title: $('#edit-title').val(),
                releaseDate: $('#edit-release-date').val(),
                mpaaRating: $('#edit-mpaa-rating').val(),
                director: $('#edit-director').val(),
                studio: $('#edit-studio').val(),
                note: $('#edit-note').val()
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'dataType': 'json'
        }).success(function (data, status) {
            loadDvds();
            $('#edit-button').attr('data-dismiss', 'modal');
            $('#validationErrorsEdit').empty();
        }).error(function (data, status) {
            $('#validationErrorsEdit').empty();
            $('#edit-button').attr('data-dismiss', '');
            $.each(data.responseJSON.fieldErrors, function (index, validationError) {
                var errorDiv = $('#validationErrorsEdit');
                errorDiv.append(validationError.message).append($('<br>'));

            });
        });
    });

});

function loadDvds() {
    clearDvdTable();

    var dvdTable = $('#contentRows');
    $.ajax({
        url: "dvds/"
    }).success(function (data, status) {
        $.each(data, function (index, dvd) {
            dvdTable.append($('<tr>')
                    .append($('<td>').append($('<a>')
                            .attr({
                                'data-dvd-id': dvd.dvdIndex,
                                'data-toggle': 'modal',
                                'data-target': '#detailsModal'
                            })
                            .text(dvd.title)
                            )//end of <a> append
                            )// end of <td> append
                    .append($('<td>').text(dvd.mpaaRating))
                    .append($('<td>').append($('<a>')
                            .attr({
                                'data-dvd-id': dvd.dvdIndex,
                                'data-toggle': 'modal',
                                'data-target': '#editModal'
                            })
                            .text('Edit')))
                    .append($('<td>')
                            .append($('<a>').attr({'onclick': 'deleteDvd(' + dvd.dvdIndex + ')'})
                                    .text('Delete')))
                    );
        });

    });



}

function clearDvdTable() {
    $("#contentRows").empty();
}

function deleteDvd(dvdIndex) {
    var answer = confirm('Do you really want to delete this DVD from list?');
    if (answer === true) {
        $.ajax({
            type: 'DELETE',
            url: "dvd/" + dvdIndex

        }).success(function () {
            loadDvds();
        });
    }
}

$('#detailsModal').on('show.bs.modal', function (event) {
    var element = $(event.relatedTarget);
    var dvdId = element.data('dvd-id');
    var modal = $(this);
    $.ajax({
        url: "dvd/" + dvdId
    }).success(function (dvd) {
        modal.find('#dvd-id').text(dvd.contactId);
        modal.find('#dvd-title').text(dvd.title);
        modal.find('#dvd-release-date').text(dvd.releaseDate);
        modal.find('#dvd-mpaa-rating').text(dvd.mpaaRating);
        modal.find('#dvd-director').text(dvd.director);
        modal.find('#dvd-studio').text(dvd.studio);
        modal.find('#dvd-note').text(dvd.note);

    });

});

$('#editModal').on('show.bs.modal', function (event) {
    var element = $(event.relatedTarget);
    var dvdId = element.data('dvd-id');

    var modal = $(this);
    $.ajax({
        url: "dvd/" + dvdId
    }).success(function (dvd) {
        //use.val on text display fields like <h3> or <span>
        modal.find('#edit-dvd-id').val(dvd.dvdIndex);
        //use.val on input fields
        modal.find('#edit-title').val(dvd.title);
        modal.find('#edit-release-date').val(dvd.releaseDate);
        modal.find('#edit-mpaa-rating').val(dvd.mpaaRating);
        modal.find('#edit-director').val(dvd.director);
        modal.find('#edit-studio').val(dvd.studio);
        modal.find('#edit-note').val(dvd.note);

    });

});

