$(document).ready(function () {
    searchDvdFromForm();
});

function searchDvdFromForm() {
    //this method triggers when the search button is clicked
    $('#search-button').click(function (event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: "search/dvds",
            //searching request body and making it json
            data: JSON.stringify({
                title: $('#search-title').val(),
                releaseDate: $('#search-release-date').val(),
                mpaaRating: $('#search-mpaa-ratings').val(),
                director: $('#search-director').val(),
                studio: $('#search-studio').val(),
                note: $('#search-note').val()
            }), //creating headers
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'dataType': 'json'
                    //now jason object is ready and send .. we clear the data from the form
        }).success(function (data, status) {
            $('#search-title').val('');
            $('#search-release-date').val('');
            $('#search-mpaa-ratings').val('');
            $('#search-director').val('');
            $('#search-studio').val('');
            $('#search-note').val('');
            fillDvdTable(data, status);

        });
    });
}

function fillDvdTable(data, status) {
    clearDvdTable();
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
}

function clearDvdTable() {
    $("#content-rows").empty();
}