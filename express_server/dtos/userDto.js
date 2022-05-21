class userDto {
    id;
    phone;
    name;
    activated;
    createdAt;

    constructor(user) {
        this.id = user._id;
        this.phone = user.phone;
        this.name = user.name;
        this.activated = user.activated;
        this.createdAt = user.createdAt;
    }
}

module.exports = userDto;