// =====================================================
// FOOD CATEGORY SECTIONS
// =====================================================

const menuLinks = document.querySelectorAll(".menu-item-link");

const chickenItems = document.getElementById("chickenItems");
const vegItems = document.getElementById("vegItems");
const soupItems = document.getElementById("soupItems");
const fishItems = document.getElementById("fishItems");
const mainCourseItems = document.getElementById("mainCourseItems");
const noodlesItems = document.getElementById("noodlesItems");
const saladItems = document.getElementById("saladItems");
const dessertItems = document.getElementById("dessertItems");


// =====================================================
// HIDE ALL FOOD SECTIONS
// =====================================================

function hideAllFoodSections() {

    if (chickenItems) chickenItems.style.display = "none";
    if (vegItems) vegItems.style.display = "none";
    if (soupItems) soupItems.style.display = "none";
    if (fishItems) fishItems.style.display = "none";
    if (mainCourseItems) mainCourseItems.style.display = "none";
    if (noodlesItems) noodlesItems.style.display = "none";
    if (saladItems) saladItems.style.display = "none";
    if (dessertItems) dessertItems.style.display = "none";
}


// =====================================================
// SHOW FOOD CATEGORY
// =====================================================

function showFoodSection(section) {

    if (!section) {
        console.error("Food section not found");
        return;
    }

    hideAllFoodSections();

    section.style.display = "block";

    setTimeout(function () {

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);

}


// =====================================================
// VIEW ALL - ALL 8 CATEGORIES
// =====================================================

if (menuLinks.length > 0) {

    if (menuLinks[0] && chickenItems) {
        menuLinks[0].addEventListener("click", function (event) {
            event.preventDefault();
            showFoodSection(chickenItems);
        });
    }


    if (menuLinks[1] && vegItems) {
        menuLinks[1].addEventListener("click", function (event) {
            event.preventDefault();
            showFoodSection(vegItems);
        });
    }


    if (menuLinks[2] && soupItems) {
        menuLinks[2].addEventListener("click", function (event) {
            event.preventDefault();
            showFoodSection(soupItems);
        });
    }


    if (menuLinks[3] && fishItems) {
        menuLinks[3].addEventListener("click", function (event) {
            event.preventDefault();
            showFoodSection(fishItems);
        });
    }


    if (menuLinks[4] && mainCourseItems) {
        menuLinks[4].addEventListener("click", function (event) {
            event.preventDefault();
            showFoodSection(mainCourseItems);
        });
    }


    if (menuLinks[5] && noodlesItems) {
        menuLinks[5].addEventListener("click", function (event) {
            event.preventDefault();
            showFoodSection(noodlesItems);
        });
    }


    if (menuLinks[6] && saladItems) {
        menuLinks[6].addEventListener("click", function (event) {
            event.preventDefault();
            showFoodSection(saladItems);
        });
    }


    if (menuLinks[7] && dessertItems) {
        menuLinks[7].addEventListener("click", function (event) {
            event.preventDefault();
            showFoodSection(dessertItems);
        });
    }

}


// =====================================================
// CART
// =====================================================

const cartSection = document.getElementById("cartSection");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const chicken65OrderBtn =
    document.getElementById("chicken65OrderBtn");

let cart = {};


// =====================================================
// ADD TO CART
// =====================================================

async function addToCart(foodName, foodPrice) {

    const userId = localStorage.getItem("userId");

    // User login check
    if (!userId) {

        alert("Please login first to add items to cart.");

        window.location.href = "login.html";

        return;
    }


    // Add item to local cart
    if (cart[foodName]) {

        cart[foodName].quantity++;

    } else {

        cart[foodName] = {
            price: Number(foodPrice),
            quantity: 1
        };

    }


    // Update cart UI immediately
    renderCart();


    // Show cart
    if (cartSection) {

        cartSection.style.display = "block";

        setTimeout(function () {

            cartSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);

    }


    // Save cart to database
    try {

        const response = await fetch(
            " /add-to-cart",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    user_id: parseInt(userId),

                    food_name: foodName,

                    price: Number(foodPrice),

                    quantity: 1

                })
            }
        );


        const result = await response.json();

        console.log(
            "Cart Database Response:",
            result
        );


        if (!result.success) {

            console.error(
                "Cart save failed:",
                result.message
            );

        }

    } catch (error) {

        console.error(
            "Error saving cart to database:",
            error
        );

    }

}


