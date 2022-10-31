$( document ).ready( async function() {
    const linkAdmin = "adminTTT/"
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "200",
        "hideDuration": "200",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
    let notify = listNotify()
    var arrayPath = window.location.pathname.split("/")
    var adminUrl = arrayPath[1]
    var pathname = arrayPath[2]
    if (pathname == '') pathname = "dashboard"
    $(`ul.nav-sidebar > li > a[href="/${adminUrl}/${pathname}"]`).addClass("active")

    showPreview = (FileList,value) => {
        if (typeof (FileReader) != "undefined") {
            var dvPreview = $(`#divImageMediaPreview${value}`);
            dvPreview.html("");            
            $(FileList).each(function () {
                var file = $(this);                
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = $("<img />");
                        img.attr("style", "width: 58%;");
                        img.attr("src", e.target.result);
                        dvPreview.append(img);
                    }
                    reader.readAsDataURL(file[0]);                
            });
        } else {
            alert("This browser does not support HTML5 FileReader.");
        }
    }

    $("#ImageMediasLarge").change(function (e) {
        let value = e.target.getAttribute('value')
        showPreview($(this)[0].files,value);
    });

    $("#ImageMediasSmall").change(function (e) {
        let value = e.target.getAttribute('value')
        showPreview($(this)[0].files,value);
    });

    $("#ImageMediasTitle").change(function (e) {
        let value = e.target.getAttribute('value')
        showPreview($(this)[0].files,value);
    });
    
    $("#ImageMediasArticle").change(function (e) {
        let value = e.target.getAttribute('value')
        showPreview($(this)[0].files,value);
    });
    $("#ImageMediasBanner").change(function (e) {
        let value = e.target.getAttribute('value')
        showPreview($(this)[0].files,value);
    });

    function ChangeToSlug(text)
        {
            //Đổi chữ hoa thành chữ thường
            let slug = text.toLowerCase();
        
            //Đổi ký tự có dấu thành không dấu
            slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
            slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
            slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
            slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
            slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
            slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
            slug = slug.replace(/đ/gi, 'd');
            //Xóa các ký tự đặt biệt
            slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
            //Đổi khoảng trắng thành ký tự gạch ngang
            slug = slug.replace(/ /gi, "-");
            //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
            //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
            slug = slug.replace(/\-\-\-\-\-/gi, '-');
            slug = slug.replace(/\-\-\-\-/gi, '-');
            slug = slug.replace(/\-\-\-/gi, '-');
            slug = slug.replace(/\-\-/gi, '-');
            //Xóa các ký tự gạch ngang ở đầu và cuối
            slug = '@' + slug + '@';
            slug = slug.replace(/\@\-|\-\@|\@/gi, '');
            return slug
        }

    changeStatus = (status, id, link) =>{
        let elmnumberActive = $("#count-items-active span")
        let elmnumberInactive = $("#count-items-inactive span")
        let numberActive = parseInt(elmnumberActive.text())
        let numberInactive = parseInt(elmnumberInactive.text())
        $.ajax({
            type: "post",
            url: `${link}`,
            data: `status=${status}&id=${id}`,
            dataType: "json",
            success: function (response) {
                if(response.success == true){
                    let currentClass =  (status == 'active') ? "btn-success" : "btn-danger"
                    let classNew =  (status == 'active') ? "btn-danger" : "btn-success" 
                    let currentIcon = (status == 'active') ? "fa-check" : "fa-ban"
                    let newIcon = (status == 'active') ? "fa-ban" : "fa-check"
                    status = (status == 'active') ? "inactive" : "active"
                    $(`#change-status-${id}`).removeClass(currentClass).addClass(classNew).attr('onClick', `changeStatus('${status}','${id}', '${link}')`)
                    $(`#change-status-${id} i`).removeClass(currentIcon).addClass(newIcon)
                    $(`#${id}`).attr("data-status",status)
                    if (status.toLowerCase() == 'inactive'){
                        elmnumberActive.text((numberActive-1)) 
                        elmnumberInactive.text((numberInactive+1))
                    } else {
                        elmnumberActive.text((numberActive+1))
                        elmnumberInactive.text((numberInactive-1))
                    }
                    toastr["success"](notify.CHANGE_STATUS_SUCCESS)
                } else {
                    toastr["error"](notify.CHANGE_STATUS_ERROR)
                }
            }
        });
    }

    changeOrdering = (id, value, link ) => {
        $.ajax({
            type: "post",
            url: `${link}`,
            data: `ordering=${value}&id=${id}`,
            dataType: "json",
            success: function (response) {
                if(response.success == true){
                    toastr["success"](notify.CHANGE_ORDERING_SUCCESS)
                } else {
                    let msg = response.errors.errors[0].msg
                    toastr["error"](notify.CHANGE_ORDERING_ERROR + '\n'+ msg )
                }
            }
        });
    }

    deleteItem = (id, name, link, thumb) => {
        $('#modal-danger .modal-title').text('You want to delete this Item?')
        $('#modal-danger .modal-body p').text(`Name: ${name} - ID: ${id}`)
        $('#modal-danger button[data-type="confirm"]').attr("onClick",`deleteItemConfirm('${id}','${link}','${thumb}')`)
    }

    deleteItemConfirm = (id,link,thumb)=>{
        $.ajax({
            type: "post",
            url: `${link}`,
            data: `id=${id}&thumb=${thumb}`,
            dataType: "json",
            success: function (response) {
                if(response.success == true){
                    $('button[data-dismiss="modal"]').click()
                    let elmnumberActive = $("#count-items-active span")
                    let elmnumberInactive = $("#count-items-inactive span")
                    let elmnumberAll = $("#count-items-all span")
                    let numberActive = parseInt(elmnumberActive.text())
                    let numberInactive = parseInt(elmnumberInactive.text())
                    let numberAll = parseInt(elmnumberAll.text())
                    let dataStatus = $(`#${id}`).attr("data-status")
                    $(`#area-${id}`).remove()
                    if (dataStatus == 'active'){
                        elmnumberActive.text(numberActive-1)
                    } else if(dataStatus == 'inactive'){
                        elmnumberInactive.text(numberInactive-1)
                    }
                    elmnumberAll.text(numberAll-1)
                    toastr["success"](notify.DELETE_SUCCESS)
                } else {
                    toastr["error"](notify.DELETE_ERROR)
                }
            }
        });
    }

    deleteMultiItemsConfirm = (items,img, link) => {
        let arrItems = items.split(",")
        $.ajax({
            type: "post",
            url: `${link}`,
            data: `id=${items}&img=${img}`,
            dataType: "json",
            success: async function (response) {
                if(response.success == true){
                    $('button[data-dismiss="modal"]').click()
                    $.each(arrItems, (index, id)=>{
                            let elmnumberAll = $("#count-items-all span")
                            let elmnumberActive = $("#count-items-active span")
                            let elmnumberInactive = $("#count-items-inactive span")
                            let numberActive = parseInt(elmnumberActive.text())
                            let numberInactive = parseInt(elmnumberInactive.text())
                            let numberAll = parseInt(elmnumberAll.text())
                            let dataStatus = $(`#${id}`).attr("data-status")
                            if (dataStatus == 'active'){
                                elmnumberActive.text(numberActive-1)
                                elmnumberAll.text(numberAll-1)
                            } else if(dataStatus == 'inactive'){
                                elmnumberInactive.text(numberInactive-1)
                                elmnumberAll.text(numberAll-1)
                            }
                            $(`#area-${id}`).remove()
                    })
                    toastr["success"](notify.DELETE_MULTI_SUCCESS)
                } else {
                    toastr["error"](notify.DELETE_MULTI_ERROR)
                }
            }
        });
    }

    const orderingInput = document.querySelectorAll('input[name="items-ordering"]');
    orderingInput.forEach(item => {
        item.addEventListener('change', event => {
            let id = event.target.getAttribute('data-id')
            let value = event.target.value
            let link = event.target.getAttribute('data-router')
            changeOrdering(id, value, link )
        })
    })


    changePrice = (id, value, link ) => {
        $.ajax({
            type: "post",
            url: `${link}`,
            data: `price=${value}&id=${id}`,
            dataType: "json",
            success: function (response) {
                if(response.success == true){
                    $(`#change-price-${id}`).notify("Successful", {className: "success", autoHideDelay: 1500, elementPosition:"bottom"});
                } else {
                    let msg = response.errors.errors[0].msg
                    $(`#change-price-${id}`).notify(msg, {className: "error", autoHideDelay: 1500, });
                }
            }
        });
    }

    const priceInput = document.querySelectorAll('input[name="items-price"]');
    priceInput.forEach(item => {
        item.addEventListener('change', event => {
            let id = event.target.getAttribute('data-id')
            let value = event.target.value
            let link = event.target.getAttribute('data-router')
            changeOrdering(id, value, link )
        })
    })

    $("#check-all").click(function(){
        $("input[name='cid']").prop('checked', $(this).prop('checked'));
    });

    deleteMultiItems = async (link) =>{
        let itemsDelete = [];
        let imgDelete   = []
        let listItems =''
        let compare = new Boolean(false);
        $( "input[type='checkbox']" ).prop( "checked", function( i, val ) {
            if(val == true) 
            {
                compare = val
            } 
        });
        if (compare == false){
            $('#modal-danger .modal-title').text('Warning!')
            $('#modal-danger .modal-body p').text('Please choose items to delete')
            $('#modal-danger button[data-type="confirm"]').css('display', 'none')
        } else {
            let boxChecked = $("input[name='cid']:checkbox:checked")
            
            await boxChecked.each((index, value)=>{
                let id = $(value).val()
                let thumb = $(value).attr("data-img")
                itemsDelete.push(id)
                imgDelete.push(thumb)
                listItems += `
                    <p> Name: ${$(`#name-item-${id}`).text()} - ID: ${id} </p>
                `
            })
            $('#modal-danger .modal-title').text('You want to delete these Items?')
            $('#modal-danger .modal-body p').html(listItems)
            $('#modal-danger button[data-type="confirm"]').css('display', 'block').attr("onClick",`deleteMultiItemsConfirm('${itemsDelete}','${imgDelete}','${link}')`)
        }

    }

    changeStatusMultiItemsConfirm = (items, status, link) =>{
        let elmnumberActive = $("#count-items-active span")
        let elmnumberInactive = $("#count-items-inactive span")
        let numberActive = parseInt(elmnumberActive.text())
        let numberInactive = parseInt(elmnumberInactive.text())
        let arrItems = items.split(",")
        let updateStatus = (status=='inactive') ? 'inactive' : 'active'
        let updateBtn = (status=='inactive') ? 'btn-danger' : 'btn-success'
        let updateIcon =(status=='inactive') ? "fa-ban" : "fa-check"
        $.ajax({
            type: "post",
            url: `${link}`,
            data: `id=${items}&status=${status}`,
            dataType: "json",
            success: async function (response) {
                if(response.success == true){
                    $('button[data-dismiss="modal"]').click()
                    $.each(arrItems, async (index, id)=>{
                            let html = await `
                                <a href="javascript:" onclick="changeStatus('${updateStatus}','${id}', '/${linkAdmin}items/change-status/')" id="change-status-${id}" class="rounded-circle btn btn-sm ${updateBtn}">
                                <i class="fas ${updateIcon}"></i></a>
                                `
                            $(`#status-item-${id}`).html(html)
                            $(`#${id}`).attr("data-status",status)
                    })
                    if (status.toLowerCase() == 'inactive'){
                        elmnumberActive.text((numberActive-arrItems.length)) 
                        elmnumberInactive.text((numberInactive+arrItems.length))
                    } else {
                        elmnumberActive.text((numberActive+arrItems.length))
                        elmnumberInactive.text((numberInactive-arrItems.length))
                    }
                    toastr["success"](notify.CHANGE_MULTI_STATUS_SUCCESS)
                } else {
                    toastr["error"](notify.CHANGE_MULTI_STATUS_ERROR)
                }
            }
        });
    }
    changeMultiStatus = async (status, link) =>{
        let modalClass = (status == 'active') ? "modal-success" : "modal-danger"
        let itemsChangeStatus = [];
        let listItems =''
        let compare = new Boolean(false);
        $( "input[name='cid']" ).prop( "checked", function( i, val ) {
            if(val == true) 
            {
                compare = val
            } 
        });
        if (compare == false){
            $(`#${modalClass} .modal-title`).text('Warning!')
            $(`#${modalClass} .modal-body p`).text('Please choose items to change status')
            $(`#${modalClass} button[data-type="confirm"]`).css('display', 'none')
        } else {
            let boxChecked = $("input[name='cid']:checkbox:checked")
            await boxChecked.each((index, value)=>{
                if ($(value).attr("data-status") == status) return
                let id = $(value).val()
                itemsChangeStatus.push(id)
                listItems += `
                    <p> Name: ${$(`#name-item-${id}`).text()} - ID: ${id} </p>
                `
            })
            if (itemsChangeStatus.length == 0) {
                $(`#${modalClass} .modal-title`).text('Warning!')
                $(`#${modalClass} .modal-body p`).text('Please choose items to change status')
                $(`#${modalClass} button[data-type="confirm"]`).css('display', 'none')
                return false
            }
            $(`#${modalClass} .modal-title`).text(`You want to change these Items to ${status}?`)
            $(`#${modalClass} .modal-body p`).html(listItems)
            $(`#${modalClass} button[data-type="confirm"]`).css('display', 'block').attr("onClick",`changeStatusMultiItemsConfirm('${itemsChangeStatus}','${status}','${link}')`)
        }
    }


    const inputNameForm = $("input#name-input-form")
    const inputSlugForm = $("input#slug-input-form")
        inputNameForm.on("change paste keyup", function() {
            inputSlugForm.val(ChangeToSlug($(this).val())); 
        });

    
    $( "select[name='parentMenu']" ).change(function (value) {
        let id = value.target.getAttribute('data-id')
        let newParent = $(this).find(":selected").val()
        $.ajax({
            type: "post",
            url: `menubar/changeparentmenu`,
            data: `id=${id}&newParent=${newParent}`,
            dataType: "json",
            success: function (response) {
                if(response.success == true){
                    toastr["success"](notify.CHANGE_MENUTYPE_SUCCESS)
                } else {
                    toastr["error"](notify.CHANGE_MENUTYPE_ERROR)
                }
            }
        });
    })

    $( "select[name='category']" ).change(function (value) {
        let id = value.target.getAttribute('data-id')
        let newCategory = $(this).find(":selected").val()
        $.ajax({
            type: "post",
            url: `/${linkAdmin}article/changecategory`,
            data: `id=${id}&newCategory=${newCategory}`,
            dataType: "json",
            success: function (response) {
                if(response.success == true){
                    toastr["success"](notify.CHANGE_CATEGORY_SUCCESS)
                } else {
                    toastr["error"](notify.CHANGE_CATEGORY_ERROR)
                }
            }
        });
    })

    changeOption = (data, isCheck) => {
        let dataArr = data.split("-")
        let id = dataArr[1]
        let fieldOption = dataArr[0]
        $.ajax({
            type: "post",
            url: `/${linkAdmin}article/option`,
            data: `id=${id}&field=${fieldOption}&isCheck=${isCheck}`,
            dataType: "json",
            success: function (response) {
                if(response.success == true){
                    toastr["success"](notify.CHANGE_OPTION_SUCCESS)
                } else {
                    toastr["error"](notify.CHANGE_OPTION_ERROR)
                }
            }
        });
    }

    $("div.option input:checkbox").change(function(value) {
        let data = value.target.getAttribute('id')
        if(this.checked) {
            changeOption(data, true)
        } else{
            changeOption(data, false)
        }
    }); 


});

