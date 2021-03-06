(function(){

  'use strict';

  var api_key = 'appydays';

  var contacts = [];

  var contact;

  function getContacts(callback){

    $.get( 'http://contacts.tinyapollo.com/contacts?key=' + api_key, function(data){
      contacts = data.contacts;

      callback();
    });

  }

  function saveContact(callback){

    if ( contact ) {

      $.ajax({
        url: 'http://contacts.tinyapollo.com/contacts/' + contact._id + '?key=' + api_key,
        method: 'PUT',
        data: {
          name: contact.name,
          title: contact.title,
          email: contact.email,
          phone: contact.phone,
          twitterId: contact.twitterId
        },
        success: function(){
          callback();
        }
      });

    }

  };

  function deleteContact(callback){

    if ( contact && contact._id ) {

      $.ajax({
        url: 'http://contacts.tinyapollo.com/contacts/' + contact._id + '?key=' + api_key,
        method: 'DELETE',
        success: function(){
          callback();
        }
      });

    }

  };

  $( document ).on( 'pagebeforeshow', '#home', function(){
    getContacts(function(){
      var contact_list = $( '#contact_list' );

      contact_list.empty();

      for ( var i in contacts ) {
        var a = $( '<a href="#show">' + contacts[i].name + '</a>' ).data( 'contact', contacts[i] );

        contact_list.append( $( '<li></li>' ).append( a ) );
      }

      contact_list.listview( 'refresh' );
    });
  });

  $( document ).on( 'click', '#contact_list a', function(e){
    contact = $( this ).data( 'contact' );
  });

  $( document ).on( 'pagebeforeshow', '#show', function(e, ui){
    if ( !contact ) {
      $.mobile.navigate( '#home' );
      return;
    }

    $( '#show_title' ).text( contact.title );
    $( '#show_name' ).text( contact.name );
    $( '#show_phone' ).text( contact.phone );
    $( '#show_email' ).text( contact.email );
    $( '#show_twitter' ).text( contact.twitterId );
    
    $('#action_button_list').empty();
    $('#action_button_list').append('<a href=tel:' + contact.phone + '><img class="action_img" src="images/call.png"></a>');
    $('#action_button_list').append('<a href=sms:' + contact.phone + '><img class="action_img" src="images/sms.png"></a>');
    $('#action_button_list').append('<a href=mailto:' + contact.email + '><img class="action_img" src="images/sendemail.png"></a>');

  });

  $( document ).on( 'pagebeforeshow', '#edit', function(e, ui){
    if ( !contact ) {
      $.mobile.navigate( '#home' );
      return;
    }

    $( '#edit_title' ).val( contact.title ).selectmenu( 'refresh' );
    $( '#edit_name' ).val( contact.name );
    $( '#edit_phone' ).val( contact.phone );
    $( '#edit_email' ).val( contact.email );
    $( '#edit_twitter' ).val( contact.twitterId );
  });

  $( document ).on( 'pagebeforeshow', '#add', function(e, ui){
    $( '#add_title' ).val( '' );
    $( '#add_name' ).val( '' );
    $( '#add_phone' ).val( '' );
    $( '#add_email' ).val( '' );
    $( '#add_twitter' ).val( '' );
  });

  $( document ).on( 'submit', '#add_form', function(){

    var addTitle = $('#add_title').val();
    var addName =  $('#add_name').val();
    var addPhone = $('#add_phone').val();
    var addEmail = $('#add_email').val();
    var addTwitter = $('#add_twitter').val();

    if (addName != ''){

      $.ajax({
        url: 'http://contacts.tinyapollo.com/contacts/?key=' + api_key,
        method: 'POST',
        data: {
          name: addName,
          title: addTitle,
          email: addEmail,
          phone: addPhone,
          twitterId: addTwitter
        },
        success: function(){
          $.mobile.navigate( '#home' );
        }
      });

    }

  });

  $( document ).on( 'submit', '#edit_form', function(e){
    e.preventDefault();

    contact.title = $( '#edit_title' ).val();
    contact.name = $( '#edit_name' ).val();
    contact.phone = $( '#edit_phone' ).val();
    contact.email = $( '#edit_email' ).val();
    contact.twitterId = $( '#edit_twitter' ).val();

    saveContact(function(){
      $.mobile.navigate( '#home' );
    });
  });

  $( document ).on( 'click', '#delete_contact', function(){

    deleteContact(function(){
      $.mobile.navigate( '#home' );
    });

  });

})();