// =====================================================
// RENDER CART
// =====================================================

function renderCart() {

    // Navbar cart count
    const cartCount =
        document.getElementById("cartCount");


    if (cartCount) {

        let totalQuantity = 0;

        Object.keys(cart).forEach(function (foodName) {

            totalQuantity +=
                Number(cart[foodName].quantity);

        });

        cartCount.textContent = totalQuantity;

    }


    // Mobile cart count
    const mobileCartCount =
        document.getElementById("mobileCartCount");


    if (mobileCartCount) {

        let totalQuantity = 0;

        Object.keys(cart).forEach(function (foodName) {

            totalQuantity +=
                Number(cart[foodName].quantity);

        });

        mobileCartCount.textContent =
            totalQuantity;

    }


    if (!cartItems) {
        return;
    }


    cartItems.innerHTML = "";

    let total = 0;


    Object.keys(cart).forEach(function (foodName) {

        const item = cart[foodName];

        const itemPrice =
            Number(item.price);

        const itemQuantity =
            Number(item.quantity);

        const itemTotal =
            itemPrice * itemQuantity;

        total += itemTotal;


        cartItems.innerHTML += `

            <div class="cart-item">

                <div class="cart-item-details">

                    <h3>${foodName}</h3>

                    <p>
                        ₹${itemPrice} × ${itemQuantity}
                    </p>

                </div>


                <div class="quantity-controls">

                    <button
                        class="quantity-btn"
                        onclick="decreaseQuantity('${foodName.replace(/'/g, "\\'")}')">
                        −
                    </button>


                    <span class="quantity">
                        ${itemQuantity}
                    </span>


                    <button
                        class="quantity-btn"
                        onclick="increaseQuantity('${foodName.replace(/'/g, "\\'")}')">
                        +
                    </button>

                </div>


                <div class="cart-item-total">

                    ₹${itemTotal}

                </div>

            </div>

        `;

    });


    if (cartTotal) {

        cartTotal.textContent =
            "Total: ₹" + total;

    }

}


// =====================================================
// INCREASE QUANTITY
// =====================================================

function increaseQuantity(foodName) {

    if (!cart[foodName]) {
        return;
    }

    cart[foodName].quantity++;

    renderCart();

}


// =====================================================
// DECREASE QUANTITY
// =====================================================

function decreaseQuantity(foodName) {

    if (!cart[foodName]) {
        return;
    }


    cart[foodName].quantity--;


    if (cart[foodName].quantity <= 0) {

        delete cart[foodName];

    }


    renderCart();

}


// =====================================================
// CHICKEN 65 ORDER BUTTON
// =====================================================

if (chicken65OrderBtn) {

    chicken65OrderBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            addToCart(
                "Chicken 65",
                199
            );

        }
    );

}


// =====================================================
// OTHER FOOD ORDER BUTTONS
// =====================================================

const foodOrderButtons =
    document.querySelectorAll(".food-order-btn");


foodOrderButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            // Find parent food card
            let foodCard =
                button.parentElement;


            // Keep moving upward until h3 and p are found
            while (
                foodCard &&
                (
                    !foodCard.querySelector("h3") ||
                    !foodCard.querySelector("p")
                )
            ) {

                foodCard =
                    foodCard.parentElement;

            }


            if (!foodCard) {

                console.error(
                    "Food card not found"
                );

                return;

            }


            const nameElement =
                foodCard.querySelector("h3");


            const priceElement =
                foodCard.querySelector("p");


            if (!nameElement || !priceElement) {

                console.error(
                    "Food name or price not found"
                );

                return;

            }


            const foodName =
                nameElement.textContent.trim();


            const foodPriceText =
                priceElement.textContent.trim();


            const foodPrice =
                parseInt(
                    foodPriceText.replace(/[^\d]/g, "")
                );


            if (
                !foodName ||
                isNaN(foodPrice)
            ) {

                console.error(
                    "Invalid food name or price"
                );

                return;

            }


            addToCart(
                foodName,
                foodPrice
            );

        }
    );

});


// =====================================================
// PLACE ORDER
// =====================================================

const placeOrderBtn =
    document.getElementById("placeOrderBtn");

const orderFormSection =
    document.getElementById("orderFormSection");


if (placeOrderBtn) {

    placeOrderBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            console.log(
                "PLACE ORDER CLICKED"
            );


            // Cart empty check
            if (
                Object.keys(cart).length === 0
            ) {

                alert(
                    "Please add food items to your cart first."
                );

                return;

            }


            if (!orderFormSection) {

                console.error(
                    "orderFormSection NOT FOUND"
                );

                alert(
                    "Order form section not found in HTML."
                );

                return;

            }


            // Show order form
            orderFormSection.style.display =
                "block";


            // Calculate subtotal
            let subtotal = 0;


            Object.keys(cart).forEach(
                function (foodName) {

                    const item =
                        cart[foodName];

                    subtotal +=
                        Number(item.price) *
                        Number(item.quantity);

                }
            );


            const deliveryCharge = 40;

            const grandTotal =
                subtotal + deliveryCharge;


            // =================================================
            // ORDER SUMMARY
            // =================================================

            const orderSummaryItems =
                document.getElementById(
                    "orderSummaryItems"
                );


            if (orderSummaryItems) {

                orderSummaryItems.innerHTML = "";


                Object.keys(cart).forEach(
                    function (foodName) {

                        const item =
                            cart[foodName];


                        const itemTotal =
                            Number(item.price) *
                            Number(item.quantity);


                        orderSummaryItems.innerHTML += `

                            <div class="order-summary-row">

                                <span>
                                    ${foodName} × ${item.quantity}
                                </span>

                                <span>
                                    ₹${itemTotal}
                                </span>

                            </div>

                        `;

                    }
                );

            }


            // =================================================
            // PRICE DETAILS
            // =================================================

            const orderSubtotal =
                document.getElementById(
                    "orderSubtotal"
                );


            const deliveryChargeElement =
                document.getElementById(
                    "deliveryCharge"
                );


            const orderGrandTotal =
                document.getElementById(
                    "orderGrandTotal"
                );


            if (orderSubtotal) {

                orderSubtotal.textContent =
                    "₹" + subtotal;

            }


            if (deliveryChargeElement) {

                deliveryChargeElement.textContent =
                    "₹" + deliveryCharge;

            }


            if (orderGrandTotal) {

                orderGrandTotal.textContent =
                    "₹" + grandTotal;

            }


            // Scroll to order form
            setTimeout(function () {

                orderFormSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 100);

        }
    );

}


// =====================================================
// CONFIRM ORDER
// =====================================================

const confirmOrderBtn =
    document.getElementById(
        "confirmOrderBtn"
    );


const successPopup =
    document.getElementById(
        "successPopup"
    );


const successMessage =
    document.getElementById(
        "successMessage"
    );


