class userDto {
    id;
    phone;
    name;
    activated;
    createdAt;
    userId;

    constructor(user) {
        this.id = user._id;
        this.phone = user.phone;
        this.name = user.name;
        this.activated = user.activated;
        this.createdAt = user.createdAt;
        this.userId = user.userId;
    }
}

module.exports = userDto;