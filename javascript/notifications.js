
//Modal Activities

let modals = [];
$(document).keyup(function(e) {
        if ((e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) && modals.length) { $(".modal[modal='" + modals.pop() + "']").modal('hide') }
})

$(document).on("click", ".showNotification", function () {
        let id = $(this).data('id');
        let type = $(this).data('type');
        const modalId = modals.length;
        modals.push(modalId);
        $(".modal").attr("modal", modalId);
        serverData[type].messages
            .forEach(message => {
                    if (message.id === id) {
                            $(".modal-body").text(message.message);
                            $(".modal-title-text").text(message.title);
                            $("#notification-icon").removeClass().addClass("oi oi-flag text-warning mr-1");
                            if (jQuery.isEmptyObject(message.url)) {
                                $('#notification-link').attr("href", '#').hide();
                            } else {
                                $('#notification-link').attr("href", message.url).show();
                            }
                    }
            });
});
