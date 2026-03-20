// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
    // Guard clause: Check if NOT authenticated and return error
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    // If authenticated, continue to next middleware/controller
    next();
};


const isAdmin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not logged in'});
    }

    if (req.user.roleID !== 2) {
        return res.status(403).json({ error: "You don't have the required permission for this action" });
    }

    next();
}

module.exports = {
    isAuthenticated,
    isAdmin
};

