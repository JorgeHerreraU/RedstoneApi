module.exports = function Cart(cart) {
    this.services = cart.services || [];
    this.totalServices = cart.totalServices || 0;
    this.totalPrice = cart.totalPrice || 0;
    this.add = function (service, id) {
        const itemsArray = this.services.filter((element) => element.id === id);
        if (itemsArray.length > 0) {
            // do some logic
        } else {
            this.services.push(service);
        }
        this.totalServices = this.services.length;
        this.totalPrice = this.services.reduce((acc, cur) => {
            return acc + cur.basePrice;
        }, 0);
    };
    this.remove = function (id) {
        this.totalServices--;
        this.totalPrice -= this.services.filter(
            (element) => element.id == id
        )[0].basePrice;
        this.services.splice(
            this.services.findIndex((v) => v.id == id),
            1
        );
    };
};
