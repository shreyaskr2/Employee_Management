class Product:
    def __init__(self, product_id, name, price, quantity):
        self.product_id = product_id
        self.name = name
        self.price = price
        self.quantity = quantity

    def total_value(self):
        return self.price * self.quantity

    def __repr__(self):
        return f"Product(id={self.product_id}, name='{self.name}', price={self.price}, quantity={self.quantity})"


def get_sample_products():
    return [
        Product(1, "Laptop", 999.99, 5),
        Product(2, "Mouse", 19.99, 50),
        Product(3, "Keyboard", 49.99, 30),
        Product(4, "Monitor", 149.99, 10),
    ]


def print_inventory(products):
    print("Current inventory:")
    for product in products:
        print(f"- {product.name}: {product.quantity} units, ${product.price:.2f} each, total ${product.total_value():.2f}")


if __name__ == "__main__":
    products = get_sample_products()
    print_inventory(products)
    total_stock_value = sum(p.total_value() for p in products)
    print(f"\nTotal stock value: ${total_stock_value:.2f}")
