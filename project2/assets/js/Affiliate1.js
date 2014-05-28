
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
            console.log(response)
            console.log(responseText)
//JSON.parse is actually not necessary because it is already being sent back as JSON
            // result = JSON.parse(response);

// this gets whatever the current # in the cart is
            var currentCartItems = $('#cartItems').text();

            if(currentCartItems == "")
// if it is empty, meaning the cart is currently empty, then put in the new item added (the response.qty being 1)
                $('#cartItems').text(response.qty);
            else{
// otherwise, since we just added an item to the cart, add the response.qty to the previous cart #
                $('#cartItems').empty().text( (currentCartItems*1) + response.qty);
            }        
        }
    });


});