if (confirmOrderBtn) {

    confirmOrderBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            console.log(
                "CONFIRM ORDER CLICKED"
            );


            const customerNameElement =
                document.getElementById(
                    "customerName"
                );


            const customerPhoneElement =
                document.getElementById(
                    "customerPhone"
                );


            const customerAddressElement =
                document.getElementById(
                    "customerAddress"
                );


            if (
                !customerNameElement ||
                !customerPhoneElement ||
                !customerAddressElement
            ) {

                alert(
                    "Customer details fields not found."
                );

                return;

            }


            const customerName =
                customerNameElement.value.trim();


            const customerPhone =
                customerPhoneElement.value.trim();


            const customerAddress =
                customerAddressElement.value.trim();


            // Check details
            if (
                customerName === "" ||
                customerPhone === "" ||
                customerAddress === ""
            ) {

                alert(
                    "Please fill all the details."
                );

                return;

            }


            // Calculate subtotal
            let subtotal = 0;


            Object.keys(cart).forEach(
                function (foodName) {

                    const item =
                        cart[foodName];


                    subtotal +=
                        Number(item.price) *
                        Number(item.quantity);

                }
            );


            const deliveryCharge = 40;


            const grandTotal =
                subtotal + deliveryCharge;


            console.log(
                "Grand Total:",
                grandTotal
            );


            // Hide order form
            if (orderFormSection) {

                orderFormSection.style.display =
                    "none";

            }


            // Show payment
            const paymentSection =
                document.getElementById(
                    "paymentSection"
                );


            if (!paymentSection) {

                console.error(
                    "paymentSection NOT FOUND"
                );

                alert(
                    "Payment section not found in HTML."
                );

                return;

            }


            paymentSection.style.display =
                "block";


            const paymentTotal =
                document.getElementById(
                    "paymentTotal"
                );


            if (paymentTotal) {

                paymentTotal.textContent =
                    "₹" + grandTotal;

            }


            setTimeout(function () {

                paymentSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 100);

        }
    );

}


// =====================================================
// PAYMENT
// =====================================================

const payNowBtn =
    document.getElementById(
        "payNowBtn"
    );


if (payNowBtn) {

    payNowBtn.addEventListener(
        "click",
        async function () {

            const selectedPayment =
                document.querySelector(
                    'input[name="paymentMethod"]:checked'
                );


            if (!selectedPayment) {

                alert(
                    "Please select a payment method."
                );

                return;

            }


            const userId =
                localStorage.getItem("userId");


            if (!userId) {

                alert(
                    "Please login first."
                );

                window.location.href =
                    "login.html";

                return;

            }


            const customerNameElement =
                document.getElementById(
                    "customerName"
                );


            const customerPhoneElement =
                document.getElementById(
                    "customerPhone"
                );


            const customerAddressElement =
                document.getElementById(
                    "customerAddress"
                );


            if (
                !customerNameElement ||
                !customerPhoneElement ||
                !customerAddressElement
            ) {

                alert(
                    "Customer details not found."
                );

                return;

            }


            const customerName =
                customerNameElement.value.trim();


            const customerPhone =
                customerPhoneElement.value.trim();


            const customerAddress =
                customerAddressElement.value.trim();


            // Calculate subtotal
            let subtotal = 0;


            Object.keys(cart).forEach(
                function (foodName) {

                    const item =
                        cart[foodName];


                    subtotal +=
                        Number(item.price) *
                        Number(item.quantity);

                }
            );


            const deliveryCharge = 40;


            const grandTotal =
                subtotal + deliveryCharge;


            // Prepare items
            const items =
                Object.keys(cart).map(
                    function (foodName) {

                        return {

                            food_name:
                                foodName,

                            price:
                                Number(
                                    cart[foodName].price
                                ),

                            quantity:
                                Number(
                                    cart[foodName].quantity
                                )

                        };

                    }
                );


            if (items.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        " /place-order",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                user_id:
                                    parseInt(userId),

                                customer_name:
                                    customerName,

                                customer_phone:
                                    customerPhone,

                                customer_address:
                                    customerAddress,

                                payment_method:
                                    selectedPayment.value,

                                items:
                                    items

                            })

                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "PLACE ORDER RESPONSE:",
                    result
                );


                if (!result.success) {

                    alert(
                        result.message ||
                        "Order failed. Please try again."
                    );

                    return;

                }


                // Hide payment
                const paymentSection =
                    document.getElementById(
                        "paymentSection"
                    );


                if (paymentSection) {

                    paymentSection.style.display =
                        "none";

                }


                // Success popup
                if (successMessage) {

                    successMessage.textContent =
                        "Thank you, " +
                        customerName +
                        "! Your order has been confirmed.";

                }


                if (successPopup) {

                    successPopup.style.display =
                        "flex";

                }


                // Clear cart
                cart = {};

                renderCart();


                console.log(
                    "Order Saved:",
                    result
                );

            } catch (error) {

                console.error(
                    "Order Error:",
                    error
                );


                alert(
                    "Unable to connect to server. Please try again."
                );

            }

        }
    );

}


