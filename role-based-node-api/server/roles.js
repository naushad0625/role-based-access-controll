const AccessControl = require("accesscontrol");

class Privileges {
    constructor() {
        this.accessControl = new AccessControl();
        this.setAccessController = this.setAccessController.bind(this);
    }

    setAccessController() {
        this.accessControl
            .grant("user")
            .readOwn("profile")
            .updateOwn("profile");

        this.accessControl
            .grant("moderator")
            .extend("user")
            .readAny("profile");

        this.accessControl
            .grant("admin")
            .extend(["user", "moderator"])
            .updateAny("profile")
            .deleteAny("profile");
    }

    getAccessController() {
        return this.accessControl;
    }
}

module.exports = new Privileges();
