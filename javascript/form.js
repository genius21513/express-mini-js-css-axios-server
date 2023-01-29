function saveData() {
    var formData = $('#data-form').serializeJSON();
    var dataString = JSON.stringify(formData, null, '\t');
    console.log(dataString);
}