// =====================================================
// CLOSE SUCCESS POPUP
// =====================================================

function closeSuccessPopup() {

    if (successPopup) {

        successPopup.style.display =
            "none";

    }


    const customerName =
        document.getElementById(
            "customerName"
        );


    const customerPhone =
        document.getElementById(
            "customerPhone"
        );


    const customerAddress =
        document.getElementById(
            "customerAddress"
        );


    if (customerName) {
        customerName.value = "";
    }


    if (customerPhone) {
        customerPhone.value = "";
    }


    if (customerAddress) {
        customerAddress.value = "";
    }


    // Hide order form
    if (orderFormSection) {

        orderFormSection.style.display =
            "none";

    }


    // Hide payment
    const paymentSection =
        document.getElementById(
            "paymentSection"
        );


    if (paymentSection) {

        paymentSection.style.display =
            "none";

    }


    // Back to menu
    const exploreMenuSection =
        document.getElementById(
            "exploreMenuSection"
        );


    if (exploreMenuSection) {

        exploreMenuSection.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// =====================================================
// SIDE MENU
// =====================================================

function openSideMenu() {

    const sideMenu =
        document.getElementById(
            "sideMenu"
        );


    const menuOverlay =
        document.getElementById(
            "menuOverlay"
        );


    if (sideMenu) {

        sideMenu.classList.add(
            "active"
        );

    }


    if (menuOverlay) {

        menuOverlay.classList.add(
            "active"
        );

    }

}


function closeSideMenu() {

    const sideMenu =
        document.getElementById(
            "sideMenu"
        );


    const menuOverlay =
        document.getElementById(
            "menuOverlay"
        );


    if (sideMenu) {

        sideMenu.classList.remove(
            "active"
        );

    }


    if (menuOverlay) {

        menuOverlay.classList.remove(
            "active"
        );

    }

}


// =====================================================
// NORMAL MOBILE MENU
// =====================================================

function openMenu() {

    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );


    const menuOverlay =
        document.getElementById(
            "menuOverlay"
        );


    if (mobileMenu) {

        mobileMenu.classList.add(
            "active"
        );

    }


    if (menuOverlay) {

        menuOverlay.classList.add(
            "active"
        );

    }

}


function closeMenu() {

    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );


    const menuOverlay =
        document.getElementById(
            "menuOverlay"
        );


    if (mobileMenu) {

        mobileMenu.classList.remove(
            "active"
        );

    }


    if (menuOverlay) {

        menuOverlay.classList.remove(
            "active"
        );

    }

}


// =====================================================
// LOAD CART FROM DATABASE
// =====================================================

async function loadCartFromDatabase() {

    const userId =
        localStorage.getItem("userId");


    if (!userId) {

        return;

    }


    try {

        const response =
            await fetch(
                ` /cart/${userId}`
            );


        const result =
            await response.json();


        console.log(
            "DATABASE CART:",
            result
        );


        if (result.success) {

            cart = {};


            result.cart.forEach(
                function (item) {

                    cart[item.food_name] = {

                        price:
                            Number(item.price),

                        quantity:
                            Number(item.quantity)

                    };

                }
            );


            renderCart();

        }

    } catch (error) {

        console.error(
            "Error loading cart:",
            error
        );

    }

}


