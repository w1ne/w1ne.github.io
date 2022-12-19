$('#position').keyup(function() {
    alert( "Handler for .keyup() called." );
    var price = parseInt(this.value) * 15;
    $('#price').prop('value', price);
});