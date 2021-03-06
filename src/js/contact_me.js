/* eslint-disable quotes */

$(function() {

    $("#contactForm input, #contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) { // eslint-disable-line no-unused-vars
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault() // prevent default submit behaviour
            // get values from FORM
            const name = escape( $("input#name").val() )
            const email = escape( $("input#email").val() )
            const phone = escape( $("input#phone").val() )
            const message = escape( $("textarea#message").val() )
            let firstName = name // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ')
            }
            $.ajax({
                url: PP + "contact_me.php",
                type: "POST",
                data: {
                    name,
                    phone,
                    email,
                    message
                },
                cache: false,
                success: function() {
                    // Success message
                    $('#success').html("<div class='alert alert-success'>")
                    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times")
                        .append("</button>")
                    $('#success > .alert-success')
                        .append("<strong>Your message has been sent. </strong>")
                    $('#success > .alert-success')
                        .append('</div>')

                    //clear all fields
                    $('#contactForm').trigger("reset")
                },
                error: function() {
                    // Fail message
                    $('#success').html("<div class='alert alert-danger'>")
                    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times")
                        .append("</button>")
                    $('#success > .alert-danger').append($("<strong>").html("Sorry " + firstName + ", there was a mail error. <a href='mailto:ajoslow@gmail.com'>Click here</a> to try another method."))
                    $('#success > .alert-danger').append('</div>')
                    //clear all fields
                    $('#contactForm').trigger("reset")
                },
            })
        },
        filter: function() {
            return $(this).is(":visible")
        },
    })

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault()
        $(this).tab("show")
    })
})


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('')
})
