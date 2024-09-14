import {Request, Response, Router} from "express";
import userModal from "../modals/users";
import bcrypt from "bcrypt";
import {authManager, renderTemplate} from "../main";

const router = Router();

router.get("/logout", (req: Request, res: Response) => {
    res.clearCookie("AuthToken");

    if (req.query.redirect) {
        res.redirect(req.query.redirect as string);
    } else {
        res.redirect("/");
    }
    res.end();
});

router.get("/login", (req: Request, res: Response) => {
    renderTemplate(res, req, "login.ejs", {
        loginMessage: 'none',
    });
});

router.post("/login", async (req: Request, res: Response) => {
    const email = req.body.username;
    const password = req.body.password;

    const user = await userModal.findOne({ email: email }) || await userModal.findOne({ userName: email }) || undefined;

    if (!user) {
        renderTemplate(res, req, "login.ejs", {
            user: req.user,
            alertMessage: 'Ungültige E-Mail-Adresse oder Benutzername!',
        });
        return;
    }

    if (!user.password) {
        renderTemplate(res, req, "login.ejs", {
            user: req.user,
            alertMessage: 'Ungültiges Passwort!',
        });
        return;
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
        renderTemplate(res, req, "login.ejs", {
            user: req.user,
            alertMessage: 'Ungültiges Passwort!',
        });
        return;
    }

    authManager.login(res, user);

    if (req.query.redirect) res.redirect(req.query.redirect as string);
    else res.redirect("/");
});

export default router;