// =====================================================
// MY ORDERS NAVBAR
// =====================================================

const myOrdersLink =
    document.getElementById(
        "myOrdersLink"
    );


if (myOrdersLink) {

    myOrdersLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const userId =
                localStorage.getItem(
                    "userId"
                );


            if (!userId) {

                alert(
                    "Please login first to view your orders."
                );


                window.location.href =
                    "login.html";


                return;

            }


            const myOrderSection =
                document.getElementById(
                    "myOrderSection"
                );


            if (myOrderSection) {

                myOrderSection.style.display =
                    "block";


                loadMyOrders();


                setTimeout(function () {

                    myOrderSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }, 100);

            }

        }
    );

}


// =====================================================
// LOAD MY ORDERS
// =====================================================

async function loadMyOrders() {

    const userId =
        localStorage.getItem(
            "userId"
        );


    if (!userId) {

        alert(
            "Please login first."
        );


        window.location.href =
            "login.html";


        return;

    }


    try {

        const response =
            await fetch(
                `/my-orders/${userId}`
            );


        const result =
            await response.json();


        console.log(
            "MY ORDERS:",
            result
        );


        if (result.success) {

            displayMyOrders(
                result.orders
            );

        } else {

            alert(
                result.message ||
                "Unable to load your orders."
            );

        }

    } catch (error) {

        console.error(
            "My Orders Error:",
            error
        );


        alert(
            "Unable to connect to server."
        );

    }

}


// =====================================================
// DISPLAY MY ORDERS
// =====================================================

function displayMyOrders(orders) {

    const myOrderItems =
        document.getElementById(
            "myOrderItems"
        );


    if (!myOrderItems) {

        return;

    }


    myOrderItems.innerHTML =
        "";


    if (!orders || orders.length === 0) {

        myOrderItems.innerHTML = `

            <div class="empty-order">

                <div class="empty-order-icon">
                    📦
                </div>

                <h3>
                    No Orders Yet
                </h3>

                <p>
                    You haven't placed any orders yet.
                </p>

            </div>

        `;


        return;

    }


    orders.forEach(
        function (order) {

            let orderedDate =
                "Invalid Date";


            if (order.ordered_at) {

                const d =
                    new Date(
                        order.ordered_at
                    );


                if (!isNaN(d.getTime())) {

                    orderedDate =
                        d.toLocaleString(
                            "en-IN",
                            {
                                day: "numeric",
                                month: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true
                            }
                        );

                }

            }


            myOrderItems.innerHTML += `

                <div class="my-order-card">

                    <div class="my-order-header">

                        <div>

                            <h3>
                                ${order.food_name}
                            </h3>

                            <p>
                                Order #${order.id}
                            </p>

                        </div>


                        <span class="order-status">
                            Confirmed
                        </span>

                    </div>


                    <div class="my-order-details">

                        <div>

                            <strong>
                                Quantity
                            </strong>

                            <span>
                                ${order.quantity}
                            </span>

                        </div>


                        <div>

                            <strong>
                                Price
                            </strong>

                            <span>
                                ₹${order.price}
                            </span>

                        </div>


                        <div>

                            <strong>
                                Payment
                            </strong>

                            <span>
                                ${order.payment_method}
                            </span>

                        </div>


                        <div>

                            <strong>
                                Total
                            </strong>

                            <span>
                                ₹${order.total_amount}
                            </span>

                        </div>


                        <div>

                            <strong>
                                Ordered On
                            </strong>

                            <span>
                                ${orderedDate}
                            </span>

                        </div>

                    </div>

                </div>

            `;

        }
    );

}


// =====================================================
// LOAD DATABASE CART WHEN PAGE OPENS
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCartFromDatabase();

    }
);