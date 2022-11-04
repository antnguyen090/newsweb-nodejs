(function ($) {
    "use strict";
    //realtime clock
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
    
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
    
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    };

    var keyword = (getUrlParameter('keyword') != false) ? getUrlParameter('keyword').replaceAll("+"," ") : ""
    $('input[name="keyword"]').val(keyword)
    function getDateTime() {
        var now     = new Date(); 
        var year    = now.getFullYear();
        var month   = now.getMonth()+1; 
        var day     = now.getDate();
        var hour    = now.getHours();
        var minute  = now.getMinutes();
        var second  = now.getSeconds(); 
        if(month.toString().length == 1) {
             month = '0'+month;
        }
        if(day.toString().length == 1) {
             day = '0'+day;
        }   
        if(hour.toString().length == 1) {
             hour = '0'+hour;
        }
        if(minute.toString().length == 1) {
             minute = '0'+minute;
        }
        if(second.toString().length == 1) {
             second = '0'+second;
        }   
        var dateTime = hour+':'+minute+':'+second+' '+ day+'/'+month+'/'+year;   
        return dateTime;
    }

    // example usage: realtime clock
    setInterval(function(){
        let currentTime = getDateTime();
        document.getElementById("realtimeClock").innerHTML = currentTime;
    }, 1000);

    var pathname = window.location.pathname.split("/")[1]
    $(`#navbarCollapse a[href="${pathname}"]`).addClass("active")

    const divs = document.querySelectorAll('article > div');

    document.querySelector('#cityName').addEventListener('change', () => {
    let id = event.target.value;  
    //if selectedIndex = 0, default is selected so all divs will be displayed, otherwise all divs will be removed
    divs.forEach(div =>{
        let compare = $(div).attr('id')
        if (compare == id){
            div.style.display = 'block'
        } else {
            div.style.display = 'none'
        }
    });
    //the coresponding div to the selected option will be displayed
    })
    

    let showTitlePage = () =>{
        let urlPath = window.location.pathname.split("/")[1]
        let titlePage = document.title
        if (urlPath==''){
            urlPath='index'
        }
        let text = $(`nav.navbar a[href='/${urlPath}']`).text()
        if(text == '') text = 'Trang Lỗi'
        let textPage  = titlePage + " | " + text
        $(document).attr("title", textPage) 
        $(`nav.navbar a[href='/${urlPath}']`).addClass('active')
    }
    showTitlePage()
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);

        $("#sendMail").submit(function(e) {
            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-center",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
              }
            let urlPath = window.location.pathname.split("/")[1]
            e.preventDefault(); // avoid to execute the actual submit of the form.
            var form = $("#sendMail").serialize();
            $("#sendMail button[type='submit']").addClass('disabled').attr('disabled','')
            toastr["info"]("Đang gửi xin vui lòng đợi!")
            $.ajax({
                type: "POST",
                url: `/${urlPath}/sendmail`,
                data: form, // serializes the form's elements.
                success: function (response) {
                    toastr.clear()
                    if(response.success == true){
                        toastr["success"]("Đã gửi thông tin thành công")
                        $("#sendMail input").val("")
                        $("#sendMail textarea").val("")
                    } else {
                        toastr["error"]("Đã có lỗi, vui lòng thử lại!")
                    }
                    $("#sendMail button[type='submit']").removeClass('disabled').removeAttr('disabled')
                }
            });
            
        });
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Main News carousel
    $(".main-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: true,
        loop: true,
        center: true,
    });


    // Tranding carousel
    $(".tranding-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left"></i>',
            '<i class="fa fa-angle-right"></i>'
        ]
    });


    // Carousel item 1
    $(".carousel-item-1").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ]
    });

    // Carousel item 2
    $(".carousel-item-2").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 30,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            }
        }
    });


    // Carousel item 3
    $(".carousel-item-3").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 30,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    

    // Carousel item 4
    $(".carousel-item-4").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 30,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });


    
})(jQuery);

