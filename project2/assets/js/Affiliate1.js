
$('.addToCart').click(function(e){
    e.preventDefault();
    console.log("adding to cart");
    var item = $(this).parent();
    var price = item.attr("data-price");
    var sku = item.attr("data-sku");
    var name = item.attr("data-name");

    $.ajax({
        type: "POST",
        url: "/affiliate1/cart",
        data: {
            'price': price,
            'sku': sku,
            'name': name
        },
        success: function(response, responseText){
            console.log(response);
            console.log(responseText);
       		$('#cartItems').text(response.count);

        }
    });


});


$('.updateItem').click(function(e){
    e.preventDefault();
    console.log("updating cart");
    var item = $(this).parents('li');
    var price = item.attr("data-price");
    var sku = item.attr("data-sku");
    var qty = item.find("input").val();

    $.ajax({
        type: "POST",
        url: "/affiliate1/cart/update",
        data: {
            'price': price,
            'sku': sku,
            'qty': qty
        },
        success: function(response){
            console.log('YEAH UPDATED!!');
            console.log(response.item);
            console.log(response.total);
            $('#cartTotal').text(response.total.total);
            // var itemContainer = $('div').attr('data-sku="' +response.item.sku+ '"')

            var itemContainer = $('li[data-sku="'+response.item.sku+'"] .itemTotal');
            itemContainer.text((response.item.total).toFixed(2));



                    // Object {item: Object, total: Object}
                    // item: Object
                    // qty: "2"
                    // sku: "00005"
                    // total: 27.98
                    // __proto__: Object
                    // total: Object
                    // total: 39.97
                    // __proto__: Object
                    // __proto__: Object



        }
    });


});
$('.deleteItem').click(function(e){
    e.preventDefault();
    console.log("deleting item from cart");
    var item = $(this).parents('li');
    var sku = item.attr("data-sku");


    $.ajax({
        type: "POST",
        url: "/affiliate1/cart/delete",
        data: {
            'sku': sku
        },
        success: function(response){
            console.log('YEAH DELETED!!');
            console.log(response.total);
            $('#cartTotal').text(response.total.total);

            item.remove();
        }
    });


});
