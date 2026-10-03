from flask import Flask, request, jsonify, send_file
import mysql.connector
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/*": {
            "origins": "*"
        }
    },
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"]
)

# MySQL Connection
import os

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "localhost"),
        port=int(os.getenv("MYSQL_PORT", "3306")),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE", "foodmunch")
    )   

# Home
@app.route("/")
def home():
    return send_file("studentfood.html")


@app.route("/studentfood.css")
def studentfood_css():
    return send_file(
        os.path.join(app.root_path, "studentfood.css"),
        mimetype="text/css"
    )

# Login page
@app.route("/login.html")
def login_page():
    return send_file(
        os.path.join(app.root_path, "login.html"),
        mimetype="text/html"
    )

# Signup page
@app.route("/signup.html")
def signup_page():
    return send_file(
        os.path.join(app.root_path, "signup.html"),
        mimetype="text/html"
    )

@app.route("/my-orders.html")
def my_orders_page():
    return send_file(
        os.path.join(app.root_path, "my-orders.html"),
        mimetype="text/html"
    )

# JavaScript
@app.route("/script.js")
def script_js():
    return send_file(
        os.path.join(app.root_path, "script.js"),
        mimetype="application/javascript"
    )


# Signup CSS
@app.route("/signup.css")
def signup_css():
    return send_file(
        os.path.join(app.root_path, "signup.css"),
        mimetype="text/css"
    )

# SIGNUP
@app.route("/signup", methods=["POST"])
def signup():


    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    db = get_db_connection()
    cursor = db.cursor()

    # Check email already exists
    cursor.execute(
        "SELECT id FROM users WHERE email = %s",
        (email,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        cursor.close()
        db.close()

        return jsonify({
            "success": False,
            "message": "Email already registered"
        }), 400

    # Password hashing
    hashed_password = generate_password_hash(password)

    # Insert user
    cursor.execute(
        """
        INSERT INTO users (name, email, password)
        VALUES (%s, %s, %s)
        """,
        (name, email, hashed_password)
    )

    db.commit()

    cursor.close()
    db.close()

    return jsonify({
        "success": True,
        "message": "Account created successfully"
    })


# LOGIN
@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM users WHERE email = %s",
        (email,)
    )

    user = cursor.fetchone()

    cursor.close()
    db.close()

    if user and check_password_hash(user["password"], password):

        return jsonify({
            "success": True,
            "message": "Login successful",
            "id": user["id"],
            "name": user["name"]
        })

    return jsonify({
        "success": False,
        "message": "Invalid email or password"
    }), 401

@app.route("/add-to-cart", methods=["POST"])
def add_to_cart():
    data = request.get_json()

    user_id = data.get("user_id")
    food_name = data.get("food_name")
    price = data.get("price")
    quantity = data.get("quantity", 1)

    if not user_id or not food_name or not price:
        return jsonify({
            "success": False,
            "message": "Cart details are required"
        }), 400

    db = get_db_connection()
    cursor = db.cursor()

    # Check if the same food item already exists in the user's cart
    cursor.execute(
        """
        SELECT id, quantity
        FROM cart_items
        WHERE user_id = %s AND food_name = %s
        """,
        (user_id, food_name)
    )

    existing_item = cursor.fetchone()

    if existing_item:
        # Increase existing quantity
        cursor.execute(
            """
            UPDATE cart_items
            SET quantity = quantity + %s
            WHERE id = %s
            """,
            (quantity, existing_item[0])
        )
    else:
        # Add new food item
        cursor.execute(
            """
            INSERT INTO cart_items
            (user_id, food_name, price, quantity)
            VALUES (%s, %s, %s, %s)
            """,
            (user_id, food_name, price, quantity)
        )

    db.commit()

    cursor.close()
    db.close()

    return jsonify({
        "success": True,
        "message": "Item added to cart"
    })

    
@app.route("/cart/<int:user_id>", methods=["GET"])
def get_cart(user_id):

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT id, food_name, price, quantity, created_at
        FROM cart_items
        WHERE user_id = %s
        ORDER BY created_at DESC
        """,
        (user_id,)
    )

    cart_items = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify({
        "success": True,
        "cart": cart_items
})

# ===============================
# PLACE ORDER
# ===============================

@app.route("/place-order", methods=["POST"])
def place_order():

    data = request.get_json()

    user_id = data.get("user_id")
    customer_name = data.get("customer_name")
    customer_phone = data.get("customer_phone")
    customer_address = data.get("customer_address")
    payment_method = data.get("payment_method")
    items = data.get("items")

    if (
        not user_id
        or not customer_name
        or not customer_phone
        or not customer_address
        or not payment_method
        or not items
    ):
        return jsonify({
            "success": False,
            "message": "Order details are required"
        }), 400

    db = get_db_connection()
    cursor = db.cursor()

    try:

        # Calculate subtotal from items
        subtotal = 0

        for item in items:

            price = float(item["price"])
            quantity = int(item["quantity"])

            subtotal += price * quantity


        # Delivery charge
        delivery_charge = 40

        grand_total = subtotal + delivery_charge


        # Save every food item into orders table
        for item in items:

            cursor.execute(
                """
                INSERT INTO orders
                (
                    user_id,
                    food_name,
                    price,
                    quantity,
                    customer_name,
                    customer_phone,
                    customer_address,
                    payment_method,
                    total_amount
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    user_id,
                    item["food_name"],
                    item["price"],
                    item["quantity"],
                    customer_name,
                    customer_phone,
                    customer_address,
                    payment_method,
                    grand_total
                )
            )


        # Clear user's cart after successful order
        cursor.execute(
            """
            DELETE FROM cart_items
            WHERE user_id = %s
            """,
            (user_id,)
        )


        db.commit()

        return jsonify({
            "success": True,
            "message": "Order placed successfully",
            "total": grand_total
        })


    except Exception as error:

        db.rollback()

        print("Order Error:", error)

        return jsonify({
            "success": False,
            "message": "Failed to place order"
        }), 500


    finally:

        cursor.close()
        db.close()


# ===============================
# GET MY ORDERS
# ===============================

@app.route("/my-orders/<int:user_id>", methods=["GET"])
def get_my_orders(user_id):

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT
                id,
                food_name,
                price,
                quantity,
                customer_name,
                customer_phone,
                customer_address,
                payment_method,
                total_amount,
                ordered_at
            FROM orders
            WHERE user_id = %s
            ORDER BY ordered_at DESC
            """,
            (user_id,)
        )

        orders = cursor.fetchall()

        return jsonify({
            "success": True,
            "orders": orders
        })


    except Exception as error:

        print("My Orders Error:", error)

        return jsonify({
            "success": False,
            "message": "Failed to load orders"
        }), 500


    finally:

        cursor.close()
        db.close()

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    ) 