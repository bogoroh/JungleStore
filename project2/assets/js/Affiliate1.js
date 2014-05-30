
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
    var item = $(this).parent();
    var price = item.attr("data-price");
    var sku = item.attr("data-sku");
    var qty = item.find("input");

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
       
        }
    });


});