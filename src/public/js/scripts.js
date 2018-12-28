$(document).ready(function () {
    $('#post-comment').hide();

    $('#btn-toggle-comment').click(function (e) {
        e.preventDefault();
        $('#post-comment').slideToggle();
    });

    $('#btn-like').click(function (e) {
        e.preventDefault();
        let imgId = $(this).data('id');

        $.post('/images/' + imgId + '/like')
            .done(data => {
                console.log(data);
                $('.likes-count').text(data.like);
            });
    });

    $('#btn-delete').click(function (e) {
        e.preventDefault();
        console.log('Delete button');
        let $this = $(this);
        const response = confirm("Are you sure you want to delete this image?");
        if (response) {
            let imgId = $this.data('id');
            $.ajax({
                url: "/images/" + imgId,
                type: "DELETE"
            })
                .done(function (result) {
                    $this.removeClass('btn-danger').addClass('btn-success');
                    $this.html('<i class="fa fa-check"></i> <span>Deleted!</span>');
                });
        }
    });
});


